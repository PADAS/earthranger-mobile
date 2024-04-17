// External Dependencies
import { difference } from 'lodash-es';

// Internal Dependencies
import { getBoolForKey, setBoolForKey } from '../data/storage/keyValue';
import { LOCAL_DB_SYNCING, PATROLS_SYNCING, REPORTS_SYNCING } from '../constants/constants';

export enum SyncSource {
  Reports = 'REPORTS',
  Patrols = 'PATROLS',
  LocalDB = 'LOCAL_DB',
}

export const setIsSyncing = (source: SyncSource, value: boolean) => {
  switch (source) {
    case SyncSource.Reports:
      setBoolForKey(REPORTS_SYNCING, value);
      break;
    case SyncSource.Patrols:
      setBoolForKey(PATROLS_SYNCING, value);
      break;
    case SyncSource.LocalDB:
      setBoolForKey(LOCAL_DB_SYNCING, value);
      break;
    default:
      break;
  }
};

export const isSyncing = () => getBoolForKey(REPORTS_SYNCING)
  || getBoolForKey(PATROLS_SYNCING)
  || getBoolForKey(LOCAL_DB_SYNCING);

export const isSyncingReports = () => getBoolForKey(REPORTS_SYNCING);

export const getListsDiff = (localData: any, remoteData: any) => {
  const localList = localData.map((localItem: any) => localItem.value);
  const remoteList: string[] = [];

  remoteData.forEach((remoteItem: any) => {
    if (remoteItem.flag === 'user') {
      remoteList.push(remoteItem.value);
    }
  });

  return difference(localList, remoteList);
};
