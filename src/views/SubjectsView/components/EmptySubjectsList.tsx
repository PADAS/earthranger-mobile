// External Dependencies
import { Text } from 'react-native-ui-lib';
import { TextStyle, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import React from 'react';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../common/constants/colors';
import NoSubjectsIcon from '../../../common/icons/NoSubjectsIcon';

const EmptySubjectsList = () => {
  // Hooks
  const { t } = useTranslation();

  return (
    <View style={$cardContainer}>
      <View style={$contentContainer}>
        <View style={$iconContainer}>
          <NoSubjectsIcon />
        </View>
        <View>
          <Text heading3 style={$infoCardTitle}>
            { t('subjectsView.emptyList')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const $cardContainer: ViewStyle = {
  backgroundColor: COLORS_LIGHT.white,
  borderColor: COLORS_LIGHT.G5_LightGreyLines,
  borderRadius: 3,
  borderWidth: 1,
  margin: 15,
};

const $contentContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};

const $iconContainer: ViewStyle = {
  height: 47,
  width: 47,
  borderRadius: 3,
  backgroundColor: COLORS_LIGHT.G7_veryLightGrey,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 25,
  marginBottom: 25,
  marginLeft: 12,
};

const $infoCardTitle: TextStyle = {
  marginLeft: 15,
  color: COLORS_LIGHT.G0_black,
};

export { EmptySubjectsList };
