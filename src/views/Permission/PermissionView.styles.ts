// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../common/constants/colors';

const styles = StyleSheet.create({
  containerSafeArea: {
    backgroundColor: COLORS_LIGHT.white,
  },
  cardsContainer: {
    paddingTop: 12,
  },
  infoCardContainer: {
    backgroundColor: COLORS_LIGHT.white,
    borderColor: COLORS_LIGHT.G5_LightGreyLines,
    borderRadius: 3,
    borderWidth: 1,
    marginBottom: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
  },
  infoCardDescriptionContainer: {
    marginRight: 55,
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    paddingBottom: 20,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 20,
    marginRight: 14,
    backgroundColor: COLORS_LIGHT.G7_veryLightGrey,
  },
  infoCardTitle: {
    marginBottom: 8,
    color: COLORS_LIGHT.G0_black,
    fontWeight: '600',
  },
});

export default styles;
