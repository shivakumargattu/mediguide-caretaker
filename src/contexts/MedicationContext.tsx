
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  patientId: string;
  createdAt: Date;
  taken: boolean;
  lastTaken?: Date;
  photoProof?: string;
}

export interface MedicationFormData {
  name: string;
  dosage: string;
  frequency: string;
}

interface MedicationContextType {
  medications: Medication[];
  addMedication: (medicationData: MedicationFormData, patientId: string) => void;
  markAsTaken: (medicationId: string) => void;
  getAdherenceStats: (patientId: string) => { taken: number; total: number; percentage: number };
  isLoading: boolean;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (context === undefined) {
    throw new Error('useMedication must be used within a MedicationProvider');
  }
  return context;
};

// Mock medications
const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Aspirin',
    dosage: '100mg',
    frequency: 'Once daily',
    patientId: '1',
    createdAt: new Date('2024-01-01'),
    taken: true,
    lastTaken: new Date()
  },
  {
    id: '2',
    name: 'Vitamin D',
    dosage: '1000IU',
    frequency: 'Once daily',
    patientId: '1',
    createdAt: new Date('2024-01-01'),
    taken: false
  },
  {
    id: '3',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    patientId: '1',
    createdAt: new Date('2024-01-01'),
    taken: true,
    lastTaken: new Date()
  }
];

export const MedicationProvider = ({ children }: { children: ReactNode }) => {
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const [isLoading, setIsLoading] = useState(false);

  const addMedication = (medicationData: MedicationFormData, patientId: string) => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      ...medicationData,
      patientId,
      createdAt: new Date(),
      taken: false
    };

    setMedications(prev => [...prev, newMedication]);
  };

  const markAsTaken = (medicationId: string) => {
    setMedications(prev => prev.map(med => 
      med.id === medicationId 
        ? { ...med, taken: !med.taken, lastTaken: !med.taken ? new Date() : med.lastTaken }
        : med
    ));
  };

  const getAdherenceStats = (patientId: string) => {
    const patientMedications = medications.filter(med => med.patientId === patientId);
    const taken = patientMedications.filter(med => med.taken).length;
    const total = patientMedications.length;
    const percentage = total > 0 ? Math.round((taken / total) * 100) : 0;

    return { taken, total, percentage };
  };

  return (
    <MedicationContext.Provider value={{
      medications,
      addMedication,
      markAsTaken,
      getAdherenceStats,
      isLoading
    }}>
      {children}
    </MedicationContext.Provider>
  );
};
