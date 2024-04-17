interface AnalyticsEvent {
  siteName: string;
  eventName: string;
  screenName: string;
  category: string;
  action: string;
  duration?: number;
}

export const analyticsEventToHashMap = (event: AnalyticsEvent) => ({
  siteName: event.siteName,
  screen_name: event.screenName,
  category: event.category,
  action: event.action,
  duration: event.duration,
});

export default AnalyticsEvent;
