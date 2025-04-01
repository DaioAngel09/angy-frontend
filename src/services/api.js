import axios from "axios";

// 🔹 Definição da base da API
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Função auxiliar para tratar erros corretamente
const handleRequest = async (request) => {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    console.error("❌ Erro na API:", error.response?.data || error.message);

    if (error.response) {
      throw error.response.data || { error: "Erro no servidor." };
    } else if (error.request) {
      throw { error: "Sem resposta do servidor. Verifique a conexão." };
    } else {
      throw { error: "Erro ao configurar a requisição." };
    }
  }
};

/* ========================= */
/* ✅ ROTAS DO DASHBOARD ✅ */
/* ========================= */
export const getEstoque = async () => handleRequest(() => api.get("/estoque"));
export const getProdutos = async () => handleRequest(() => api.get("/produtos"));

/* ========================= */
/* ✅ ROTAS DE PRODUTOS ✅ */
/* ========================= */
export const getProdutoById = async (id) => handleRequest(() => api.get(`/produtos/${id}`));
export const addProduto = async (produto) => handleRequest(() => api.post("/produtos", produto));
export const updateProduto = async (id, produto) => handleRequest(() => api.put(`/produtos/${id}`, produto));
export const deleteProduto = async (id) => handleRequest(() => api.delete(`/produtos/${id}`));

/* ========================= */
/* ✅ ROTAS DE ESTOQUE ✅ */
/* ========================= */
export const updateEstoque = async (id, quantidade, tipo) =>
  handleRequest(() => api.put(`/estoque/${id}/movimentar`, { quantidade, tipo }));

export const getMovimentacoes = async (periodo = "diario") =>
  handleRequest(() => api.get(`/estoque/relatorio?periodo=${periodo}`));

/* ========================= */
/* ✅ ROTAS DE FATURAS ✅ */
/* ========================= */
export const getFaturas = async () => handleRequest(() => api.get("/faturas"));
export const getFaturaById = async (id) => handleRequest(() => api.get(`/faturas/${id}`));
export const addFatura = async (fatura) => handleRequest(() => api.post("/faturas", fatura));
export const deleteFatura = async (id) => handleRequest(() => api.delete(`/faturas/${id}`));

/* ========================= */
/* ✅ ROTAS DE RELATÓRIOS ✅ */
/* ========================= */
export const getRelatorios = async () => handleRequest(() => api.get("/relatorios"));
export const addRelatorio = async (relatorio) => handleRequest(() => api.post("/relatorios", relatorio));

/* ========================= */
/* ✅ ROTAS DE CLIENTES ✅ */
/* ========================= */
export const getClientes = async () => handleRequest(() => api.get("/clientes"));
export const getClienteById = async (id) => handleRequest(() => api.get(`/clientes/${id}`));
export const addCliente = async (cliente) => handleRequest(() => api.post("/clientes", cliente));
export const updateCliente = async (id, cliente) => handleRequest(() => api.put(`/clientes/${id}`, cliente));
export const deleteCliente = async (id) => handleRequest(() => api.delete(`/clientes/${id}`));

export default api;
