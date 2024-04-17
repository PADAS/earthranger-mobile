// External Dependencies
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native-ui-lib';

// Internal Dependencies
import { AccountSettingsIcon } from '../../common/icons/AccountSettingsIcon';

// Styles
import styles from './PermissionView.styles';

const PermissionView = ({ emptyEventCategory }: { emptyEventCategory: boolean }) => {
  // Hooks
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.containerSafeArea} edges={['bottom']}>
      <View style={styles.infoCardContainer}>
        <View style={styles.infoCardDescriptionContainer}>
          <View style={styles.iconContainer}>
            <AccountSettingsIcon />
          </View>
          <View>
            <Text heading3 style={styles.infoCardTitle}>
              {emptyEventCategory ? t('permissionsView.emptyEventCategory.title') : t('permissionsView.title')}
            </Text>
            <Text>
              {emptyEventCategory ? t('permissionsView.emptyEventCategory.description') : t('permissionsView.description')}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export { PermissionView };
