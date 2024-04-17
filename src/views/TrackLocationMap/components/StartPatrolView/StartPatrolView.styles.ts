import { StyleSheet } from 'react-native';
import { COLORS_LIGHT } from '../../../../common/constants/colors';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: COLORS_LIGHT.white,
    padding: 16,
  },
  startLocationContainer: {
    borderWidth: 1,
    borderColor: COLORS_LIGHT.G5_LightGreyLines,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 16,
    marginBottom: 16,
  },
  startLocationTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  startLocationTitle: {
    paddingLeft: 4,
    textTransform: 'uppercase',
    color: COLORS_LIGHT.G2_secondaryMediumGray,
  },
  startLocationConnectivityContainer: {
    display: 'flex',
    position: 'absolute',
    right: 11,
    bottom: 16,
  },
  startPatrolButton: {
    width: '100%',
    borderRadius: 5,
    height: 48,
    marginTop: 30,
  },
  navBarRightButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  patrolCustomTitle: {
    marginTop: 16,
  },
});

export default styles;
