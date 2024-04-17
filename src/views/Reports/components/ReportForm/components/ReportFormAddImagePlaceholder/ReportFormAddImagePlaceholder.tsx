// External Dependencies
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';

// Internal Dependencies
import { CameraPlusIcon } from '../../../../../../common/icons/CameraPlusIcon';

// Styles
import styles from './ReportFormAddImagePlaceholder.styles';

// Interfaces
interface AddImagePlaceholderProps {
  onCameraPress: () => void;
}

export const AddImagePlaceholder = ({
  onCameraPress,
}: AddImagePlaceholderProps) => {
  // Hooks
  const { t } = useTranslation();

  return (
    <Pressable style={styles.addImagePlaceholderContainer} onPress={onCameraPress}>
      <CameraPlusIcon />
      <Text style={styles.addImagePlaceholderText}>
        {t('reports.addImage')}
      </Text>
    </Pressable>
  );
};
