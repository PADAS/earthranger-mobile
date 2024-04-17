// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../common/constants/colors';
import { commonStyles } from '../Controls.style';

const styles = StyleSheet.create({
  container: {
    topMargin: 16,
    ...commonStyles.horizontalMargins,
  },
  fieldContainer: {
    backgroundColor: COLORS_LIGHT.G7_veryLightGrey,
    borderColor: COLORS_LIGHT.G5_LightGreyLines,
    alignItems: 'center',
    borderRadius: 3,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    minHeight: 50,
    marginBottom: 16,
  },
  labelContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  label: {
    marginLeft: 9,
    fontWeight: '500',
  },
  labelCount: {
    fontWeight: '400',
  },
  title: {
    marginBottom: 8,
  },
  arrowIcon: {
    marginLeft: 'auto',
    marginRight: 16,
  },
});

export default styles;
