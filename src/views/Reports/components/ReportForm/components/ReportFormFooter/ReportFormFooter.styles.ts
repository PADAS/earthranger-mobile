// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';

const styles = StyleSheet.create({
  reportFormFooter: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: COLORS_LIGHT.white,
    height: 66,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reportFormFooterIcons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  reportFormCentralIcon: {
    marginLeft: 29,
    marginRight: 24,
  },
  reportFormFooterDraftContainer: {
    marginEnd: 16,
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: COLORS_LIGHT.G6_LightGreyButton,
    borderRadius: 5,
  },
  reportFormFooterDraftPressable: {
    marginTop: 12,
    marginStart: 16,
    marginEnd: 16,
    flexDirection: 'row',
  },
  reportFormFooterDraftText: {
    color: COLORS_LIGHT.G1_off_black,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.34,
    lineHeight: 17,
    marginTop: 3,
  },
});

export default styles;
