import React, { useState, useContext, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import { FrotaContext } from '../contexts/FrotaContext';

const TIPOS_SERVICO = [
  'Troca de Óleo',
  'Alinhamento e Balanceamento',
  'Revisão Geral',
  'Sistema de Freios',
  'Suspensão',
  'Correia Dentada',
  'Bateria',
  'Pneus',
  'Elétrica',
  'Outro'
];

const AgendarManutencaoScreen = ({ navigation }) => {
  const { addManutencao, veiculos } = useContext(FrotaContext);
  const [tipoServico, setTipoServico] = useState('Troca de Óleo');
  const [veiculo, setVeiculo] = useState('');
  const [dataPrevista, setDataPrevista] = useState('10/02/2026');
  const [urgencia, setUrgencia] = useState('Média');
  const [prestador, setPrestador] = useState('');
  const [custo, setCusto] = useState('');
  const [km, setKm] = useState('');

  // Inicializar com o primeiro veículo se disponível
  useEffect(() => {
    if (veiculos && veiculos.length > 0 && !veiculo) {
      const v = veiculos[0];
      setVeiculo(`${v.brandNome} ${v.modelNome} - ${v.placa}`);
    }
  }, [veiculos]);

  const handleSalvar = () => {
    addManutencao({
      id: Date.now().toString(),
      tipoServico,
      veiculo,
      dataPrevista,
      urgencia,
      prestador,
      custo,
      km
    });
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <View style={styles.statusBar}>
        <Text style={styles.statusBarText}>9:41</Text>
        <View style={styles.statusBarIcons}>
          <MaterialIcons name="signal-cellular-alt" size={16} color="#222" />
          <MaterialIcons name="wifi" size={16} color="#222" />
          <MaterialIcons name="battery-full" size={16} color="#222" />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={24} color="#1e3a5f" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Agendamentos</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <MaterialIcons name="notifications" size={22} color="#64748b" />
            <MaterialIcons name="more-vert" size={22} color="#64748b" />
          </View>
        </View>
        <View style={styles.formBox}>
          <View style={styles.formHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialIcons name="build-circle" size={24} color="#1e3a5f" />
              <Text style={styles.formHeaderTitle}>Agendar Manutenção</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.formCloseBtn}>
              <MaterialIcons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          <View style={styles.formContent}>
            <Text style={styles.formLabel}>Tipo de Serviço</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={tipoServico}
                onValueChange={(itemValue) => setTipoServico(itemValue)}
                style={styles.picker}
              >
                {TIPOS_SERVICO.map(tipo => (
                  <Picker.Item key={tipo} label={tipo} value={tipo} />
                ))}
              </Picker>
            </View>
            <Text style={styles.formLabel}>Veículo</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={veiculo}
                onValueChange={(itemValue) => setVeiculo(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecione um veículo" value="" />
                {veiculos.map((v) => (
                  <Picker.Item 
                    key={v.id} 
                    label={`${v.brandNome} ${v.modelNome} - ${v.placa}`} 
                    value={`${v.brandNome} ${v.modelNome} - ${v.placa}`} 
                  />
                ))}
              </Picker>
            </View>
            <Text style={styles.formLabel}>Data Prevista</Text>
            <View style={styles.inputRow}>
              <MaterialIcons name="calendar-today" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={dataPrevista}
                onChangeText={setDataPrevista}
                placeholder="Data Prevista"
                placeholderTextColor="#64748b"
              />
            </View>
            <Text style={styles.formLabel}>Urgência</Text>
            <View style={styles.urgenciaRow}>
              {['Baixa','Média','Alta'].map(u => (
                <TouchableOpacity
                  key={u}
                  style={[styles.urgenciaBtn, urgencia === u && styles.urgenciaBtnSelected]}
                  onPress={() => setUrgencia(u)}
                >
                  <Text style={[styles.urgenciaBtnText, urgencia === u && styles.urgenciaBtnTextSelected]}>{u}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.formLabel}>Prestador de Serviço</Text>
            <View style={styles.inputRow}>
              <MaterialIcons name="storefront" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={prestador}
                onChangeText={setPrestador}
                placeholder="Nome da oficina ou prestador"
                placeholderTextColor="#64748b"
              />
            </View>
            <Text style={styles.formLabel}>Custo Estimado (R$)</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>$</Text>
              <TextInput
                style={styles.input}
                value={custo}
                onChangeText={setCusto}
                placeholder="0,00"
                placeholderTextColor="#64748b"
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.formLabel}>Quilometragem</Text>
            <View style={styles.inputRow}>
              <MaterialIcons name="speed" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={km}
                onChangeText={setKm}
                placeholder="km"
                placeholderTextColor="#64748b"
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleSalvar}>
              <MaterialIcons name="check-circle" size={22} color="#fff" />
              <Text style={styles.confirmBtnText}>Confirmar Agendamento</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBar: {
    height: 44,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f3f4f6',
  },
  statusBarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#222',
  },
  statusBarIcons: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 120,
    width: 400,
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginLeft: 8,
  },
  formBox: {
    backgroundColor: '#fff',
    borderRadius: 32,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  formHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  formHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginLeft: 8,
  },
  formCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContent: {
    marginTop: 8,
  },
  formLabel: {
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: 4,
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 8,
    color: '#64748b',
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
    height: 55,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picker: {
    height: 55,
    width: '100%',
    color: '#222',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#222',
    backgroundColor: 'transparent',
  },
  urgenciaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
  },
  urgenciaBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  urgenciaBtnSelected: {
    backgroundColor: '#ffedd5',
    borderColor: '#ff6b35',
  },
  urgenciaBtnText: {
    color: '#64748b',
    fontWeight: '500',
    fontSize: 14,
  },
  urgenciaBtnTextSelected: {
    color: '#ff6b35',
    fontWeight: 'bold',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6b35',
    borderRadius: 20,
    paddingVertical: 16,
    marginTop: 8,
    gap: 8,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default AgendarManutencaoScreen;

// ...existing code...
