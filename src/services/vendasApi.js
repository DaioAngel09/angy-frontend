import axios from "axios";

const API_URL = "http://localhost:5000/api/vendas"; // Ajuste conforme necessário

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Obtém todas as vendas do sistema.
 * @returns {Promise<Array>} Lista de vendas.
 */
export const getVendas = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar vendas:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Erro ao buscar vendas.");
  }
};

/**
 * Registra uma nova venda e atualiza o estoque automaticamente.
 * @param {Object} venda - Dados da venda { cliente, produtos, valor_total, status }.
 * @returns {Promise<Object>} Venda registrada.
 */
export const registrarVenda = async (venda) => {
  try {
    // Primeiro, registra a venda no sistema
    const response = await api.post("/", venda);
    const vendaCriada = response.data;

    // Atualiza o estoque automaticamente após a venda
    for (const item of venda.produtos) {
      await atualizarEstoque(item.produto_id, item.quantidade);
    }

    return vendaCriada;
  } catch (error) {
    console.error("❌ Erro ao registrar venda:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Erro ao registrar venda.");
  }
};

/**
 * Atualiza os dados de uma venda existente.
 * @param {number} id - ID da venda a ser atualizada.
 * @param {Object} vendaAtualizada - Novos dados da venda.
 * @returns {Promise<Object>} Venda atualizada.
 */
export const atualizarVenda = async (id, vendaAtualizada) => {
  try {
    const response = await api.put(`/${id}`, vendaAtualizada);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao atualizar venda:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Erro ao atualizar venda.");
  }
};

/**
 * Exclui uma venda do sistema.
 * @param {number} id - ID da venda a ser removida.
 * @returns {Promise<Object>} Confirmação da exclusão.
 */
export const excluirVenda = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao excluir venda:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Erro ao excluir venda.");
  }
};

/**
 * Atualiza o estoque após uma venda.
 * @param {number} produtoId - ID do produto a ser atualizado.
 * @param {number} quantidadeVendida - Quantidade vendida.
 */
const atualizarEstoque = async (produtoId, quantidadeVendida) => {
  try {
    await axios.put(`http://localhost:5000/api/produtos/${produtoId}/atualizar-estoque`, {
      quantidade: -quantidadeVendida, // Reduz o estoque
    });
  } catch (error) {
    console.error(`❌ Erro ao atualizar estoque para o produto ${produtoId}:`, error.response?.data || error.message);
  }
};
