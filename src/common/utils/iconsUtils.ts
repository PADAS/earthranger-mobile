// External Dependencies
import { isEmpty } from 'lodash-es';

// Internal Dependencies
import { getIconMarkup } from '../../api/reportsAPI';
import { getSecuredStringForKey } from '../data/storage/utils';
import { SITE_VALUE_KEY } from '../constants/constants';
import { SUBJECTS_STATIC_RESOURCES } from '../../api/EarthRangerService';

export const getIconSVGMarkup = async (iconId: string) => {
  const host = getSecuredStringForKey(SITE_VALUE_KEY) || '';
  if (isEmpty(host) || isEmpty(iconId)) {
    return undefined;
  }

  const staticResources = SUBJECTS_STATIC_RESOURCES.replace('%host%', host);

  if (isEmpty(staticResources)) {
    return undefined;
  }

  const iconStaticResource = staticResources.replace('%icon%', iconId);

  const iconMarkup = await getIconMarkup(iconStaticResource);

  return iconMarkup;
};
