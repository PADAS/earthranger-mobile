// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../constants/colors';
import { fontSize, fontWeight, lineHeight } from '../../constants/fonts';

const customAlertStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS_LIGHT.blackTransparent88,
  },
  modalContainer: {
    width: '80%',
    backgroundColor: COLORS_LIGHT.white,
    borderRadius: 5,
    paddingTop: 22,
    paddingBottom: 22,
    paddingLeft: 15,
    paddingRight: 15,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  messageText: {
    color: COLORS_LIGHT.G2_secondaryMediumGray,
    fontSize: 15,
    marginTop: 16,
    fontWeight: '400',
  },
  additionalText: {
    fontWeight: 'bold',
  },
  horizontalView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 22,
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    fontSize: fontSize.huge,
    lineHeight: lineHeight.huge,
    fontWeight: fontWeight.medium,
  },
  negativeButton: {
    flexDirection: 'row',
  },
  negativeButtonText: {
    lineHeight: 18,
    fontSize: 17,
    fontWeight: fontWeight.semiBold,
    color: COLORS_LIGHT.G3_secondaryMediumLightGray,
    textTransform: 'capitalize',
  },
  positiveButton: {
    height: 40,
    alignItems: 'center',
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 24,
    maxWidth: '60%',
    minWidth: '40%',
    paddingHorizontal: 16,
  },
  positiveText: {
    fontSize: 17,
    lineHeight: 21,
    marginRight: 9,
    marginLeft: 9,
    fontWeight: fontWeight.semiBold,
    color: COLORS_LIGHT.white,
    textTransform: 'capitalize',
  },
  positiveIcon: {
    marginRight: 6,
    marginLeft: 9,
  },
  progressBar: {
    height: 12,
    marginTop: 16,
    backgroundColor: COLORS_LIGHT.G5_LightGreyLines,
    borderRadius: 5,
  },
});

export { customAlertStyles };
