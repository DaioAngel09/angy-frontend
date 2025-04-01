import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { Bar, Pie } from "react-chartjs-2";
import "./RelatoriosFinanceiros.css";

const RelatoriosFinanceiros = () => {
  const [dados, setDados] = useState({});
  const [filtro, setFiltro] = useState("mensal");

  useEffect(() => {
    fetch(`http://localhost:5000/relatorios?periodo=${filtro}`)
      .then((response) => response.json())
      .then((data) => setDados(data))
      .catch((error) => console.error("Erro ao carregar relatórios:", error));
  }, [filtro]);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  return (
    <div className="relatorios-container">
      <h1>Relatórios Financeiros</h1>

      <div className="filtros">
        <label>Filtrar por período:</label>
        <select value={filtro} onChange={handleFiltroChange}>
          <option value="diario">Diário</option>
          <option value="mensal">Mensal</option>
          <option value="anual">Anual</option>
        </select>
      </div>

      <div className="graficos">
        <div className="grafico-bar">
          <h2>Receitas por Período</h2>
          <Bar
            data={{
              labels: dados.periodos || [],
              datasets: [
                {
                  label: "Receitas (AOA)",
                  data: dados.receitas || [],
                  backgroundColor: "rgba(54, 162, 235, 0.6)",
                },
              ],
            }}
          />
        </div>

        <div className="grafico-pie">
          <h2>Produtos Mais Vendidos</h2>
          <Pie
            data={{
              labels: dados.produtos || [],
              datasets: [
                {
                  label: "Vendas",
                  data: dados.vendas || [],
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                  ],
                },
              ],
            }}
          />
        </div>
      </div>

      <button className="btn-pdf" onClick={() => window.open(`http://localhost:5000/relatorios/pdf?periodo=${filtro}`)}>
        Exportar Relatório em PDF
      </button>
    </div>
  );
};

export default RelatoriosFinanceiros;
