// src/services/produtosApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/produtos"; // Ajuste conforme necessário

// Criando instância do Axios com interceptores
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token de autenticação automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Ajuste se precisar de outra fonte de autenticação
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Obtém a lista de produtos.
 * @returns {Promise<Array>} Lista de produtos.
 */
export const getProdutos = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar produtos:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Erro ao buscar produtos.");
  }
};

/**
 * Obtém um produto específico pelo ID.
 * @param {number} produtoId - ID do produto.
 * @returns {Promise<Object>} Produto encontrado.
 */
export const getProdutoById = async (produtoId) => {
  try {
    const response = await api.get(`/${produtoId}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao buscar produto ${produtoId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Erro ao buscar produto.");
  }
};

/**
 * Cria um novo produto.
 * @param {Object} produto - Dados do produto.
 * @returns {Promise<Object>} Produto criado.
 */
export const criarProduto = async (produto) => {
  try {
    const response = await api.post("/", produto);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao criar produto:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Erro ao criar produto.");
  }
};

/**
 * Atualiza o estoque de um produto específico.
 * @param {number} produtoId - ID do produto.
 * @param {number} quantidade - Quantidade a ser adicionada ou removida.
 * @returns {Promise<Object>} Produto atualizado.
 */
export const atualizarEstoque = async (produtoId, quantidade) => {
  try {
    const response = await api.put(`/${produtoId}/atualizar-estoque`, { quantidade });
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao atualizar estoque do produto ${produtoId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Erro ao atualizar estoque.");
  }
};

/**
 * Deleta um produto pelo ID.
 * @param {number} produtoId - ID do produto.
 * @returns {Promise<string>} Mensagem de confirmação.
 */
export const deletarProduto = async (produtoId) => {
  try {
    await api.delete(`/${produtoId}`);
    return `✅ Produto ${produtoId} removido com sucesso!`;
  } catch (error) {
    console.error(`❌ Erro ao deletar produto ${produtoId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Erro ao deletar produto.");
  }
};
