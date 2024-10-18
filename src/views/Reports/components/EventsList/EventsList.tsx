// External Dependencies
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Pressable, TextInput } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Incubator, Text, View } from 'react-native-ui-lib';
import { useFocusEffect } from '@react-navigation/native';
import { isEmpty } from 'lodash-es';

// Internal Dependencies
import { EventCell } from '../EventCell/EventCell';
import { EventListItem, Position, RootStackParamList } from '../../../../common/types/types';
import { useRetrieveReportNotSyncedById } from '../../../../common/data/reports/useRetrieveReportEvent';
import { COLORS_LIGHT } from '../../../../common/constants/colors';
import { TrashIcon as TrashIconSVG } from '../../../../common/icons/TrashIcon';
import { UndoIcon as UndoIconSVG } from '../../../../common/icons/UndoIcon';
import { useRemoveEvent } from '../../../../common/data/reports/useRemoveEvent';
import { logSQL } from '../../../../common/utils/logUtils';
import { logEvent } from '../../../../analytics/wrapper/analyticsWrapper';
import AnalyticsEvent, { analyticsEventToHashMap } from '../../../../analytics/model/analyticsEvent';
import { createOpenReportDraftEvent, removeReportDraftEvent, undoDeleteDraftEvent } from '../../../../analytics/reports/reportsAnalytics';
import { osBackIcon } from '../../../../common/components/header/header';
import { SearchButton } from '../../../../common/components/SearchButton/SearchButton';
import {
  EVENT_FILTERS_CHANGED,
  IS_ANDROID,
  IS_STATUS_FILTER_DRAFT_SELECTED,
  IS_STATUS_FILTER_ENABLED,
  IS_STATUS_FILTER_PENDING_SELECTED,
  IS_STATUS_FILTER_SYNCED_SELECTED,
} from '../../../../common/constants/constants';
import { EmptySearchResultsView } from '../../../../common/components/EmptySearchResults/EmptySearchResultsView';
import { TuneIcon } from '../../../../common/icons/TuneIcon';
import { EmptyEventsListView } from './components/EmptyEventsListView/EmptyEventsListView';
import { getBoolForKey } from '../../../../common/data/storage/keyValue';
import { useRetrieveReports } from '../../../../common/data/reports/useRetrieveReports';
import { useEventHandler } from '../../../../common/utils/useEventHandler';

// Styles
import styles from './EventsList.styles';

// Icons
const TrashIcon = () => <TrashIconSVG />;
const UndoIcon = () => <View style={{ marginRight: 8 }}><UndoIconSVG width="16" /></View>;

// Interfaces
interface EventsListProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ReportsView'>,
}

