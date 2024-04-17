// External Dependencies
import { Dimensions, StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../common/constants/colors';

const { width } = Dimensions.get('window');

export const commonStyles = StyleSheet.create({
  horizontalMargins: {
    marginLeft: 16,
    marginRight: 16,
  },
  marginBottom: {
    marginBottom: 16,
  },
});

const styles = StyleSheet.create({
  container: {
    ...commonStyles.horizontalMargins,
    ...commonStyles.marginBottom,
  },
  placeholder: {
    marginStart: 9,
    fontSize: 15,
    fontWeight: '400',
  },
  textInput: {
    width: width * 0.78, // Avoid trailingAccessory be positioned outside the field
    marginLeft: 9,
    color: COLORS_LIGHT.G0_black,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    marginTop: 4,
  },
  textFieldContainer: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  field: {
    borderBottomWidth: 1,
  },
  validationMessage: {
    marginTop: 4,
    marginLeft: 9,
    marginBottom: 4,
  },
  divider: {
    height: 16,
    backgroundColor: COLORS_LIGHT.G6_LightGreyButton,
    ...commonStyles.marginBottom,
  },
  headerText: {
    ...commonStyles.horizontalMargins,
    ...commonStyles.marginBottom,
  },
  trailingAccessory: {
    paddingRight: 8,
    justifyContent: 'center',
  },
});

export default styles;
