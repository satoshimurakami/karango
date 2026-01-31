import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';

const UsersScreen = () => {
  const { users, register } = useContext(AuthContext);
  const [editingEmail, setEditingEmail] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [userList, setUserList] = useState(users);

  // Atualiza lista local se users mudar
  React.useEffect(() => {
    setUserList(users);
  }, [users]);

  const handleEdit = (email) => {
    setEditingEmail(email);
    setNewPassword('');
  };

  const handleSave = async (email) => {
    if (!newPassword) {
      Alert.alert('Erro', 'Digite a nova senha.');
      return;
    }
    // Atualiza senha do usuário
    const updatedUsers = userList.map(u => u.email === email ? { ...u, password: newPassword } : u);
    setUserList(updatedUsers);
    // Atualiza no contexto
    await register(email, newPassword, true); // true = update
    setEditingEmail(null);
    setNewPassword('');
  };

  const handleRemove = (email) => {
    Alert.alert('Remover usuário', 'Tem certeza que deseja remover este usuário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover', style: 'destructive', onPress: async () => {
          const updatedUsers = userList.filter(u => u.email !== email);
          setUserList(updatedUsers);
          await register(email, null, false, true); // true = remove
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuários cadastrados</Text>
      {/* Card de cabeçalho */}
      <View style={[styles.card, styles.headerCard]}>
        <Text style={[styles.headerText, { flex: 1 }]}>Email</Text>
        <Text style={[styles.headerText, { width: 100, textAlign: 'center' }]}>Ações</Text>
      </View>
      <FlatList
        data={userList}
        keyExtractor={item => item.email}
        renderItem={({ item }) => (
          editingEmail === item.email ? (
            <View style={styles.card}>
              <Text style={{ flex: 1 }}>{item.email}</Text>
              <TextInput
                style={styles.input}
                placeholder="Nova senha"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => handleSave(item.email)} style={styles.actionBtn}>
                <MaterialIcons name="check" size={24} color="#388e3c" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditingEmail(null)} style={styles.actionBtn}>
                <MaterialIcons name="close" size={24} color="#d32f2f" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={{ flex: 1 }}>{item.email}</Text>
              <TouchableOpacity onPress={() => handleEdit(item.email)} style={styles.actionBtn}>
                <MaterialIcons name="edit" size={24} color="#1976d2" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRemove(item.email)} style={styles.actionBtn}>
                <MaterialIcons name="delete" size={24} color="#d32f2f" />
              </TouchableOpacity>
            </View>
          )
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 16 }}>Nenhum usuário cadastrado.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    minHeight: 48,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 120,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  actionBtn: {
    marginLeft: 8,
  },
  headerCard: {
    backgroundColor: '#e0e0e0',
    marginBottom: 6,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
});

export default UsersScreen;