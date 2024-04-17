// External Dependencies
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Colors, Text, View } from 'react-native-ui-lib';
import { BulletsListIcon } from '../../../../../../../../common/icons/BulletsListIcon';

// Styles
import styles from './ReportRepeatableEmptyList.styles';

const ReportEmptyRepeatableList = () => {
  // Hooks
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <BulletsListIcon />
      </View>
      {/* End Icon */}

      {/* Text */}
      <Text heading2 centeredText>{ t('reportRepeatableFieldListView.noItemsAddedYet') }</Text>
      <Text
        bodySmall
        color={Colors.secondaryMediumGray}
      >
        { t('reportRepeatableFieldListView.tapToCreate') }
      </Text>
      {/* End Text */}
    </View>
  );
};

export { ReportEmptyRepeatableList };
