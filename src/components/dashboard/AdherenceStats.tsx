
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useMedication } from '@/contexts/MedicationContext';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, Target, CheckCircle } from 'lucide-react';

export const AdherenceStats = () => {
  const { getAdherenceStats } = useMedication();
  const { user } = useAuth();

  if (!user) return null;

  const stats = getAdherenceStats(user.id);
  const streakDays = 7; // Mock streak data

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Adherence</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.percentage}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.taken} of {stats.total} medications taken
          </p>
          <Progress value={stats.percentage} className="mt-3" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{streakDays} days</div>
          <p className="text-xs text-muted-foreground">
            Keep it up! You're doing great
          </p>
          <div className="flex space-x-1 mt-3">
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full ${
                  i < streakDays ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Week</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">85%</div>
          <p className="text-xs text-muted-foreground">
            Average weekly adherence
          </p>
          <div className="mt-3 space-y-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className="flex items-center justify-between text-xs">
                <span>{day}</span>
                <div className={`w-2 h-2 rounded-full ${
                  Math.random() > 0.2 ? 'bg-green-500' : 'bg-red-300'
                }`} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
