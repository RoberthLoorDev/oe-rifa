import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { CREATE_TABLES_SQL } from './schema';

const DB_NAME = 'rifa_app.db';

let dbInstance: any = null;

/**
 * Retorna la conexión activa de la base de datos local SQLite.
 * Utiliza un patrón Singleton para asegurar una única instancia.
 */
export async function getDbConnection() {
  if (dbInstance) return dbInstance;
  
  try {
    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
    return dbInstance;
  } catch (error) {
    console.error('[Database] Error al conectar con la base de datos:', error);
    throw error;
  }
}

/**
 * Inicializa la base de datos ejecutando el esquema DDL.
 * Crea las tablas e índices si no existen.
 */
export async function initDatabase(): Promise<boolean> {
  if (Platform.OS === 'web') {
    console.log('[Database] Ejecutando en entorno Web. SQLite utilizará el almacenamiento disponible en el navegador.');
  }

  try {
    const db = await getDbConnection();
    // execAsync ejecuta múltiples sentencias SQL en un solo bloque
    await db.execAsync(CREATE_TABLES_SQL);
    console.log('[Database] Inicialización exitosa: Tablas e índices creados o validados.');
    return true;
  } catch (error) {
    console.error('[Database] Fallo crítico al inicializar la base de datos:', error);
    return false;
  }
}
