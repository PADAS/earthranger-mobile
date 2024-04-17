// External Dependencies
import { StyleSheet } from 'react-native';
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';

// Internal Dependencies

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
    height: 40,
    justifyContent: 'space-between',
    marginTop: 24,
  },
  patrolButton: {
    borderRadius: 5,
    height: 45,
    backgroundColor: COLORS_LIGHT.brightBlue,
  },
  patrolButtonRow: {
    flex: 2,
    marginRight: 8,
  },
  patrolButtonColumn: {
    flex: 1,
    marginBottom: 8,
  },
  trackButton: {
    borderRadius: 5,
    height: 45,
    backgroundColor: COLORS_LIGHT.white,
    borderWidth: 1,
    borderColor: COLORS_LIGHT.brightBlue,
  },
  trackButtonRow: {
    flex: 2,
    marginLeft: 8,
  },
  trackButtonColumn: {
    flex: 1,
    marginBottom: 8,
  },
});

export default styles;
