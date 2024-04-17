// External Dependencies
import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

// Internal Dependencies
import { ReportFormErrorIcon } from '../../../../../../common/icons/ReportFormErrorIcon';

// Styles
import styles from './ReportFormSchemaError.styles';

export const ReportFormSchemaError = () => {
  // Hooks
  const { t } = useTranslation();
  return (
    <View style={styles.reportSchemaErrorContainer}>
      <ReportFormErrorIcon />
      <Text style={styles.reportSchemaErrorTextTitle}>{t('reports.reportFormError')}</Text>
      <Text style={styles.reportSchemaErrorTextSubText}>{t('reports.unknownFieldTypeInReportSchema')}</Text>
    </View>
  );
};
