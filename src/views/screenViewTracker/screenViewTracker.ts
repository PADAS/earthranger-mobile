import AnalyticsScreenView from '../../analytics/model/analyticsScreenView';

export const createScreenView = (screenName: string, className: string) => ({
  screenName,
  className,
} as AnalyticsScreenView);

export default createScreenView;
