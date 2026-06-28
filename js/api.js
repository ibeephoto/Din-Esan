import { enqueueSync } from './syncQueue.js';

export function addRecord(record) {
  enqueueSync('UPSERT_RECORD', record);
}

export function deleteRecord(id) {
  enqueueSync('DELETE_RECORD', { id });
}
