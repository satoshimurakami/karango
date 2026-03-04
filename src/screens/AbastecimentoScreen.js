import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, FlatList, TouchableOpacity, Alert, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FrotaContext } from '../contexts/FrotaContext';

const AbastecimentoScreen = ({ route, navigation }) => {
  const { veiculoId } = route.params;
  const { veiculos, abastecimentos, addAbastecimento, updateAbastecimento, removeAbastecimento } = useContext(FrotaContext);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [quantidade, setQuantidade] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [data, setData] = useState('');
  const [km, setKm] = useState('');
  const [posto, setPosto] = useState('');
  const [tipoCombustivel, setTipoCombustivel] = useState('Gasolina');
  const [observacoes, setObservacoes] = useState('');

  const veiculo = veiculos.find(v => v.id === veiculoId);
  const abastecimentosVeiculo = abastecimentos.filter(a => a.veiculoId === veiculoId);

  const resetForm = () => {
    setEditingId(null);
    setQuantidade('');
    setValorTotal('');
    setData('');
    setKm('');
    setPosto('');
    setTipoCombustivel('Gasolina');
    setObservacoes('');
  };

  const handleAdd = () => {
    resetForm();
    setModalVisible(true);
  };

  const handleEdit = (abastecimento) => {
    setEditingId(abastecimento.id);
    setQuantidade(abastecimento.quantidade?.toString() || '');
    setValorTotal(abastecimento.valorTotal?.toString() || '');
    setData(abastecimento.data || '');
    setKm(abastecimento.km?.toString() || '');
    setPosto(abastecimento.posto || '');
    setTipoCombustivel(abastecimento.tipoCombustivel || 'Gasolina');
    setObservacoes(abastecimento.observacoes || '');
    setModalVisible(true);
  };

  const handleSalvar = async () => {
    if (!quantidade || !valorTotal || !data) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios: quantidade, valor e data');
      return;
    }

    const qtd = parseFloat(quantidade);
    const valor = parseFloat(valorTotal);
    const valorLitro = qtd > 0 ? valor / qtd : 0;

    const abastecimentoData = {
      veiculoId,
      veiculoPlaca: veiculo?.placa || '',
      quantidade: qtd,
      valorTotal: valor,
      valorLitro: parseFloat(valorLitro.toFixed(2)),
      data,
      km: km ? parseFloat(km) : null,
      posto,
      tipoCombustivel,
      observacoes
    };

    try {
      if (editingId) {
        await updateAbastecimento(editingId, abastecimentoData);
        Alert.alert('Sucesso', 'Abastecimento atualizado!');
      } else {
        await addAbastecimento({
          id: Date.now().toString(),
          ...abastecimentoData
        });
        Alert.alert('Sucesso', 'Abastecimento registrado!');
      }
      setModalVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o abastecimento');
    }
  };

  const handleRemove = (id) => {
    Alert.alert(
      'Remover abastecimento',
      'Deseja realmente remover este abastecimento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeAbastecimento(id);
              Alert.alert('Sucesso', 'Abastecimento removido!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível remover o abastecimento');
            }
          }
        }
      ]
    );
  };

  const renderAbastecimento = ({ item }) => {
    const valorLitro = item.valorLitro || (item.quantidade > 0 ? item.valorTotal / item.quantidade : 0);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderInfo}>
            <MaterialIcons name="local-gas-station" size={24} color="#0284c7" />
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardDate}>{item.data}</Text>
              {item.posto && <Text style={styles.cardPosto}>{item.posto}</Text>}
            </View>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity onPress={() => handleEdit(item)} style={styles.iconButton}>
              <MaterialIcons name="edit" size={20} color="#0284c7" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.iconButton}>
              <MaterialIcons name="delete" size={20} color="#dc2626" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.cardBody}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Combustível:</Text>
            <Text style={styles.cardValue}>{item.tipoCombustivel || 'Gasolina'}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Quantidade:</Text>
            <Text style={styles.cardValue}>{item.quantidade} L</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Valor total:</Text>
            <Text style={styles.cardValue}>R$ {item.valorTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Valor/litro:</Text>
            <Text style={styles.cardValue}>R$ {valorLitro.toFixed(2)}</Text>
          </View>
          {item.km && (
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Km:</Text>
              <Text style={styles.cardValue}>{item.km}</Text>
            </View>
          )}
          {item.observacoes && (
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Obs:</Text>
              <Text style={styles.cardValue}>{item.observacoes}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Abastecimentos</Text>
        {veiculo && (
          <Text style={styles.subtitle}>{veiculo.placa} - {veiculo.brandNome} {veiculo.modelNome}</Text>
        )}
      </View>

      {abastecimentosVeiculo.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="local-gas-station" size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>Nenhum abastecimento registrado</Text>
        </View>
      ) : (
        <FlatList
          data={abastecimentosVeiculo}
          renderItem={renderAbastecimento}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={handleAdd}>
        <MaterialIcons name="add" size={28} color="white" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>
                {editingId ? 'Editar Abastecimento' : 'Novo Abastecimento'}
              </Text>

              <Text style={styles.label}>Combustível:</Text>
              <View style={styles.combustivelContainer}>
                {['Gasolina', 'Etanol', 'Diesel', 'GNV'].map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={[
                      styles.combustivelButton,
                      tipoCombustivel === tipo && styles.combustivelButtonActive
                    ]}
                    onPress={() => setTipoCombustivel(tipo)}
                  >
                    <Text
                      style={[
                        styles.combustivelButtonText,
                        tipoCombustivel === tipo && styles.combustivelButtonTextActive
                      ]}
                    >
                      {tipo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Quantidade (litros) *</Text>
              <TextInput
                style={styles.input}
                value={quantidade}
                onChangeText={setQuantidade}
                placeholder="Ex: 45.5"
                keyboardType="decimal-pad"
              />

              <Text style={styles.label}>Valor total (R$) *</Text>
              <TextInput
                style={styles.input}
                value={valorTotal}
                onChangeText={setValorTotal}
                placeholder="Ex: 250.00"
                keyboardType="decimal-pad"
              />

              <Text style={styles.label}>Data *</Text>
              <TextInput
                style={styles.input}
                value={data}
                onChangeText={setData}
                placeholder="dd/mm/aaaa"
              />

              <Text style={styles.label}>Quilometragem</Text>
              <TextInput
                style={styles.input}
                value={km}
                onChangeText={setKm}
                placeholder="Ex: 15000"
                keyboardType="numeric"
              />

              <Text style={styles.label}>Posto</Text>
              <TextInput
                style={styles.input}
                value={posto}
                onChangeText={setPosto}
                placeholder="Nome do posto"
              />

              <Text style={styles.label}>Observações</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={observacoes}
                onChangeText={setObservacoes}
                placeholder="Observações adicionais"
                multiline
                numberOfLines={3}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSalvar}
                >
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  cardHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardHeaderText: {
    gap: 2,
  },
  cardDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  cardPosto: {
    fontSize: 12,
    color: '#64748b',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  cardBody: {
    gap: 8,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0284c7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  combustivelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  combustivelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: 'white',
  },
  combustivelButtonActive: {
    backgroundColor: '#0284c7',
    borderColor: '#0284c7',
  },
  combustivelButtonText: {
    fontSize: 14,
    color: '#64748b',
  },
  combustivelButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 8,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  saveButton: {
    backgroundColor: '#0284c7',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default AbastecimentoScreen;
