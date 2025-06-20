
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Header } from '@/components/layout/Header';
import { PatientDashboard } from '@/components/dashboard/PatientDashboard';
import { CaretakerDashboard } from '@/components/dashboard/CaretakerDashboard';

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return <AuthLayout />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {user.role === 'patient' ? <PatientDashboard /> : <CaretakerDashboard />}
    </div>
  );
};

export default Index;
