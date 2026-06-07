// Esquema DDL de creación para SQLite local
export const CREATE_TABLES_SQL = `
PRAGMA foreign_keys = ON;

-- Tabla de Rifas
CREATE TABLE IF NOT EXISTS raffles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    product TEXT, -- Campo opcional para Producto / Premio
    ticket_count INTEGER NOT NULL CHECK (ticket_count IN (30, 50, 100, 1000)),
    ticket_price REAL NOT NULL CHECK (ticket_price >= 0),
    draw_date TEXT NOT NULL, -- Formato ISO8601 o YYYY-MM-DD
    status TEXT NOT NULL CHECK (status IN ('EN_CURSO', 'COMPLETA', 'CERRADA')) DEFAULT 'EN_CURSO',
    winner_ticket_num INTEGER, -- Almacena el número ganador tras el sorteo
    winner_name TEXT, -- Almacena el nombre del ganador para consulta rápida
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

-- Tabla de Boletos / Participantes
CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    raffle_id INTEGER NOT NULL,
    ticket_num INTEGER NOT NULL CHECK (ticket_num >= 1),
    participant_name TEXT NOT NULL,
    participant_phone TEXT,
    status TEXT NOT NULL CHECK (status IN ('RESERVADO', 'PAGADO')),
    updated_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (raffle_id) REFERENCES raffles (id) ON DELETE CASCADE,
    UNIQUE (raffle_id, ticket_num) -- Evita duplicidad de boletos en el mismo sorteo
);

-- Tabla de Registro de Actividad Reciente
CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    raffle_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (raffle_id) REFERENCES raffles (id) ON DELETE CASCADE
);

-- Índices optimizados para mejorar búsquedas y velocidad de renderizado
CREATE INDEX IF NOT EXISTS idx_tickets_raffle ON tickets (raffle_id);
CREATE INDEX IF NOT EXISTS idx_logs_raffle ON activity_logs (raffle_id);
`;
