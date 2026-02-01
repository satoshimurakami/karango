import React, { createContext, useState } from 'react';

export const FrotaContext = createContext();

export const FrotaProvider = ({ children }) => {
  const [veiculos, setVeiculos] = useState([]);
  const [manutencoes, setManutencoes] = useState([]);
  const [abastecimentos, setAbastecimentos] = useState([]);

  // Funções para cadastro, edição, remoção
  const addVeiculo = (veiculo) => setVeiculos([...veiculos, veiculo]);
  const updateVeiculo = (id, dados) => setVeiculos(veiculos.map(v => v.id === id ? { ...v, ...dados } : v));
  const removeVeiculo = (id) => setVeiculos(veiculos.filter(v => v.id !== id));

  const addManutencao = (manutencao) => setManutencoes([...manutencoes, manutencao]);
  const addAbastecimento = (abastecimento) => setAbastecimentos([...abastecimentos, abastecimento]);

  return (
    <FrotaContext.Provider value={{
      veiculos,
      manutencoes,
      abastecimentos,
      addVeiculo,
      updateVeiculo,
      removeVeiculo,
      addManutencao,
      addAbastecimento
    }}>
      {children}
    </FrotaContext.Provider>
  );
};
