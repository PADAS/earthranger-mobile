// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';

const styles = StyleSheet.create({
  /* Start Recording Button */
  startRecordingButton: {
    backgroundColor: COLORS_LIGHT.brightBlue,
  },
  startRecordingButtonText: {
    color: COLORS_LIGHT.white,
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
  },
  /* End Start Recording Button */
});

export default styles;
