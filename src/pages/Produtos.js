import React, { useState, useEffect } from "react";
import { getProdutos, addProduto, deleteProduto, updateEstoque } from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaEdit, FaArrowLeft, FaSpinner } from "react-icons/fa";

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({ nome: "", descricao: "", preco: "", estoque: "" });
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    setCarregando(true);
    try {
      const produtosData = await getProdutos();
      setProdutos(produtosData);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setMensagem("❌ Erro ao carregar produtos. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  const handleAdicionarProduto = async () => {
    if (!novoProduto.nome || !novoProduto.descricao || !novoProduto.preco || !novoProduto.estoque) {
      setMensagem("⚠️ Preencha todos os campos obrigatórios!");
      return;
    }

    if (processando) return;
    setProcessando(true);

    try {
      await addProduto(novoProduto);
      setMensagem("✅ Produto adicionado com sucesso!");
      setNovoProduto({ nome: "", descricao: "", preco: "", estoque: "" });
      carregarProdutos();
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      setMensagem("❌ Erro ao adicionar produto.");
    } finally {
      setProcessando(false);
    }
  };

  const handleRemoverProduto = async (id) => {
    if (!window.confirm("⚠️ Tem certeza que deseja remover este produto?")) return;

    setProcessando(true);
    try {
      await deleteProduto(id);
      setMensagem("🗑️ Produto removido com sucesso!");
      setProdutos(produtos.filter((produto) => produto.id !== id));
    } catch (error) {
      console.error("Erro ao remover produto:", error);
      setMensagem("❌ Erro ao remover produto.");
    } finally {
      setProcessando(false);
    }
  };

  const handleAtualizarEstoque = async (id, estoque) => {
    const novoEstoque = parseInt(prompt("Digite o novo estoque:", estoque), 10);
    if (!isNaN(novoEstoque) && novoEstoque >= 0) {
      setProcessando(true);
      try {
        await updateEstoque(id, novoEstoque);
        setMensagem("🔄 Estoque atualizado com sucesso!");
        setProdutos(
          produtos.map((produto) =>
            produto.id === id ? { ...produto, estoque: novoEstoque } : produto
          )
        );
      } catch (error) {
        console.error("Erro ao atualizar estoque:", error);
        setMensagem("❌ Erro ao atualizar estoque.");
      } finally {
        setProcessando(false);
      }
    } else {
      setMensagem("⚠️ Valor inválido para o estoque.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        📦 Gerenciamento de Produtos
      </h1>
      {mensagem && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 border border-blue-300 rounded text-center">
          {mensagem}
        </div>
      )}

      {/* Formulário de Adicionar Produto */}
      <div className="mb-6 p-6 bg-white rounded-lg shadow-xl border">
        <h2 className="text-xl font-semibold mb-4">➕ Adicionar Novo Produto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {["nome", "descricao", "preco", "estoque"].map((campo) => (
            <input
              key={campo}
              type={campo === "preco" || campo === "estoque" ? "number" : "text"}
              placeholder={`${campo.charAt(0).toUpperCase() + campo.slice(1)} *`}
              value={novoProduto[campo]}
              onChange={(e) => setNovoProduto({ ...novoProduto, [campo]: e.target.value })}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
        <button
          onClick={handleAdicionarProduto}
          disabled={processando}
          className="mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {processando ? <FaSpinner className="animate-spin" /> : <FaPlus />} Adicionar Produto
        </button>
      </div>

      {/* Lista de Produtos */}
      {carregando ? (
        <p className="text-center text-gray-600 text-lg">🔄 Carregando produtos...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-xl rounded-lg">
            <thead>
              <tr className="bg-gray-900 text-white text-lg">
                {["ID", "Nome", "Descrição", "Preço (AOA)", "Estoque", "Ações"].map((header) => (
                  <th key={header} className="py-4 px-6">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {produtos.length > 0 ? (
                produtos.map(({ id, nome, descricao, preco, estoque }) => (
                  <tr key={id} className="border-b text-center hover:bg-gray-200 transition">
                    <td className="py-3 px-6">{id}</td>
                    <td className="py-3 px-6">{nome}</td>
                    <td className="py-3 px-6">{descricao}</td>
                    <td className="py-3 px-6 font-semibold text-green-600">AOA {preco}</td>
                    <td className="py-3 px-6">{estoque}</td>
                    <td className="py-3 px-6 flex justify-center space-x-3">
                      <button
                        onClick={() => handleAtualizarEstoque(id, estoque)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleRemoverProduto(id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        disabled={processando}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500 text-lg">Nenhum produto encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Botão de Voltar */}
      <div className="text-center mt-6">
        <button onClick={() => navigate("/dashboard")} className="px-6 py-3 flex items-center justify-center gap-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition">
          <FaArrowLeft /> Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
};

export default Produtos;
