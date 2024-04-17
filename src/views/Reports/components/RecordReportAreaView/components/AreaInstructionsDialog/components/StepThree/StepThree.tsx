// External Dependencies
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Colors,
  Image,
  Text,
  View,
} from 'react-native-ui-lib';

// Styles
import styles from '../Steps.styles';

const StepThree = () => {
  // Hooks
  const { t } = useTranslation();

  return (
    <View>
      <Image
        /* eslint-disable-next-line global-require */
        source={require('../../../../../../../../../assets/dialog-step-3.gif')}
        style={styles.topSection}
      />
      <View style={styles.bodySection}>
        <Text heading2>
          {t('recordReportArea.helpDialog.stepThree.title')}
        </Text>
        <Text mobileBody color={Colors.secondaryGray}>
          {t('recordReportArea.helpDialog.stepThree.body')}
        </Text>
      </View>
    </View>
  );
};

export { StepThree };
