// External Dependencies
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { View, Text } from 'react-native-ui-lib';
import { RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../common/constants/colors';
import { getStringForKey, setStringForKey } from '../../../common/data/storage/keyValue';
import { PHOTO_QUALITY_KEY } from '../../../common/constants/constants';
import { QualityType } from '../../../common/utils/imageUtils';

// Styles
import { style } from './style';

const PhotoQualityView = () => {
  // Variables
  const CHECKED = 'checked';
  const UNCHECKED = 'unchecked';

  // Hooks
  const { t } = useTranslation();
  const [radioButtonState, setRadioButtonState] = useState(
    getStringForKey(PHOTO_QUALITY_KEY) || QualityType.MEDIUM,
  );

  // Utilities
  const saveSelectedFormat = (format: string) => {
    setRadioButtonState(format);
    setStringForKey(PHOTO_QUALITY_KEY, format);
  };

  return (
    <SafeAreaView style={style.containerSafeArea} edges={['bottom']}>
      <View style={style.overallContainer}>
        <View style={style.optionItemContainer}>
          <Pressable onPress={() => saveSelectedFormat(QualityType.HIGH)}>
            <View style={style.radioButtonContainer}>
              <RadioButton
                value={QualityType.HIGH}
                color={COLORS_LIGHT.brightBlue}
                status={
                  radioButtonState === QualityType.HIGH ? CHECKED : UNCHECKED
                }
                onPress={() => saveSelectedFormat(QualityType.HIGH)}
              />
              <View style={style.textContainer}>
                <Text style={radioButtonState === QualityType.HIGH ? style.textSelected : style.textDeselected}>{`${t('settingsView.high')}`}</Text>
              </View>
              <View style={{ alignSelf: 'center' }}>
                <Text style={style.textSubtitle}>{`${t('settingsView.slowestUpload')}`}</Text>
              </View>
            </View>
          </Pressable>
        </View>

        <View style={style.line} />

        <View style={style.optionItemContainer}>
          <Pressable onPress={() => saveSelectedFormat(QualityType.MEDIUM)}>
            <View style={style.radioButtonContainer}>
              <RadioButton
                value={QualityType.MEDIUM}
                color={COLORS_LIGHT.brightBlue}
                status={
                  radioButtonState === QualityType.MEDIUM ? CHECKED : UNCHECKED
                }
                onPress={() => saveSelectedFormat(QualityType.MEDIUM)}
              />
              <View style={style.textContainer}>
                <Text style={radioButtonState === QualityType.MEDIUM ? style.textSelected : style.textDeselected}>{`${t('settingsView.medium')}`}</Text>
              </View>
            </View>
          </Pressable>
        </View>

        <View style={style.line} />

        <View style={style.optionItemContainer}>
          <Pressable onPress={() => saveSelectedFormat(QualityType.LOW)}>
            <View style={style.radioButtonContainer}>
              <RadioButton
                value={QualityType.LOW}
                color={COLORS_LIGHT.brightBlue}
                status={
                  radioButtonState === QualityType.LOW ? CHECKED : UNCHECKED
                }
                onPress={() => saveSelectedFormat(QualityType.LOW)}
              />
              <View style={style.textContainer}>
                <Text style={radioButtonState === QualityType.LOW ? style.textSelected : style.textDeselected}>{`${t('settingsView.low')}`}</Text>
              </View>
              <View style={{ alignSelf: 'center' }}>
                <Text style={style.textSubtitle}>{`${t('settingsView.fastestUpload')}`}</Text>
              </View>
            </View>
          </Pressable>
        </View>

      </View>
    </SafeAreaView>
  );
};

export { PhotoQualityView };
