import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { FrotaContext } from '../contexts/FrotaContext';

const AbastecimentoScreen = ({ route, navigation }) => {
  const { veiculoId } = route.params;
  const { addAbastecimento } = useContext(FrotaContext);
  const [quantidade, setQuantidade] = useState('');
  const [data, setData] = useState('');
  const [valor, setValor] = useState('');

  const handleSalvar = () => {
    addAbastecimento({
      id: Date.now().toString(),
      veiculoId,
      quantidade,
      data,
      valor
    });
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar Abastecimento</Text>
      <Text>Quantidade (litros):</Text>
      <TextInput
        style={styles.input}
        value={quantidade}
        onChangeText={setQuantidade}
        placeholder="Quantidade"
        keyboardType="numeric"
      />
      <Text>Data:</Text>
      <TextInput
        style={styles.input}
        value={data}
        onChangeText={setData}
        placeholder="Data (dd/mm/aaaa)"
      />
      <Text>Valor total:</Text>
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={setValor}
        placeholder="Valor"
        keyboardType="numeric"
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

export default AbastecimentoScreen;
