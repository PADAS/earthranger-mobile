// External Dependencies
import { exists, mkdir, unlink } from 'react-native-fs';

// Internal Dependencies
import log from './logUtils';

export const createFolderIfNotExists = async (folderPath: string) => {
  try {
    const isFolderCreated = await exists(folderPath);

    if (!isFolderCreated) {
      await mkdir(folderPath);
    }
  } catch (error) {
    log.error(`[fileHandling] - Could not create directory - ${error}`);
  }
};

export const removeFiles = async (files: string[]) => {
  try {
    for (let i = 0, l = files.length; i < l; i++) {
      // eslint-disable-next-line no-await-in-loop
      await unlink(files[i]);
    }
  } catch (error) {
    log.error(`[fileHandling] - Could not remove file - ${error}`);
  }
};
