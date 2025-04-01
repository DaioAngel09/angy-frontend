import React, { useState, useEffect } from "react";
import { getClientes, adicionarCliente, removerCliente } from "../services/clientesApi";
import { FaUserPlus, FaTrash, FaSpinner } from "react-icons/fa";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [novoCliente, setNovoCliente] = useState({ nome: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarClientes();
  }, []);

  // 🔹 Buscar clientes no Firestore
  const carregarClientes = async () => {
    setLoading(true);
    setErro(null);
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      setErro("❌ Erro ao carregar clientes. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Adicionar novo cliente
  const handleAdicionarCliente = async () => {
    if (!novoCliente.nome || !novoCliente.email) {
      setMensagem("⚠️ Preencha todos os campos obrigatórios!");
      return;
    }

    setProcessando(true);
    try {
      const clienteAdicionado = await adicionarCliente(novoCliente);
      setClientes([...clientes, clienteAdicionado]);
      setMensagem("✅ Cliente adicionado com sucesso!");
      setNovoCliente({ nome: "", email: "" });
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      setErro("❌ Erro ao adicionar cliente.");
    } finally {
      setProcessando(false);
    }
  };

  // 🔹 Remover cliente
  const handleRemoverCliente = async (id) => {
    if (!window.confirm("⚠️ Tem certeza que deseja remover este cliente?")) return;

    setProcessando(id);
    try {
      await removerCliente(id);
      setClientes(clientes.filter((cliente) => cliente.id !== id));
      setMensagem("🗑️ Cliente removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover cliente:", error);
      setErro("❌ Erro ao remover cliente.");
    } finally {
      setProcessando(null);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">📋 Gestão de Clientes</h1>

      {/* Exibir mensagens */}
      {mensagem && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded text-center">
          {mensagem}
        </div>
      )}
      {erro && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded text-center">
          {erro}
        </div>
      )}

      {/* Formulário de Cadastro */}
      <div className="mb-6 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Adicionar Novo Cliente</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Nome"
            value={novoCliente.nome}
            onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })}
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={novoCliente.email}
            onChange={(e) => setNovoCliente({ ...novoCliente, email: e.target.value })}
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAdicionarCliente}
            disabled={processando}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {processando ? <FaSpinner className="animate-spin" /> : <FaUserPlus />} Adicionar
          </button>
        </div>
      </div>

      {/* Lista de Clientes */}
      {loading ? (
        <p className="text-center text-gray-600 text-lg">🔄 Carregando clientes...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-900 text-white text-lg">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Nome</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <tr key={cliente.id} className="border-b text-center hover:bg-gray-200 transition">
                    <td className="py-3 px-6">{cliente.id}</td>
                    <td className="py-3 px-6">{cliente.nome}</td>
                    <td className="py-3 px-6">{cliente.email}</td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => handleRemoverCliente(cliente.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                        disabled={processando === cliente.id}
                      >
                        {processando === cliente.id ? <FaSpinner className="animate-spin" /> : <FaTrash />} Remover
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500 text-lg">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Clientes;
