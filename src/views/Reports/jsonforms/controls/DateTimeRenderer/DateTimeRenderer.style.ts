// External Dependencies
import { StyleSheet } from 'react-native';
import { commonStyles } from '../Controls.style';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...commonStyles.horizontalMargins,
    ...commonStyles.marginBottom,
  },
  trailingAccessory: {
    paddingRight: 8,
    justifyContent: 'center',
  },
});

export default styles;
