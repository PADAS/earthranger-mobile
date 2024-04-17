import { StyleSheet } from 'react-native';
import { COLORS_LIGHT } from '../../../../common/constants/colors';
import { shadowStyles } from '../../../../common/style/shadowStyles';

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
  },
  patrolIcon: {
    marginTop: 12,
  },
  header: {
    marginLeft: 12,
  },

  /* Header - Minimized Patrol */
  headerEndPatrolButtonMP: {
    marginTop: 8,
    marginLeft: 'auto',
    backgroundColor: '#FDF2F4',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 45,
  },
  headerChevronIcon: {
    marginTop: 16,
    marginRight: 14,
    marginLeft: 'auto',
    backgroundColor: COLORS_LIGHT.transparent,
    transform: [{ rotate: '90deg' }],
  },
  /* End Header - Minimized Patrol */

  /* Header - Maximized Patrol */
  endPatrolButtonMP: {
    marginTop: 16,
    marginRight: 'auto',
    backgroundColor: '#FDF2F4',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 45,
  },
  /* End Header - Maximized Patrol */

  dateText: {
    marginTop: 16,
  },
  locationCardContainer: {
    marginTop: 16,
    borderColor: COLORS_LIGHT.G5_LightGreyLines,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'column',
  },
  startLocationContainer: {
    flexDirection: 'row',
    marginTop: 14,
    marginLeft: 8,
    alignItems: 'center',
  },
  locationContainer: {
    marginTop: 8,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStatusContainer: {
    marginLeft: 'auto',
    marginRight: 11,
  },
});
