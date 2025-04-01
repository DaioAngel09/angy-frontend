import axios from "axios";
import API_BASE_URL from "../config/api";

// Função para buscar os produtos do estoque
export const fetchProdutos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/produtos`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
};

// Função para adicionar um produto
export const adicionarProduto = async (produto) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/produtos`, produto);
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
    return null;
  }
};

// Função para movimentar o estoque (entrada/saída)
export const movimentarEstoque = async (id, quantidade, tipo) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/estoque/movimentar`, {
      id,
      quantidade,
      tipo,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao movimentar estoque:", error);
    return null;
  }
};
