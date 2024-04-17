// External Dependencies
import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

// Internal Dependencies
import { TrashIcon } from '../../icons/TrashIcon';

// Styles
import styles from './ListItemCell.styles';

interface ReportTypesCellProps {
  text: string;
  onPress: () => void;
  onDelete: () => void;
}

const ListItemCell = ({
  text,
  onPress,
  onDelete,
}: ReportTypesCellProps) => (
  <View style={styles.container}>
    {/* Text Container */}
    <TouchableOpacity style={styles.textContainer} onPress={onPress}>
      <Text style={styles.text} numberOfLines={1}>{text}</Text>
    </TouchableOpacity>
    {/* End Text Container */}

    {/* Delete Button */}
    <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
      <TrashIcon />
    </TouchableOpacity>
    {/* Delete Button */}
  </View>
);

export { ListItemCell };
