// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../constants/colors';

const styles = StyleSheet.create({
  infoCardContainer: {
    backgroundColor: COLORS_LIGHT.white,
    borderColor: COLORS_LIGHT.G5_LightGreyLines,
    borderRadius: 3,
    borderWidth: 1,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 16,
    paddingBottom: 28,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
  },
  infoCardTitle: {
    color: COLORS_LIGHT.G2_secondaryMediumGray,
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  infoCardDescriptionContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  infoCardInnerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCardText: {
    color: COLORS_LIGHT.G0_black,
    fontSize: 21,
    fontWeight: '400',
    marginLeft: 14,
    marginRight: 32,
    letterSpacing: 0.02,
  },
  infoCardStatusText: {
    color: COLORS_LIGHT.G2_secondaryMediumGray,
    fontSize: 15,
  },
  infoCardStatusValue: {
    color: COLORS_LIGHT.G0_black,
    fontSize: 15,
    fontWeight: '400',
  },
  infoCardChevron: {
    display: 'flex',
    justifyContent: 'center',
  },
  infoCardInfoIcon: {
    position: 'absolute',
    top: 12,
    right: 16,
  },
});

export default styles;
