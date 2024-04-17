/* eslint-disable arrow-body-style */
// External Dependencies
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { FlatList, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Incubator } from 'react-native-ui-lib';
import dayjs from 'dayjs';

// Internal Dependencies
import { ReportDraftsListCell } from './components/ReportDraftsListCell/ReportDraftsListCell';
import { useRetrieveReportPendingSync } from '../../../common/data/reports/useRetrieveReportPendingSync';
import log from '../../../common/utils/logUtils';
import { DraftReports, Position, RootStackParamList } from '../../../common/types/types';
import { useRemoveReportDraft } from '../../../common/data/reports/useRemoveReportDraft';
import { COLORS_LIGHT } from '../../../common/constants/colors';
import { TrashIcon as TrashIconSVG } from '../../../common/icons/TrashIcon';
import { UndoIcon as UndoIconSVG } from '../../../common/icons/UndoIcon';
import { customBackButton, osBackIcon } from '../../../common/components/header/header';
import { logEvent } from '../../../analytics/wrapper/analyticsWrapper';
import { createOpenReportDraftEvent, removeReportDraftEvent, undoDeleteDraftEvent } from '../../../analytics/reports/reportsAnalytics';
import AnalyticsEvent, { analyticsEventToHashMap } from '../../../analytics/model/analyticsEvent';

// Styles
import styles from './ReportDraftsView.styles';

// Icons
const TrashIcon = () => <TrashIconSVG />;
const UndoIcon = () => <View style={{ marginRight: 8 }}><UndoIconSVG width="16" /></View>;

// Interfaces + Types
interface ReportDraftsViewProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ReportDraftsView'>;
}

const ReportDraftsView = ({ navigation }: ReportDraftsViewProps) => {
  // Hooks
  const { t } = useTranslation();
  const { retrieveDraftReports } = useRetrieveReportPendingSync();
  const { removeReportDraft } = useRemoveReportDraft();

  // Component's State
  const [draftReports, setDraftReports] = useState<DraftReports[]>([]);
  const [displayToast, setDisplayToast] = useState(false);
  const [removedReportDraftId, setRemovedReportDraftId] = useState<number | null>();
  const shouldRemoveReportDraft = useRef(false);

  useEffect(() => {
    const initDraftReports = async () => {
      try {
        const draftReportsList = await retrieveDraftReports();
        setDraftReports(draftReportsList);
      } catch (error) {
        log.debug(`[ReportDraftsView] :: Could not retrieve draft reports - Error ${error}`);
      }
    };

    initDraftReports();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      // @ts-ignore
      headerLeft: () => customBackButton(osBackIcon, onBackButton, false),
      gestureEnabled: false,
    });
  }, [displayToast]);

  // Handlers
  const onRemoveReportHandler = async (id: number) => {
    trackAnalyticsEvent(removeReportDraftEvent());
    draftReports.forEach((draftReport) => {
      if (draftReport.id === id) {
        // eslint-disable-next-line no-param-reassign
        draftReport.hidden = true;
        setRemovedReportDraftId(id);
        shouldRemoveReportDraft.current = true;
      }
    });

    setDisplayToast(true);
    setDraftReports(draftReports);
  };

  const onRemoveReportUndo = () => {
    trackAnalyticsEvent(undoDeleteDraftEvent());
    draftReports.forEach((draftReport) => {
      if (draftReport.id === removedReportDraftId) {
        // eslint-disable-next-line no-param-reassign
        draftReport.hidden = false;
        setRemovedReportDraftId(null);
        shouldRemoveReportDraft.current = false;
      }
    });
  };

  const onBackButton = () => {
    if (!displayToast) {
      navigation.goBack();
    }
    return null;
  };

  // Utilities
  const commitReportRemoval = async () => {
    if (!shouldRemoveReportDraft.current || !removedReportDraftId) {
      setDisplayToast(false);
      return;
    }

    try {
      const rowsAffected = await removeReportDraft(removedReportDraftId.toString());

      if (rowsAffected === 1) {
        const filteredDraftReports = draftReports.filter((draftReport) => {
          return draftReport.id !== removedReportDraftId;
        });

        setDisplayToast(false);
        setDraftReports(filteredDraftReports);
      }
    } catch (error) {
      log.debug(`[ReportDraftsView] :: onRemoveReportHandler - Error: ${error}`);
    }
  };

  const navigateToReportForm = useCallback((
    reportId: number,
    title: string,
    typeId: string,
    schema: string,
    geometryType: string,
    isEditMode: true,
  ) => {
    navigation.navigate('ReportForm', {
      reportId,
      title,
      typeId,
      coordinates: [0, 0] as Position,
      schema,
      geometryType,
      isEditMode,
    });
  }, []);

  const trackAnalyticsEvent = (event: AnalyticsEvent) => {
    logEvent(event.eventName, analyticsEventToHashMap(event));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        <Text style={styles.dateHeaderText}>{t('reportDrafts.dateUpdated')}</Text>
        <View style={styles.divider} />
        <FlatList
          style={styles.flatList}
          data={draftReports}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            if (!item?.hidden) {
              return (
                <ReportDraftsListCell
                  iconImage={item.icon_svg}
                  title={item.title}
                  date={dayjs(item.updated_at).format('D MMM \'YY HH:mm')}
                  priority={item.default_priority.toString()}
                  onPress={() => {
                    trackAnalyticsEvent(createOpenReportDraftEvent());
                    navigateToReportForm(
                      item.id,
                      item.title,
                      item.type_id.toString(),
                      item.schema,
                      item.geometry_type,
                      true,
                    );
                  }}
                  onRemove={() => onRemoveReportHandler(item.id)}
                />
              );
            }
            return null;
          }}
        />
      </View>

      {/* Report Delete Confirmation Toast */}
      <Incubator.Toast
        action={{
          color: COLORS_LIGHT.white,
          iconSource: UndoIcon,
          label: `${t('common.undo')}`,
          onPress: () => onRemoveReportUndo(),
          style: {
            backgroundColor: 'transparent',
            marginRight: 16,
          },
        }}
        autoDismiss={2000}
        backgroundColor={COLORS_LIGHT.G0_black}
        icon={TrashIcon}
        message={t('reportDrafts.toastRemoveConfirmationText')}
        messageStyle={{ color: COLORS_LIGHT.white }}
        onDismiss={() => commitReportRemoval()}
        position="bottom"
        style={{ borderRadius: 0 }}
        visible={displayToast}
      />
      {/* End Report Delete Confirmation Toast */}
    </SafeAreaView>
  );
};

export { ReportDraftsView };
