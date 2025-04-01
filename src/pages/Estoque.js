import React, { useState, useEffect } from "react";
import { getProdutos, updateEstoque } from "../services/api";
import { Link } from "react-router-dom";
import { FaPlus, FaMinus, FaSpinner, FaList } from "react-icons/fa";

const Estoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState({});
  const [erro, setErro] = useState(null);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const data = await getProdutos();
      setProdutos(data);

      const movimentosIniciais = {};
      data.forEach((produto) => {
        movimentosIniciais[produto.id] = [];
      });
      setMovimentacoes(movimentosIniciais);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setErro("❌ Não foi possível carregar os produtos.");
    } finally {
      setCarregando(false);
    }
  };

  const handleAtualizarEstoque = async (id, tipo) => {
    const quantidade = parseInt(prompt(`Digite a quantidade para ${tipo}:`), 10);

    if (isNaN(quantidade) || quantidade <= 0) {
      alert("⚠️ Quantidade inválida.");
      return;
    }

    setProcessando((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await updateEstoque(id, quantidade, tipo);
      setMensagem(`✅ ${response.message}`);

      setProdutos((prevProdutos) =>
        prevProdutos.map((produto) =>
          produto.id === id
            ? {
                ...produto,
                estoque: tipo === "entrada" ? produto.estoque + quantidade : produto.estoque - quantidade,
              }
            : produto
        )
      );

      setMovimentacoes((prevMov) => ({
        ...prevMov,
        [id]: [{ tipo, quantidade, data: new Date().toLocaleString() }, ...prevMov[id]],
      }));
    } catch (error) {
      console.error("Erro ao atualizar estoque:", error);
      setMensagem("❌ Erro ao atualizar estoque.");
    } finally {
      setProcessando((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center p-8" style={{ backgroundImage: "url('/assets/background.jpg')" }}>
      <h1 className="text-4xl font-bold mb-6 text-center text-white bg-black bg-opacity-50 p-4 rounded-md">📦 Controle de Estoque</h1>

      {/* 🔹 Exibir mensagens */}
      {mensagem && <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded text-center">{mensagem}</div>}
      {erro && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded text-center">{erro}</div>}

      {carregando ? (
        <p className="text-center text-white text-lg">🔄 Carregando produtos...</p>
      ) : (
        <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-900 text-white text-lg">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Nome</th>
                <th className="py-4 px-6">Estoque</th>
                <th className="py-4 px-6">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.length > 0 ? (
                produtos.map((produto) => (
                  <React.Fragment key={produto.id}>
                    <tr className="border-b text-center hover:bg-gray-200 transition">
                      <td className="py-3 px-6">{produto.id}</td>
                      <td className="py-3 px-6">{produto.nome}</td>
                      <td className={`py-3 px-6 font-semibold ${produto.estoque > 10 ? "text-blue-700" : "text-red-700"}`}>
                        {produto.estoque}
                      </td>
                      <td className="py-3 px-6 flex justify-center space-x-3">
                        <button
                          onClick={() => handleAtualizarEstoque(produto.id, "entrada")}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                          disabled={processando[produto.id]}
                        >
                          {processando[produto.id] ? <FaSpinner className="animate-spin" /> : <FaPlus />} Adicionar
                        </button>
                        <button
                          onClick={() => handleAtualizarEstoque(produto.id, "saida")}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                          disabled={processando[produto.id]}
                        >
                          {processando[produto.id] ? <FaSpinner className="animate-spin" /> : <FaMinus />} Remover
                        </button>
                      </td>
                    </tr>
                    {movimentacoes[produto.id]?.length > 0 && (
                      <tr>
                        <td colSpan="4">
                          <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                              <FaList className="inline-block mr-2" /> Movimentações de {produto.nome}
                            </h3>
                            <table className="w-full text-sm bg-white border border-gray-200 rounded-lg">
                              <thead>
                                <tr className="bg-gray-300">
                                  <th className="py-2 px-4">Tipo</th>
                                  <th className="py-2 px-4">Quantidade</th>
                                  <th className="py-2 px-4">Data</th>
                                </tr>
                              </thead>
                              <tbody>
                                {movimentacoes[produto.id].map((mov, index) => (
                                  <tr key={index} className="border-b text-center">
                                    <td className={`py-2 px-4 ${mov.tipo === "entrada" ? "text-green-600" : "text-red-600"}`}>
                                      {mov.tipo === "entrada" ? "Entrada" : "Saída"}
                                    </td>
                                    <td className="py-2 px-4">{mov.quantidade}</td>
                                    <td className="py-2 px-4">{mov.data}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500 text-lg">Nenhum produto encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔹 Botão de Gerenciar Produtos */}
      <div className="text-center mt-6">
        <Link to="/dashboard/produtos">
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">🔄 Gerenciar Produtos</button>
        </Link>
      </div>
    </div>
  );
};

export default Estoque;