const EventsList = ({
  navigation,
}: EventsListProps) => {
  // Hooks
  const { t } = useTranslation();
  const { retrieveReportNotSyncedById } = useRetrieveReportNotSyncedById();
  const { removeEvent } = useRemoveEvent();
  const { retrieveReports } = useRetrieveReports();

  // Refs
  const inputRef = useRef<TextInput>(null);
  const shouldRemoveEvent = useRef(false);
  const updatedFilters = useRef(false);
  const searchedText = useRef('');

  // State
  const [displayToast, setDisplayToast] = useState(false);
  const [extraData, setExtraData] = useState<string | null>(null);
  const [removedEventId, setRemovedEventId] = useState<number | null>();
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [eventsDataSource, setEventsDataSource] = useState<EventListItem[]>([]);
  const [isSearchModeEnabled, setIsSearchModeEnabled] = useState(false);

  // Helpers

  const filtersUpdated = () => {
    updatedFilters.current = true;
  };

  useEventHandler(EVENT_FILTERS_CHANGED, filtersUpdated);

  const navigateToReportForm = useCallback(async (reportId: number) => {
    const event = await retrieveReportNotSyncedById(reportId);

    if (event?.is_draft) {
      trackAnalyticsEvent(createOpenReportDraftEvent());
    }

    if (event) {
      navigation.navigate('ReportForm', {
        coordinates: [0, 0] as Position,
        geometryType: event.geometry_type,
        isEditMode: true,
        reportId,
        schema: event.schema,
        title: event.title,
        typeId: event.type_id.toString(),
      });
    }
  }, []);

  const trackAnalyticsEvent = (event: AnalyticsEvent) => {
    logEvent(event.eventName, analyticsEventToHashMap(event));
  };

  const initAppBar = () => {
    const viewTitle = t('reports.title');

    navigation.setOptions({
      // @ts-ignore
      title: viewTitle,
      headerTitle: viewTitle,
    });
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

    setEventsDataSource(events);
    setExtraData(Math.random().toString());
  };

  const removeSearchInput = () => {
    setIsSearchModeEnabled(false);

    setEventsDataSource(events);
    setExtraData(Math.random().toString());
    initAppBar();

    navigation.setOptions({
      // @ts-ignore
      headerLeft: null,
      headerRight: () => (eventsDataSource.length > 0 ? searchIconView() : null),
    });
  };

  const searchEvents = (text: string) => {
    searchedText.current = text;
    if (text === '') {
      setEventsDataSource(events);
    } else {
      setEventsDataSource(events.filter(
        (item) => item.title.toLowerCase().includes(text.toLowerCase()),
      ));
    }

    setExtraData(Math.random().toString());
  };

  // Handlers
  const onRemoveEventHandler = async (id: number) => {
    eventsDataSource.forEach((event) => {
      if (event.id === id) {
        if (event.isDraft) {
          trackAnalyticsEvent(removeReportDraftEvent());
        }

        setExtraData(event.id.toString());
        // eslint-disable-next-line no-param-reassign
        event.hidden = true;
        setRemovedEventId(id);
        shouldRemoveEvent.current = true;
      }
    });

    setDisplayToast(true);
    setEventsDataSource(eventsDataSource);
  };

  const onRemoveEventUndo = () => {
    eventsDataSource.forEach((event) => {
      if (event.id === removedEventId) {
        // eslint-disable-next-line no-param-reassign
        event.hidden = false;

        if (event.isDraft) {
          trackAnalyticsEvent(undoDeleteDraftEvent());
        }

        setExtraData(Math.random().toString());
        setRemovedEventId(null);
        shouldRemoveEvent.current = false;
        setDisplayToast(false);
      }
    });
  };

  // Utilities

  /**
   * Remove event from the local database and update the events list
   *
   * @returns void
   */
  const commitEventRemoval = async () => {
    if (!shouldRemoveEvent.current || !removedEventId) {
      setDisplayToast(false);
      return;
    }

    try {
      const rowsAffected = await removeEvent(removedEventId.toString());

      if (rowsAffected === 1) {
        setDisplayToast(false);
        let filteredEvents = await retrieveReports();
        if (filteredEvents?.length === 0) {
          removeSearchInput();
        }
        setEvents(filteredEvents || []);

        if (isSearchModeEnabled && searchedText.current) {
          filteredEvents = (filteredEvents || []).filter(
            (item) => item.title.toLowerCase().includes(searchedText.current.toLowerCase()),
          );
        }
        setEventsDataSource(filteredEvents || []);
      }
    } catch (error) {
      logSQL.error(error);
    }

    setExtraData(null);
  };

  const getFiltersCount = useCallback(() => {
    const filters = [
      getBoolForKey(IS_STATUS_FILTER_DRAFT_SELECTED),
      getBoolForKey(IS_STATUS_FILTER_PENDING_SELECTED),
      getBoolForKey(IS_STATUS_FILTER_SYNCED_SELECTED),
    ];

    return filters.filter(Boolean).length;
  }, [
    getBoolForKey(IS_STATUS_FILTER_DRAFT_SELECTED),
    getBoolForKey(IS_STATUS_FILTER_PENDING_SELECTED),
    getBoolForKey(IS_STATUS_FILTER_SYNCED_SELECTED),
  ]);

  // Effects
  useFocusEffect(useCallback(() => {
    const getEvents = async () => {
      const localEvents = await retrieveReports();
      if (localEvents) {
        setEvents(localEvents);
        setEventsDataSource(localEvents);
      }
    };

    if (!isSearchModeEnabled || updatedFilters.current) {
      if (isSearchModeEnabled) {
        removeSearchInput();
      }
      getEvents();
      updatedFilters.current = false;
    }
  }, []));

  useFocusEffect(useCallback(() => () => {
    if (isSearchModeEnabled) {
      setIsSearchModeEnabled(false);
      removeSearchInput();
    }
  }, [isSearchModeEnabled]));

  useEffect(() => {
    initAppBar();
    setTimeout(() => {
      navigation.setOptions({
        // @ts-ignore
        headerLeft: null,
        headerRight: () => (eventsDataSource.length > 0 ? searchIconView() : null),
      });
    }, 10);
  }, []);

  useEffect(() => {
    if (isSearchModeEnabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchModeEnabled]);

  useEffect(() => {
    if (!isSearchModeEnabled) {
      navigation.setOptions({
        // @ts-ignore
        headerRight: () => (eventsDataSource.length > 0 ? searchIconView() : null),
        headerLeft: null,
      });
    } else {
      updateAppBar();
    }
  }, [eventsDataSource, events]);

  // Additional Components
  const searchIconView = () => (<SearchButton onPress={showSearchInput} additionalMargin />);

  const searchBackIconView = () => (
    <Pressable
      style={{ marginLeft: IS_ANDROID ? 16 : 0 }}
      onPress={removeSearchInput}
      hitSlop={{
        top: 20, bottom: 20, left: 20, right: 20,
      }}
    >
      {osBackIcon}
    </Pressable>
  );

  const searchInputView = () => (
    <TextInput
      placeholder={t('reportTypes.searchPlaceholder')}
      style={styles.searchInput}
      onChangeText={(text) => (searchEvents(text))}
      ref={inputRef}
      placeholderTextColor={COLORS_LIGHT.G3_secondaryMediumLightGray}
    />
  );

  const filterSectionView = () => (
    <Pressable onPress={() => navigation.navigate('EventsListFilterView')}>
      <View style={styles.filterHeaderContainer}>
        <View style={styles.filterHeaderContent}>
          <TuneIcon />
          <Text mobileBody brightBlue marginL-4>{t('eventsListFilterView.appBarTitle')}</Text>
        </View>
        {getBoolForKey(IS_STATUS_FILTER_ENABLED) && (
          <View style={styles.filterCounter}>
            <Text style={styles.filterCounterValue}>{getFiltersCount()}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );

  // Render
  const renderItem = ({ item }: any) => {
    switch (Number(item.hidden)) {
      case 1:
        return null;
      case 0:
        return (
          <EventCell
            bgColor={item.bgColor}
            defaultPriority={item.defaultPriority}
            fgColor={item.fgColor}
            iconImage={item.icon}
            id={item.id}
            labelText={item.labelText}
            navigateToReportForm={navigateToReportForm}
            onRemoveReport={() => onRemoveEventHandler(item.id)}
            statusIcon={item.statusIcon}
            text={item.text}
            title={item.title}
            type={item.status}
            isEditable={(isEmpty(item.remoteId))}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* eslint-disable-next-line no-nested-ternary, max-len */}
      { (!isSearchModeEnabled && !getBoolForKey(IS_STATUS_FILTER_ENABLED)) && eventsDataSource.length === 0
        ? <EmptyEventsListView />
        // eslint-disable-next-line max-len
        : (isSearchModeEnabled || getBoolForKey(IS_STATUS_FILTER_ENABLED)) && eventsDataSource.length === 0
          ? (
            <>
              {filterSectionView()}
              <EmptySearchResultsView />
            </>
          ) : (
            <>
              {filterSectionView()}
              <FlashList
                data={eventsDataSource}
                estimatedItemSize={eventsDataSource.length + 1}
                extraData={extraData}
                getItemType={(item) => Number(item.hidden)}
                keyExtractor={(item: EventListItem) => item.id.toString()}
                renderItem={renderItem}
                testID="EventsList-FlashList"
              />
            </>
          )}
      {/* Event Delete Confirmation Toast */}
      <Incubator.Toast
        action={{
          color: COLORS_LIGHT.white,
          iconSource: UndoIcon,
          label: `${t('common.undo')}`,
          onPress: () => onRemoveEventUndo(),
          style: {
            backgroundColor: 'transparent',
            marginRight: 16,
          },
        }}
        autoDismiss={2000}
        backgroundColor={COLORS_LIGHT.G0_black}
        icon={TrashIcon}
        message={t('eventsDrafts.toastRemoveConfirmationText')}
        messageStyle={{ color: COLORS_LIGHT.white }}
        onDismiss={() => commitEventRemoval()}
        position="bottom"
        style={{ borderRadius: 0, marginBottom: 86 }}
        visible={displayToast}
      />
      {/* End Event Delete Confirmation Toast */}
    </View>
  );
};

export { EventsList };
