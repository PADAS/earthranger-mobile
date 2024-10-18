// External Dependencies
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import {
  DataProvider,
  LayoutProvider,
  RecyclerListView,
} from 'recyclerlistview';
import { View } from 'react-native-ui-lib';
import { RouteProp } from '@react-navigation/native';

// Internal Dependencies
import { MERGE_CATEGORIES_KEY, PATROL_INFO_EVENT_TYPE_VALUE } from '../../../../common/constants/constants';
import { useRetrieveReportTypesByCategory } from '../../../../common/data/reports/useRetrieveReportTypesByCategory';
import { EventType } from '../../../../common/types/reportsResponse';
import { getBoolForKey, setStringForKey } from '../../../../common/data/storage/keyValue';
import { ReportTypesCell } from './components/ReportTypesCell/ReportTypesCell';
import { Position, RootStackParamList } from '../../../../common/types/types';
import { customBackButton, osBackIcon } from '../../../../common/components/header/header';
import { useFilterReportTypesByDisplay } from '../../../../common/data/reports/useFilterReportTypesByDisplay';
import { COLORS_LIGHT } from '../../../../common/constants/colors';
import { EmptySearchResultsView } from '../../../../common/components/EmptySearchResults/EmptySearchResultsView';
import { cropHeaderTitleText } from '../../../../common/utils/stringUtils';
import { SearchButton } from '../../../../common/components/SearchButton/SearchButton';
import { PermissionView } from '../../../Permission/PermissionView';
import { useRetrieveUser } from '../../../../common/data/users/useRetrieveUser';
import { UserType } from '../../../../common/enums/enums';
import { useRetrieveReportTypes } from '../../../../common/data/reports/useRetrieveReportTypes';
import { useRetrieveEventPermissions } from '../../../../common/data/permissions/useRetrievePermissions';

// Styles
import styles from './ReportTypesView.styles';

// Constants
const GRID_TYPE = 'DEFAULT_TYPE';
const DEFAULT_HEIGHT = 131;

// Interfaces + Types
interface ReportTypesViewProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ReportTypesView'>;
  route: RouteProp<{ params: { title: string, categoryId: string, coordinates?: Position, isPatrolInfoEventType?: boolean, } }, 'params'>,
}

