// External Dependencies
import React, { useMemo } from 'react';
import { Pressable } from 'react-native';

// internal Dependencies
import { SearchIcon } from '../../icons/SearchIcon';

// Styles
import styles from './SearchButton.styles';

// Interfaces
interface SearchButtonProps {
  onPress: () => void,
  additionalMargin?: boolean,
}

const SearchButton = ({ onPress, additionalMargin }: SearchButtonProps) => {
  // Components
  const icon = useMemo(() => (<SearchIcon />), []);

  return (
    <Pressable
      style={[styles.searchIcon, additionalMargin ? styles.additionalMargin : null]}
      onPress={onPress}
      hitSlop={{
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      }}
    >
      {icon}
    </Pressable>
  );
};

export { SearchButton };
