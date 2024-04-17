// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS_LIGHT.G7_veryLightGrey,
    borderColor: COLORS_LIGHT.G5_LightGreyLines,
    borderRadius: 3,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    height: 50,
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 8,
    paddingLeft: 8,
    paddingRight: 6,
  },

  /* Text */
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  text: {
    alignItems: 'center',
    color: COLORS_LIGHT.G0_black,
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: 14,
    fontWeight: '600',
  },
  /* End Text */

  /* Delete Button */
  deleteButton: {
    alignItems: 'center',
    backgroundColor: COLORS_LIGHT.G3_secondaryMediumLightGray,
    borderRadius: 3,
    display: 'flex',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  /* End Delete Button */
});

export default styles;
