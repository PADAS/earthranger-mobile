// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';
import { fontSize } from '../../../../../../common/constants/fonts';

const styles = StyleSheet.create({
  reportSchemaErrorContainer: {
    marginTop: 129,
    marginStart: 10,
    marginEnd: 10,
    alignItems: 'center',
  },
  reportSchemaErrorTextTitle: {
    marginTop: 20,
    color: COLORS_LIGHT.G0_black,
    fontSize: fontSize.massive,
    textAlign: 'center',
  },
  reportSchemaErrorTextSubText: {
    marginTop: 5,
    fontSize: fontSize.huge,
    textAlign: 'center',
  },
});

export default styles;
