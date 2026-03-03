import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

let dbPromise = null;

async function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      await loadDatabase();
      const db = await SQLite.openDatabaseAsync('database.sqlite');
      await initDatabase(db);
      return db;
    })();
  }
  return dbPromise;
}

async function loadDatabase() {
  const dbName = 'database.sqlite';
  const dbDir = `${FileSystem.documentDirectory}SQLite`;
  const dbPath = `${dbDir}/${dbName}`;

  try {
    const dbDirInfo = await FileSystem.getInfoAsync(dbDir);
    if (!dbDirInfo.exists) {
      console.log('[DB] Creating SQLite directory...');
      await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });
    }

    const fileInfo = await FileSystem.getInfoAsync(dbPath);
    
    // Se o arquivo existe mas o carregamento falhou antes, ou se queremos garantir que o banco está certo
    // No log anterior vimos Brands: 5, Models: 15, o que indica um banco incompleto ou de teste.
    let shouldCopy = !fileInfo.exists;
    
    if (fileInfo.exists) {
      // Pequena verificação: se o arquivo for muito pequeno (menos de 50KB), provavelmente está vazio/errado
      // O banco com 10k registros deve ter alguns MBs.
      if (fileInfo.size < 50000) { 
        console.log('[DB] Existing database is too small. Forcing re-copy...');
        await FileSystem.deleteAsync(dbPath, { idempotent: true });
        shouldCopy = true;
      }
    }

    if (shouldCopy) {
      console.log('[DB] Copying database from assets...');
      const asset = Asset.fromModule(require('../assets/db/database.sqlite'));
      await asset.downloadAsync();
      await FileSystem.copyAsync({
        from: asset.localUri,
        to: dbPath,
      });
      console.log('[DB] Database copied successfully!');
    } else {
      console.log('[DB] Database already exists and looks valid.');
    }
  } catch (error) {
    console.error('[DB] Error loading database from assets:', error);
  }
}

async function initDatabase(db) {
  try {
    // Criar tabela brands se não existir
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS brands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        vehicleType TEXT,
        brandId INTEGER
      );
    `);
    
    // Criar tabela models se não existir
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS models (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        brandId INTEGER NOT NULL,
        vehicleType TEXT,
        modelId INTEGER,
        FOREIGN KEY (brandId) REFERENCES brands(id)
      );
    `);

    // Criar tabela veiculos para os cadastros do usuário
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS veiculos (
        id TEXT PRIMARY KEY,
        tipo TEXT,
        tipoNome TEXT,
        brandId INTEGER,
        brandNome TEXT,
        modelId TEXT,
        modelNome TEXT,
        ano TEXT,
        placa TEXT
      );
    `);
    // Log counts to verify
    const brandsCount = await db.getFirstAsync('SELECT COUNT(*) as count FROM brands');
    const modelsCount = await db.getFirstAsync('SELECT COUNT(*) as count FROM models');
    console.log(`[DB] Initialization complete. Brands: ${brandsCount.count}, Models: ${modelsCount.count}`);
    
    // Debug schema
    const brandsColumns = await db.getAllAsync('PRAGMA table_info(brands)');
    const modelsColumns = await db.getAllAsync('PRAGMA table_info(models)');
    console.log('[DB] Brands columns:', brandsColumns.map(c => c.name).join(', '));
    console.log('[DB] Models columns:', modelsColumns.map(c => c.name).join(', '));

    const brandSample = await db.getFirstAsync('SELECT * FROM brands LIMIT 1');
    const modelSample = await db.getFirstAsync('SELECT * FROM models LIMIT 1');
    console.log('[DB] Brand sample:', JSON.stringify(brandSample));
    console.log('[DB] Model sample:', JSON.stringify(modelSample));
  } catch (error) {
    console.log('Erro ao inicializar banco:', error);
  }
}

export async function getVeiculos() {
  const db = await getDb();
  return await db.getAllAsync('SELECT * FROM veiculos ORDER BY id DESC');
}

export async function saveVeiculo(veiculo) {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO veiculos (id, tipo, tipoNome, brandId, brandNome, modelId, modelNome, ano, placa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [veiculo.id, veiculo.tipo, veiculo.tipoNome, veiculo.brandId, veiculo.brandNome, veiculo.modelId, veiculo.modelNome, veiculo.ano, veiculo.placa]
  );
}

export async function updateVeiculoDB(id, dados) {
  const db = await getDb();
  await db.runAsync(
    'UPDATE veiculos SET tipo = ?, tipoNome = ?, brandId = ?, brandNome = ?, modelId = ?, modelNome = ?, ano = ?, placa = ? WHERE id = ?',
    [dados.tipo, dados.tipoNome, dados.brandId, dados.brandNome, dados.modelId, dados.modelNome, dados.ano, dados.placa, id]
  );
}

export async function deleteVeiculo(id) {
  const db = await getDb();
  await db.runAsync('DELETE FROM veiculos WHERE id = ?', [id]);
}

export function getVehicleTypes() {
  return getDb().then(db => 
    db.getAllAsync('SELECT DISTINCT vehicleType FROM brands').then(rows => {
      console.log('[DB] Raw vehicle types rows:', JSON.stringify(rows));
      const types = rows.map(row => row.vehicleType).filter(t => t !== null && t !== '');
      console.log('[DB] Processed vehicle types:', types);
      return types;
    })
  );
}

export function getBrandsByType(tipo) {
  return getDb().then(db => 
    db.getAllAsync(
      'SELECT brandId, name FROM brands WHERE vehicleType = ?',
      [tipo]
    )
  );
}

export function getModelsByBrand(idMarca) {
  return getDb().then(db => {
    console.log('[DB] Fetching models for brandId:', idMarca);
    return db.getAllAsync(
      'SELECT id, name FROM models WHERE brandId = ?',
      [idMarca]
    ).then(rows => {
      console.log(`[DB] Models found for brand ${idMarca}:`, rows.length);
      return rows;
    });
  });
}
