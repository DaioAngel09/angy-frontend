import React, { useState, useEffect } from "react";
import { getFaturas } from "../services/faturasApi";
import { FaEye, FaSync, FaSpinner } from "react-icons/fa";

const Faturas = () => {
  const [faturas, setFaturas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todas");

  useEffect(() => {
    carregarFaturas();
  }, []);

  const carregarFaturas = async () => {
    setProcessando(true);
    setErro("");
    try {
      const data = await getFaturas();
      if (!Array.isArray(data)) {
        throw new Error("Dados inválidos recebidos");
      }
      setFaturas(data);
    } catch (err) {
      console.error("Erro ao buscar faturas:", err);
      setErro("❌ Erro ao carregar faturas. Tente novamente.");
    } finally {
      setProcessando(false);
      setCarregando(false);
    }
  };

  const formatarData = (data) => {
    return data ? new Date(data).toLocaleDateString() : "N/A";
  };

  // Filtragem de faturas pelo status
  const faturasFiltradas =
    filtroStatus === "todas"
      ? faturas
      : faturas.filter((fatura) => fatura.status.toLowerCase() === filtroStatus.toLowerCase());

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">📄 Faturas</h1>
        <button
          onClick={carregarFaturas}
          disabled={processando}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {processando ? <FaSpinner className="animate-spin" /> : <FaSync />} Atualizar
        </button>
      </div>

      {/* Filtro de status */}
      <div className="mb-4 flex items-center">
        <label className="mr-2 font-semibold">Filtrar por status:</label>
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="todas">Todas</option>
          <option value="pago">Pago</option>
          <option value="pendente">Pendente</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {/* Exibição de mensagens */}
      {erro && <p className="text-center text-red-600 bg-red-100 p-3 rounded">{erro}</p>}

      {carregando ? (
        <p className="text-center text-gray-600 text-lg flex items-center justify-center gap-2">
          <FaSpinner className="animate-spin" /> Carregando faturas...
        </p>
      ) : faturasFiltradas.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-900 text-white text-lg">
                {["ID", "Pedido", "Cliente", "Data", "Total", "Status", "Ações"].map((header) => (
                  <th key={header} className="py-4 px-6">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {faturasFiltradas.map(({ id, pedido_id, cliente, data_fatura, valor_total, status }) => (
                <tr key={id} className="border-b text-center hover:bg-gray-200 transition">
                  <td className="py-3 px-6">{id}</td>
                  <td className="py-3 px-6">{pedido_id}</td>
                  <td className="py-3 px-6">{cliente}</td>
                  <td className="py-3 px-6">{formatarData(data_fatura)}</td>
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
      ) : (
        !erro && <p className="text-center text-gray-600 text-lg">Nenhuma fatura encontrada.</p>
      )}
    </div>
  );
};

export default Faturas;
