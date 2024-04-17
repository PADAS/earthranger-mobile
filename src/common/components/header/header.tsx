// External Dependencies
import React from 'react';
import { Pressable } from 'react-native';

// Internal Dependencies
import { IS_IOS } from '../../constants/constants';
import { BackIconiOS } from '../../icons/BackIconiOS';
import { BackIconAndroid } from '../../icons/BackIconAndroid';
import styles from './header.styles';

export const osBackIcon = IS_IOS ? <BackIconiOS /> : <BackIconAndroid />;

export const customBackButton = (
  icon: JSX.Element,
  onPress?: () => void,
  closeButtonStyle = false,
) => (
  <Pressable
    style={closeButtonStyle ? styles.closebutton : styles.backbutton}
    onPress={onPress}
    hitSlop={{
      top: 20, bottom: 20, left: 20, right: 20,
    }}
  >
    {icon}
  </Pressable>
);
