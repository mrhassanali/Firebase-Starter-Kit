export default function clearFirebaseIndexedDBFCMTokens(): void {
  const dbName = 'firebase-messaging-database';
  const storeName = 'firebase-messaging-store';

  const request: IDBOpenDBRequest = indexedDB.open(dbName);

  request.onsuccess = (event: Event) => {
    const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;

    if (db) {
      if (db.objectStoreNames.contains(storeName)) {
        const transaction: IDBTransaction = db.transaction(
          [storeName],
          'readwrite',
        );
        const store: IDBObjectStore = transaction.objectStore(storeName);

        const clearRequest: IDBRequest<undefined> = store.clear();

        clearRequest.onsuccess = () => {
          console.log('Firebase messaging tokens cleared successfully.');
        };

        clearRequest.onerror = (error: Event) => {
          console.error(
            'Error clearing Firebase messaging tokens:',
            (error.target as IDBRequest).error,
          );
        };
      } else {
        console.error(`Object store '${storeName}' not found in database.`);
      }
    } else {
      console.error('Failed to open database or database is null.');
    }
  };

  request.onerror = (error: Event) => {
    console.error(
      'Error opening IndexedDB:',
      (error.target as IDBOpenDBRequest).error,
    );
  };
}
