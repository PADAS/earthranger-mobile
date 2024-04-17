// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';
import { fontSize } from '../../../../../../common/constants/fonts';

const styles = StyleSheet.create({
  areaContainer: {
    height: 124,
    backgroundColor: COLORS_LIGHT.blue2,
    alignItems: 'center',
    borderBottomColor: COLORS_LIGHT.G5_LightGreyLines,
    borderBottomWidth: 3,
    borderTopColor: COLORS_LIGHT.G5_LightGreyLines,
    borderTopWidth: 3,
  },
  icon: {
    marginTop: 39,
    alignItems: 'center',
  },
  text: {
    marginTop: 13,
    fontWeight: 'bold',
    fontSize: fontSize.larger,
    color: COLORS_LIGHT.brightBlue,
  },
});

export default styles;
