interface AnalyticsScreenView {
  screenName: string;
  screenClass?: string;
  params?: [key: string];
}

export const screenViewEventToHashMap = (event: AnalyticsScreenView) => ({
  screen_name: event.screenName,
  screen_class: event.screenClass,
  params: event.params,
});

export default AnalyticsScreenView;
