// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../common/constants/colors';

const styles = StyleSheet.create({
  container: {
    borderBottomColor: COLORS_LIGHT.G5_LightGreyLines,
    borderBottomWidth: 1,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  displayText: {
    fontSize: 16,
  },
});

export default styles;
