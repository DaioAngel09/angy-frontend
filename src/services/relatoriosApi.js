export const getMovimentacoes = async () => {
    const response = await fetch("http://localhost:5000/api/relatorios");
    if (!response.ok) {
      throw new Error("Erro ao buscar movimentações.");
    }
    return await response.json();
  };
  