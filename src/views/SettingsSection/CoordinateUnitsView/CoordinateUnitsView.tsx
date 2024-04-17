// External Dependencies
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Pressable } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../common/constants/colors';
import {
  COORDINATES_FORMAT_KEY,
} from '../../../common/constants/constants';
import { getStringForKey, setStringForKey } from '../../../common/data/storage/keyValue';
import { LocationFormats } from '../../../common/utils/locationUtils';

// Styles
import { style } from './style';

const CoordinateUnitsView = () => {
  // Variables
  const CHECKED = 'checked';
  const UNCHECKED = 'unchecked';

  // Hooks
  const { t } = useTranslation();
  const [radioButtonState, setRadioButtonState] = useState(
    getStringForKey(COORDINATES_FORMAT_KEY) || LocationFormats.DEG,
  );

  // Utilities
  const saveSelectedFormat = (format: string) => {
    setRadioButtonState(format);
    setStringForKey(COORDINATES_FORMAT_KEY, format);
  };

  return (
    <SafeAreaView style={style.containerSafeArea} edges={['bottom']}>
      <View style={style.overallContainer}>
        <Pressable onPress={() => saveSelectedFormat(LocationFormats.DEG)}>
          <View style={style.radioButtonContainer}>
            <RadioButton
              value={LocationFormats.DEG}
              color={COLORS_LIGHT.brightBlue}
              status={
                radioButtonState === LocationFormats.DEG ? CHECKED : UNCHECKED
              }
              onPress={() => saveSelectedFormat(LocationFormats.DEG)}
            />
            <View style={style.textContainer}>
              <Text style={radioButtonState === LocationFormats.DEG ? style.textSelected : style.textDeselected}>{`${t('coordinateUnitsView.deg')}`}</Text>
            </View>
          </View>
        </Pressable>

        <View style={style.line} />

        <Pressable onPress={() => saveSelectedFormat(LocationFormats.DMS)}>
          <View style={style.radioButtonContainer}>
            <RadioButton
              value={LocationFormats.DMS}
              color={COLORS_LIGHT.brightBlue}
              status={
                radioButtonState === LocationFormats.DMS ? CHECKED : UNCHECKED
              }
              onPress={() => saveSelectedFormat(LocationFormats.DMS)}
            />
            <View style={style.textContainer}>
              <Text style={radioButtonState === LocationFormats.DMS ? style.textSelected : style.textDeselected}>{`${t('coordinateUnitsView.dms')}`}</Text>
            </View>
          </View>
        </Pressable>

        <View style={style.line} />

        <Pressable onPress={() => saveSelectedFormat(LocationFormats.DDM)}>
          <View style={style.radioButtonContainer}>
            <RadioButton
              value={LocationFormats.DDM}
              color={COLORS_LIGHT.brightBlue}
              status={
                radioButtonState === LocationFormats.DDM ? CHECKED : UNCHECKED
              }
              onPress={() => saveSelectedFormat(LocationFormats.DDM)}
            />
            <View style={style.textContainer}>
              <Text style={radioButtonState === LocationFormats.DDM ? style.textSelected : style.textDeselected}>{`${t('coordinateUnitsView.ddm')}`}</Text>
            </View>
          </View>
        </Pressable>

        <View style={style.line} />

        <Pressable onPress={() => saveSelectedFormat(LocationFormats.UTM)}>
          <View style={style.radioButtonContainer}>
            <RadioButton
              value={LocationFormats.UTM}
              color={COLORS_LIGHT.brightBlue}
              status={
                radioButtonState === LocationFormats.UTM ? CHECKED : UNCHECKED
              }
              onPress={() => saveSelectedFormat(LocationFormats.UTM)}
            />
            <View style={style.textContainer}>
              <Text style={radioButtonState === LocationFormats.UTM ? style.textSelected : style.textDeselected}>{`${t('coordinateUnitsView.utm')}`}</Text>
            </View>
          </View>
        </Pressable>

        <View style={style.line} />

        <Pressable onPress={() => saveSelectedFormat(LocationFormats.MGRS)}>
          <View style={style.radioButtonContainer}>
            <RadioButton
              value={LocationFormats.MGRS}
              color={COLORS_LIGHT.brightBlue}
              status={
                radioButtonState === LocationFormats.MGRS ? CHECKED : UNCHECKED
              }
              onPress={() => saveSelectedFormat(LocationFormats.MGRS)}
            />
            <View style={style.textContainer}>
              <Text style={radioButtonState === LocationFormats.MGRS ? style.textSelected : style.textDeselected}>{`${t('coordinateUnitsView.mgrs')}`}</Text>
            </View>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export { CoordinateUnitsView };
