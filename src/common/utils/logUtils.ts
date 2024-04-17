// External Dependencies
import {
  logger,
  fileAsyncTransport,
  consoleTransport,
} from 'react-native-logs';
import RNFS, {
  exists,
  mkdir,
  readdir,
  unlink,
} from 'react-native-fs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Platform } from 'react-native';
import deviceInfoModule from 'react-native-device-info';

// Day.js needs customParseFormat plugin to parse 'DD-MM-YYYY'
dayjs.extend(customParseFormat);

const today = dayjs().format('DD-MM-YYYY'); // This generates dates with a consistent format.
export const directoryPath = `${RNFS.DocumentDirectoryPath}/logs`;

const defaultConfig = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: 'debug',
  transport: (props: any) => {
    fileAsyncTransport(props);
    consoleTransport(props);
  },
  transportOptions: {
    FS: RNFS,
    filePath: directoryPath,
    fileName: `er_mobile_${today}.log`,
    colors: {
      debug: 'white',
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
    extensionColors: {
      GENERAL: 'magenta',
      TRACKING: 'green',
      USER_INTERACTION: 'cyan',
      SYNC: 'blue',
      SQL: 'white',
    },
  },
  async: false,
  dateFormat: 'time',
  printLevel: true,
  printDate: true,
  enabled: true,
};

// @ts-ignore
const log = logger.createLogger(defaultConfig);
export const logGeneral = log.extend('GENERAL');
export const logTracking = log.extend('TRACKING');
export const logUserInteraction = log.extend('USER_INTERACTION');
export const logSync = log.extend('SYNC');
export const logSQL = log.extend('SQL');

export const initLogs = async () => {
  const directoryCreated = await exists(directoryPath);
  if (!directoryCreated) {
    await mkdir(directoryPath);
  }

  log.info(`OS: ${Platform.OS}`);
  log.info(`OS Version: ${Platform.Version}`);
  log.info(`EarthRanger Version: ${deviceInfoModule.getVersion()}`);
};

export const removeOldLogFiles = async () => {
  const weekAgo = dayjs().subtract(8, 'day');
  const files = await readdir(directoryPath);
  files.forEach((logFile) => {
    const fileDate = getFileDateString(logFile);
    if (dayjs(fileDate, 'DD-MM-YYYY').isBefore(weekAgo)) {
      log.debug('Deleting log file', `${directoryPath}/${logFile}`);
      unlink(`${directoryPath}/${logFile}`);
    }
  });
};

export const getFileDateString = (file: string) => {
  const fileDate = file.match(/\d{2}-\d{2}-\d{4}/);
  return fileDate ? fileDate[0] : '';
};

// eslint-disable-next-line no-console
console.warn = (message) => { log.warn(message); };

// eslint-disable-next-line no-console
console.error = (message) => { log.error(message); };

export default log;
