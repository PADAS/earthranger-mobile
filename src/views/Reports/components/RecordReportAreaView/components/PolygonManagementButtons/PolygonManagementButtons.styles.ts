// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';

const styles = StyleSheet.create({
  /* Add Point Button */
  addPointButton: {
    backgroundColor: COLORS_LIGHT.brightBlue,
    marginRight: 6,
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
  },
  addPointButtonText: {
    color: COLORS_LIGHT.white,
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
  },
  /* End Add Point Button */

  /* Close Area Button */
  closeAreaButton: {
    backgroundColor: COLORS_LIGHT.white,
    marginLeft: 6,
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
  },
  closeAreaButtonText: {
    color: COLORS_LIGHT.brightBlue,
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
  },
  /* End Close Area Button */
});

export default styles;
