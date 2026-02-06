import { openDatabaseAsync } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

const dbName = 'karango_database.db';
const dbDestination = FileSystem.documentDirectory + 'database.sqlite';

async function getDatabase() {
  // Se já copiado, apenas abra
  const destInfo = await FileSystem.getInfoAsync(dbDestination);
  if (!destInfo.exists) {
    try {
      // Local module path to bundled asset
      const assetModule = require('../assets/db/database.sqlite');
      const asset = Asset.fromModule(assetModule);
      await asset.downloadAsync();
      const assetUri = asset.localUri || asset.uri;
      if (!assetUri) throw new Error('Não foi possível obter URI do asset database.sqlite');
      await FileSystem.copyAsync({ from: assetUri, to: dbDestination });
      console.log('Database copiado dos assets com sucesso');
    } catch (error) {
      console.error('Erro ao copiar database dos assets:', error);
      // Fallback: criar database vazio
      console.log('Criando database vazio como fallback');
    }
  }

  const db = await openDatabaseAsync(dbName, undefined, FileSystem.documentDirectory);

  // Criar tabela veiculos se não existir (sempre, pois pode não estar no database.sqlite)
  try {
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS veiculos (
        id TEXT PRIMARY KEY,
        tipo TEXT,
        tipoNome TEXT,
        brandId TEXT,
        brandNome TEXT,
        modelId TEXT,
        modelNome TEXT,
        ano TEXT,
        placa TEXT
      )
    `);
  } catch (error) {
    console.error('Erro ao criar tabela veiculos:', error);
  }

  return db;
}

// Funções para veículos
export async function getVeiculos() {
  try {
    const db = await getDatabase();
    const result = await db.getAllAsync('SELECT * FROM veiculos');
    return result;
  } catch (error) {
    console.error('Erro em getVeiculos:', error);
    throw error;
  }
}

export async function saveVeiculo(veiculo) {
  try {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT INTO veiculos (id, tipo, tipoNome, brandId, brandNome, modelId, modelNome, ano, placa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [veiculo.id, veiculo.tipo, veiculo.tipoNome, veiculo.brandId, veiculo.brandNome, veiculo.modelId, veiculo.modelNome, veiculo.ano, veiculo.placa]
    );
  } catch (error) {
    console.error('Erro em saveVeiculo:', error);
    throw error;
  }
}

export async function updateVeiculo(id, dados) {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE veiculos SET tipo = ?, tipoNome = ?, brandId = ?, brandNome = ?, modelId = ?, modelNome = ?, ano = ?, placa = ? WHERE id = ?',
    [dados.tipo, dados.tipoNome, dados.brandId, dados.brandNome, dados.modelId, dados.modelNome, dados.ano, dados.placa, id]
  );
}

export async function deleteVeiculo(id) {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM veiculos WHERE id = ?', [id]);
}

export default getDatabase;