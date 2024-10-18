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
    backgroundColor: '#FDF2F4',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 48,
  },
  /* End Header - Maximized Patrol */

  dateText: {
    marginTop: 16,
  },

  /* Cards */
  detailCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    alignItems: 'center',
  },
  cardContainer: {
    borderColor: COLORS_LIGHT.G5_LightGreyLines,
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    width: '49%',
  },
  cardContent: {
    flexDirection: 'row',
    marginTop: 8,
  },
  /* End Cards */

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  iconStatusContainer: {
    marginLeft: 8,
  },
});
