import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FrotaContext } from '../contexts/FrotaContext';
import { MaterialIcons } from '@expo/vector-icons';
import { getVehicleTypes, getBrandsByType, getModelsByBrand } from '../database2';

const CadastroVeiculoScreen = ({ navigation }) => {
  const { addVeiculo } = useContext(FrotaContext);
  const [tiposVeiculo, setTiposVeiculo] = useState([]);
  const [tipo, setTipo] = useState('');
  const [brand, setBrand] = useState('');
  const [brands, setBrands] = useState([]);
  const [model, setModel] = useState('');
  const [models, setModels] = useState([]);
  const [ano, setAno] = useState('');
  const [anos, setAnos] = useState([]);
  const [placa, setPlaca] = useState('');

  // Carregar tipos de veículo do banco (DISTINCT)
  useEffect(() => {
    (async () => {
      try {
        console.log('[DEBUG] Loading vehicle types via helper...');
        const tipos = await getVehicleTypes();
        console.log('[DEBUG] Vehicle types from DB (helper):', tipos);
        setTiposVeiculo(tipos);
        if (tipos.length > 0 && !tipo) {
          console.log('[DEBUG] Setting default tipo to:', tipos[0]);
          setTipo(tipos[0]);
        }
      } catch (error) {
        console.error('[SCREEN] Erro ao carregar tipos de veículo:', error);
        setTiposVeiculo([]);
      }
    })();
  }, []);

  // Carregar marcas do banco com base no tipo selecionado
  useEffect(() => {
    if (!tipo) {
      setBrands([]);
      setBrand('');
      return;
    }
    (async () => {
      try {
        console.log('[DEBUG] Loading brands via helper for vehicleType:', tipo);
        const brandsResult = await getBrandsByType(tipo);
        console.log('[DEBUG] Brands found:', brandsResult.length);
        const marcas = brandsResult.map(r => ({ brandId: r.brandId, name: r.name }));
        setBrands(marcas);
        if (marcas.length > 0) {
          setBrand(marcas[0].brandId);
        } else {
          setBrand('');
        }
      } catch (error) {
        console.error('Erro ao carregar marcas:', error);
        setBrands([]);
        setBrand('');
      }
    })();
  }, [tipo]); // Recarrega quando o tipo muda

  // Carregar modelos ao trocar marca (async)
  useEffect(() => {
    if (!brand) {
      setModels([]);
      setModel('');
      return;
    }
    (async () => {
      try {
        console.log('[SCREEN] Effect: loading models for brand:', brand, 'type of brand:', typeof brand);
        const modelsResult = await getModelsByBrand(brand);
        console.log('[SCREEN] Models received:', modelsResult.length);
        setModels(modelsResult);
        if (modelsResult.length > 0) {
          setModel(modelsResult[0].id.toString());
        } else {
          setModel('');
        }
      } catch (error) {
        console.error('[SCREEN] Erro ao carregar modelos:', error);
        setModels([]);
        setModel('');
      }
    })();
  }, [brand]);

  // Popular anos
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const anosArray = [];
    for (let y = 1930; y <= currentYear + 1; y++) {
      anosArray.push(y.toString());
    }
    setAnos(anosArray);
    setAno(anosArray[0]);
  }, []);

  const handleSalvar = async () => {
    // Encontrar os nomes da marca e modelo selecionados
    const selectedBrand = brands.find(b => b.brandId === brand);
    const selectedModel = models.find(m => m.id.toString() === model);
    
    const veiculo = {
      id: Date.now().toString(),
      tipo: tipo,
      tipoNome: tipo, // vehicleType já é o valor do banco
      brandId: brand,
      brandNome: selectedBrand?.name || '',
      modelId: model,
      modelNome: selectedModel?.name || '',
      ano,
      placa
    };
    
    try {
      await addVeiculo(veiculo);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
    }
  };

  return (
    <View style={styles.root}>
      {/* Status bar fake */}
      <View style={styles.statusBar}>
        <Text style={styles.statusBarText}>9:41</Text>
        <View style={styles.statusBarIcons}>
          <MaterialIcons name="signal-cellular-alt" size={16} color="#64748b" />
          <MaterialIcons name="wifi" size={16} color="#64748b" />
          <MaterialIcons name="battery-full" size={16} color="#64748b" style={{ transform: [{ rotate: '90deg' }] }} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header image */}
        <View style={styles.headerImageContainer}>
          <ImageBackground
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1tn0KdVzvan1PKxZCfy65_0kuD_RZfTD2TrhtlZXxyuHcqZHyYtoRUqozbFb9t5DhOMm-cKXeDSeTTR4_jYMUEr7y_DRIibVq8GM_cQryJfKTYHAzqp_XjYsuGqOiiW4g6vdrH1QoXBTRODnd8rMf9-1pypU_zyjc1Vk_WYSmwWUT7Y3_ViVRtyZfZhcu4xCxrLkZLHFtG77kcChuB817WcKN-i7fGyXlF4f3rcPTEZ4xwTktIx482WmzPdU6uKQkZ6HeUM-R1ig' }}
            style={styles.headerImage}
            resizeMode="cover"
          >
            <View style={styles.headerGradient} />
            <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerEditBtn}>
              <MaterialIcons name="edit" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerInfoBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.statusBadge}>Ativo</Text>
              </View>
              <Text style={styles.headerTitle}>Ford Transit 2022</Text>
              <Text style={styles.headerSubtitle}>Placa: ABC-1234</Text>
              <View style={styles.headerDriverRow}>
                <MaterialIcons name="person" size={18} color="#fff" />
                <Text style={styles.headerDriverText}>Motorista: João Silva</Text>
              </View>
            </View>
          </ImageBackground>
        </View>
        {/* Tabs */}
        <View style={styles.tabsRow}>
          <Text style={[styles.tabBtn, styles.tabBtnActive]}>Visão Geral</Text>
          <Text style={styles.tabBtn}>Localização</Text>
          <Text style={styles.tabBtn}>Manutenção</Text>
          <Text style={styles.tabBtn}>Documentos</Text>
        </View>
        {/* Especificações e formulário */}
        <View style={styles.specsContainer}>
          <View style={styles.specsHeaderRow}>
            <MaterialIcons name="info" size={22} color="#1e3a5f" />
            <Text style={styles.specsHeader}>Especificações do Veículo</Text>
          </View>
          <View style={styles.specsList}>
            <View style={styles.specRow}><Text style={styles.specLabel}>Marca</Text><Text style={styles.specValue}>Ford</Text></View>
            <View style={styles.specRow}><Text style={styles.specLabel}>Modelo</Text><Text style={styles.specValue}>Ford Transit 2022</Text></View>
            <View style={styles.specRow}><Text style={styles.specLabel}>Ano</Text><Text style={styles.specValue}>2022</Text></View>
            <View style={styles.specRow}><Text style={styles.specLabel}>Cor</Text><Text style={styles.specValue}>Branco</Text></View>
            <View style={styles.specRow}><Text style={styles.specLabel}>Combustível</Text><Text style={styles.specValue}>Diesel</Text></View>
            <View style={styles.specRow}><Text style={styles.specLabel}>Quilometragem</Text><Text style={styles.specValue}>45.230 km</Text></View>
          </View>
          {/* Formulário de cadastro */}
          <View style={styles.formContainer}>
            <Text style={styles.formLabel}>Tipo</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={tipo}
                onValueChange={setTipo}
                style={styles.picker}
              >
                <Picker.Item label="Selecione um tipo" value="" />
                {tiposVeiculo.map(t => (
                  <Picker.Item key={t} label={t} value={t} />
                ))}
              </Picker>
            </View>
            <Text style={styles.formLabel}>Marca</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={brand}
                onValueChange={setBrand}
                style={styles.picker}
              >
                <Picker.Item label="Selecione uma marca" value="" />
                {brands.map(b => (
                  <Picker.Item key={b.brandId} label={b.name} value={b.brandId} />
                ))}
              </Picker>
            </View>
            <Text style={styles.formLabel}>Modelo</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={model}
                onValueChange={setModel}
                style={styles.picker}
              >
                <Picker.Item label="Selecione um modelo" value="" />
                {models.map(m => (
                  <Picker.Item key={m.id} label={m.name} value={m.id.toString()} />
                ))}
              </Picker>
            </View>
            <Text style={styles.formLabel}>Ano</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={ano}
                onValueChange={setAno}
                style={styles.picker}
              >
                <Picker.Item label="Selecione o ano" value="" />
                {anos.map(a => (
                  <Picker.Item key={a} label={a} value={a} />
                ))}
              </Picker>
            </View>
            <Text style={styles.formLabel}>Placa</Text>
            <TextInput
              style={styles.input}
              value={placa}
              onChangeText={setPlaca}
              placeholder="Placa"
              placeholderTextColor="#64748b"
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSalvar}>
              <MaterialIcons name="add" size={22} color="#fff" />
              <Text style={styles.saveBtnText}>Salvar Veículo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Bottom bar fake */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBarBtn}><MaterialIcons name="history" size={20} color="#64748b" /><Text style={styles.bottomBarText}>Histórico</Text></TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarBtn}><MaterialIcons name="assessment" size={20} color="#64748b" /><Text style={styles.bottomBarText}>Relatórios</Text></TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarBtn}><MaterialIcons name="settings" size={20} color="#64748b" /><Text style={styles.bottomBarText}>Configurar</Text></TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarBtn}><MaterialIcons name="share" size={20} color="#64748b" /><Text style={styles.bottomBarText}>Compartilhar</Text></TouchableOpacity>
      </View>
      {/* Floating add button */}
      <TouchableOpacity style={styles.fabBtn}>
        <MaterialIcons name="add" size={32} color="#fff" />
      </TouchableOpacity>
      {/* Drag bar fake */}
      <View style={styles.dragBar} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  statusBarText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  statusBarIcons: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 120,
    width: 414,
    alignSelf: 'center',
  },
  headerImageContainer: {
    height: 288,
    width: '100%',
    position: 'relative',
    marginBottom: 8,
  },
  headerImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  headerBackBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerEditBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfoBox: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 24,
  },
  statusBadge: {
    backgroundColor: '#22c55e',
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
  },
  headerDriverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  headerDriverText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  tabBtn: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    color: '#1e3a5f',
    borderBottomColor: '#1e3a5f',
    fontWeight: '700',
  },
  specsContainer: {
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  specsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  specsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginLeft: 8,
  },
  specsList: {
    marginBottom: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 8,
  },
  specLabel: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  specValue: {
    color: '#1e293b',
    fontSize: 14,
    fontWeight: '600',
  },
  formContainer: {
    marginTop: 16,
  },
  formLabel: {
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: 4,
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    height: 55,
    justifyContent: 'center',
  },
  picker: {
    height: 55,
    width: '100%',
    color: '#222',
  },
  input: {
    height: 48,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f8fafc',
    color: '#222',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3a5f',
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
    gap: 8,
    shadowColor: '#1e3a5f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    zIndex: 20,
  },
  bottomBarBtn: {
    alignItems: 'center',
    gap: 2,
  },
  bottomBarText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
  },
  fabBtn: {
    position: 'absolute',
    right: 24,
    bottom: 96,
    width: 56,
    height: 56,
    backgroundColor: '#ff6b35',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 30,
  },
  dragBar: {
    position: 'absolute',
    left: '50%',
    bottom: 6,
    width: 128,
    height: 4,
    backgroundColor: '#cbd5e1',
    borderRadius: 8,
    marginLeft: -64,
    zIndex: 40,
  },
});

export default CadastroVeiculoScreen;
