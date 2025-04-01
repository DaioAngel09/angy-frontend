export const getRelatorioDiario = async () => {
    try {
      const response = await fetch("http://localhost:5000/produtos/relatorio-diario");
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar relatório diário:", error);
      return [];
    }
  };
  