// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    marginLeft: 8,
    marginRight: 8,
    marginTop: 24,
  },
  inputContainer: {
    backgroundColor: COLORS_LIGHT.G7_veryLightGrey,
  },
  title: {
    color: COLORS_LIGHT.G2_secondaryMediumGray,
    fontSize: 15,
    marginStart: 16,
    marginTop: 6,
  },
  textInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    color: COLORS_LIGHT.G0_black,
    fontSize: 17,
    marginBottom: 6,
    marginTop: 6,
    paddingLeft: 16,
  },
  textInput: {
    marginLeft: 8,
    color: COLORS_LIGHT.G0_black,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS_LIGHT.G5_LightGreyLines,
  },
});

export default styles;
