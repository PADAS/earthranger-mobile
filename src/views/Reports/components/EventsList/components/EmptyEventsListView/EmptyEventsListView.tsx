// External Dependencies
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native-ui-lib';

// Internal Dependencies
import NoEventsIcon from '../../../../../../common/icons/NoEventsIcon';

// Styles
import styles from './EmptyEventsListView.styles';

const EmptyEventsListView = () => {
  // Hooks
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.containerSafeArea} edges={['bottom']}>
      <View style={styles.cardContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <NoEventsIcon />
          </View>
          <View>
            <Text heading3 style={styles.infoCardTitle}>
              { t('eventList.emptyEvents')}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export { EmptyEventsListView };
