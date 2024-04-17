// External Dependencies
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    padding: 20,
    width: '100%',
    justifyContent: 'space-between',
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  button: {
    marginLeft: 28,
  },
  smallButton: {
    paddingTop: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default styles;
