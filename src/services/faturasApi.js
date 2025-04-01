export const getFaturas = async () => {
    const response = await fetch("http://localhost:5000/api/faturas");
    if (!response.ok) {
      throw new Error("Erro ao buscar faturas.");
    }
    return await response.json();
  };
  