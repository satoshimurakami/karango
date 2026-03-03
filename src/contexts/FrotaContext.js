import React, { createContext, useState, useEffect } from 'react';
import { 
  getVeiculos, saveVeiculo, updateVeiculoDB, deleteVeiculo,
  getManutencoes, saveManutencao, updateManutencaoDB, deleteManutencao 
} from '../database2';

export const FrotaContext = createContext();

export const FrotaProvider = ({ children }) => {
  const [veiculos, setVeiculos] = useState([]);
  const [manutencoes, setManutencoes] = useState([]);
  const [abastecimentos, setAbastecimentos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados do SQLite ao iniciar
  useEffect(() => {
    (async () => {
      try {
        const [veiculosFromDB, manutencoesFromDB] = await Promise.all([
          getVeiculos(),
          getManutencoes()
        ]);
        setVeiculos(veiculosFromDB);
        setManutencoes(manutencoesFromDB);
      } catch (error) {
        console.error('Erro ao carregar dados do banco:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Adicionar veículo (persiste no SQLite)
  const addVeiculo = async (veiculo) => {
    try {
      await saveVeiculo(veiculo);
      setVeiculos(prev => [veiculo, ...prev]);
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
      throw error;
    }
  };

  // Atualizar veículo (persiste no SQLite)
  const updateVeiculo = async (id, dados) => {
    try {
      await updateVeiculoDB(id, dados);
      setVeiculos(prev => prev.map(v => v.id === id ? { ...v, ...dados } : v));
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      throw error;
    }
  };

  // Remover veículo (remove do SQLite)
  const removeVeiculo = async (id) => {
    try {
      await deleteVeiculo(id);
      setVeiculos(prev => prev.filter(v => v.id !== id));
    } catch (error) {
      console.error('Erro ao remover veículo:', error);
      throw error;
    }
  };

  const addManutencao = async (manutencao) => {
    try {
      await saveManutencao(manutencao);
      setManutencoes(prev => [...prev, manutencao]);
    } catch (error) {
      console.error('Erro ao salvar manutenção:', error);
      throw error;
    }
  };

  const updateManutencao = async (id, dados) => {
    try {
      await updateManutencaoDB(id, dados);
      setManutencoes(prev => prev.map(m => m.id === id ? { ...m, ...dados } : m));
    } catch (error) {
      console.error('Erro ao atualizar manutenção:', error);
      throw error;
    }
  };

  const removeManutencao = async (id) => {
    try {
      await deleteManutencao(id);
      setManutencoes(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Erro ao remover manutenção:', error);
      throw error;
    }
  };

  const addAbastecimento = (abastecimento) => setAbastecimentos([...abastecimentos, abastecimento]);

  return (
    <FrotaContext.Provider value={{
      veiculos,
      manutencoes,
      abastecimentos,
      loading,
      addVeiculo,
      updateVeiculo,
      removeVeiculo,
      addManutencao,
      updateManutencao,
      removeManutencao,
      addAbastecimento
    }}>
      {children}
    </FrotaContext.Provider>
  );
};
