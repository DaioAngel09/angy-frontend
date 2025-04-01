import React, { useState, useEffect } from "react";
import { FaSync, FaCheckCircle, FaTimesCircle, FaClock, FaTruck } from "react-icons/fa";

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    setCarregando(true);
    setErro("");
    try {
      const response = await fetch("http://localhost:5000/pedidos");
      if (!response.ok) throw new Error("Erro ao buscar pedidos.");
      const data = await response.json();
      setPedidos(data);
    } catch (error) {
      console.error(error);
      setErro("❌ Erro ao carregar pedidos. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  // Cores e ícones para status dos pedidos
  const statusClasses = {
    pendente: "text-yellow-600",
    processando: "text-blue-600",
    concluido: "text-green-600",
    cancelado: "text-red-600",
  };

  const statusIcons = {
    pendente: <FaClock />,
    processando: <FaTruck />,
    concluido: <FaCheckCircle />,
    cancelado: <FaTimesCircle />,
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📜 Pedidos</h1>
        <button
          onClick={carregarPedidos}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          <FaSync /> Atualizar
        </button>
      </div>

      {/* Exibição de mensagens */}
      {carregando && <p className="text-center text-gray-600 text-lg">🔄 Carregando pedidos...</p>}
      {erro && <p className="text-center text-red-600">{erro}</p>}

      {/* Tabela de Pedidos */}
      {!carregando && !erro && pedidos.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-900 text-white text-lg">
                {["ID", "Cliente", "Data", "Total (AOA)", "Status"].map((header) => (
                  <th key={header} className="py-4 px-6">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pedidos.map(({ id, cliente, data_pedido, total, status }) => (
                <tr key={id} className="border-b text-center hover:bg-gray-200 transition">
                  <td className="py-3 px-6">{id}</td>
                  <td className="py-3 px-6">{cliente}</td>
                  <td className="py-3 px-6">{new Date(data_pedido).toLocaleDateString()}</td>
                  <td className="py-3 px-6 font-semibold text-green-600">AOA {total.toFixed(2)}</td>
                  <td className={`py-3 px-6 font-semibold flex items-center justify-center gap-2 ${statusClasses[status.toLowerCase()]}`}>
                    {statusIcons[status.toLowerCase()]} {status.charAt(0).toUpperCase() + status.slice(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !carregando && !erro && <p className="text-center text-gray-600 text-lg">Nenhum pedido encontrado.</p>
      )}
    </div>
  );
};

export default Pedidos;
