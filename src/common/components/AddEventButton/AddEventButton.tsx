// External Dependencies
import React, { useMemo } from 'react';
import { Button } from 'react-native-ui-lib';

// internal Dependencies
import { ReportIcon } from '../../icons/ReportIcon';

// Styles
import styles from './AddEventButton.styles';

// Interfaces + Types
interface AddEventButtonProps {
  onPress: () => void
}

const AddEventButton = ({
  onPress,
}: AddEventButtonProps) => {
  // Components
  const icon = useMemo(() => (<ReportIcon />), []);

  return (
    <Button
      iconSource={() => icon}
      style={styles.addEventButton}
      onPress={onPress}
    />
  );
};

export { AddEventButton };
