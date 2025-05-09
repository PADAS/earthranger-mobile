// External Dependencies
import { FlashList } from '@shopify/flash-list';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TextInput,
  TextStyle,
} from 'react-native';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native-ui-lib';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

// Internal Dependencies
import { COLORS_LIGHT } from '../../common/constants/colors';
import { customBackButton, osBackIcon } from '../../common/components/header/header';
import { EmptySubjectsList } from './components/EmptySubjectsList';
import { IS_IOS } from '../../common/constants/constants';
import {
  RootStackParamList,
  Subject,
  SubjectGroupData,
} from '../../common/types/types';
import { SearchButton } from '../../common/components/SearchButton/SearchButton';
import { SubjectGroupHeader } from './components/SubjectGroupHeader';
import { SubjectItem } from './components/SubjectItem';
import { useRetrieveSubjectGroups } from '../../common/data/subjects/useRetrieveSubjectGroups';
import subjectsStorage from '../../common/data/storage/subjectsStorage';
import { useRetrieveUser } from '../../common/data/users/useRetrieveUser';
import { UserType } from '../../common/enums/enums';
import { getCoordinatesFromFeature } from '../../common/utils/geometryUtils';

interface SubjectsListViewProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SubjectsListView'>;
}

export const SubjectsListView = ({ navigation }: SubjectsListViewProps) => {
  // Hooks
  const { retrieveSubjectGroups } = useRetrieveSubjectGroups();
  const { retrieveUserInfo } = useRetrieveUser();
  const { t } = useTranslation();

  // State
  const [data, setData] = useState<(SubjectGroupData | Subject)[]>([]);
  const [filteredData, setFilteredData] = useState<(SubjectGroupData | Subject)[]>([]);
  const [extraData, setExtraData] = useState<string | null>(null);
  const [isSearchModeEnabled, setIsSearchModeEnabled] = useState(false);
  const [displayEmptyView, setDisplayEmptyView] = useState(false);

  // Refs
  const isParentView = useRef<boolean>(true);
  const parentSubjectGroupId = useRef<string>('');
  const inputRef = useRef<TextInput>(null);

  // Focus
  useFocusEffect(useCallback(() => {
    const retrieveData = async (isParent: boolean, parentId?: string) => {
      const userInfo = await retrieveUserInfo();
      let profileId;

      if (userInfo && userInfo.userType === UserType.profile) {
        profileId = userInfo.userId;
      } else {
        profileId = undefined;
      }

      const retrievedData = await retrieveSubjectGroups(isParent, parentId, profileId || '');
      setData(retrievedData);

      const subjectsCount = retrievedData.reduce((acc, cur) => (cur.type === 'subject' ? acc + 1 : acc), 0);
      // eslint-disable-next-line max-len
      const subjectGroupsCount = retrievedData.reduce((acc, cur) => (cur.type === 'group' && cur.count > 0 ? acc + 1 : acc), 0);

      setDisplayEmptyView(subjectsCount === 0 && subjectGroupsCount === 0);

      initAppBar(subjectsCount >= 2);
    };

    const getProperties = () => {
      const route = getCurrentRoute();

      const parentName = route.params?.parentSubjectGroupName;
      const isParent = route.params?.isParentView;
      const parentId = route.params?.parentId;

      isParentView.current = isParent;
      parentSubjectGroupId.current = parentId;

      if (parentName) {
        navigation.setOptions({
          // @ts-ignore
          title: parentName,
          headerTitle: parentName,
        });
      }

      retrieveData(isParentView.current === undefined ? true : isParentView.current, parentSubjectGroupId.current);
    };

    getProperties();
  }, []));

  // Effects
  useEffect(() => {
    if (isSearchModeEnabled && inputRef.current) {
      setFilteredData(JSON.parse(JSON.stringify(data)));
      inputRef.current.focus();
    }
  }, [isSearchModeEnabled]);

  // Helpers
  const initAppBar = (shouldShowSearch: boolean) => {
    const route = getCurrentRoute();

    const parentName = route.params?.parentSubjectGroupName;

    navigation.setOptions({
      // @ts-ignore
      title: parentName,
      headerTitle: parentName,
    });

    setTimeout(() => {
      navigation.setOptions({
        // @ts-ignore
        headerLeft: isParentView.current === undefined
          ? null
          : () => customBackButton(osBackIcon, () => navigation.pop()),
        headerRight: shouldShowSearch ? () => searchIconView() : null,
      });
    }, 10);
  };

  const updateAppBar = () => {
    navigation.setOptions({
      // @ts-ignore
      headerLeft: () => searchBackIconView(),
      headerRight: () => null,
      headerTitle: () => searchInputView(),
      headerBackVisible: false,
    });
  };

  const clearSearchInputView = async () => {
    const retrievedData = await retrieveSubjectGroups(
      isParentView.current === undefined ? true : isParentView.current,
      parentSubjectGroupId.current || '',
    );

    const subjectsCount = retrievedData.reduce((acc, cur) => (cur.type === 'subject' ? acc + 1 : acc), 0);

    initAppBar(subjectsCount >= 2);
    setIsSearchModeEnabled(false);
    setFilteredData([]);
  };

  const showSearchInput = () => {
    updateAppBar();
    setIsSearchModeEnabled(true);
  };

  const searchSubjects = async (text: string) => {
    const retrievedData = await retrieveSubjectGroups(
      isParentView.current === undefined ? true : isParentView.current,
      parentSubjectGroupId.current || '',
    );

    if (text.length > 0) {
      const result = retrievedData.filter(
        // eslint-disable-next-line max-len
        (item: Subject | SubjectGroupData) => item.type === 'subject' && item.name.toLowerCase().includes(text.toLocaleLowerCase()),
      );

      setFilteredData(result);
    } else {
      setFilteredData(JSON.parse(JSON.stringify(retrievedData)));
    }
  };

  const getCurrentRoute = () => {
    // @ts-ignore
    const { routes } = navigation.getState();

    let route = routes.findLast((item: any) => item.name === t('mainTabBar.subjects'));

    if (!route) {
      route = routes.findLast((item: any) => item.name === 'SubjectsListView');
    }

    return route;
  };

  // Handlers
  const toggleVisibility = (item: SubjectGroupData | Subject) => {
    // eslint-disable-next-line no-param-reassign
    item.isVisible = !item.isVisible;
  };

  const onVisibilityPress = (item: SubjectGroupData | Subject) => {
    toggleVisibility(item);

    // @ts-ignore
    const visibleSubjects = JSON.parse(subjectsStorage.subjectsKey.get() || '[]');

    // @ts-ignore
    const subjectIndex = visibleSubjects.indexOf(item.id);

    if (subjectIndex !== -1) {
      const subjectsTmp = visibleSubjects.filter((subjectItem: string) => subjectItem !== item.id);
      // @ts-ignore
      subjectsStorage.subjectsKey.set(JSON.stringify(subjectsTmp));
    } else {
      // @ts-ignore
      visibleSubjects.push(item.id);
      // @ts-ignore
      subjectsStorage.subjectsKey.set(JSON.stringify(visibleSubjects));
    }

    setExtraData(Math.random().toString());
  };

  const navigateTo = (name: string, params?: object) => {
    navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{ name, params }],
    }));
  };

  const onLocationPress = (lastPosition: any) => {
    const flyToPosition = getCoordinatesFromFeature(lastPosition);
    navigateTo('MainTabBar', { flyTo: flyToPosition });
  };

  // Additional Components
  const searchIconView = () => (<SearchButton onPress={showSearchInput} />);
  const searchBackIconView = () => customBackButton(osBackIcon, clearSearchInputView);
  const searchInputView = () => (
    <TextInput
      placeholder={t('reportTypes.searchPlaceholder')}
      style={$searchInput}
      onChangeText={(text) => (searchSubjects(text))}
      ref={inputRef}
      placeholderTextColor={COLORS_LIGHT.G3_secondaryMediumLightGray}
    />
  );

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
      {((!isSearchModeEnabled && !displayEmptyView) || (isSearchModeEnabled && filteredData.length > 0)) ? (
        <FlashList
          data={(isSearchModeEnabled && filteredData.length > 0) ? filteredData : data}
          extraData={extraData}
          renderItem={({ item }) => {
            if (item.type === 'group') {
              if (item.count > 0) {
                return (
                  <SubjectGroupHeader
                    subjectsCount={item.count}
                    title={item.title || ''}
                    navigation={navigation}
                    parentId={item.id}
                  />
                );
              }

              return (<View />);
            }
            return (
              <SubjectItem
                isVisible={JSON.parse(subjectsStorage.subjectsKey.get() || '[]').indexOf(item.id) !== -1}
                lastPositionUpdate={item.lastPositionUpdate || ''}
                name={item.name || ''}
                onVisibilityPress={() => onVisibilityPress(item)}
                onLocationPress={() => onLocationPress(item.lastPosition)}
                icon={item.icon}
              />
            );
          }}
          getItemType={(item) => item.type}
          estimatedItemSize={100}
        />
      ) : (
        <EmptySubjectsList />
      )}
    </SafeAreaView>
  );
};

// Styles
const $searchInput: TextStyle = {
  flex: 1,
  marginStart: IS_IOS ? -10 : 0,
  marginEnd: IS_IOS ? 80 : 40,
  fontSize: 17,
};
