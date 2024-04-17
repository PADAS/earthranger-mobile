// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../constants/colors';

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: COLORS_LIGHT.white,
    borderColor: COLORS_LIGHT.G5_LightGreyLines,
    borderRadius: 3,
    borderWidth: 1,
    marginLeft: 8,
    marginTop: 16,
    marginRight: 8,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  iconStatus: {
    marginLeft: 'auto',
  },
  title: {
    marginLeft: 4,
  },
  bodyContainer: {
    marginTop: 8,
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    color: COLORS_LIGHT.G2_secondaryMediumGray,
    fontSize: 15,
  },
  value: {
    color: COLORS_LIGHT.G0_black,
    fontSize: 15,
    fontWeight: '400',
  },
});

export default styles;
