import React, { useContext, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { AuthContext } from '../contexts/AuthContext';

const HomeScreen = () => {
  const { user } = useContext(AuthContext);
  const [inputText, setInputText] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const handleShowMessage = () => {
    setSnackbarMsg(inputText);
    setSnackbarVisible(true);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={60}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Welcome, {user?.name || 'User'}!</Text>
        <Text>You are logged in.</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite uma mensagem"
          value={inputText}
          onChangeText={setInputText}
        />
        <Button title="Exibir mensagem" onPress={handleShowMessage} />
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
        >
          {snackbarMsg}
        </Snackbar>
      </ScrollView>
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

export default HomeScreen;