// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';

const styles = StyleSheet.create({
  containerSafeArea: {
    backgroundColor: COLORS_LIGHT.white,
    flex: 1,
  },
  cardContainer: {
    backgroundColor: COLORS_LIGHT.white,
    borderColor: COLORS_LIGHT.G5_LightGreyLines,
    borderRadius: 3,
    borderWidth: 1,
    margin: 15,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    height: 47,
    width: 47,
    borderRadius: 3,
    backgroundColor: COLORS_LIGHT.G7_veryLightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 25,
    marginLeft: 12,
  },
  infoCardTitle: {
    marginLeft: 15,
    color: COLORS_LIGHT.G0_black,
  },
});

export default styles;
