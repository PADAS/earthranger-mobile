// External Dependencies
import { StyleSheet } from 'react-native';
import { fontSize, fontWeight, lineHeight } from '../../../../../../common/constants/fonts';

// Internal Dependencies

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  textArea: {
    marginTop: 21,
    marginLeft: 12,
    marginRight: 12,
    flex: 1,
    textAlignVertical: 'top',
    fontSize: fontSize.large,
    lineHeight: lineHeight.large,
    fontWeight: fontWeight.normal,
  },
});

export default styles;
