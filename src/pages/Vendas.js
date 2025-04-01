import React, { useState, useEffect } from "react";
import { FaPlus, FaEye, FaSpinner } from "react-icons/fa";
import { getVendas, registrarVenda } from "../services/vendasApi";
import { getProdutos, atualizarEstoque } from "../services/produtosApi";
import Modal from "../components/Modal";

const Vendas = () => {
  const [vendas, setVendas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todas");
  const [modalAberto, setModalAberto] = useState(false);
  const [novaVenda, setNovaVenda] = useState({ cliente: "", produtoId: "", quantidade: 1 });
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const vendasData = await getVendas();
      const produtosData = await getProdutos();
      setVendas(vendasData);
      setProdutos(produtosData);
    } catch (err) {
      setErro("❌ Erro ao carregar dados. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  const handleRegistrarVenda = async () => {
    if (!novaVenda.cliente || !novaVenda.produtoId || novaVenda.quantidade <= 0) {
      setMensagem("Preencha todos os campos corretamente.");
      return;
    }

    const produtoSelecionado = produtos.find(p => p.id === parseInt(novaVenda.produtoId));
    if (!produtoSelecionado || produtoSelecionado.estoque < novaVenda.quantidade) {
      setMensagem("Estoque insuficiente para esta venda.");
      return;
    }

    try {
      const vendaCriada = await registrarVenda(novaVenda);
      await atualizarEstoque(novaVenda.produtoId, produtoSelecionado.estoque - novaVenda.quantidade);
      setVendas([...vendas, vendaCriada]);
      setNovaVenda({ cliente: "", produtoId: "", quantidade: 1 });
      setModalAberto(false);
      setMensagem("✅ Venda registrada com sucesso!");
    } catch (err) {
      setMensagem("❌ Erro ao registrar venda.");
    }
  };

  const vendasFiltradas = filtroStatus === "todas"
    ? vendas
    : vendas.filter(venda => venda.status.toLowerCase() === filtroStatus.toLowerCase());

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">🛒 Vendas</h1>
        <button onClick={() => setModalAberto(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
          <FaPlus /> Nova Venda
        </button>
      </div>

      <div className="mb-4 flex items-center">
        <label className="mr-2 font-semibold">Filtrar por status:</label>
        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="p-2 border rounded-lg">
          <option value="todas">Todas</option>
          <option value="pago">Pago</option>
          <option value="pendente">Pendente</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {mensagem && <p className="text-center text-blue-600 bg-blue-100 p-3 rounded">{mensagem}</p>}
      {erro && <p className="text-center text-red-600 bg-red-100 p-3 rounded">{erro}</p>}
      
      {carregando ? (
        <p className="text-center text-gray-600 text-lg flex items-center justify-center gap-2">
          <FaSpinner className="animate-spin" /> Carregando vendas...
        </p>
      ) : vendasFiltradas.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-900 text-white text-lg">
                {["ID", "Cliente", "Data", "Total", "Status", "Ações"].map(header => (
                  <th key={header} className="py-4 px-6">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vendasFiltradas.map(({ id, cliente, data_venda, valor_total, status }) => (
                <tr key={id} className="border-b text-center hover:bg-gray-200 transition">
                  <td className="py-3 px-6">{id}</td>
                  <td className="py-3 px-6">{cliente}</td>
                  <td className="py-3 px-6">{new Date(data_venda).toLocaleDateString()}</td>
                  <td className="py-3 px-6 font-semibold text-green-600">AOA {valor_total}</td>
                  <td className={`py-3 px-6 font-semibold ${status === "pago" ? "text-green-600" : status === "pendente" ? "text-yellow-600" : "text-red-600"}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </td>
                  <td className="py-3 px-6">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (!erro && <p className="text-center text-gray-600 text-lg">Nenhuma venda encontrada.</p>)}

      {modalAberto && (
        <Modal onClose={() => setModalAberto(false)}>
          <h2 className="text-2xl font-bold mb-4">Nova Venda</h2>
          <input type="text" placeholder="Cliente" value={novaVenda.cliente} onChange={(e) => setNovaVenda({ ...novaVenda, cliente: e.target.value })} className="p-2 border w-full rounded mb-3" />
          <select value={novaVenda.produtoId} onChange={(e) => setNovaVenda({ ...novaVenda, produtoId: e.target.value })} className="p-2 border w-full rounded mb-3">
            <option value="">Selecione um produto</option>
            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>{produto.nome} - Estoque: {produto.estoque}</option>
            ))}
          </select>
          <button onClick={handleRegistrarVenda} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-full">Registrar Venda</button>
        </Modal>
      )}
    </div>
  );
};

export default Vendas;
