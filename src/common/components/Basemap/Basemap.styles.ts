// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../constants/colors';

const styles = StyleSheet.create({
  /* Basemap */
  bottomSheetBody: {
    paddingLeft: 16,
    paddingRight: 16,
    height: '100%',
  },
  bottomSheetHeader: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS_LIGHT.G5_LightGreyLines,
    paddingBottom: 16,
    paddingTop: 16,
  },
  bottomSheetHeaderTitle: {
    marginLeft: 16,
  },
  bottomSheetCloseButton: {
    position: 'absolute',
    right: 28,
    top: 24,
  },
  bottomSheetMapsContainer: {
    paddingTop: 16,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  bottomSheetMapItem: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '30%',
  },
  bottomSheetMap: {
    width: '100%',
    borderRadius: 3,
  },
  bottomSheetMapItemSelected: {
    borderWidth: 3,
    borderColor: COLORS_LIGHT.brightBlue,
    borderRadius: 3,
    padding: 2,
  },
  bottomSheetMapItemUnselected: {
    borderWidth: 3,
    borderColor: COLORS_LIGHT.transparent,
    borderRadius: 3,
    padding: 2,
  },
  /* End Basemap */
});

export default styles;
