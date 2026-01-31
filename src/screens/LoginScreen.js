
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Snackbar } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import RNRootToast from 'react-native-root-toast';
import { AuthContext } from '../contexts/AuthContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [registerMode, setRegisterMode] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarType, setSnackbarType] = useState('info');
  const { login, register } = useContext(AuthContext);




  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      setSnackbarMsg(error.message);
      setSnackbarType('error');
      setSnackbarVisible(true);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: error.message,
      });
      RNRootToast.show(error.message, {
        duration: RNRootToast.durations.SHORT,
        backgroundColor: '#d32f2f',
      });
    }
  };




  const handleRegister = async () => {
    try {
      await register(email, password);
      setSnackbarMsg('Cadastro realizado! Faça login.');
      setSnackbarType('success');
      setSnackbarVisible(true);
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Cadastro realizado! Faça login.',
      });
      RNRootToast.show('Cadastro realizado! Faça login.', {
        duration: RNRootToast.durations.SHORT,
        backgroundColor: '#388e3c',
      });
      setRegisterMode(false);
      setEmail('');
      setPassword('');
    } catch (error) {
      setSnackbarMsg(error.message);
      setSnackbarType('error');
      setSnackbarVisible(true);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: error.message,
      });
      RNRootToast.show(error.message, {
        duration: RNRootToast.durations.SHORT,
        backgroundColor: '#d32f2f',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={60}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{registerMode ? 'Cadastrar' : 'Login'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {registerMode ? (
          <>
            <Button title="Cadastrar" onPress={handleRegister} />
            <Button title="Já tenho conta" onPress={() => setRegisterMode(false)} />
          </>
        ) : (
          <>
            <Button title="Login" onPress={handleLogin} />
            <Button title="Criar conta" onPress={() => setRegisterMode(true)} />
          </>
        )}
      </ScrollView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={snackbarType === 'error' ? { backgroundColor: '#d32f2f' } : snackbarType === 'success' ? { backgroundColor: '#388e3c' } : {}}
      >
        {snackbarMsg}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;