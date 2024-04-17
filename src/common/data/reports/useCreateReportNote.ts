// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { createReportNote } from '../../../api/reportsAPI';

export const useReportCreateNote = () => {
  /**
   * Create a note associated to a report
   * @param {string} accessToken user token
   * @param {string} reportId Report id (Eg 3e7ac9a7-0f52-46fa-988c-93a684a6d32b)
   * @param {string} note note
   * @param userProfileId? String  Profile remote id to link profile to report history.
   * For parent users, this param should be empty
   */
  const reportCreateNote = useCallback(async (
    accessToken: string,
    reportId: string,
    note: string,
    userProfileId?: string,
  ) => createReportNote(accessToken, reportId, note, userProfileId), []);

  return { reportCreateNote };
};
