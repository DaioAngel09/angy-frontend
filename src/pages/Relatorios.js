import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMovimentacoes } from "../services/relatoriosApi";
import { FaSpinner, FaSearch, FaCalendarAlt, FaArrowLeft, FaSync } from "react-icons/fa";

const Relatorios = () => {
  const navigate = useNavigate();
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [periodo, setPeriodo] = useState("diario");
  const [horaAtual, setHoraAtual] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    carregarMovimentacoes();
    const interval = setInterval(() => {
      carregarMovimentacoes();
      setHoraAtual(new Date().toLocaleTimeString());
    }, 10000); // Atualiza a cada 10 segundos
    return () => clearInterval(interval);
  }, [periodo]);

  const carregarMovimentacoes = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const data = await getMovimentacoes(periodo);
      setMovimentacoes(data || []);
    } catch (error) {
      console.error("Erro ao buscar movimentações:", error);
      setErro("❌ Não foi possível carregar os relatórios.");
    } finally {
      setCarregando(false);
    }
  };

  const movimentacoesFiltradas = movimentacoes.filter((mov) =>
    mov.produto?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md p-6 rounded-lg">
        {/* 🔹 Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📊 Relatórios de Movimentação</h1>
          <div className="text-gray-600 text-lg font-semibold">🕒 {horaAtual}</div>
          <button 
            onClick={() => navigate("/dashboard")} 
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition"
          >
            <FaArrowLeft /> Voltar
          </button>
        </div>

        {/* 🔹 Filtros e Pesquisa */}
        <div className="flex flex-wrap gap-4 bg-gray-50 p-4 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-gray-600" />
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="diario">📅 Diário</option>
              <option value="semanal">📆 Semanal</option>
              <option value="mensal">📊 Mensal</option>
            </select>
          </div>

          <div className="flex items-center gap-3 border p-2 rounded-lg bg-white shadow-sm">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Buscar produto..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="outline-none bg-transparent"
            />
          </div>

          <button 
            onClick={carregarMovimentacoes}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            disabled={carregando}
          >
            {carregando ? <FaSpinner className="animate-spin" /> : <FaSync />} Atualizar
          </button>
        </div>

        {/* 🔹 Exibir mensagens */}
        {erro && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded text-center">
            {erro}
          </div>
        )}

        {carregando ? (
          <p className="text-center text-gray-600 text-lg flex items-center justify-center gap-2 mt-6">
            <FaSpinner className="animate-spin" /> Carregando movimentações...
          </p>
        ) : movimentacoesFiltradas.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-6">📉 Nenhuma movimentação encontrada.</p>
        ) : (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-900 text-white text-lg">
                  <th className="py-4 px-6">Produto</th>
                  <th className="py-4 px-6">Tipo</th>
                  <th className="py-4 px-6">Quantidade</th>
                  <th className="py-4 px-6">Usuário</th>
                  <th className="py-4 px-6">Data</th>
                </tr>
              </thead>
              <tbody>
                {movimentacoesFiltradas.map((mov) => (
                  <tr key={mov.id} className="border-b text-center hover:bg-gray-200 transition">
                    <td className="py-3 px-6">{mov.produto}</td>
                    <td className={`py-3 px-6 font-semibold ${mov.tipo === "entrada" ? "text-green-600" : "text-red-600"}`}>
                      {mov.tipo}
                    </td>
                    <td className="py-3 px-6">{mov.quantidade}</td>
                    <td className="py-3 px-6">{mov.usuario}</td>
                    <td className="py-3 px-6">{mov.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Relatorios;
