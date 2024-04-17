// External Dependencies
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native-ui-lib';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable } from 'react-native';

// Internal Dependencies
import { LogOutAlertIcon } from '../../../common/icons/LogOutAlertIcon';
import { TrashIcon } from '../../../common/icons/TrashIcon';

// Styles
import { style } from './style';

const ResetDatabaseCacheView = () => {
  // Hooks
  const { t } = useTranslation();

  return (
    <SafeAreaView style={style.containerSafeArea} edges={['bottom']}>
      <View style={style.infoCardContainer}>
        <View style={style.infoCardDescriptionContainer}>
          <View style={style.iconContainer}>
            <View style={style.iconBackground}>
              <LogOutAlertIcon />
            </View>
          </View>
          <View>
            <Text style={style.infoCard}>
              {t('resetDatabaseCacheView.alertDescription')}
            </Text>
          </View>
        </View>
        {/* Submit Button */}
        <View style={style.buttonContainer}>
          <Pressable style={style.button}>
            <TrashIcon />
            <Text style={style.textButton}>
              {t('aboutView.resetDatabaseCache')}
            </Text>
          </Pressable>
        </View>
        {/* End Submit Button */}
      </View>
    </SafeAreaView>
  );
};

export { ResetDatabaseCacheView };
