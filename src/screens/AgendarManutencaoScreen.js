import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Picker, ScrollView } from 'react-native';
import { FrotaContext } from '../contexts/FrotaContext';

const AgendarManutencaoScreen = ({ route, navigation }) => {
  const { veiculoId } = route.params;
  const { addManutencao } = useContext(FrotaContext);
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');

  const handleSalvar = () => {
    addManutencao({
      id: Date.now().toString(),
      veiculoId,
      descricao,
      data
    });
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agendar Manutenção</Text>
      <Text>Descrição:</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Descrição"
      />
      <Text>Data:</Text>
      <TextInput
        style={styles.input}
        value={data}
        onChangeText={setData}
        placeholder="Data (dd/mm/aaaa)"
      />
      <Button title="Salvar" onPress={handleSalvar} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
});

export default AgendarManutencaoScreen;
