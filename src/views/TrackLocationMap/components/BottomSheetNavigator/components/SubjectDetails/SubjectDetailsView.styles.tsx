import { StyleSheet } from 'react-native';
import { shadowStyles } from '../../../../../../common/style/shadowStyles';
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';

export const styles = StyleSheet.create({
  bottomSheet: {
    ...shadowStyles.viewDropShadow,
  },
  container: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 26,
  },
  header: {
    marginLeft: 12,
    fontSize: 25,
    fontWeight: '600',
    width: '80%',
  },
  closeIcon: {
    marginRight: 14,
    marginLeft: 'auto',
    backgroundColor: COLORS_LIGHT.transparent,
  },

});
