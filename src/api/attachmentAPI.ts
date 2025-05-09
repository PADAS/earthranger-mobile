// External Dependencies
import axios from 'axios';

// Internal Dependencies
import {
  API_EVENT, API_ATTACHMENT_FILES, getApiUrl, USER_AGENT_VALUE,
} from './EarthRangerService';
import { ApiResponseCodes, FileRequest } from '../common/types/apiModels';
import log from '../common/utils/logUtils';
import { getApiStatus } from '../common/utils/errorUtils';

export const uploadAttachmentFile = async (
  accessToken: string,
  eventId: string,
  file: FileRequest,
  userProfileId?: string,
): Promise<any> => {
  const maxRetries = 3;

  const uploadFileWithRetries = async (retryCount: number): Promise<any> => {
    const backOffDelay = 2 * (retryCount - 1) * 1000;

    if (retryCount > maxRetries) {
      throw new Error(`Attachment photo upload failed after ${maxRetries} retries`);
    }

    const url = getApiUrl(`${API_EVENT}/${eventId}${API_ATTACHMENT_FILES}`);
    const form = new FormData();
    form.append('filecontent.file', file);
    form.append('type', 'multipart/form-data');

    const headers: any = {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
      'User-Agent': USER_AGENT_VALUE,
    };

    if (userProfileId) {
      headers['user-profile'] = userProfileId;
    }

    const config = {
      headers,
      transformRequest: () => form,
    };

    try {
      const response = await axios.post(url, form, config);
      return response.data;
    } catch (error: any) {
      log.debug(`Attempt ${retryCount} failed with error: ${error.message}. Retrying...`);

      if (getApiStatus(error.message) === ApiResponseCodes.NotFound) {
        throw new Error(error);
      }

      await new Promise((resolve) => {
        setTimeout(resolve, backOffDelay);
      });
      return uploadFileWithRetries(retryCount + 1);
    }
  };
  // Start with the first attempt
  return uploadFileWithRetries(1);
};
