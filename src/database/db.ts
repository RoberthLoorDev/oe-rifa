import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { CREATE_TABLES_SQL } from './schema';

const DB_NAME = 'rifa_app.db';

let dbInstance: any = null;
let dbPromise: Promise<any> | null = null;

export async function getDbConnection() {
  if (dbInstance) return dbInstance;
  if (dbPromise) return dbPromise;
  
  dbPromise = (async () => {
    try {
      dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
      return dbInstance;
    } catch (error) {
      dbPromise = null;
      console.error(error);
      throw error;
    }
  })();

  return dbPromise;
}

export async function initDatabase(): Promise<boolean> {
  try {
    const db = await getDbConnection();
    await db.execAsync(CREATE_TABLES_SQL);
    try {
      await db.execAsync('ALTER TABLE raffles ADD COLUMN image TEXT;');
    } catch (e: any) {
      if (e && e.message && !e.message.includes('duplicate column name') && !e.message.includes('already exists')) {
        console.error(e);
      }
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
