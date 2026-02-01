import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FrotaContext } from '../contexts/FrotaContext';

const DashboardScreen = () => {
  const { veiculos, manutencoes, abastecimentos } = useContext(FrotaContext);

  // Estatísticas simples
  const totalVeiculos = veiculos.length;
  const totalManutencoes = manutencoes.length;
  const totalAbastecimentos = abastecimentos.length;
  const tipos = veiculos.reduce((acc, v) => {
    acc[v.tipo] = (acc[v.tipo] || 0) + 1;
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text>Total de veículos: {totalVeiculos}</Text>
      <Text>Total de manutenções: {totalManutencoes}</Text>
      <Text>Total de abastecimentos: {totalAbastecimentos}</Text>
      <Text style={styles.subtitle}>Veículos por tipo:</Text>
      {Object.entries(tipos).map(([tipo, qtd]) => (
        <Text key={tipo}>{tipo}: {qtd}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  subtitle: { marginTop: 20, fontWeight: 'bold' },
});

export default DashboardScreen;
