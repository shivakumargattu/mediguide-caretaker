
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMedication } from '@/contexts/MedicationContext';
import { Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const CaretakerDashboard = () => {
  const { medications } = useMedication();

  // Mock patient data - in a real app this would come from the database
  const patients = [
    {
      id: '1',
      name: 'John Doe',
      lastActive: '2 hours ago',
      adherenceRate: 85,
      missedDoses: 2,
      totalMedications: 3
    },
    {
      id: '2',
      name: 'Mary Johnson',
      lastActive: '1 day ago',
      adherenceRate: 95,
      missedDoses: 0,
      totalMedications: 2
    }
  ];

  const getAdherenceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAdherenceBadge = (rate: number) => {
    if (rate >= 90) return { text: 'Excellent', variant: 'default' as const };
    if (rate >= 70) return { text: 'Good', variant: 'secondary' as const };
    return { text: 'Needs Attention', variant: 'destructive' as const };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Caretaker Dashboard</h1>
        <p className="text-gray-600">Monitor your patients' medication adherence</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground">
              Active patients under care
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Adherence</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(patients.reduce((sum, p) => sum + p.adherenceRate, 0) / patients.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all patients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {patients.reduce((sum, p) => sum + p.missedDoses, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Missed doses this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Patient List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Patient Overview</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {patients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{patient.name}</CardTitle>
                  <Badge {...getAdherenceBadge(patient.adherenceRate)}>
                    {getAdherenceBadge(patient.adherenceRate).text}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  Last active: {patient.lastActive}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Adherence Rate</span>
                    <span className={`text-sm font-bold ${getAdherenceColor(patient.adherenceRate)}`}>
                      {patient.adherenceRate}%
                    </span>
                  </div>
                  <Progress value={patient.adherenceRate} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Total Medications</span>
                    <p className="text-lg font-semibold text-blue-600">{patient.totalMedications}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Missed Doses</span>
                    <p className={`text-lg font-semibold ${patient.missedDoses > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {patient.missedDoses}
                    </p>
                  </div>
                </div>

                {patient.missedDoses > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center text-red-800">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Attention Required</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      Patient has missed {patient.missedDoses} doses this week. Consider following up.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
