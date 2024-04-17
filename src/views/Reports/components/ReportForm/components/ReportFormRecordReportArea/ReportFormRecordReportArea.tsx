// External Dependencies
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  View,
  Text,
} from 'react-native';

// Internal Dependencies
import { RecordReportAreaIcon } from '../../../../../../common/icons/RecordReportAreaIcon';

// Styles
import styles from './ReportFormRecordReportArea.styles';

// Interfaces
interface RecordReportAreaProps {
  onRecordAreaPress: () => void;
  areaValue: number;
}

export const RecordReportArea = ({
  onRecordAreaPress,
  areaValue,
}: RecordReportAreaProps) => {
  // Hooks
  const { t } = useTranslation();

  return (
    <View style={styles.areaContainer}>
      <Pressable onPress={onRecordAreaPress}>
        <View style={styles.icon}><RecordReportAreaIcon /></View>
        <Text style={styles.text}>
          {
            areaValue > 0 ? t('reports.recordReportAreaValue', { areaValue })
              : t('reports.recordReportArea')
          }
        </Text>
      </Pressable>
    </View>
  );
};
