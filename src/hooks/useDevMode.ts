import { useState, useEffect } from 'react';

interface DevModeSettings {
  enabled: boolean;
  autoLogin: boolean;
  testEmail: string;
  testPassword: string;
}

const DEFAULT_SETTINGS: DevModeSettings = {
  enabled: false,
  autoLogin: false,
  testEmail: 'nick.rodenrijs@methisconsulting.com',
  testPassword: '', // Empty by default for security
};

export const useDevMode = () => {
  const [settings, setSettings] = useState<DevModeSettings>(() => {
    const stored = localStorage.getItem('devModeSettings');
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('devModeSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: Partial<DevModeSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    updateSettings,
    resetSettings,
  };
};
