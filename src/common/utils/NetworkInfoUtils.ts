import NetInfo from '@react-native-community/netinfo';

export const isInternetReachable = async () => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isInternetReachable;
};
