// External Dependencies
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  TextInput,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native-ui-lib';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../common/constants/colors';
import { cropHeaderTitleText } from '../../../../common/utils/stringUtils';
import { customBackButton, osBackIcon } from '../../../../common/components/header/header';
import { EmptySearchResultsView } from '../../../../common/components/EmptySearchResults/EmptySearchResultsView';
import { EventType } from '../../../../common/types/reportsResponse';
import { getBoolForKey, setStringForKey } from '../../../../common/data/storage/keyValue';
import {
  ELEMENT_INSPECTOR_WIDTH,
  MERGE_CATEGORIES_KEY,
  PATROL_INFO_EVENT_TYPE_VALUE,
} from '../../../../common/constants/constants';
import { PermissionView } from '../../../Permission/PermissionView';
import { PersistedEventType, Position, RootStackParamList } from '../../../../common/types/types';
import { ReportTypesCell } from './components/ReportTypesCell/ReportTypesCell';
import { SearchButton } from '../../../../common/components/SearchButton/SearchButton';
import { useFilterReportTypesByDisplay } from '../../../../common/data/reports/useFilterReportTypesByDisplay';
import { useRetrieveEventPermissions } from '../../../../common/data/permissions/useRetrievePermissions';
import { useRetrieveReportTypes } from '../../../../common/data/reports/useRetrieveReportTypes';
import { useRetrieveReportTypesByCategory } from '../../../../common/data/reports/useRetrieveReportTypesByCategory';
import { useRetrieveUser } from '../../../../common/data/users/useRetrieveUser';
import { UserType } from '../../../../common/enums/enums';

// Styles
import styles from './ReportTypesView.styles';

// Interfaces + Types
interface EventTypesViewProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ReportTypesView'>;
  route: RouteProp<{
    params: {
      categoryId: string,
      coordinates?: Position,
      isPatrolInfoEventType?: boolean,
      title: string,
    }
  },
  'params'>,
}

