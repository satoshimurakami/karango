import { openDatabaseAsync } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system/legacy';

const dbName = 'karango_database.db';

async function getDatabase() {
  const db = await openDatabaseAsync(dbName, undefined, FileSystem.documentDirectory);

  // Criar tabelas se não existirem
  try {
    // Criar tabela brands
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS brands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brandId TEXT,
        name TEXT,
        vehicleType TEXT,
        modelId TEXT,
        modelName TEXT
      )
    `);

    // Verificar se há dados na tabela brands
    const brandsCount = await db.getAllAsync('SELECT COUNT(*) as count FROM brands');
    if (brandsCount[0].count === 0) {
      // Inserir dados de exemplo
      await db.runAsync(`
        INSERT INTO brands (brandId, name, vehicleType, modelId, modelName) VALUES
        ('1', 'Mercedes-Benz', 'Caminhão', '1', 'Sprinter'),
        ('1', 'Mercedes-Benz', 'Caminhão', '7', 'Actros'),
        ('2', 'Volkswagen', 'Caminhão', '2', 'Delivery'),
        ('2', 'Volkswagen', 'Caminhão', '8', 'Constellation'),
        ('3', 'Ford', 'Caminhão', '3', 'Transit'),
        ('3', 'Ford', 'Caminhão', '9', 'F-4000'),
        ('4', 'Chevrolet', 'Carro', '4', 'Onix'),
        ('4', 'Chevrolet', 'Carro', '10', 'Cruze'),
        ('5', 'Fiat', 'Carro', '5', 'Uno'),
        ('5', 'Fiat', 'Carro', '11', 'Palio'),
        ('6', 'Honda', 'Carro', '6', 'Civic'),
        ('6', 'Honda', 'Carro', '12', 'Fit')
      `);
    }
  } catch (error) {
    console.error('Erro ao criar/verificar tabela brands:', error);
  }

  // Criar tabela veiculos se não existir
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