// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { shadowStyles } from '../../../../common/style/shadowStyles';
import { COLORS_LIGHT } from '../../../../common/constants/colors';

const styles = StyleSheet.create({
  coordinatesOverlay: {
    ...shadowStyles.viewDropShadow,
    alignItems: 'center',
    backgroundColor: COLORS_LIGHT.white,
    borderRadius: 24,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    left: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    position: 'absolute',
  },
});

export default styles;
