// External Dependencies
import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';

// Internal Dependencies
import { DefaultEventTypeIcon } from '../../../../../../common/icons/DefaultEventTypeIcon';
import { cleanUpSvg } from '../../../../../../common/utils/svgIconsUtils';

// Styles
import styles from './PatrolTypesCell.styles';

interface ReportTypesCellProps {
  typeId: string;
  title: string;
  iconImage: string;
  onPress: (typeId: string) => void;
}

const PatrolTypesCell = ({
  typeId,
  title,
  iconImage,
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
            ? <SvgXml xml={xml} width="40" height="40" fill={COLORS_LIGHT.G2_5_mobileSecondaryGray} />
            : <DefaultEventTypeIcon color={COLORS_LIGHT.G2_5_mobileSecondaryGray} />}
        </View>
        <Text style={styles.titleText} numberOfLines={3}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export { PatrolTypesCell };
