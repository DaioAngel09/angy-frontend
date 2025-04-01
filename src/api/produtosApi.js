import axios from "axios";

const API_URL = "http://localhost:5000/produtos";

// ✅ Buscar todos os produtos
export const getProdutos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
};

// ✅ Adicionar um novo produto
export const addProduto = async (produto) => {
  try {
    await axios.post(API_URL, produto);
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
  }
};

// ✅ Remover um produto pelo ID
export const deleteProduto = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Erro ao remover produto:", error);
  }
};

// ✅ Atualizar estoque do produto
export const updateEstoque = async (id, estoque) => {
  try {
    await axios.put(`${API_URL}/${id}/estoque`, { estoque });
  } catch (error) {
    console.error("Erro ao atualizar estoque:", error);
  }
};
