import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { CREATE_TABLES_SQL } from './schema';

const DB_NAME = 'rifa_app.db';

let dbInstance: any = null;

export async function getDbConnection() {
  if (dbInstance) return dbInstance;
  
  try {
    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
    return dbInstance;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function initDatabase(): Promise<boolean> {
  try {
    const db = await getDbConnection();
    await db.execAsync(CREATE_TABLES_SQL);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
