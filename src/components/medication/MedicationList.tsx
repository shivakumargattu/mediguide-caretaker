
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMedication, Medication } from '@/contexts/MedicationContext';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Circle, Camera, Clock } from 'lucide-react';
import { PhotoUploadModal } from './PhotoUploadModal';

export const MedicationList = () => {
  const { medications, markAsTaken } = useMedication();
  const { user } = useAuth();
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  const userMedications = medications.filter(med => med.patientId === user?.id);

  const handleMarkAsTaken = (medicationId: string) => {
    markAsTaken(medicationId);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (userMedications.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-gray-500">
            <Circle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No medications added yet</p>
            <p className="text-sm">Add your first medication to get started with tracking.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {userMedications.map((medication) => (
          <Card key={medication.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {medication.name}
                    </h3>
                    <Badge 
                      variant={medication.taken ? "default" : "secondary"}
                      className={medication.taken ? "bg-green-100 text-green-800" : ""}
                    >
                      {medication.taken ? "Taken" : "Pending"}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Dosage:</span> {medication.dosage}</p>
                    <p><span className="font-medium">Frequency:</span> {medication.frequency}</p>
                    {medication.lastTaken && (
                      <p className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Last taken: {formatDate(medication.lastTaken)}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMedication(medication)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant={medication.taken ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleMarkAsTaken(medication.id)}
                    className={medication.taken ? "text-green-600 border-green-200" : ""}
                  >
                    {medication.taken ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Taken
                      </>
                    ) : (
                      <>
                        <Circle className="h-4 w-4 mr-2" />
                        Mark as Taken
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedMedication && (
        <PhotoUploadModal
          medication={selectedMedication}
          isOpen={!!selectedMedication}
          onClose={() => setSelectedMedication(null)}
        />
      )}
    </>
  );
};
