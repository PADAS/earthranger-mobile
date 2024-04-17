// External Dependencies
import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';
import { RecordReportAreaIcon } from '../../../../../../common/icons/RecordReportAreaIcon';

// Styles
import styles from './ReportFormPolygonInfo.styles';

// Interfaces
interface ReportFormPolygonInfoProps {
  data: string;
}

const ReportFormPolygonInfo = ({
  data,
}: ReportFormPolygonInfoProps) => {
  // Hooks
  const { t } = useTranslation();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>{t('reports.reportArea')}</Text>
        <View style={styles.textInputContainer}>
          <RecordReportAreaIcon
            height="16"
            width="16"
            color={COLORS_LIGHT.G2_5_mobileSecondaryGray}
          />
          <Text style={styles.textInput}>
            {`${data}`}
          </Text>
        </View>
        <View style={styles.line} />
      </View>
    </View>
  );
};

export { ReportFormPolygonInfo };
