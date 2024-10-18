/* eslint-disable react/jsx-no-useless-fragment */

// External Dependencies
import { Switch, TextStyle, ViewStyle } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import { useMMKVBoolean } from 'react-native-mmkv';
import React from 'react';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../common/constants/colors';
import { EXPERIMENTAL_FEATURES_FLAG_KEY } from '../../../common/constants/constants';
import { localStorage } from '../../../common/data/storage/keyValue';

// Interfaces + Types
interface SettingsItemProps {
  // The item to provide more information about the setting
  children?: JSX.Element,

  // The icon that represents the setting
  icon: JSX.Element,

  // The state variable tracking the status
  isEnabled: boolean,

  // Is the settings item behind experimental features?
  isExperimental?: boolean,

  // The label of the setting
  label: string,

  // The function to toggle the state
  toggle: React.Dispatch<React.SetStateAction<boolean>> | (() => Promise<void>),
}

const SettingsItem = (props: SettingsItemProps) => {
  // Props
  const {
    children,
    icon,
    isEnabled,
    isExperimental,
    label,
    toggle,
  } = props;

  const [isExperimentalFeaturesEnabled] = useMMKVBoolean(EXPERIMENTAL_FEATURES_FLAG_KEY, localStorage);

  return (
    <>
      {((isExperimental && isExperimentalFeaturesEnabled) || !isExperimental) ? (
        <>
          <View style={$mainContainer}>
            <View style={$settingsItemContainer}>
              {/* Icon */}
              <View style={$icon}>
                {icon}
              </View>

              {/* Text */}
              <View style={$labelContainer}>
                <Text
                  style={$label}
                  numberOfLines={2}
                >
                  {label}
                </Text>
              </View>

              {/* Switch */}
              <Switch
                style={$switch}
                trackColor={{ false: COLORS_LIGHT.G5_LightGreyLines, true: COLORS_LIGHT.blueLight }}
                thumbColor={
                  isEnabled
                    ? COLORS_LIGHT.brightBlue
                    : COLORS_LIGHT.G3_secondaryMediumLightGray
                }
                onValueChange={toggle}
                value={isEnabled}
              />
            </View>
          </View>

          {children}
        </>
      ) : null}
    </>
  );
};

export { SettingsItem };

// Styles

const $mainContainer: ViewStyle = {
  backgroundColor: COLORS_LIGHT.white,
  borderTopColor: COLORS_LIGHT.G5_LightGreyLines,
  borderTopWidth: 1,
};

const $settingsItemContainer: ViewStyle = {
  alignItems: 'center',
  flexDirection: 'row',
  paddingHorizontal: 16,
  paddingVertical: 14,
  width: '100%',
};

const $icon: ViewStyle = {
  height: 22,
  paddingTop: 3,
  width: 17.6,
};

const $labelContainer: ViewStyle = {
  flex: 1,
  marginLeft: 20,
};

const $label: TextStyle = {
  color: COLORS_LIGHT.G0_black,
  fontSize: 18,
  fontWeight: '600',
  paddingRight: 5,
};

const $switch: ViewStyle = {
  justifyContent: 'flex-end',
};
