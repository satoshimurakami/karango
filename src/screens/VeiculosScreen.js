import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { FrotaContext } from '../contexts/FrotaContext';

const VeiculosScreen = ({ navigation }) => {
  const { veiculos } = useContext(FrotaContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Veículos</Text>
      <Button title="Cadastrar Veículo" onPress={() => navigation.navigate('CadastroVeiculo')} />
      <FlatList
        data={veiculos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.tipo}: {item.modelo} ({item.placa})</Text>
            {/* Botões de editar, agendar manutenção, abastecimento podem ser adicionados aqui */}
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum veículo cadastrado.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  item: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
});

export default VeiculosScreen;
