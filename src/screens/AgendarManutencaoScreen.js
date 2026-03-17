import React, { useContext, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FrotaContext } from '../contexts/FrotaContext';

const prioridades = ['Baixa', 'Média', 'Alta'];

const AgendarManutencaoScreen = ({ route, navigation }) => {
  const { veiculos, addManutencao, updateManutencao } = useContext(FrotaContext);

  const manutencao = route?.params?.manutencao;
  const veiculoId = route?.params?.veiculoId;

  const veiculoSelecionado = useMemo(
    () => veiculos.find((item) => item.id === veiculoId),
    [veiculos, veiculoId]
  );

  const veiculoInicial = manutencao?.veiculo
    || (veiculoSelecionado
      ? `${veiculoSelecionado.placa} - ${veiculoSelecionado.brandNome} ${veiculoSelecionado.modelNome}`
      : '');

  const [tipoServico, setTipoServico] = useState(manutencao?.tipoServico || '');
  const [veiculo, setVeiculo] = useState(veiculoInicial);
  const [dataPrevista, setDataPrevista] = useState(manutencao?.dataPrevista || '');
  const [urgencia, setUrgencia] = useState(manutencao?.urgencia || 'Média');
  const [prestador, setPrestador] = useState(manutencao?.prestador || '');
  const [custo, setCusto] = useState(manutencao?.custo || '');
  const [km, setKm] = useState(manutencao?.km || '');

  const resetForm = () => {
    setTipoServico('');
    setVeiculo(veiculoInicial);
    setDataPrevista('');
    setUrgencia('Média');
    setPrestador('');
    setCusto('');
    setKm('');
  };

  const handleSalvar = async () => {
    if (!tipoServico.trim() || !veiculo.trim() || !dataPrevista.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha serviço, veículo e data prevista.');
      return;
    }

    const payload = {
      tipoServico: tipoServico.trim(),
      veiculo: veiculo.trim(),
      dataPrevista: dataPrevista.trim(),
      urgencia,
      prestador: prestador.trim(),
      custo: custo.trim(),
      km: km.trim(),
    };

    try {
      if (manutencao?.id) {
        await updateManutencao(manutencao.id, payload);
        Alert.alert('Sucesso', 'Agendamento atualizado com sucesso.');
      } else {
        await addManutencao({
          id: Date.now().toString(),
          ...payload,
        });
        Alert.alert('Sucesso', 'Agendamento criado com sucesso.');
        resetForm();
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o agendamento.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>
            {manutencao?.id ? 'Editar Manutenção' : 'Agendar Manutenção'}
          </Text>
          <Text style={styles.headerSubtitle}>Cadastre revisões e serviços da frota</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.label}>Tipo de serviço *</Text>
          <TextInput
            style={styles.input}
            value={tipoServico}
            onChangeText={setTipoServico}
            placeholder="Ex: Troca de óleo"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Veículo *</Text>
          <TextInput
            style={styles.input}
            value={veiculo}
            onChangeText={setVeiculo}
            placeholder="Ex: ABC-1234 - Ford Ka"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Data prevista *</Text>
          <TextInput
            style={styles.input}
            value={dataPrevista}
            onChangeText={setDataPrevista}
            placeholder="dd/mm/aaaa"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Urgência</Text>
          <View style={styles.priorityRow}>
            {prioridades.map((item, index) => {
              const active = item === urgencia;
              const isLast = index === prioridades.length - 1;

              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.priorityButton,
                    active && styles.priorityButtonActive,
                    isLast && styles.priorityButtonLast,
                  ]}
                  onPress={() => setUrgencia(item)}
                >
                  <Text style={[styles.priorityText, active && styles.priorityTextActive]}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Prestador</Text>
          <TextInput
            style={styles.input}
            value={prestador}
            onChangeText={setPrestador}
            placeholder="Oficina ou responsável"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Custo estimado</Text>
          <TextInput
            style={styles.input}
            value={custo}
            onChangeText={setCusto}
            placeholder="Ex: 350,00"
            placeholderTextColor="#94a3b8"
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Quilometragem</Text>
          <TextInput
            style={styles.input}
            value={km}
            onChangeText={setKm}
            placeholder="Ex: 45230"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
          <MaterialIcons name="save" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Salvar agendamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e3a8a',
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#cbd5e1',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    color: '#0f172a',
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  priorityButtonLast: {
    marginRight: 0,
  },
  priorityButtonActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#2563eb',
  },
  priorityText: {
    color: '#475569',
    fontWeight: '600',
  },
  priorityTextActive: {
    color: '#1d4ed8',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#2563eb',
    borderRadius: 14,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default AgendarManutencaoScreen;
