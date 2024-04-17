// External Dependencies
import React from 'react';
import { FlatList } from 'react-native';

// Internal Dependencies
import { RepeatableFieldListData } from '../../../../../../../../common/types/types';
import { ReportEmptyRepeatableList } from '../ReportRepeatableEmptyList/ReportRepeatableEmptyList';
import { RepeatableFieldListItem } from './components/RepeatableFieldListItem/RepeatableFieldListItem';

// Styles
import styles from './ReportRepeatableFieldList.styles';

// Interfaces + Types
interface ReportRepeatableFieldListProps {
  data: RepeatableFieldListData[];
  schema?: any,
  onDeleteItem: (itemId: number) => void;
  onPress: (itemId: number) => void;
}

const ReportRepeatableFieldList = ({
  data,
  schema,
  onDeleteItem,
  onPress,
}: ReportRepeatableFieldListProps) => {
  if (data && data.length > 0) {
    return (
      <FlatList
        style={styles.container}
        data={data}
        renderItem={({ item }) => {
          if (!item.hidden) {
            return (
              <RepeatableFieldListItem
                id={item.id}
                title={item.title}
                data={item.data}
                properties={schema?.properties || {}}
                onDelete={onDeleteItem}
                onPress={onPress}
              />
            );
          }
          return null;
        }}
      />
    );
  }
  return (
    <ReportEmptyRepeatableList />
  );
};

export { ReportRepeatableFieldList };
