// External Dependencies
import React from 'react';
import { Pressable } from 'react-native';

// Internal Dependencies
import { osBackIcon } from '../header/header';

// Styles
import styles from './BackViewButton.styles';

// Interfaces
interface BackViewButtonProps {
  onPressHandler: () => void;
}

const BackViewButton = ({
  onPressHandler,
}: BackViewButtonProps) => (
  <Pressable
    style={styles.backIcon}
    onPress={onPressHandler}
    hitSlop={{
      top: 20, bottom: 20, left: 20, right: 20,
    }}
  >
    {osBackIcon}
  </Pressable>
);

export { BackViewButton };
