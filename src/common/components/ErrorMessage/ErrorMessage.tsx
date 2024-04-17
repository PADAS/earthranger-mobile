/* eslint-disable arrow-body-style */
// External Dependencies
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, Pressable } from 'react-native';

// Internal Dependencies
import { CloseIcon } from '../../icons/CloseIcon';
import { COLORS_LIGHT } from '../../constants/colors';

// Styles
import style from './ErrorMessage.styles';

// Interfaces
interface ErrorMessageProps {
  onIconClickHandler: () => void;
}

export const ErrorMessage = ({ onIconClickHandler }: ErrorMessageProps) => {
  // Hooks
  const { t } = useTranslation();

  return (
    <View style={style.errorMessage}>
      <View style={style.errorMessageContainer}>
        <Text style={style.errorMessageText}>{t('statusView.unableToSync')}</Text>
        <Pressable style={style.errorMessageIcon} onPress={onIconClickHandler}>
          <CloseIcon color={COLORS_LIGHT.white} />
        </Pressable>
      </View>
    </View>
  );
};
