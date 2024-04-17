// External Dependencies
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-ui-lib';
import { useTranslation } from 'react-i18next';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';
import { CheckmarkIcon } from '../../../../../../common/icons/CheckmarkIcon';
import { SendIcon } from '../../../../../../common/icons/SendIcon';

// Styles
import styles from './ReportFormSubmitButton.styles';

// Interfaces + Types
interface ReportFormSubmitButtonProps {
  disabled?: boolean;
  isExtended?: boolean;
}

export const ReportFormSubmitButton = ({
  disabled = false,
  isExtended = false,
}: ReportFormSubmitButtonProps) => {
  // Hooks
  const { t } = useTranslation();

  return (
    <View
      style={[
        isExtended ? styles.extendedSubmitButtonContainer : styles.reportFormSubmitButtonContainer,
        disabled ? styles.formSubmitButtonDisabled : null,
      ]}
    >
      {isExtended ? (
        <>
          <SendIcon />
          <Text heading3 brightBlue marginL-8>{t('common.submit')}</Text>
        </>
      ) : (
        <CheckmarkIcon color={COLORS_LIGHT.brightBlue} width="24" height="24" />
      )}
    </View>
  );
};
