// External Dependencies
import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

// Internal Dependencies
import { LastSyncIcon } from '../../icons/LastSyncIcon';
import { PendingSyncIcon } from '../../icons/PendingSyncIcon';
import { ReportsArrowIcon } from '../../icons/ReportArrowIcon';
import { SavedDraftsIcon } from '../../icons/SavedDraftsIcon';
import { PendingSyncIcon as ReportsPendingSyncIcon } from '../../icons/ReportsPendingSyncIcon';
import { ReportsSyncRequiredIcon } from '../../icons/ReportsSyncRequiredIcon';
import { ReportsSyncNotRequiredIcon } from '../../icons/ReportsSyncNotRequiredIcon';

// Styles
import styles from './InfoCard.styles';

// Interfaces
interface InfoCardProps {
  title: string;
  type: string;
  text: string;
  lastSync?: string;
  displayChevron?: boolean;
}

export const InfoCard = ({
  title,
  type,
  text,
  lastSync = '',
  displayChevron = false,
}: InfoCardProps) => {
  // Hooks
  const { t } = useTranslation();

  let icon = null;

  switch (type) {
    case 'lastSync':
      icon = <LastSyncIcon />;
      break;
    case 'pendingSync':
      icon = <PendingSyncIcon />;
      break;
    case 'savedDrafts':
      icon = <SavedDraftsIcon />;
      break;
    case 'reportsPendingSync':
      icon = <ReportsPendingSyncIcon />;
      break;
    case 'reportsSyncRequired':
      icon = <ReportsSyncRequiredIcon />;
      break;
    case 'reportsSyncNotRequired':
      icon = <ReportsSyncNotRequiredIcon />;
      break;
    default:
      break;
  }

  return (
    <View style={styles.infoCardContainer}>
      <Text style={styles.infoCardTitle}>{title}</Text>
      <View style={styles.infoCardDescriptionContainer}>
        { (type === 'status') ? (
          <View>
            <View style={styles.infoCardInnerContainer}>
              <Text style={styles.infoCardStatusText}>{t('reports.submittedThisSession')}</Text>
              <Text style={styles.infoCardStatusValue}>{text}</Text>
            </View>
            <View style={styles.infoCardInnerContainer}>
              <Text style={styles.infoCardStatusText}>{t('reports.lastSyncInfo')}</Text>
              <Text style={styles.infoCardStatusValue}>{lastSync}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.infoCardInnerContainer}>
            {icon}
            <Text style={styles.infoCardText}>{text}</Text>
          </View>
        )}
        {displayChevron && <View style={styles.infoCardChevron}><ReportsArrowIcon /></View>}
      </View>
    </View>
  );
};
