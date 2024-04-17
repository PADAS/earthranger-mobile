// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';

const styles = StyleSheet.create({
  horizontalContainer: {
    marginTop: 24,
    flexDirection: 'row',
  },
  inputContainer: {
    width: '80%',
    marginStart: 8,
    marginEnd: 20,
    backgroundColor: COLORS_LIGHT.G7_veryLightGrey,
  },
  textInput: {
    marginStart: 15,
    marginBottom: 6,
    color: COLORS_LIGHT.G0_black,
    fontSize: 17,
  },
  title: {
    marginTop: 6,
    marginStart: 15,
    color: COLORS_LIGHT.G2_secondaryMediumGray,
    fontSize: 15,
  },
  icon: {
    marginTop: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS_LIGHT.G5_LightGreyLines,
  },
});

export default styles;
