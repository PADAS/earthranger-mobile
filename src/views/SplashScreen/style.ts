import { StyleSheet } from 'react-native';
import { COLORS_LIGHT } from '../../common/constants/colors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS_LIGHT.white,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
  },
  logo: {
    width: 194,
    height: 86,
    marginTop: '29.9%',
    resizeMode: 'cover',
  },
  statusMessage: {
    marginTop: 52,
  },
});

export default styles;
