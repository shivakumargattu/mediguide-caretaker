
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/input-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMedication, MedicationFormData } from '@/contexts/MedicationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Plus } from 'lucide-react';

interface MedicationFormProps {
  onSuccess?: () => void;
}

export const MedicationForm = ({ onSuccess }: MedicationFormProps) => {
  const [formData, setFormData] = useState<MedicationFormData>({
    name: '',
    dosage: '',
    frequency: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isOpen, setIsOpen] = useState(false);

  const { addMedication } = useMedication();
  const { user } = useAuth();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name) {
      newErrors.name = 'Medication name is required';
    }

    if (!formData.dosage) {
      newErrors.dosage = 'Dosage is required';
    }

    if (!formData.frequency) {
      newErrors.frequency = 'Frequency is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    addMedication(formData, user.id);
    setFormData({ name: '', dosage: '', frequency: '' });
    setIsOpen(false);
    onSuccess?.();
  };

  const handleInputChange = (field: keyof MedicationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="mb-6"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Medication
      </Button>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add New Medication</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Medication Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            placeholder="e.g., Aspirin"
          />

          <InputField
            label="Dosage"
            value={formData.dosage}
            onChange={(e) => handleInputChange('dosage', e.target.value)}
            error={errors.dosage}
            placeholder="e.g., 100mg"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Frequency</label>
            <Select 
              value={formData.frequency} 
              onValueChange={(value) => handleInputChange('frequency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Once daily">Once daily</SelectItem>
                <SelectItem value="Twice daily">Twice daily</SelectItem>
                <SelectItem value="Three times daily">Three times daily</SelectItem>
                <SelectItem value="Four times daily">Four times daily</SelectItem>
                <SelectItem value="As needed">As needed</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
            {errors.frequency && (
              <p className="text-sm text-red-600">{errors.frequency}</p>
            )}
          </div>

          <div className="flex space-x-3">
            <Button type="submit" className="flex-1">
              Add Medication
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
