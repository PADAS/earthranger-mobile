// External Dependencies
import { useCallback } from 'react';
import { uploadAttachmentFile } from '../../../api/attachmentAPI';

// Internal Dependencies
import { FileRequest } from '../../types/apiModels';

export const useReportUploadFile = () => {
  /**
   * Form for user login
   * @param {string} accessToken user token
   * @param {string} reportId Report id (Eg 3e7ac9a7-0f52-46fa-988c-93a684a6d32b)
   * @param {FileRequest} file file metadata
   *    {
          uri: `file://assets/assets/icons/ic-login-logo.png`, iOS needs file:// but Android does not
          type: 'image/png',
          name: 'image.png',
        },
   * @param userProfileId? String  Profile remote id to link profile to report history.
   * For parent users, this param should be empty
   */
  const uploadReportFile = useCallback(async (
    accessToken: string,
    reportId: string,
    file: FileRequest,
    userProfileId?: string,
  ) => uploadAttachmentFile(
    accessToken,
    reportId,
    file,
    userProfileId,
  ), []);

  return { uploadReportFile };
};
