import { openDatabaseAsync } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';

const dbName = 'database.sqlite';
const dbDestination = FileSystem.documentDirectory + dbName;

let dbInstance = null;

async function getDatabase() {
  if (dbInstance) return dbInstance;
  
  dbInstance = await openOrCopyDatabase();
  
  // Criar tabela de veículos cadastrados se não existir
  await dbInstance.execAsync(`
    CREATE TABLE IF NOT EXISTS veiculos (
      id TEXT PRIMARY KEY,
      tipo TEXT,
      tipoNome TEXT,
      brandId TEXT,
      brandNome TEXT,
      modelId TEXT,
      modelNome TEXT,
      ano TEXT,
      placa TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  return dbInstance;
}

async function openOrCopyDatabase() {
  const destInfo = await FileSystem.getInfoAsync(dbDestination);
  if (!destInfo.exists) {
    const assetModule = require('../assets/db/database.sqlite');
    const asset = Asset.fromModule(assetModule);
    await asset.downloadAsync();
    const assetUri = asset.localUri || asset.uri;
    if (!assetUri) throw new Error('Não foi possível obter URI do asset database.sqlite');
    await FileSystem.copyAsync({ from: assetUri, to: dbDestination });
  }
  return await openDatabaseAsync(dbDestination);
}

// === Funções para gerenciar veículos cadastrados ===

async function saveVeiculo(veiculo) {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO veiculos (id, tipo, tipoNome, brandId, brandNome, modelId, modelNome, ano, placa)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      veiculo.id,
      veiculo.tipo,
      veiculo.tipoNome || veiculo.tipo,
      veiculo.brandId,
      veiculo.brandNome,
      veiculo.modelId,
      veiculo.modelNome,
      veiculo.ano,
      veiculo.placa
    ]
  );
}

async function getVeiculos() {
  const db = await getDatabase();
  return await db.getAllAsync('SELECT * FROM veiculos ORDER BY createdAt DESC');
}

async function deleteVeiculo(id) {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM veiculos WHERE id = ?', [id]);
}

async function updateVeiculo(id, dados) {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE veiculos SET 
      tipo = ?, tipoNome = ?, brandId = ?, brandNome = ?, 
      modelId = ?, modelNome = ?, ano = ?, placa = ?
     WHERE id = ?`,
    [
      dados.tipo, dados.tipoNome, dados.brandId, dados.brandNome,
      dados.modelId, dados.modelNome, dados.ano, dados.placa, id
    ]
  );
}

export default getDatabase;
export { saveVeiculo, getVeiculos, deleteVeiculo, updateVeiculo };