// @ts-ignore
const ReportTypesView = ({ route, navigation }: ReportTypesViewProps) => {
  // Hooks
  const { t } = useTranslation();
  const { retrieveReportTypesByCategory } = useRetrieveReportTypesByCategory();
  const { filterReportTypesByDisplay } = useFilterReportTypesByDisplay();
  const { retrieveReportTypesByUserType } = useRetrieveReportTypes();
  const { retrieveUserInfo } = useRetrieveUser();
  const { userHasEventsPermissions } = useRetrieveEventPermissions();

  // References
  const inputRef = useRef<TextInput>(null);
  // eslint-disable-next-line max-len
  const mergeCategories = useRef(route.params.isPatrolInfoEventType || getBoolForKey(MERGE_CATEGORIES_KEY));
  const isSearching = useRef(false);

  // Variables
  const itemSize = (Dimensions.get('window').width) / 3 - 1;

  // Component's State
  const [reportTypes, setReportTypes] = useState<EventType[]>([]);
  const [dataProvider, setDataProvider] = useState(new DataProvider((r1, r2) => r1 !== r2));
  const [layoutProvider] = useState<LayoutProvider>(new LayoutProvider(
    () => GRID_TYPE,
    (type, dim) => {
      switch (type) {
        case 'DEFAULT_TYPE':
        default:
          // eslint-disable-next-line no-param-reassign
          dim.width = itemSize;
          // eslint-disable-next-line no-param-reassign
          dim.height = DEFAULT_HEIGHT;
          break;
      }
    },
  ));
  const [filteredReportTypes, setFilteredReportTypes] = useState<EventType[]>([]);
  const [coordinates, setCoordinates] = useState<Position>([0, 0]);
  const [isSearchModeEnabled, setIsSearchModeEnabled] = useState(false);
  const [showPermissionView, setShowPermissionView] = useState(false);
  const [emptyEventCategory, setEmptyEventCategory] = useState(false);

  // Component's Lifecycle Events
  useEffect(() => {
    initAppBar();
    initCoordinates();
    getReportTypes();
  }, []);

  useEffect(() => {
    if ((isSearching.current && filteredReportTypes.length > 0)
      || (!isSearching.current && reportTypes.length > 0)) {
      setDataProvider(
        // eslint-disable-next-line max-len
        new DataProvider((r1, r2) => (r1 !== r2)).cloneWithRows(isSearching.current ? filteredReportTypes : reportTypes),
      );
    }
  }, [isSearching, reportTypes, filteredReportTypes]);

  useEffect(() => {
    if (isSearchModeEnabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchModeEnabled]);

  useEffect(() => {
    if (showPermissionView) {
      hideSearchIcon();
    }
  }, [showPermissionView]);

  // Utility Functions
  const initAppBar = () => {
    let viewTitle = t('reports.appBarTitle');

    if (route.params.title) {
      viewTitle = cropHeaderTitleText(route.params.title);
    }

    navigation.setOptions({
      title: viewTitle,
      headerTitle: viewTitle,
      headerLeft: () => customBackButton(
        osBackIcon,
        () => navigation.pop(),
        getBoolForKey(MERGE_CATEGORIES_KEY),
      ),
    });

    // Workaround found in https://github.com/software-mansion/react-native-screens/issues/1570#issuecomment-1362794902
    setTimeout(() => {
      navigation.setOptions({
        headerRight: () => searchIconView(),
      });
    }, 10);
  };

  const updateAppBar = async () => {
    navigation.setOptions({
      headerLeft: () => searchBackIconView(),
      headerRight: () => null,
      headerTitle: () => searchInputView(),
      headerBackVisible: false,
    });
  };

  const hideSearchIcon = () => {
    navigation.setOptions({
      headerRight: () => null,
    });
  };

  const initCoordinates = () => {
    if (route.params.coordinates) {
      setCoordinates(
        [
          parseFloat(route.params.coordinates[0].toFixed(6)),
          parseFloat(route.params.coordinates[1].toFixed(6)),
        ],
      );
    }
  };

  const getReportTypes = async () => {
    let reportTypesList;
    const hasEventsPermission = await userHasEventsPermissions();

    if (mergeCategories.current) {
      const userInfo = await retrieveUserInfo();
      if (userInfo?.userType) {
        const profileId = userInfo?.userType === UserType.profile ? parseInt(userInfo.userId || '', 10) : undefined;
        reportTypesList = await retrieveReportTypesByUserType(
          userInfo.userType,
          userInfo?.permissions,
          profileId,
        );
      }
    } else {
      reportTypesList = await retrieveReportTypesByCategory([route.params.categoryId]);
    }

    setReportTypes(reportTypesList);

    if (reportTypesList.length === 0) {
      setShowPermissionView(true);

      setEmptyEventCategory(hasEventsPermission);
    }
  };

  const filterReportTypes = async (queryText: string) => {
    // eslint-disable-next-line max-len
    const filteredReportTypesList = await filterReportTypesByDisplay([route.params.categoryId, `%${queryText}%`], mergeCategories.current, queryText);
    setFilteredReportTypes(filteredReportTypesList);
  };

  const showSearchInput = async () => {
    await updateAppBar();
    setIsSearchModeEnabled(true);
  };

  const backFromSearch = () => {
    initAppBar();
    getReportTypes();
    isSearching.current = false;
    setIsSearchModeEnabled(false);
  };

  const searchReport = (text: string) => {
    isSearching.current = true;
    filterReportTypes(text);
  };

  const navigateToReportForm = useCallback((
    titleValue: string,
    idValue: string,
    schema: string,
    geometryType: string,
  ) => {
    navigation.navigate('ReportForm', {
      title: titleValue,
      typeId: idValue,
      coordinates,
      schema,
      geometryType,
    });
  }, [coordinates]);

  // Additional Components
  const searchIconView = () => (<SearchButton onPress={showSearchInput} />);

  const searchBackIconView = () => customBackButton(osBackIcon, backFromSearch);

  const searchInputView = () => (
    <TextInput
      placeholder={t('reportTypes.searchPlaceholder')}
      style={styles.searchInput}
      onChangeText={(text) => (searchReport(text))}
      ref={inputRef}
      placeholderTextColor={COLORS_LIGHT.G3_secondaryMediumLightGray}
    />
  );

  const rowRenderer = (type: any, data: any) => {
    switch (type) {
      case 'DEFAULT_TYPE':
        return (
          <ReportTypesCell
            typeId={data.id.toString()}
            title={data.display}
            iconImage={data.icon_svg}
            priority={data.default_priority}
            onPress={() => {
              if (route.params.isPatrolInfoEventType) {
                setStringForKey(PATROL_INFO_EVENT_TYPE_VALUE, data.value);
                navigation.goBack();
              } else {
                navigateToReportForm(
                  data.display,
                  data.id.toString(),
                  data.schema,
                  data.geometry_type,
                );
              }
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.content} edges={['bottom']}>
      {(!showPermissionView) ? (
        <View>
          {(isSearching.current && filteredReportTypes.length === 0)
            ? <EmptySearchResultsView />
            : (
              <View style={{ height: '100%' }}>
                <RecyclerListView
                  style={styles.flatList}
                  layoutProvider={layoutProvider}
                  dataProvider={dataProvider}
                  rowRenderer={rowRenderer}
                  canChangeSize={false}
                  disableRecycling // This prevents blank spaces when scrolling up
                  keyboardShouldPersistTaps="always"
                />
              </View>
            )}
        </View>
      ) : (<PermissionView emptyEventCategory={emptyEventCategory} />)}

    </SafeAreaView>
  );
};

export { ReportTypesView };
