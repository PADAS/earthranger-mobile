// External Dependencies
import React from 'react';
import { Pressable } from 'react-native';
import { Colors, View } from 'react-native-ui-lib';

// Internal Dependencies
import { RedoIcon } from '../../../../../../common/icons/RedoIcon';
import { TrashIcon } from '../../../../../../common/icons/TrashIcon';
import { UndoIcon } from '../../../../../../common/icons/UndoIcon';
import { QuestionMarkIcon } from '../../../../../../common/icons/QuestionMarkIcon';

// Styles
import styles from './BottomToolbar.styles';

// Interfaces
interface BottomToolbarProps {
  isDeleteDisabled: boolean;
  isRedoDisabled: boolean;
  isUndoDisabled: boolean;
  onDeletePressHandler: () => void;
  onRedoPressHandler: () => void;
  onUndoPressHandler: () => void;
  onToggleHelpPressHandler: (isVisible: boolean) => void;
}

const BottomToolbar = ({
  isDeleteDisabled,
  isRedoDisabled,
  isUndoDisabled,
  onDeletePressHandler,
  onRedoPressHandler,
  onUndoPressHandler,
  onToggleHelpPressHandler,
}: BottomToolbarProps) => (
  <View
    backgroundColor={Colors.white}
    style={styles.container}
  >
    <View style={styles.leftContainer}>
      {/* Undo */}
      <Pressable
        onPress={onUndoPressHandler}
        style={[styles.smallButton, isUndoDisabled ? styles.disabledButton : null]}
        hitSlop={{
          top: 20, bottom: 20, left: 20, right: 20,
        }}
        disabled={isUndoDisabled}
      >
        <UndoIcon color={Colors.secondaryMediumGray} />
      </Pressable>
      {/* End Undo */}

      {/* Redo */}
      <Pressable
        style={[
          styles.button,
          styles.smallButton,
          isRedoDisabled ? styles.disabledButton : null,
        ]}
        onPress={onRedoPressHandler}
        hitSlop={{
          top: 20, bottom: 20, left: 20, right: 20,
        }}
        disabled={isRedoDisabled}
      >
        <RedoIcon color={Colors.secondaryMediumGray} />
      </Pressable>
      {/* End Redo */}

      {/* Delete */}
      <Pressable
        style={[styles.button, isDeleteDisabled ? styles.disabledButton : null]}
        onPress={onDeletePressHandler}
        hitSlop={{
          top: 20, bottom: 20, left: 20, right: 20,
        }}
        disabled={isDeleteDisabled}
      >
        <TrashIcon color={Colors.brightRed} />
      </Pressable>
      {/* End Delete */}
    </View>

    {/* Help */}
    <Pressable
      onPress={() => onToggleHelpPressHandler(true)}
      hitSlop={{
        top: 20, bottom: 20, left: 20, right: 20,
      }}
    >
      <QuestionMarkIcon />
    </Pressable>
    {/* End Help */}
  </View>
);

export { BottomToolbar };
