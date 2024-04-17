import { StyleSheet } from 'react-native';
import { COLORS_LIGHT } from '../../../../common/constants/colors';
import { shadowStyles } from '../../../../common/style/shadowStyles';

export const styles = StyleSheet.create({
  bottomSheet: {
    ...shadowStyles.viewDropShadow,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 16,
    marginRight: 16,
  },

  /* Header */
  headerContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  headerIcon: {
    marginRight: 8,
    marginTop: 14,
  },
  headerTitle: {
    color: COLORS_LIGHT.G0_black,
    fontWeight: '600',
  },
  headerChevronIcon: {
    backgroundColor: 'transparent',
    marginLeft: 'auto',
    marginRight: 16,
    marginTop: 12,
    transform: [{ rotate: '90deg' }],
  },
  headerStopTrackingButton: {
    backgroundColor: '#FDF2F4',
    borderRadius: 5,
    marginLeft: 'auto',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  /* End Header */

  /* Body */
  bodyContainer: {
    marginTop: 14,
    flexDirection: 'row',
  },
  bodyContainerStacked: {
    flexDirection: 'column',
  },
  buttonContainer: {
    minWidth: '50%',
  },
  buttonInlineLeft: {
    marginRight: 6,
  },
  buttonInlineRight: {
    marginLeft: 6,
  },
  buttonStacked: {
    marginTop: 8,
  },
  startButton: {
    backgroundColor: COLORS_LIGHT.brightBlue,
    borderRadius: 5,
    paddingVertical: 10,
  },
  endButton: {
    backgroundColor: '#FDF2F4',
    borderRadius: 5,
    paddingVertical: 10,
  },
  /* End Body */
});
