// External Dependencies
import React from 'react';
import {
  Modal, View, Pressable,
} from 'react-native';
import { Text } from 'react-native-ui-lib';
import { isEmpty } from 'lodash-es';
import { ProgressBar } from 'react-native-paper';

// Internal Dependencies
import { COLORS_LIGHT } from '../../constants/colors';

// Styles
import { customAlertStyles } from './CustomAlert.styles';

// Interfaces + Types
interface ICustomAlertProps {
  additionalText?: string;
  alertIcon?: JSX.Element;
  alertMessageText?: string;
  alertTitleText?: string;
  alertTitleTextColor?: string;
  displayAlert: boolean;
  negativeButtonIcon?: React.ReactElement;
  negativeButtonText?: string;
  onNegativeButtonPress?: () => void;
  onPositiveButtonPress: () => void;
  positiveButtonBackgroundColor: string;
  positiveButtonIcon?: React.ReactElement;
  positiveButtonText: string;
  progress?: number;
}

/**
 * Custom Alert - Displays an alert with custom title, message, and CTAs.
 *
 * @param ICustomAlertProps Alert properties to customize it.
 * @returns JSX
 */
const CustomAlert = ({
  additionalText,
  alertIcon,
  alertMessageText,
  alertTitleText,
  alertTitleTextColor,
  displayAlert,
  negativeButtonIcon,
  negativeButtonText,
  onNegativeButtonPress,
  onPositiveButtonPress,
  positiveButtonBackgroundColor,
  positiveButtonIcon,
  positiveButtonText,
  progress,
}: ICustomAlertProps) => (
  <Modal visible={displayAlert} transparent animationType="fade">
    <View style={customAlertStyles.modalOverlay}>
      <View style={customAlertStyles.modalContainer}>
        <View style={customAlertStyles.header}>
          {alertIcon ? (
            <View style={customAlertStyles.headerIcon}>
              {alertIcon}
            </View>
          ) : null}
          {!isEmpty(alertTitleText) && (
          <Text
            style={customAlertStyles.headerText}
            color={alertTitleTextColor || COLORS_LIGHT.G0_black}
          >
            {alertTitleText}
          </Text>
          )}
        </View>
        {!isEmpty(alertMessageText) && (
        <Text style={customAlertStyles.messageText}>
          {alertMessageText}
        </Text>
        )}

        {!isEmpty(additionalText) && (
          <Text style={customAlertStyles.additionalText}>{additionalText}</Text>
        )}

        {progress ? (
          <ProgressBar
            style={customAlertStyles.progressBar}
            progress={progress || 0}
            color={COLORS_LIGHT.brightBlue}
          />
        ) : null}
        <View style={customAlertStyles.horizontalView}>
          {!isEmpty(negativeButtonText) && (
            <Pressable
              style={customAlertStyles.negativeButton}
              onPress={onNegativeButtonPress}
              hitSlop={5}
            >
              {negativeButtonIcon && (
                <View style={customAlertStyles.positiveIcon}>
                  {negativeButtonIcon}
                </View>
              )}
              <Text style={customAlertStyles.negativeButtonText}>
                {negativeButtonText}
              </Text>
            </Pressable>
          )}
          {!isEmpty(positiveButtonText) && (
            <Pressable
              style={[
                { backgroundColor: positiveButtonBackgroundColor },
                customAlertStyles.positiveButton,
              ]}
              onPress={onPositiveButtonPress}
            >
              {positiveButtonIcon && (
              <View style={customAlertStyles.positiveIcon}>
                {positiveButtonIcon}
              </View>
              )}
              <Text style={customAlertStyles.positiveText}>{positiveButtonText}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  </Modal>
);

export { CustomAlert };
