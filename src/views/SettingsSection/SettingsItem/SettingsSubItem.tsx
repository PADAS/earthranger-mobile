/* eslint-disable react/jsx-no-useless-fragment */

// External Dependencies
import { Pressable, TextStyle, ViewStyle } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import React from 'react';

// Internal Dependencies
import { ChevronIcon } from '../../../common/icons/ChevronIcon';
import { COLORS_LIGHT } from '../../../common/constants/colors';

// Interfaces + Types
interface SettingsSubItemProps {
  // The contextual text
  description: string,

  // The state variable tracking the status
  isEnabled: boolean,

  // The label of the setting
  label: string,

  // The action to execute when tapped
  onPress?: () => void,
}

const SettingsSubItem = (props: SettingsSubItemProps) => {
  // Props
  const {
    description,
    isEnabled,
    label,
    onPress,
  } = props;

  return (
    <>
      {(isEnabled) ? (
        <View style={$mainContainer}>
          <Pressable onPress={onPress}>
            <View style={$settingsSubItemContainer}>
              {/* Spacer */}
              <View style={$spacer} />

              {/* Label and Description */}
              <View style={$labelContainer}>
                <Text style={$label}>
                  {label}
                </Text>
                <Text style={$description}>
                  {description}
                </Text>
              </View>

              {/* Icon */}
              <ChevronIcon />
            </View>
          </Pressable>
        </View>
      ) : null}
    </>
  );
};

export { SettingsSubItem };

// Styles

const $mainContainer: ViewStyle = {
  backgroundColor: COLORS_LIGHT.white,
};

const $settingsSubItemContainer: ViewStyle = {
  alignItems: 'center',
  flexDirection: 'row',
  paddingBottom: 14,
  paddingLeft: 16,
  paddingRight: 16,
  paddingTop: 8,
  width: '100%',
};

const $spacer: ViewStyle = {
  height: 22,
  paddingTop: 3,
  width: 17.6,
};

const $labelContainer: ViewStyle = {
  marginStart: 20,
  width: '80%',
};

const $label: TextStyle = {
  color: COLORS_LIGHT.G0_black,
  fontSize: 17,
  fontWeight: 'normal',
  paddingRight: 5,
};

const $description: TextStyle = {
  color: COLORS_LIGHT.G2_secondaryMediumGray,
  fontSize: 14,
  fontWeight: '400',
  marginStart: 2,
};
