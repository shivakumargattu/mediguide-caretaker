
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { database, MedicationRecord } from '@/lib/database';

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
  refreshMedications: (patientId: string) => void;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (context === undefined) {
    throw new Error('useMedication must be used within a MedicationProvider');
  }
  return context;
};

// Helper function to convert database record to Medication interface
const convertToMedication = (record: MedicationRecord): Medication => ({
  id: record.id,
  name: record.name,
  dosage: record.dosage,
  frequency: record.frequency,
  patientId: record.patientId,
  createdAt: new Date(record.createdAt),
  taken: record.taken === 1,
  lastTaken: record.lastTaken ? new Date(record.lastTaken) : undefined,
  photoProof: record.photoProof
});

export const MedicationProvider = ({ children }: { children: ReactNode }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshMedications = (patientId: string) => {
    try {
      const records = database.getMedicationsByPatientId(patientId);
      const convertedMedications = records.map(convertToMedication);
      setMedications(convertedMedications);
    } catch (error) {
      console.error('Error refreshing medications:', error);
    }
  };

  const addMedication = (medicationData: MedicationFormData, patientId: string) => {
    try {
      const newMedicationRecord = database.addMedication({
        ...medicationData,
        patientId,
        createdAt: new Date().toISOString(),
        taken: 0,
        lastTaken: undefined,
        photoProof: undefined
      });

      const newMedication = convertToMedication(newMedicationRecord);
      setMedications(prev => [...prev, newMedication]);
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  };

  const markAsTaken = (medicationId: string) => {
    try {
      const medication = medications.find(med => med.id === medicationId);
      if (!medication) return;

      const newTakenState = !medication.taken;
      const lastTaken = newTakenState ? new Date().toISOString() : undefined;

      database.updateMedicationTaken(medicationId, newTakenState, lastTaken);

      setMedications(prev => prev.map(med => 
        med.id === medicationId 
          ? { 
              ...med, 
              taken: newTakenState, 
              lastTaken: newTakenState ? new Date() : med.lastTaken 
            }
          : med
      ));
    } catch (error) {
      console.error('Error updating medication:', error);
    }
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
      isLoading,
      refreshMedications
    }}>
      {children}
    </MedicationContext.Provider>
  );
};
