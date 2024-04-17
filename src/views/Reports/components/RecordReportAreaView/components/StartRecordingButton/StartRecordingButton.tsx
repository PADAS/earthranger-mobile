// External Dependencies
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

// Internal Dependencies
import { PlayIcon } from '../../../../../../common/icons/PlayIcon';

// Styles
import generalStyles from '../../RecordReportAreaView.styles';
import styles from './StartRecordingButton.styles';

interface StartRecordingButtonProps {
  onStartRecordingPressHandler: () => void;
}

const StartRecordingButton = ({
  onStartRecordingPressHandler,
}: StartRecordingButtonProps) => {
  // Hooks
  const { t } = useTranslation();

  return (
    <View style={generalStyles.buttonOuterContainer}>
      <View style={generalStyles.buttonInnerContainer}>
        <Pressable
          style={
            [
              generalStyles.buttonBase,
              styles.startRecordingButton,
            ]
          }
          onPress={onStartRecordingPressHandler}
        >
          <PlayIcon />
          <Text style={styles.startRecordingButtonText}>{t('recordReportArea.startRecording')}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export { StartRecordingButton };
