// External Dependencies
import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import { useTranslation } from 'react-i18next';

// Internal Dependencies
import { COLORS_LIGHT } from '../../constants/colors';
import { LocationOnForIos } from '../../icons/LocationOnForIos';
import { ReportsIcon } from '../../icons/ReportsIcon';
import { ReportsSyncNotRequiredIcon } from '../../icons/ReportsSyncNotRequiredIcon';
import { ReportsSyncRequiredIcon } from '../../icons/ReportsSyncRequiredIcon';
import { SyncIcon } from '../../icons/SyncIcon';
import { PatrolIcon } from '../../icons/PatrolIcon';
import { SubjectsIcon } from '../../icons/SubjectsIcon';

// Styles
import styles from './DetailedInfoCard.styles';

// Interfaces
interface DetailedInfoCardProps {
  title: string;
  type: string;
  pendingSync?: string;
  uploaded?: string;
  lastSync: string;
  syncing: boolean;
}

export const DetailedInfoCard = ({
  title,
  type,
  pendingSync,
  uploaded,
  lastSync,
  syncing,
}: DetailedInfoCardProps) => {
  // Hooks
  const { t } = useTranslation();

  let icon = null;

  switch (type) {
    case 'tracks':
      icon = <LocationOnForIos color={COLORS_LIGHT.erTeal} />;
      break;
    case 'reports':
      icon = <ReportsIcon color={COLORS_LIGHT.indigo} />;
      break;
    case 'patrols':
      icon = <PatrolIcon color={COLORS_LIGHT.magenta} />;
      break;
    case 'subjects':
      icon = <SubjectsIcon />;
      break;
    default:
      break;
  }

  const getCurrentStateIcon = () => {
    if (syncing) {
      return <SyncIcon width="11" height="16" />;
    }
    if (parseInt(pendingSync || '', 10) > 0) {
      return <ReportsSyncRequiredIcon width="16" height="12" />;
    }
    return <ReportsSyncNotRequiredIcon width="16" height="10.5" />;
  };

  return (
    <View style={styles.mainContainer}>
      {/* Title */}
      <View style={styles.titleContainer}>
        {icon}
        <Text label color={COLORS_LIGHT.G2_secondaryMediumGray} style={styles.title}>
          {title}
        </Text>
        <View style={styles.iconStatus}>
          { getCurrentStateIcon() }
        </View>
      </View>
      {/* End Title */}

      {/* Body */}
      <View style={styles.bodyContainer}>
        {pendingSync && (
          <View style={styles.infoContainer}>
            <Text style={styles.text}>{`${t('statusView.pendingSync')}: `}</Text>
            <Text style={styles.value}>{pendingSync}</Text>
          </View>
        )}
        {uploaded && (
          <View style={styles.infoContainer}>
            <Text style={styles.text}>{`${t('statusView.submittedSession')}: `}</Text>
            <Text style={styles.value}>{uploaded}</Text>
          </View>
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.text}>{`${t('statusView.lastSync')}: `}</Text>
          <Text style={styles.value}>{lastSync}</Text>
        </View>
      </View>
      {/* End Body */}
    </View>
  );
};
