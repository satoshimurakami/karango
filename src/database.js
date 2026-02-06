import { openDatabaseAsync } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

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
        ('2', 'Volkswagen', 'Caminhão', '2', 'Delivery'),
        ('3', 'Ford', 'Caminhão', '3', 'Transit'),
        ('4', 'Chevrolet', 'Carro', '4', 'Onix'),
        ('5', 'Fiat', 'Carro', '5', 'Uno'),
        ('6', 'Honda', 'Carro', '6', 'Civic')
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

    // Verificar se há dados na tabela veiculos
    const veiculosCount = await db.getAllAsync('SELECT COUNT(*) as count FROM veiculos');
    console.log('Número de veículos no banco:', veiculosCount[0].count);
    if (veiculosCount[0].count === 0) {
      console.log('Inserindo veículo de teste...');
      // Inserir um veículo de teste
      await db.runAsync(`
        INSERT INTO veiculos (id, tipo, tipoNome, brandId, brandNome, modelId, modelNome, ano, placa) VALUES
        ('teste-1', 'Caminhão', 'Caminhão', '1', 'Mercedes-Benz', '1', 'Sprinter', '2022', 'ABC-1234')
      `);
      console.log('Veículo de teste inserido');
    }
  } catch (error) {
    console.error('Erro ao criar tabela veiculos:', error);
  }

  return db;
}

// Funções para veículos
export async function getVeiculos() {
  try {
    console.log('Executando getVeiculos...');
    const db = await getDatabase();
    console.log('Database obtida:', db);
    const result = await db.getAllAsync('SELECT * FROM veiculos');
    console.log('Resultado da query:', result);
    return result;
  } catch (error) {
    console.error('Erro em getVeiculos:', error);
    throw error;
  }
}

export async function saveVeiculo(veiculo) {
  try {
    console.log('Executando saveVeiculo com dados:', veiculo);
    const db = await getDatabase();
    console.log('Database obtida para salvar');
    await db.runAsync(
      'INSERT INTO veiculos (id, tipo, tipoNome, brandId, brandNome, modelId, modelNome, ano, placa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [veiculo.id, veiculo.tipo, veiculo.tipoNome, veiculo.brandId, veiculo.brandNome, veiculo.modelId, veiculo.modelNome, veiculo.ano, veiculo.placa]
    );
    console.log('Veículo inserido com sucesso');
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