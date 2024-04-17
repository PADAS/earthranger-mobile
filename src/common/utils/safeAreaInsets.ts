// Internal Dependencies
import { EdgeInsets } from '../types/types';
import { IS_ANDROID } from '../constants/constants';

let safeAreaInsets = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

export const setSafeAreaInsets = (insets: EdgeInsets) => {
  safeAreaInsets = insets;
};

export const getTopAreaInsets = () => (IS_ANDROID ? 0 : safeAreaInsets.top);
