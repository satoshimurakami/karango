import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const LogoutScreen = () => {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deseja sair?</Text>
      <Button title="Sair" onPress={handleLogout} color="#d9534f" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default LogoutScreen;
