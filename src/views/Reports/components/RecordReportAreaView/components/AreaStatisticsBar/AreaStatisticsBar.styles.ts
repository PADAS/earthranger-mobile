// External Dependencies
import { StyleSheet } from 'react-native';
import { Colors } from 'react-native-ui-lib';

const styles = StyleSheet.create({
  /* Statistics Bar */
  statisticsBarContainer: {
    backgroundColor: Colors.blackOpacity75,
    borderRadius: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginLeft: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    position: 'absolute',
    top: 50,
    width: '80%',
  },
  statisticContainer: {
    width: '50%',
  },
  /* End Statistics Bar */
});

export default styles;
