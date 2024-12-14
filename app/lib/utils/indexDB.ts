import Dexie, { type EntityTable } from 'dexie';

interface FCMTokenModal {
  id: number;
  token: string;
}

const dexieDB = new Dexie('UpAlerts') as Dexie & {
  fcmToken: EntityTable<FCMTokenModal>;
};

// Schema declaration:
dexieDB.version(1).stores({
  fcmToken: 'id, token',
});

async function getFCMTokenFromIndexDB(): Promise<string> {
  try {
    const tokens = await dexieDB.fcmToken.toArray();
    if (tokens.length > 0) {
      return tokens[0].token;
    } else {
      return '';
    }
  } catch (error) {
    console.error('Failed to retrieve token:', error);
    throw error;
  }
}

export type { FCMTokenModal };
export { dexieDB, getFCMTokenFromIndexDB };
