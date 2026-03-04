
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Snackbar } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import RNRootToast from 'react-native-root-toast';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [registerMode, setRegisterMode] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarType, setSnackbarType] = useState('info');
  const { login, register } = useContext(AuthContext);




  const handleLogin = async () => {
    if (!email || !password) {
      setSnackbarMsg('Por favor, preencha todos os campos');
      setSnackbarType('error');
      setSnackbarVisible(true);
      return;
    }
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
    if (!email || !password) {
      setSnackbarMsg('Por favor, preencha todos os campos');
      setSnackbarType('error');
      setSnackbarVisible(true);
      return;
    }
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
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <MaterialIcons name="lock" size={32} color="#fff" />
            <Text style={styles.headerTitle}>{registerMode ? 'Criar Conta' : 'Login'}</Text>
            <Text style={styles.headerSubtitle}>
              {registerMode ? 'Crie sua conta para começar' : 'Acesse sua conta Karango'}
            </Text>
          </View>
        </View>

        {/* Form */}
        <ScrollView
          contentContainerStyle={styles.formContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <MaterialIcons name="email" size={16} color="#64748b" />
              <Text style={styles.labelText}>Email</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#cbd5e1"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <MaterialIcons name="lock" size={16} color="#64748b" />
              <Text style={styles.labelText}>Senha</Text>
            </View>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Digite sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#cbd5e1"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <MaterialIcons
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Buttons */}
          {registerMode ? (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
                <MaterialIcons name="person-add" size={20} color="#fff" />
                <Text style={styles.buttonText}>Cadastrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  setRegisterMode(false);
                  setEmail('');
                  setPassword('');
                }}
              >
                <Text style={styles.secondaryButtonText}>Já tenho conta</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
                <MaterialIcons name="login" size={20} color="#fff" />
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  setRegisterMode(true);
                  setEmail('');
                  setPassword('');
                }}
              >
                <Text style={styles.secondaryButtonText}>Criar conta</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={
          snackbarType === 'error'
            ? { backgroundColor: '#d32f2f' }
            : snackbarType === 'success'
            ? { backgroundColor: '#388e3c' }
            : {}
        }
      >
        {snackbarMsg}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e3a5f',
    paddingTop: 48,
    paddingBottom: 40,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#cbd5e1',
    marginTop: 8,
  },
  formContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#1e293b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  passwordInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingRight: 44,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#1e293b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    padding: 8,
  },
  buttonsContainer: {
    gap: 12,
    marginTop: 32,
  },
  primaryButton: {
    backgroundColor: '#ff7043',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#ff7043',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e3a5f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1e3a5f',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;