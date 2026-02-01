import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AuthContext } from './contexts/AuthContext';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import LogoutScreen from './screens/LogoutScreen';
import UsersScreen from './screens/UsersScreen';
import VeiculosScreen from './screens/VeiculosScreen';
import CadastroVeiculoScreen from './screens/CadastroVeiculoScreen';
import DashboardScreen from './screens/DashboardScreen';
import AgendarManutencaoScreen from './screens/AgendarManutencaoScreen';
import AbastecimentoScreen from './screens/AbastecimentoScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

import { MaterialCommunityIcons } from '@expo/vector-icons';

function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Veículos" component={VeiculosScreen} />
      <Drawer.Screen name="Usuários" component={UsersScreen} />
      <Drawer.Screen
        name="Sair"
        component={LogoutScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="exit-to-app" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Drawer" component={DrawerNavigator} />
            <Stack.Screen name="CadastroVeiculo" component={CadastroVeiculoScreen} />
            <Stack.Screen name="AgendarManutencao" component={AgendarManutencaoScreen} />
            <Stack.Screen name="Abastecimento" component={AbastecimentoScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;