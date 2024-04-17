// External Dependencies
import React from 'react';
import {
  Pressable,
} from 'react-native';
import { Text, View } from 'react-native-ui-lib';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../common/constants/colors';
import { CheckmarkIcon } from '../../../../common/icons/CheckmarkIcon';

// Styles
import styles from './SubjectItemCell.styles';

interface SubjectItemCellProps {
  id: string;
  display: string;
  onPress: (subjectItem: string) => void;
  isSubjectItemSelected: boolean;
}

const SubjectItemCell = ({
  id,
  display,
  onPress,
  isSubjectItemSelected,
// eslint-disable-next-line arrow-body-style
}: SubjectItemCellProps) => {
  return (
    <Pressable
      style={styles.container}
      onPress={() => onPress(display)}
      key={id}
    >
      <Text style={[
        styles.displayText,
        {
          fontWeight: isSubjectItemSelected ? '600' : '400',
          color: isSubjectItemSelected ? COLORS_LIGHT.brightBlue : COLORS_LIGHT.G0_black,
        },
      ]}
      >
        {display}
      </Text>
      {isSubjectItemSelected && (
        <View>
          <CheckmarkIcon
            color={COLORS_LIGHT.brightBlue}
            width="16"
            height="13"
            viewbox="0 0 16 13"
          />
        </View>
      )}
    </Pressable>
  );
};

export { SubjectItemCell };
