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

    // Criar tabela manutencoes
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS manutencoes (
        id TEXT PRIMARY KEY,
        tipoServico TEXT,
        veiculo TEXT,
        dataPrevista TEXT,
        urgencia TEXT,
        prestador TEXT,
        custo TEXT,
        km TEXT
      );
    `);

    // Criar tabela abastecimentos
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS abastecimentos (
        id TEXT PRIMARY KEY,
        veiculoId TEXT NOT NULL,
        veiculoPlaca TEXT,
        quantidade REAL NOT NULL,
        valorTotal REAL NOT NULL,
        valorLitro REAL,
        data TEXT NOT NULL,
        km REAL,
        posto TEXT,
        tipoCombustivel TEXT,
        observacoes TEXT,
        FOREIGN KEY (veiculoId) REFERENCES veiculos(id) ON DELETE CASCADE
      );
    `);
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
    db.getAllAsync('SELECT DISTINCT vehicleType FROM brands ORDER BY vehicleType ASC').then(rows => {
      return rows.map(row => row.vehicleType).filter(t => t !== null && t !== '');
    })
  );
}

export function getBrandsByType(tipo) {
  return getDb().then(db => 
    db.getAllAsync(
      'SELECT brandId, name FROM brands WHERE vehicleType = ? ORDER BY name ASC',
      [tipo]
    )
  );
}

export function getModelsByBrand(idMarca) {
  return getDb().then(db => {
    return db.getAllAsync(
      'SELECT id, name FROM models WHERE brandId = ? ORDER BY name ASC',
      [idMarca]
    );
  });
}

// Maintenance CRUD
export async function getManutencoes() {
  const db = await getDb();
  return await db.getAllAsync('SELECT * FROM manutencoes ORDER BY dataPrevista ASC');
}

export async function saveManutencao(m) {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO manutencoes (id, tipoServico, veiculo, dataPrevista, urgencia, prestador, custo, km) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [m.id, m.tipoServico, m.veiculo, m.dataPrevista, m.urgencia, m.prestador, m.custo, m.km]
  );
}

export async function updateManutencaoDB(id, d) {
  const db = await getDb();
  await db.runAsync(
    'UPDATE manutencoes SET tipoServico = ?, veiculo = ?, dataPrevista = ?, urgencia = ?, prestador = ?, custo = ?, km = ? WHERE id = ?',
    [d.tipoServico, d.veiculo, d.dataPrevista, d.urgencia, d.prestador, d.custo, d.km, id]
  );
}

export async function deleteManutencao(id) {
  const db = await getDb();
  await db.runAsync('DELETE FROM manutencoes WHERE id = ?', [id]);
}

// Abastecimentos CRUD
export async function getAbastecimentos() {
  const db = await getDb();
  return await db.getAllAsync('SELECT * FROM abastecimentos ORDER BY data DESC');
}

export async function getAbastecimentosByVeiculo(veiculoId) {
  const db = await getDb();
  return await db.getAllAsync(
    'SELECT * FROM abastecimentos WHERE veiculoId = ? ORDER BY data DESC',
    [veiculoId]
  );
}

export async function saveAbastecimento(a) {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO abastecimentos (id, veiculoId, veiculoPlaca, quantidade, valorTotal, valorLitro, data, km, posto, tipoCombustivel, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [a.id, a.veiculoId, a.veiculoPlaca, a.quantidade, a.valorTotal, a.valorLitro, a.data, a.km, a.posto, a.tipoCombustivel, a.observacoes]
  );
}

export async function updateAbastecimentoDB(id, d) {
  const db = await getDb();
  await db.runAsync(
    'UPDATE abastecimentos SET veiculoId = ?, veiculoPlaca = ?, quantidade = ?, valorTotal = ?, valorLitro = ?, data = ?, km = ?, posto = ?, tipoCombustivel = ?, observacoes = ? WHERE id = ?',
    [d.veiculoId, d.veiculoPlaca, d.quantidade, d.valorTotal, d.valorLitro, d.data, d.km, d.posto, d.tipoCombustivel, d.observacoes, id]
  );
}

export async function deleteAbastecimento(id) {
  const db = await getDb();
  await db.runAsync('DELETE FROM abastecimentos WHERE id = ?', [id]);
}
