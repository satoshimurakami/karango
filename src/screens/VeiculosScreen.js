import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert, Button } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FrotaContext } from '../contexts/FrotaContext';

const VeiculosScreen = ({ navigation }) => {
  const { veiculos, removeVeiculo, updateVeiculo, loading } = useContext(FrotaContext);
  const [editingId, setEditingId] = useState(null);
  const [editPlaca, setEditPlaca] = useState('');
  const [editAno, setEditAno] = useState('');

  const handleEdit = (veiculo) => {
    setEditingId(veiculo.id);
    setEditPlaca(veiculo.placa || '');
    setEditAno(veiculo.ano || '');
  };

  const handleSave = async (veiculo) => {
    if (!editPlaca) {
      Alert.alert('Erro', 'Digite a placa do veículo.');
      return;
    }
    try {
      await updateVeiculo(veiculo.id, {
        ...veiculo,
        placa: editPlaca,
        ano: editAno
      });
      setEditingId(null);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o veículo.');
    }
  };

  const handleRemove = (veiculo) => {
    Alert.alert(
      'Remover veículo',
      `Deseja remover ${veiculo.brandNome} ${veiculo.modelNome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => removeVeiculo(veiculo.id)
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Carregando veículos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Veículos cadastrados</Text>
      <Button title="Cadastrar Veículo" onPress={() => navigation.navigate('CadastroVeiculo')} />
      
      {/* Card de cabeçalho */}
      <View style={[styles.card, styles.headerCard, { marginTop: 16 }]}>
        <Text style={[styles.headerText, { flex: 2 }]}>Veículo</Text>
        <Text style={[styles.headerText, { flex: 1, textAlign: 'center' }]}>Placa/Ano</Text>
        <Text style={[styles.headerText, { width: 80, textAlign: 'center' }]}>Ações</Text>
      </View>
      
      <FlatList
        data={veiculos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          editingId === item.id ? (
            <View style={styles.card}>
              <View style={{ flex: 2 }}>
                <Text style={styles.cardTitle}>{item.brandNome} {item.modelNome}</Text>
                <Text style={styles.cardSubtitle}>{item.tipoNome || item.tipo}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={styles.input}
                  placeholder="Placa"
                  value={editPlaca}
                  onChangeText={setEditPlaca}
                  autoCapitalize="characters"
                />
                <TextInput
                  style={[styles.input, { marginTop: 4 }]}
                  placeholder="Ano"
                  value={editAno}
                  onChangeText={setEditAno}
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity onPress={() => handleSave(item)} style={styles.actionBtn}>
                <MaterialIcons name="check" size={24} color="#388e3c" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditingId(null)} style={styles.actionBtn}>
                <MaterialIcons name="close" size={24} color="#d32f2f" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.card}>
              <View style={{ flex: 2 }}>
                <Text style={styles.cardTitle}>{item.brandNome} {item.modelNome}</Text>
                <Text style={styles.cardSubtitle}>{item.tipoNome || item.tipo}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardText}>{item.placa}</Text>
                <Text style={styles.cardSubtitle}>{item.ano}</Text>
              </View>
              <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionBtn}>
                <MaterialIcons name="edit" size={24} color="#1976d2" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRemove(item)} style={styles.actionBtn}>
                <MaterialIcons name="delete" size={24} color="#d32f2f" />
              </TouchableOpacity>
            </View>
          )
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 16 }}>Nenhum veículo cadastrado.</Text>}
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
    minHeight: 60,
  },
  headerCard: {
    backgroundColor: '#e0e0e0',
    marginBottom: 6,
    minHeight: 48,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  cardText: {
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fff',
    fontSize: 13,
  },
  actionBtn: {
    marginLeft: 8,
    padding: 4,
  },
});

export default VeiculosScreen;
