// External Dependencies
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

// Internal Dependencies
import { NotePlusIcon } from '../../../../../../common/icons/NotePlusIcon';

// Styles
import styles from './ReportFormAddNotePlaceholder.styles';

// Interfaces
interface AddNotePlaceholderProps {
  onNotePress: () => void;
}

export const AddNotePlaceholder = ({
  onNotePress,
}: AddNotePlaceholderProps) => {
  // Hooks
  const { t } = useTranslation();

  return (
    <View>
      <Pressable style={styles.noteButton} onPress={onNotePress}>
        <NotePlusIcon />
        <Text style={styles.textNoteButton}>
          {t('reports.addNote')}
        </Text>
      </Pressable>
    </View>
  );
};
