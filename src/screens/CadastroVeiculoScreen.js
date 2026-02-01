import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FrotaContext } from '../contexts/FrotaContext';

const tiposVeiculo = [
  'Carro', 'Moto', 'Triciclo', 'Caminhão', 'Trator', 'Barco', 'Outro'
];

const CadastroVeiculoScreen = ({ navigation }) => {
  const { addVeiculo } = useContext(FrotaContext);
  const [tipo, setTipo] = useState('Carro');
  const [modelo, setModelo] = useState('');
  const [placa, setPlaca] = useState('');

  const handleSalvar = () => {
    addVeiculo({
      id: Date.now().toString(),
      tipo,
      modelo,
      placa
    });
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro de Veículo</Text>
      <Text style={styles.label}>Tipo:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tipo}
          onValueChange={setTipo}
          style={styles.picker}
        >
          {tiposVeiculo.map(t => <Picker.Item key={t} label={t} value={t} />)}
        </Picker>
      </View>
      <Text>Modelo:</Text>
      <TextInput
        style={styles.input}
        value={modelo}
        onChangeText={setModelo}
        placeholder="Modelo"
      />
      <Text>Placa:</Text>
      <TextInput
        style={styles.input}
        value={placa}
        onChangeText={setPlaca}
        placeholder="Placa"
      />
      <Button title="Salvar" onPress={handleSalvar} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
  label: { marginBottom: 4, fontWeight: 'bold' },
  pickerContainer: { borderWidth: 1, borderColor: 'gray', borderRadius: 4, marginBottom: 20, overflow: 'hidden' },
  picker: { height: 56, color: '#222', backgroundColor: '#fff' },
});

export default CadastroVeiculoScreen;
