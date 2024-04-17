import { StyleSheet } from 'react-native';
import { COLORS_LIGHT } from '../../../../../../../../common/constants/colors';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: COLORS_LIGHT.white,
  },
  formContainer: {
    marginLeft: 8,
    marginRight: 8,
  },
  scrollView: {
    flex: 1,
  },
});

export default styles;
