// External Dependencies
import { StyleSheet } from 'react-native';
import { Colors } from 'react-native-ui-lib';

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: Colors.white,
    padding: 0,
    display: 'flex',
    borderRadius: 5,
  },
  wizard: {
    borderBottomWidth: 0,
    shadowColor: Colors.white,
    display: 'flex',
    paddingVertical: 0,
    paddingHorizontal: 0,
    flexDirection: 'column',
  },

  /* Controls Bar */
  controlBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 24,
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 24,
  },
  rightControls: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftArrow: {
    marginRight: 20,
  },
  rightArrow: {
    marginLeft: 20,
  },
  disabledArrow: {
    opacity: 0.5,
  },
  /* End Controls Bar */
});

export default styles;
