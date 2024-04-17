// External Dependencies
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SvgXml } from 'react-native-svg';
import { Drawer } from 'react-native-ui-lib';
import { COLORS_LIGHT } from '../../../../../common/constants/colors';
import { DefaultEventTypeIcon } from '../../../../../common/icons/DefaultEventTypeIcon';
import { cleanUpSvg, mapPriorityToColor } from '../../../../../common/utils/svgIconsUtils';
import { icons } from '../../../../../ui/AssetsUtils';

// Styles
import styles from './ReportDraftsListCell.styles';

interface ReportDraftsListCellProps {
  date: string;
  iconImage: string;
  onPress?: () => void;
  onRemove?: () => void;
  priority: string;
  title: string;
}

const ReportDraftsListCell = ({
  title,
  iconImage,
  date,
  priority,
  onPress,
  onRemove,
}: ReportDraftsListCellProps) => {
  // Hooks
  const { t } = useTranslation();

  // Constants
  const xml = cleanUpSvg(iconImage);

  return (
    <GestureHandlerRootView>
      <Drawer
        rightItems={[
          {
            // eslint-disable-next-line global-require
            icon: icons.Trash.icon,
            text: t('common.delete'),
            background: COLORS_LIGHT.red,
            onPress: onRemove,
          },
        ]}
        itemsTextStyle={{ fontSize: 12 }}
        itemsIconSize={24}
      >
        <TouchableOpacity onPress={onPress}>
          <View style={styles.container}>
            <View>
              {iconImage
                ? <SvgXml xml={xml} width="40" height="40" fill={mapPriorityToColor(parseInt(priority, 10)) || 0} />
                : <DefaultEventTypeIcon width="40" height="40" color={mapPriorityToColor(parseInt(priority, 10)) || ''} />}
            </View>
            <Text style={styles.titleText} numberOfLines={2}>{title}</Text>
            <Text style={styles.dateText}>{date}</Text>
          </View>
          <View style={styles.divider} />
        </TouchableOpacity>
      </Drawer>
    </GestureHandlerRootView>
  );
};

export { ReportDraftsListCell };
