// External Dependencies
import { Button, Text, View } from 'react-native-ui-lib';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { ViewStyle } from 'react-native';
import React from 'react';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../common/constants/colors';
import { EyeIcon } from '../../../common/icons/EyeIcon';
import { EyeOffIcon } from '../../../common/icons/EyeOffIcon';
import { LocationIcon } from '../../../common/icons/LocationIcon';
import { calculateDateDifference } from '../../../common/utils/timeUtils';

// Interfaces + Types
interface SubjectItemProps {
  icon: string,
  isVisible: boolean,
  lastPositionUpdate: string,
  name: string,
  onVisibilityPress: () => void,
  onLocationPress: () => void,
}

export const SubjectItem = (props: SubjectItemProps) => {
  const {
    icon,
    isVisible,
    lastPositionUpdate,
    name,
    onVisibilityPress,
    onLocationPress,
  } = props;

  // Hooks
  const { t } = useTranslation();

  // Icons
  const locationIcon = () => (
    <View style={$action}>
      <LocationIcon width="12" height="16" viewbox="0 0 12 16" color={COLORS_LIGHT.brightBlue} />
    </View>
  );

  const visibleIcon = () => (
    <EyeIcon
      width="24"
      height="16"
      viewbox="0 0 24 16"
      color={COLORS_LIGHT.brightBlue}
    />
  );

  const hiddenIcon = () => (
    <EyeOffIcon
      width="24"
      height="16"
      viewbox="0 0 24 18"
      color={COLORS_LIGHT.brightBlue}
    />
  );

  return (
    <View style={$container}>
      <View style={$main}>
        {/* Visibility */}
        <View style={$visibilityIconContainer}>
          <Button
            hitSlop={{
              top: 20, bottom: 20, left: 20, right: 20,
            }}
            iconSource={isVisible ? visibleIcon : hiddenIcon}
            onPress={onVisibilityPress}
            style={$actionButton}
          />
        </View>

        {/* Details */}
        <View style={$details}>
          <View style={$detailsUpperContainer}>
            {icon && (
              <SvgXml xml={icon} width="16" height="16" fill={COLORS_LIGHT.G2_5_mobileSecondaryGray} />
            )}
            <Text heading3 numberOfLines={1} marginL-4>{name}</Text>
          </View>
          <Text bodySmall secondaryMediumGray>{`${calculateDateDifference(lastPositionUpdate, t)}`}</Text>
        </View>
      </View>

      {/* Action Icon */}
      {isVisible && (
        <View>
          <Button
            hitSlop={{
              top: 20, bottom: 20, left: 20, right: 20,
            }}
            iconSource={locationIcon}
            onPress={onLocationPress}
            style={$actionButton}
          />
        </View>
      )}
    </View>
  );
};

// Styles

const $container: ViewStyle = {
  alignItems: 'center',
  backgroundColor: COLORS_LIGHT.white,
  borderBottomColor: COLORS_LIGHT.G5_LightGreyLines,
  borderBottomWidth: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  paddingVertical: 8,
};

const $main: ViewStyle = {
  flexDirection: 'row',
};

const $visibilityIconContainer: ViewStyle = {
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  marginRight: 8,
};

const $detailsUpperContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};

const $details: ViewStyle = {
  flexDirection: 'column',
  marginLeft: 8,
  width: '75%',
};

const $action: ViewStyle = {
  width: 40,
  height: 40,
  backgroundColor: COLORS_LIGHT.blueLight,
  borderRadius: 3,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
};

const $actionButton: ViewStyle = {
  backgroundColor: 'transparent',
};
