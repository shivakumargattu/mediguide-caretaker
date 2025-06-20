
import Database from 'better-sqlite3';

export interface MedicationRecord {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  patientId: string;
  createdAt: string;
  taken: number; // SQLite uses 0/1 for boolean
  lastTaken?: string;
  photoProof?: string;
}

export interface UserRecord {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password: string;
}

class DatabaseManager {
  private db: Database.Database;

  constructor() {
    this.db = new Database(':memory:'); // In-memory database for demo
    this.initializeTables();
    this.seedData();
  }

  private initializeTables() {
    // Users table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        role TEXT NOT NULL,
        password TEXT NOT NULL
      )
    `);

    // Medications table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS medications (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        dosage TEXT NOT NULL,
        frequency TEXT NOT NULL,
        patientId TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        taken INTEGER DEFAULT 0,
        lastTaken TEXT,
        photoProof TEXT,
        FOREIGN KEY (patientId) REFERENCES users (id)
      )
    `);
  }

  private seedData() {
    // Insert default users
    const insertUser = this.db.prepare(`
      INSERT OR REPLACE INTO users (id, email, firstName, lastName, role, password)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertUser.run('1', 'patient@example.com', 'John', 'Doe', 'patient', 'password123');
    insertUser.run('2', 'caretaker@example.com', 'Jane', 'Smith', 'caretaker', 'password123');

    // Insert default medications
    const insertMedication = this.db.prepare(`
      INSERT OR REPLACE INTO medications (id, name, dosage, frequency, patientId, createdAt, taken, lastTaken)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();
    insertMedication.run('1', 'Aspirin', '100mg', 'Once daily', '1', now, 1, now);
    insertMedication.run('2', 'Vitamin D', '1000IU', 'Once daily', '1', now, 0, null);
    insertMedication.run('3', 'Metformin', '500mg', 'Twice daily', '1', now, 1, now);
    insertMedication.run('4', 'Omega-3', '1000mg', 'Once daily', '1', now, 0, null);
  }

  // User methods
  getUserByEmailAndRole(email: string, role: string): UserRecord | undefined {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ? AND role = ?');
    return stmt.get(email, role) as UserRecord | undefined;
  }

  createUser(user: Omit<UserRecord, 'id'>): UserRecord {
    const id = Date.now().toString();
    const stmt = this.db.prepare(`
      INSERT INTO users (id, email, firstName, lastName, role, password)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, user.email, user.firstName, user.lastName, user.role, user.password);
    return { id, ...user };
  }

  // Medication methods
  getMedicationsByPatientId(patientId: string): MedicationRecord[] {
    const stmt = this.db.prepare('SELECT * FROM medications WHERE patientId = ?');
    return stmt.all(patientId) as MedicationRecord[];
  }

  addMedication(medication: Omit<MedicationRecord, 'id'>): MedicationRecord {
    const id = Date.now().toString();
    const stmt = this.db.prepare(`
      INSERT INTO medications (id, name, dosage, frequency, patientId, createdAt, taken, lastTaken, photoProof)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id, 
      medication.name, 
      medication.dosage, 
      medication.frequency, 
      medication.patientId, 
      medication.createdAt, 
      medication.taken, 
      medication.lastTaken, 
      medication.photoProof
    );
    return { id, ...medication };
  }

  updateMedicationTaken(medicationId: string, taken: boolean, lastTaken?: string): void {
    const stmt = this.db.prepare('UPDATE medications SET taken = ?, lastTaken = ? WHERE id = ?');
    stmt.run(taken ? 1 : 0, lastTaken || null, medicationId);
  }

  close() {
    this.db.close();
  }
}

export const database = new DatabaseManager();
