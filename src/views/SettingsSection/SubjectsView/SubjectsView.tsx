// External Dependencies
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { cloneDeep } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';

// Internal Dependencies
import { PersistedUserSubject, RootStackParamList } from '../../../common/types/types';
import { SubjectItemCell } from './components/SubjectItemCell';
import { COLORS_LIGHT } from '../../../common/constants/colors';
import { customBackButton, osBackIcon } from '../../../common/components/header/header';
import {
  EmptySearchResultsView,
} from '../../../common/components/EmptySearchResults/EmptySearchResultsView';
import { SearchButton } from '../../../common/components/SearchButton/SearchButton';
import { getStringForKey, setStringForKey } from '../../../common/data/storage/keyValue';
import { useRetrieveUserSubjects } from '../../../common/data/users/useRetrieveUserSubjects';
import { getSecuredStringForKey } from '../../../common/data/storage/utils';
import {
  ACTIVE_USER_NAME_KEY,
  TRACKED_BY_SUBJECT_ID_KEY,
  TRACKED_BY_SUBJECT_NAME_KEY,
} from '../../../common/constants/constants';

// Styles
import styles from './SubjectsView.styles';

// Interfaces + Types
interface SubjectsViewProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SubjectsView'>;
}

const SubjectsView = ({ navigation }: SubjectsViewProps) => {
  // Hooks
  const { t } = useTranslation();
  const { retrieveUserSubjects, retrieveActiveUserAsUserSubject } = useRetrieveUserSubjects();

  // References
  const inputRef = useRef<TextInput>(null);

  // State
  const [subjectsList, setSubjectsList] = useState<PersistedUserSubject[]>([]);
  const [filteredSubjectList, setFilteredSubjectList] = useState<PersistedUserSubject[]>([]);
  const [isSearchModeEnabled, setIsSearchModeEnabled] = useState(false);
  const [subjectItem, setSubjectItem] = useState(
    getStringForKey(TRACKED_BY_SUBJECT_NAME_KEY) || '',
  );

  // Helper functions
  const initAppBar = () => {
    const viewTitle = t('settingsView.trackedBy');

    navigation.setOptions({
      // @ts-ignore
      title: viewTitle,
      headerTitle: viewTitle,
    });

    setTimeout(() => {
      navigation.setOptions({
        // @ts-ignore
        headerLeft: () => customBackButton(osBackIcon, () => navigation.pop()),
        headerRight: () => searchIconView(),
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

  const showSearchInput = () => {
    updateAppBar();
    setIsSearchModeEnabled(true);
    // @ts-ignore
    const { routes } = navigation.getState();
    const route = routes.find((item: any) => item.name === 'SubjectsView');
    const subjectsListTmp: PersistedUserSubject[] = route.params?.subjects;
    setFilteredSubjectList(subjectsListTmp);
  };

  const backFromSearch = () => {
    initAppBar();
    setIsSearchModeEnabled(false);
    // Retrieve the state data from navigation params, otherwise this function can't access
    // the state variables.
    // @ts-ignore
    const { routes } = navigation.getState();
    const route = routes.find((item: any) => item.name === 'SubjectsView');
    const subjectsListTmp: PersistedUserSubject[] = route.params?.subjects;
    setSubjectsList(subjectsListTmp);
    setFilteredSubjectList(subjectsListTmp);
  };

  const searchUserSubjects = (text: string) => {
    // Retrieve the state data from navigation params, otherwise this function can't access
    // the state variables.
    // @ts-ignore
    const { routes } = navigation.getState();
    const route = routes.find((item: any) => item.name === 'SubjectsView');
    const subjectsListTmp: PersistedUserSubject[] = route.params?.subjects;
    setFilteredSubjectList(subjectsListTmp.filter(
      (item) => item.name.toLowerCase().includes(text.toLowerCase()),
    ));
  };

  const setIsSelected = (item: string) => {
    setSubjectsList(subjectsList.map((subject) => {
      if (subject.name === item || subject.isSelected) {
        // eslint-disable-next-line no-param-reassign
        subject.isSelected = subject.name === item;
        return cloneDeep(subject);
      }
      return subject;
    }));

    setFilteredSubjectList(filteredSubjectList.map((subject) => {
      if (subject.name === item || subject.isSelected) {
        // eslint-disable-next-line no-param-reassign
        subject.isSelected = subject.name === item;
        return cloneDeep(subject);
      }
      return subject;
    }));
  };

  // Handlers
  const onSubjectItemPress = (item: string, id: string) => {
    if (getSecuredStringForKey(ACTIVE_USER_NAME_KEY) !== item) {
      setStringForKey(TRACKED_BY_SUBJECT_ID_KEY, id);
    }
    setStringForKey(TRACKED_BY_SUBJECT_NAME_KEY, item);
    setIsSelected(item);
    setSubjectItem(item);

    navigation.pop();
  };

  // Effects
  useEffect(() => {
    // App Bar
    initAppBar();
  }, []);

  useEffect(() => {
    if (isSearchModeEnabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchModeEnabled]);

  useEffect(() => {
    const initUserSubjects = async () => {
      const userSubjects = await retrieveUserSubjects();

      // @ts-ignore
      navigation.setParams({
        subjects: userSubjects,
      });

      // Get active user details
      const activeUser = await retrieveActiveUserAsUserSubject();

      if (activeUser) {
        userSubjects.push(activeUser);
      }

      setSubjectsList(userSubjects);

      userSubjects.forEach((userSubject) => {
        // eslint-disable-next-line no-param-reassign
        userSubject.isSelected = userSubject.name === subjectItem;
      });

      setFilteredSubjectList(userSubjects);
    };

    initUserSubjects();
  }, []);

  // Helper functions
  const renderItem = ({ item }: any) => (
    <SubjectItemCell
      id={item.id.toString()}
      display={item.name}
      onPress={() => onSubjectItemPress(item.name, item.remote_id.toString())}
      isSubjectItemSelected={item.isSelected}
    />
  );

  // Additional Components
  const searchIconView = () => (<SearchButton onPress={showSearchInput} />);

  const searchBackIconView = () => customBackButton(osBackIcon, backFromSearch);

  const searchInputView = () => (
    <TextInput
      placeholder={t('reportTypes.searchPlaceholder')}
      style={styles.searchInput}
      onChangeText={(text) => (searchUserSubjects(text))}
      ref={inputRef}
      placeholderTextColor={COLORS_LIGHT.G3_secondaryMediumLightGray}
    />
  );

  return (
    <SafeAreaView style={styles.content} edges={['bottom']}>
      {isSearchModeEnabled && filteredSubjectList.length === 0
        ? <EmptySearchResultsView />
        : (
          <FlashList
            data={filteredSubjectList}
            estimatedItemSize={subjectsList.length + 1}
            keyExtractor={(item: PersistedUserSubject) => item.remote_id.toString()}
            renderItem={renderItem}
          />
        )}
    </SafeAreaView>
  );
};

export { SubjectsView };
