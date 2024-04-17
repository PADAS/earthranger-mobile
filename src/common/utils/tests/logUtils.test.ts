// Internal Dependencies
import { getFileDateString } from '../logUtils';

describe('logUtils', () => {
  it('returns the date from the file name', () => {
    const fileDate = getFileDateString('er_mobile_31-05-2022.log');
    expect(fileDate).toBe('31-05-2022');
  });

  it('returns empty string when there is not a date matching the format in the file name', () => {
    const fileDate = getFileDateString('er_mobile.log');
    expect(fileDate).toBe('');
  });
});