const ReportTypesView = ({ route, navigation }: EventTypesViewProps) => {
  // Hooks
  const { filterReportTypesByDisplay } = useFilterReportTypesByDisplay();
  const { retrieveReportTypesByCategory } = useRetrieveReportTypesByCategory();
  const { retrieveReportTypesByUserType } = useRetrieveReportTypes();
  const { retrieveUserInfo } = useRetrieveUser();
  const { t } = useTranslation();
  const { userHasEventsPermissions } = useRetrieveEventPermissions();

  // References
  const inputRef = useRef<TextInput>(null);
  const mergeCategories = useRef(
    route.params.isPatrolInfoEventType || getBoolForKey(MERGE_CATEGORIES_KEY),
  );
  const isSearching = useRef(false);

  // State
  const [coordinates, setCoordinates] = useState<Position>(route.params.coordinates || [0, 0]);
  const [emptyEventCategory, setEmptyEventCategory] = useState(false);
  const [eventTypes, setEventTypes] = useState<EventType[] | PersistedEventType[]>([]);
  const [filteredEventTypes, setFilteredEventTypes] = useState<EventType[]>([]);
  const [isSearchModeEnabled, setIsSearchModeEnabled] = useState(false);
  const [showPermissionView, setShowPermissionView] = useState(false);

  // Lifecycle Events
  useEffect(() => {
    initAppBar();
    initCoordinates();
    getEventTypes();
  }, []);

  useEffect(() => {
    if ((isSearching.current && filteredEventTypes.length > 0)
      || (!isSearching.current && eventTypes.length > 0)) {
      setEventTypes(isSearching.current ? filteredEventTypes : eventTypes);
    }
  }, [isSearching, eventTypes, filteredEventTypes]);

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
      // @ts-ignore
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
        // @ts-ignore
        headerRight: () => searchIconView(),
      });
    }, 10);
  };

  const initCoordinates = useCallback(() => {
    if (route.params.coordinates) {
      setCoordinates(
        [
          parseFloat(route.params.coordinates[0].toFixed(6)),
          parseFloat(route.params.coordinates[1].toFixed(6)),
        ],
      );
    }
  }, [route.params.coordinates]);

  const getEventTypes = async () => {
    let eventTypesList: EventType[] | PersistedEventType[] = [];
    const hasEventsPermission = await userHasEventsPermissions();

    if (mergeCategories.current) {
      const userInfo = await retrieveUserInfo();

      if (userInfo?.userType) {
        const profileId = userInfo?.userType === UserType.profile ? parseInt(userInfo.userId || '', 10) : undefined;

        eventTypesList = await retrieveReportTypesByUserType(
          userInfo.userType,
          userInfo?.permissions,
          profileId,
        );

        if (eventTypesList.length === 0) {
          setShowPermissionView(true);
          setEmptyEventCategory(hasEventsPermission);
        }

        setEventTypes(eventTypesList);
      }
    } else {
      eventTypesList = await retrieveReportTypesByCategory([route.params.categoryId]);

      if (eventTypesList.length === 0) {
        setShowPermissionView(true);
        setEmptyEventCategory(hasEventsPermission);
      }

      setEventTypes(eventTypesList);
    }
  };

  const updateAppBar = async () => {
    navigation.setOptions({
      // @ts-ignore
      headerLeft: () => searchBackIconView(),
      headerRight: () => null,
      headerTitle: () => searchInputView(),
      headerBackVisible: false,
    });
  };

  const hideSearchIcon = () => {
    navigation.setOptions({
      // @ts-ignore
      headerRight: () => null,
    });
  };

  const filterEventTypes = async (queryText: string) => {
    const filteredEventTypesList = await filterReportTypesByDisplay(
      [
        route.params.categoryId,
        `%${queryText}%`,
      ],
      mergeCategories.current,
      queryText,
    );
    setFilteredEventTypes(filteredEventTypesList);
  };

  const showSearchInput = async () => {
    await updateAppBar();
    setIsSearchModeEnabled(true);
  };

  const backFromSearch = () => {
    initAppBar();
    getEventTypes();
    isSearching.current = false;
    setIsSearchModeEnabled(false);
  };

  const searchEvent = (text: string) => {
    isSearching.current = true;
    filterEventTypes(text);
  };

  const navigateToEventForm = useCallback((
    titleValue: string,
    idValue: string,
    schema: string,
    geometryType: string,
  ) => {
    navigation.navigate('ReportForm', {
      coordinates,
      geometryType,
      schema,
      title: titleValue,
      typeId: idValue,
    });
  }, [coordinates]);

  const onEventPressHanlder = useCallback((item) => {
    if (route.params.isPatrolInfoEventType) {
      setStringForKey(PATROL_INFO_EVENT_TYPE_VALUE, item.value);
      navigation.goBack();
    } else {
      navigateToEventForm(
        item.display,
        item.id.toString(),
        item.schema,
        item.geometry_type,
      );
    }
  }, []);

  // Additional Components

  const searchIconView = () => (<SearchButton onPress={showSearchInput} />);

  const searchBackIconView = () => customBackButton(osBackIcon, backFromSearch);

  const searchInputView = () => (
    <TextInput
      placeholder={t('reportTypes.searchPlaceholder')}
      style={styles.searchInput}
      onChangeText={(text) => (searchEvent(text))}
      ref={inputRef}
      placeholderTextColor={COLORS_LIGHT.G3_secondaryMediumLightGray}
    />
  );

  // List components

  const renderItem = ({ item }: any) => (
    <ReportTypesCell
      iconImage={item.icon_svg}
      onPress={() => onEventPressHanlder(item)}
      priority={item.default_priority}
      title={item.display}
      typeId={item.id.toString()}
    />
  );

  return (
    <SafeAreaView style={styles.content} edges={['bottom']}>
      {(!showPermissionView) ? (
        <View>
          {(isSearching.current && filteredEventTypes.length === 0)
            ? <EmptySearchResultsView />
            : (
              <View style={{ height: '100%' }}>
                <FlashList
                  // @ts-ignore
                  data={eventTypes}
                  estimatedItemSize={ELEMENT_INSPECTOR_WIDTH}
                  keyboardShouldPersistTaps="always"
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  renderItem={renderItem}
                />
              </View>
            )}
        </View>
      ) : (
        <PermissionView emptyEventCategory={emptyEventCategory} />
      )}
    </SafeAreaView>
  );
};

export { ReportTypesView };
