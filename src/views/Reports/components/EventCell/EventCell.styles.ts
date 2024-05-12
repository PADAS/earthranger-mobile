// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../common/constants/colors';

const styles = StyleSheet.create({
  /* Containers */
  mainContainer: {
    backgroundColor: COLORS_LIGHT.white,
    borderBottomColor: COLORS_LIGHT.G5_LightGreyLines,
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 1,
    padding: 16,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 3,
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    justifyContent: 'center',
    width: 48,
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 16,
    width: '84%',
  },
  caretContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: 15,
  },
  /* End Containers */

  /* Details */
  badgeMainContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 4,
    alignItems: 'center',
    borderRadius: 3,
  },
  badgeContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 8,
  },
  /* End Details */
});

export default styles;
