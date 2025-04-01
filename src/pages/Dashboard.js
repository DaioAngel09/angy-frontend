import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEstoque, getProdutos } from "../services/api";
import { logout } from "../services/auth";
import { 
  FaBox, FaSync, FaCube, FaClipboardList, FaWarehouse, 
  FaSignOutAlt, FaUser, FaChartPie, FaFileInvoice, FaCashRegister, FaChartBar, FaCog 
} from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const navigate = useNavigate();
  const [estoque, setEstoque] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [atualizando, setAtualizando] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    carregarDados();
    const interval = setInterval(carregarDados, 100000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUsuario(userData);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const carregarDados = async () => {
    setCarregando(true);
    setErro("");
    setAtualizando(true);

    try {
      const [estoqueData, produtosData] = await Promise.all([getEstoque(), getProdutos()]);
      if (!Array.isArray(estoqueData) || !Array.isArray(produtosData)) {
        throw new Error("Erro ao carregar os dados.");
      }
      setEstoque(estoqueData || []);
      setProdutos(produtosData || []);
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      setErro("❌ Falha ao carregar os dados.");
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("user");
    navigate("/login");
  };

  const estoqueChartData = {
    labels: produtos.map((produto) => produto.nome),
    datasets: [
      {
        label: "Estoque Atual",
        data: produtos.map((produto) => produto.estoque),
        backgroundColor: ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0", "#F44336"],
        borderColor: "rgba(255, 255, 255, 0.8)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard-container min-h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('/assets/background.jpg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 p-6">
        <header className="dashboard-header flex justify-between items-center p-4 bg-gray-900 text-white rounded-lg shadow-lg">
          <div className="user-info flex items-center gap-3">
            <FaUser className="text-xl" />
            {usuario ? (
              <p className="text-lg">
                <strong>{usuario.nome}</strong> - {usuario.role === "admin" ? "Administrador" : usuario.role === "vendedor" ? "Vendedor" : "Estoquista"}
              </p>
            ) : (
              <p>Carregando usuário...</p>
            )}
          </div>
          <h1 className="text-2xl font-bold">📊 Pagina Inicial Elsa Estoque</h1>
          <div className="flex gap-4">
            <button onClick={carregarDados} className="bg-blue-500 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-600 transition" disabled={atualizando}>
              <FaSync className={atualizando ? "animate-spin" : ""} /> Atualizar
            </button>
            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-600 transition">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>

        {erro && <div className="error-message text-red-600 text-center py-3">{erro}</div>}

        <div className="buttons-container flex justify-center gap-6 my-6 flex-wrap">
          <button onClick={() => navigate("/dashboard/produtos")} className="bg-green-500 text-white px-5 py-3 rounded-md flex items-center gap-2 hover:bg-green-600 transition">
            <FaClipboardList /> Gerenciar Produtos
          </button>
          <button onClick={() => navigate("/dashboard/estoque")} className="bg-yellow-500 text-white px-5 py-3 rounded-md flex items-center gap-2 hover:bg-yellow-600 transition">
            <FaWarehouse /> Gerenciar Estoque
          </button>
          <button onClick={() => navigate("/dashboard/emitir-fatura")} className="bg-purple-500 text-white px-5 py-3 rounded-md flex items-center gap-2 hover:bg-purple-600 transition">
            <FaFileInvoice /> Emitir Fatura
          </button>
          <button onClick={() => navigate("/dashboard/faturas")} className="bg-indigo-500 text-white px-5 py-3 rounded-md flex items-center gap-2 hover:bg-indigo-600 transition">
            <FaBox /> Faturas
          </button>
          <button onClick={() => navigate("/dashboard/vendas")} className="bg-teal-500 text-white px-5 py-3 rounded-md flex items-center gap-2 hover:bg-teal-600 transition">
            <FaCashRegister /> Vendas
          </button>
          <button onClick={() => navigate("/dashboard/relatorios")} className="bg-blue-700 text-white px-5 py-3 rounded-md flex items-center gap-2 hover:bg-blue-800 transition">
            <FaChartBar /> Relatórios
          </button>
          <button onClick={() => navigate("/dashboard/configuracoes")} className="bg-gray-600 text-white px-5 py-3 rounded-md flex items-center gap-2 hover:bg-gray-700 transition">
            <FaCog /> Configurações
          </button>
        </div>

        {!carregando && (
          <div className="charts-container max-w-5xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Grafico Estoque Atual</h2>
            <Pie data={estoqueChartData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
