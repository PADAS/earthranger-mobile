// External Dependencies
import { Button, Text, View } from 'react-native-ui-lib';
import { t } from 'i18next';
import { Pressable, ViewStyle } from 'react-native';
import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Internal Dependencies
import { ChevronIcon } from '../../../common/icons/ChevronIcon';
import { COLORS_LIGHT } from '../../../common/constants/colors';
import { RootStackParamList } from '../../../common/types/types';

// Interfaces + Types
interface SubjectGroupHeaderProps {
  subjectsCount: number,
  title: string,
  navigation: NativeStackNavigationProp<RootStackParamList, 'SubjectsListView'>,
  parentId: string,
}

export const SubjectGroupHeader = (props: SubjectGroupHeaderProps) => {
  const {
    subjectsCount,
    title,
    navigation,
    parentId,
  } = props;

  // State

  // Icons
  const chevronIcon = () => <ChevronIcon />;

  // Handlers
  const onActionPress = () => {
    navigation.push(
      'SubjectsListView',
      { parentSubjectGroupName: title, isParentView: false, parentId },
    );
  };

  return (
    <View style={$container}>
      <View style={$main}>
        {/* Details */}
        <Pressable onPress={onActionPress} style={$details}>
          <Text heading3 numberOfLines={1}>{title}</Text>
          <Text bodySmall secondaryMediumGray>
            {`${subjectsCount} ${subjectsCount > 1 ? t('subjectsView.subjects') : t('subjectsView.subject')}`}
          </Text>
        </Pressable>
      </View>

      {/* Action Icon */}
      <View>
        <Button
          hitSlop={{
            top: 20, bottom: 20, left: 20, right: 20,
          }}
          iconSource={chevronIcon}
          onPress={onActionPress}
          style={$actionButton}
        />
      </View>
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

const $details: ViewStyle = {
  flexDirection: 'column',
  marginLeft: 8,
  width: '80%',
};

const $actionButton: ViewStyle = {
  backgroundColor: 'transparent',
  marginRight: 14,
};
