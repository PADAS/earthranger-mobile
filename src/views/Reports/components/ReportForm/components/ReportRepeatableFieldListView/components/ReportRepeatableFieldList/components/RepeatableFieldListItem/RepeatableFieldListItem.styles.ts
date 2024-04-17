// External Dependencies
import { StyleSheet } from 'react-native';
import { COLORS_LIGHT } from '../../../../../../../../../../common/constants/colors';

const styles = StyleSheet.create({
  dataContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: COLORS_LIGHT.white,
  },
  title: {
    marginTop: 16,
    marginBottom: 4,
  },
  container: {
    marginBottom: 16,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  divider: {
    height: 1,
  },
});

export default styles;
