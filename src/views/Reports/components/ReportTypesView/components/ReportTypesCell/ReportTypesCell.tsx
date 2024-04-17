// External Dependencies
import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

// Internal Dependencies
import { DefaultEventTypeIcon } from '../../../../../../common/icons/DefaultEventTypeIcon';
import { cleanUpSvg, mapPriorityToColor } from '../../../../../../common/utils/svgIconsUtils';

// Styles
import styles from './ReportTypesCell.styles';

interface ReportTypesCellProps {
  typeId: string;
  title: string;
  iconImage: string;
  priority: string;
  onPress: (typeId: string) => void;
}

const ReportTypesCell = ({
  typeId,
  title,
  iconImage,
  priority,
  onPress,
}: ReportTypesCellProps) => {
  /**
   * Some icons have a previously loaded color,
   * which results in it ignoring the color we assign based on the priority.
   * For these icons, it is necessary to remove the `fill` property.
   */
  const xml = cleanUpSvg(iconImage);

  return (
    <TouchableOpacity onPress={() => onPress(typeId)}>
      <View style={styles.container}>
        <View style={styles.iconImage}>
          {iconImage
            ? <SvgXml xml={xml} width="40" height="40" fill={mapPriorityToColor(parseInt(priority, 10)) || 0} />
            : <DefaultEventTypeIcon color={mapPriorityToColor(parseInt(priority, 10)) || ''} />}
        </View>
        <Text style={styles.titleText} numberOfLines={3}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export { ReportTypesCell };
