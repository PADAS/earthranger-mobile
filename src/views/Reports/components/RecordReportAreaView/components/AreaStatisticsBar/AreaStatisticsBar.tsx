// External Dependencies
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Colors, Text, View } from 'react-native-ui-lib';

// Internal Dependencies
import { convertAreaToSqKM, convertPerimeterToKM } from '../../../../../../common/utils/geometryUtils';

// Styles
import styles from './AreaStatisticsBar.styles';

// Interfaces
interface AreaStatisticsBarProps {
  areaMeters: number;
  perimeterMeters: number;
}

const AreaStatisticsBar = ({
  areaMeters,
  perimeterMeters,
}: AreaStatisticsBarProps) => {
  // Hooks
  const { t } = useTranslation();

  // Component's State
  const [perimeter, setPerimeter] = useState<string>();
  const [area, setArea] = useState<string>();

  // Lifecycle Events
  useEffect(() => {
    setPerimeter(convertPerimeterToKM(perimeterMeters));
    setArea(areaMeters > 20000 ? convertAreaToSqKM(areaMeters) : areaMeters.toString());
  }, [areaMeters.toString(), perimeterMeters.toString()]);

  return (
    <View style={styles.statisticsBarContainer}>
      {/* Perimeter */}
      <View style={styles.statisticContainer}>
        <Text label color={Colors.white}>{t('reports.perimeter')}</Text>
        <Text label color={Colors.white}>{`${perimeter} km`}</Text>
      </View>
      {/* End Perimeter */}

      {/* Area */}
      <View style={styles.statisticContainer}>
        <Text label color={Colors.white}>{t('reports.area')}</Text>
        <Text label color={Colors.white}>{`${area} ${areaMeters > 20000 ? 'sqkm' : 'sqm'}`}</Text>
      </View>
      {/* End Area */}
    </View>
  );
};

export { AreaStatisticsBar };
