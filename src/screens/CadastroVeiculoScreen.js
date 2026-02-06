import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FrotaContext } from '../contexts/FrotaContext';
import { getVehicleTypes, getBrandsByType, getModelsByBrand } from '../database';

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
        console.error('Erro ao carregar tipos de veículo:', error);
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
        console.log('[DEBUG] Loading models via helper for brand:', brand);
        const modelsResult = await getModelsByBrand(brand);
        console.log('[DEBUG] Models found:', modelsResult.length);
        setModels(modelsResult);
        if (modelsResult.length > 0) {
          setModel(modelsResult[0].id.toString());
        } else {
          setModel('');
        }
      } catch (error) {
        console.error('Erro ao carregar modelos:', error);
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro de Veículo</Text>
      <Text style={styles.label}>Tipo:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tipo}
          onValueChange={(value) => {
            console.log('[DEBUG] Tipo selecionado:', value);
            setTipo(value);
          }}
          style={styles.picker}
        >
          <Picker.Item label="Selecione um tipo" value="" />
          {tiposVeiculo.map(t => {
            console.log('[DEBUG] Renderizando tipo:', t);
            return <Picker.Item key={t} label={t} value={t} />;
          })}
        </Picker>
      </View>

      <Text style={styles.label}>Marca:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          key={`brands-${brands.length}`}
          selectedValue={brand}
          onValueChange={setBrand}
          style={styles.picker}
        >
          <Picker.Item label="Selecione uma marca" value="" />
          {brands.map(b => (
            <Picker.Item key={b.id} label={b.name} value={b.brandId} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Modelo:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          key={`models-${brand}-${models.length}`}
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

      <Text style={styles.label}>Ano:</Text>
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

      <Text style={styles.label}>Placa:</Text>
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
