// Internal Dependencies
import {
  zip,
  subscribe as subscribeToZipArchive,
} from 'react-native-zip-archive';
import { unlink } from 'react-native-fs';

// External Dependencies
import log from './logUtils';
import { IS_ANDROID } from '../constants/constants';

export const zipFolder = async (
  inputFolderPath: string,
  outputFilePath: string,
  zipProgress: ((progress: number, filePath: string) => void),
) => {
  try {
    const subscription = subscribeToZipArchive(({ progress, filePath }) => {
      zipProgress(progress, filePath);
      log.debug(`zipping to ${filePath} ${progress}`);
    });
    await zip(inputFolderPath, outputFilePath);
    subscription.remove();
    log.debug(`zipped ${inputFolderPath}`);
    return true;
  } catch (error) {
    log.error('Error while zipping folder', error);
  }
  return false;
};

export const deleteFile = async (filePath: string) => {
  log.error('deleting', filePath);
  try {
    if (IS_ANDROID) {
      await unlink(filePath);
    }
  } catch (error) {
    log.error('Error deleting compressed file', error);
  }
};
