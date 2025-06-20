
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Clock, Smartphone } from 'lucide-react';

export const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    dailyReminders: true,
    pushNotifications: true,
    emailReminders: false,
    reminderTime: '09:00',
    snoozeMinutes: '5'
  });

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSelectChange = (setting: keyof typeof settings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Notification Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4 text-gray-500" />
              <span className="text-base font-medium">Daily Reminders</span>
            </div>
            <p className="text-sm text-gray-500">
              Get reminded to take your medications
            </p>
          </div>
          <Switch
            checked={settings.dailyReminders}
            onCheckedChange={() => handleToggle('dailyReminders')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-gray-500" />
              <span className="text-base font-medium">Push Notifications</span>
            </div>
            <p className="text-sm text-gray-500">
              Receive push notifications on your device
            </p>
          </div>
          <Switch
            checked={settings.pushNotifications}
            onCheckedChange={() => handleToggle('pushNotifications')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-base font-medium">Email Reminders</span>
            <p className="text-sm text-gray-500">
              Get email notifications for missed doses
            </p>
          </div>
          <Switch
            checked={settings.emailReminders}
            onCheckedChange={() => handleToggle('emailReminders')}
          />
        </div>

        {settings.dailyReminders && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Reminder Time</span>
              </div>
              <Select 
                value={settings.reminderTime} 
                onValueChange={(value) => handleSelectChange('reminderTime', value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="07:00">7:00 AM</SelectItem>
                  <SelectItem value="08:00">8:00 AM</SelectItem>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="18:00">6:00 PM</SelectItem>
                  <SelectItem value="20:00">8:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Snooze Duration</span>
              <Select 
                value={settings.snoozeMinutes} 
                onValueChange={(value) => handleSelectChange('snoozeMinutes', value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 min</SelectItem>
                  <SelectItem value="10">10 min</SelectItem>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
