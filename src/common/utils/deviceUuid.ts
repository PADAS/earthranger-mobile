// Internal Dependencies
import DeviceInfo from 'react-native-device-info';
import { getSecuredStringForKey, setSecuredStringForKey } from '../data/storage/utils';
import { DEVICE_UUID } from '../constants/constants';

export const getDeviceUuid = () => {
  let uuid = getSecuredStringForKey(DEVICE_UUID);
  if (uuid === undefined) {
    uuid = DeviceInfo.getUniqueId();
    setSecuredStringForKey(DEVICE_UUID, uuid);
  }
  return uuid;
};
