// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { fontSize, fontWeight, lineHeight } from '../../../../common/constants/fonts';
import { COLORS_LIGHT } from '../../../../common/constants/colors';
import { margin } from '../../../../common/constants/dimens';
import { IS_ANDROID } from '../../../../common/constants/constants';

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    backgroundColor: 'red',
    zIndex: 2,
  },
  scrollView: {
    flex: 1,
    marginBottom: 85,
  },
  reportFormMainContainer: {
    display: 'flex',
    flex: 1,
    backgroundColor: COLORS_LIGHT.white,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginStart: margin.small,
    marginEnd: margin.small,
  },
  textImages: {
    marginTop: 24,
    marginBottom: 9,
    marginStart: margin.small,
    lineHeight: lineHeight.standard,
    fontSize: fontSize.standard,
    fontWeight: fontWeight.medium,
    color: COLORS_LIGHT.G2_secondaryMediumGray,
  },
  images: {
    width: '33.3%',
    height: 120,
    resizeMode: 'cover',
    marginEnd: 1,
    marginBottom: 1,
  },
  addImagePlacholderContainer: {
    height: 120,
    width: '33%',
    alignItems: 'center',
    borderColor: COLORS_LIGHT.G5_LightGreyLines,
    borderRadius: 3,
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  addImagePlaceholderText: {
    color: COLORS_LIGHT.G2_secondaryMediumGray,
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
  },
  mapContainer: {
    height: 124,
  },
  mapImage: {
    flex: 1,
    height: 124,
  },
  mapCoordinatesContainer: {
    position: 'absolute',
    left: 8,
    bottom: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingTop: 4,
    paddingRight: 8,
    paddingBottom: 4,
    paddingLeft: 8,
    borderRadius: 20,
  },
  mapCoordinates: {
    color: COLORS_LIGHT.white,
  },
  editIcon: {
    position: 'absolute',
    top: 12,
    right: 19,
  },
  touchableArea: {
    width: 30,
    height: 30,
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'flex-end',
  },
  flatList: {
    marginTop: 12,
  },
  titleNotes: {
    lineHeight: lineHeight.standard,
    fontSize: fontSize.standard,
    fontWeight: fontWeight.medium,
    marginLeft: margin.small,
    marginTop: 24,
    color: COLORS_LIGHT.G2_secondaryMediumGray,
  },
  closeIcon: {
    marginRight: IS_ANDROID ? 16 : 0,
  },
  noteButton: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS_LIGHT.G5_LightGreyLines,
    borderLeftWidth: 1,
    borderRadius: 3,
    borderRightWidth: 1,
    borderTopWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: margin.small,
    marginRight: margin.small,
    paddingBottom: 16,
    paddingTop: 16,
  },
  textNoteButton: {
    fontSize: 15,
    fontWeight: fontWeight.normal,
    marginLeft: 8,
    color: COLORS_LIGHT.G2_secondaryMediumGray,
  },
  // Report Polygon Container
  polygonContainer: {
    alignItems: 'center',
    backgroundColor: COLORS_LIGHT.G6_LightGreyButton,
    display: 'flex',
    paddingBottom: 8,
    paddingTop: 8,
    width: '100%',
  },
  // End Report Polygon Container
});

export default styles;
