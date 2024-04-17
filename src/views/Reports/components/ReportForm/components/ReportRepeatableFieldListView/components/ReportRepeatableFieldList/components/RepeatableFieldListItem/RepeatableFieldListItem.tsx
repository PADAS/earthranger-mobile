// External Dependencies
import React from 'react';
import {
  View,
  Text,
  Drawer,
} from 'react-native-ui-lib';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../../../../../common/constants/colors';
import { icons } from '../../../../../../../../../../ui/AssetsUtils';

// Styles
import styles from './RepeatableFieldListItem.styles';

interface RepeatableFieldListItemProps {
  id: number;
  title: string;
  data: any,
  properties?: any,
  onPress: (itemId: number) => void;
  onDelete: (itemId: number) => void;
}

const RepeatableFieldListItem = ({
  id,
  title,
  data,
  properties,
  onPress,
  onDelete,
}: RepeatableFieldListItemProps) => {
  // Hooks
  const { t } = useTranslation();

  const getValue = (key: string) => {
    const property = properties[key];
    const value = data[key];

    if (property) {
      if (property.type === 'string') {
        if (Array.isArray(property.enumNames)) {
          return property.enumNames[property.enum.indexOf(value)];
        }
        if (property.enumNames instanceof Object) {
          return property.enumNames[value];
        }
      }
    }

    if (Array.isArray(value)) {
      return JSON.stringify(value).replace(/[[{\]}]/gi, '');
    }

    return value;
  };

  return (
    <GestureHandlerRootView>
      <Drawer
        rightItems={[
          {
            // eslint-disable-next-line global-require
            icon: icons.Trash.icon,
            text: t('common.delete'),
            background: COLORS_LIGHT.red,
            onPress: () => onDelete(id),
          },
        ]}
        itemsTextStyle={{ fontSize: 12 }}
        itemsIconSize={24}
      >
        <TouchableOpacity onPress={() => onPress(id)}>
          <View style={styles.dataContainer}>
            <Text heading3 style={styles.title}>{title}</Text>
            { data && Object.keys(data).length > 0 ? (
              <View style={styles.container}>
                { Object.keys(data).slice(0, 2).map((key) => (
                  <Text style={styles.textContainer} numberOfLines={1} ellipsizeMode="tail">
                    {`${properties[key]?.title.trim() || key}: `}
                    {getValue(key)}
                  </Text>
                ))}
              </View>
            ) : null }
          </View>
          <View bg-lightGrayLines style={styles.divider} />
        </TouchableOpacity>
      </Drawer>
    </GestureHandlerRootView>
  );
};

export { RepeatableFieldListItem };
