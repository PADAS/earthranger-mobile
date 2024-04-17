// External Dependencies
import { Dimensions, StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS_LIGHT.G5_LightGreyLines,
    borderRightWidth: 1,
    flexDirection: 'column',
    height: 131,
    justifyContent: 'center',
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 16,
    width: width / 3,
  },
  iconImage: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 16,
    height: 40,
  },
  titleText: {
    fontSize: 15,
    height: 54,
    lineHeight: 17,
    textAlign: 'center',
  },
});

export default styles;
