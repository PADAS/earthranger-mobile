// External Dependencies
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Colors,
  Image,
  Text,
  View,
} from 'react-native-ui-lib';
import { getLocales } from 'react-native-localize';

// Styles
import styles from '../Steps.styles';

const StepTwo = () => {
  // Hooks
  const { t } = useTranslation();

  // Component's State
  const [isLocaleEnglish, setIsLocaleEnglish] = useState(true);

  useEffect(() => {
    const locales = getLocales();
    setIsLocaleEnglish(locales[0].languageCode === 'en');
  }, []);

  return (
    <View>
      {isLocaleEnglish ? (
        <Image
          /* eslint-disable-next-line global-require */
          source={require('../../../../../../../../../assets/dialog-step-2-en.png')}
          style={styles.topSection}
        />
      ) : (
        <Image
          /* eslint-disable-next-line global-require */
          source={require('../../../../../../../../../assets/dialog-step-2-other.png')}
          style={styles.topSection}
        />
      )}
      <View style={styles.bodySection}>
        <Text heading2>
          {t('recordReportArea.helpDialog.stepTwo.title')}
        </Text>
        <Text mobileBody color={Colors.secondaryGray}>
          {t('recordReportArea.helpDialog.stepTwo.body')}
        </Text>
      </View>
    </View>
  );
};

export { StepTwo };
