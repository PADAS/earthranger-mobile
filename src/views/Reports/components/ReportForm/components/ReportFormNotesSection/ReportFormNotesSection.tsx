// External Dependencies
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';

// Internal Dependencies
import { Note } from '../../../../../../common/types/reportsResponse';
import { AddNotePlaceholder } from '../ReportFormAddNotePlaceholder/ReportFormAddNotePlaceholder';
import { ListItemCell } from '../../../../../../common/components/ListItemCell/ListItemCell';

// Styles
import styles from './ReportFormNotestSection.styles';

// Interfaces
interface NotesSectionProps {
  notes: Note[];
  onNoteEdit: (item: Note) => void;
  onNoteDelete: (id: number) => void;
  onNotePress: () => void;
}

export const NotesSection = ({
  notes,
  onNoteEdit,
  onNoteDelete,
  onNotePress,
}: NotesSectionProps) => {
  // Hooks
  const { t } = useTranslation();

  return (
    <View>
      <Text style={styles.notesSectionTitle}>{t('reports.notes').toUpperCase()}</Text>

      {notes.map((item) => (
        <ListItemCell
          key={item.id}
          text={item.text}
          onPress={() => onNoteEdit(item)}
          onDelete={() => onNoteDelete(item.id)}
        />
      ))}

      <AddNotePlaceholder onNotePress={onNotePress} />
    </View>
  );
};
