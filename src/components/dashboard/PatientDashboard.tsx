
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicationForm } from '@/components/medication/MedicationForm';
import { MedicationList } from '@/components/medication/MedicationList';
import { AdherenceStats } from './AdherenceStats';
import { NotificationSettings } from './NotificationSettings';
import { Calendar, Pill, Settings } from 'lucide-react';

export const PatientDashboard = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600 flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>{formattedDate}</span>
        </p>
      </div>

      <AdherenceStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <Pill className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Your Medications</h2>
          </div>
          
          <MedicationForm />
          <MedicationList />
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-6">
            <Settings className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
          </div>
          
          <NotificationSettings />
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Take photos as proof when you take your medications</li>
                <li>• Set consistent times for your daily medications</li>
                <li>• Contact your doctor before making any changes</li>
                <li>• Keep track of side effects in the notes section</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
