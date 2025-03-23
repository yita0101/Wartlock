import Database from 'better-sqlite3'
import fs from 'fs'

if (fs.existsSync('wartwallet.db')) {
  // Connect to the SQLite database
  const db = new Database('wartwallet.db')

  // Function to check if a column exists in a table
  function columnExists(table: string, column: string): boolean {
    const columns = db.prepare(`PRAGMA table_info(${table});`).all()
    return columns.some(col => col.name === column)
  }

  // Function to check if a table exists
  function tableExists(table: string): boolean {
    const result = db
      .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?;`)
      .get(table)
    return !!result
  }

  // Fix missing columns by migrating the wallets table
  if (!columnExists('wallets', 'name') || !columnExists('wallets', 'last_modified')) {
    console.log("Migrating 'wallets' table to add missing columns...")

    // Drop incomplete migration tables if they exist
    if (tableExists('wallets_new')) {
      db.exec(`DROP TABLE wallets_new;`)
    }

    db.exec(`
        CREATE TABLE wallets_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            address TEXT UNIQUE,
            name TEXT DEFAULT '',
            pk TEXT,
            salt TEXT,
            last_balance TEXT NOT NULL DEFAULT '0',
            last_modified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `)

    // **Deduplicate before inserting**
    db.exec(`
        INSERT INTO wallets_new (id, address, name, pk, salt, last_balance, last_modified)
        SELECT
            MAX(id) AS id,  -- Keep the latest record
            address,
            '' AS name,  -- Default name
            pk,
            salt,
            last_balance,
            CURRENT_TIMESTAMP
        FROM wallets
        GROUP BY address;  -- Deduplicates entries by address
    `)

    db.exec(`DROP TABLE wallets;`)
    db.exec(`ALTER TABLE wallets_new RENAME TO wallets;`)
  }

  // Fix missing last_modified in data table
  if (!columnExists('data', 'last_modified')) {
    console.log("Migrating 'data' table to add 'last_modified' column...")

    if (tableExists('data_new')) {
      db.exec(`DROP TABLE data_new;`)
    }

    db.exec(`
        CREATE TABLE data_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE,
            value TEXT,
            last_modified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `)

    db.exec(`
        INSERT INTO data_new (id, key, value, last_modified)
        SELECT id, key, value, CURRENT_TIMESTAMP FROM data;
    `)

    db.exec(`DROP TABLE data;`)
    db.exec(`ALTER TABLE data_new RENAME TO data;`)
  }
}

// Connect to the SQLite database
const db = new Database('wartwallet.db')

// Initialize tables
db.exec(`
    CREATE TABLE IF NOT EXISTS wallets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        address TEXT UNIQUE,
        name TEXT,
        pk TEXT,
        salt TEXT,
        last_balance TEXT NOT NULL DEFAULT '0',
        last_modified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
`)

db.exec(`
    CREATE TABLE IF NOT EXISTS data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE,
        value TEXT,
        last_modified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
`)

// Insert default peer if missing
const count = db.prepare('SELECT COUNT(*) as count FROM data;').get()
if (count.count === 0) {
  db.prepare(
    "INSERT INTO data (key, value, last_modified) VALUES ('peer', 'http://localhost:3000', CURRENT_TIMESTAMP);",
  ).run()
}

export class WalletDB {
  static getWallets() {
    return db
      .prepare('SELECT *, last_modified as lastModified FROM wallets;')
      .all()
  }

  static getWalletByAddress(address: string) {
    return db
      .prepare(
        'SELECT *, last_modified as lastModified FROM wallets WHERE address = ?;',
      )
      .get(address)
  }

  static getWalletById(id: number) {
    return db
      .prepare(
        'SELECT *, last_modified as lastModified FROM wallets WHERE id = ?;',
      )
      .get(id)
  }

  static insertWallet(name: string, address: string, pk: string, salt: string) {
    db.prepare(
      'INSERT INTO wallets (name, address, pk, salt, last_modified) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP);',
    ).run(name, address, pk, salt)
  }

  static updateBalance(address: string, balance: string) {
    db.prepare(
      'UPDATE wallets SET last_balance = ?, last_modified = CURRENT_TIMESTAMP WHERE address = ?;',
    ).run(balance, address)
  }

  static deleteWallet(address: string) {
    db.prepare('DELETE FROM wallets WHERE address = ?;').run(address)
  }

  static updatePeer(peer: string) {
    db.prepare(
      "UPDATE data SET value = ?, last_modified = CURRENT_TIMESTAMP WHERE key = 'peer';",
    ).run(peer)
  }

  static getPeer(): string {
    const result = db
      .prepare("SELECT value FROM data WHERE key = 'peer';")
      .get()
    return result ? result.value : 'http://localhost:3000'
  }
}
