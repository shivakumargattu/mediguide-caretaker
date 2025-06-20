
export interface MedicationRecord {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  patientId: string;
  createdAt: string;
  taken: number; // Using 0/1 for boolean compatibility
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
  private readonly USERS_KEY = 'medication_app_users';
  private readonly MEDICATIONS_KEY = 'medication_app_medications';

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize users if not exists
    if (!localStorage.getItem(this.USERS_KEY)) {
      const defaultUsers: UserRecord[] = [
        {
          id: '1',
          email: 'patient@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'patient',
          password: 'password123'
        },
        {
          id: '2',
          email: 'caretaker@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'caretaker',
          password: 'password123'
        }
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(defaultUsers));
    }

    // Initialize medications if not exists
    if (!localStorage.getItem(this.MEDICATIONS_KEY)) {
      const now = new Date().toISOString();
      const defaultMedications: MedicationRecord[] = [
        {
          id: '1',
          name: 'Aspirin',
          dosage: '100mg',
          frequency: 'Once daily',
          patientId: '1',
          createdAt: now,
          taken: 1,
          lastTaken: now
        },
        {
          id: '2',
          name: 'Vitamin D',
          dosage: '1000IU',
          frequency: 'Once daily',
          patientId: '1',
          createdAt: now,
          taken: 0
        },
        {
          id: '3',
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          patientId: '1',
          createdAt: now,
          taken: 1,
          lastTaken: now
        },
        {
          id: '4',
          name: 'Omega-3',
          dosage: '1000mg',
          frequency: 'Once daily',
          patientId: '1',
          createdAt: now,
          taken: 0
        }
      ];
      localStorage.setItem(this.MEDICATIONS_KEY, JSON.stringify(defaultMedications));
    }
  }

  private getUsers(): UserRecord[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private getMedications(): MedicationRecord[] {
    const medications = localStorage.getItem(this.MEDICATIONS_KEY);
    return medications ? JSON.parse(medications) : [];
  }

  private saveUsers(users: UserRecord[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private saveMedications(medications: MedicationRecord[]): void {
    localStorage.setItem(this.MEDICATIONS_KEY, JSON.stringify(medications));
  }

  // User methods
  getUserByEmailAndRole(email: string, role: string): UserRecord | undefined {
    const users = this.getUsers();
    return users.find(user => user.email === email && user.role === role);
  }

  createUser(user: Omit<UserRecord, 'id'>): UserRecord {
    const users = this.getUsers();
    const id = Date.now().toString();
    const newUser = { id, ...user };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  // Medication methods
  getMedicationsByPatientId(patientId: string): MedicationRecord[] {
    const medications = this.getMedications();
    return medications.filter(med => med.patientId === patientId);
  }

  addMedication(medication: Omit<MedicationRecord, 'id'>): MedicationRecord {
    const medications = this.getMedications();
    const id = Date.now().toString();
    const newMedication = { id, ...medication };
    medications.push(newMedication);
    this.saveMedications(medications);
    return newMedication;
  }

  updateMedicationTaken(medicationId: string, taken: boolean, lastTaken?: string): void {
    const medications = this.getMedications();
    const medicationIndex = medications.findIndex(med => med.id === medicationId);
    
    if (medicationIndex !== -1) {
      medications[medicationIndex].taken = taken ? 1 : 0;
      medications[medicationIndex].lastTaken = lastTaken || undefined;
      this.saveMedications(medications);
    }
  }
}

export const database = new DatabaseManager();
