
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/contexts/AuthContext';
import { FrotaProvider } from './src/contexts/FrotaContext';
import AppNavigator from './src/AppNavigator';


export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <FrotaProvider>
          <AppNavigator />
          <StatusBar style="auto" />
          <Toast />
        </FrotaProvider>
      </AuthProvider>
    </PaperProvider>
  );
}