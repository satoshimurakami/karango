
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/AppNavigator';


export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <AppNavigator />
        <StatusBar style="auto" />
        <Toast />
      </AuthProvider>
    </PaperProvider>
  );
}