// IndexedDB Offline Queue for AquaOne

export interface PendingSubmission {
  id: string;
  timestamp: string;
  stream_id: number;
  data: any;
  photo_blob?: string;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  attempts: number;
  last_error?: string;
}

const DB_NAME = 'AquaOne';
const STORE_NAME = 'pending_submissions';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveOfflineSubmission(submission: Omit<PendingSubmission, 'id' | 'status' | 'attempts'>): Promise<string> {
  const db = await openDB();
  const id = 'offline_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const record: PendingSubmission = {
    ...submission,
    id,
    status: 'pending',
    attempts: 0
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);
    req.onsuccess = () => resolve(id);
    req.onerror = () => reject(req.error);
  });
}

export async function getPendingSubmissions(): Promise<PendingSubmission[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function removePendingSubmission(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function updateSubmissionStatus(id: string, status: 'pending' | 'syncing' | 'synced' | 'failed', error?: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      if (getReq.result) {
        const item: PendingSubmission = {
          ...getReq.result,
          status,
          attempts: getReq.result.attempts + (status === 'failed' ? 1 : 0),
          last_error: error
        };
        store.put(item);
      }
      resolve();
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

export async function syncPendingSubmissions(apiSubmitFn: (data: any) => Promise<any>): Promise<{ synced: number; failed: number }> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { synced: 0, failed: 0 };
  }

  const pending = await getPendingSubmissions();
  let synced = 0;
  let failed = 0;

  for (const item of pending) {
    if (item.status === 'syncing') continue;
    try {
      await updateSubmissionStatus(item.id, 'syncing');
      await apiSubmitFn(item.data);
      await removePendingSubmission(item.id);
      synced++;
    } catch (err: any) {
      failed++;
      await updateSubmissionStatus(item.id, 'failed', err?.message || 'Sync failed');
    }
  }

  return { synced, failed };
}
