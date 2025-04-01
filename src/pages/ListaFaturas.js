import React, { useEffect, useState } from "react";
import "./ListaFaturas.css";

const ListaFaturas = () => {
  const [faturas, setFaturas] = useState([]);
  const [detalhes, setDetalhes] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/faturas")
      .then((response) => response.json())
      .then((data) => setFaturas(data))
      .catch((error) => console.error("Erro ao carregar faturas:", error));
  }, []);

  const handleVerDetalhes = (id) => {
    fetch(`http://localhost:5000/faturas/${id}`)
      .then((response) => response.json())
      .then((data) => setDetalhes(data))
      .catch((error) => console.error("Erro ao carregar detalhes:", error));
  };

  return (
    <div className="lista-faturas-container">
      <h1>Faturas Emitidas</h1>
      <div className="lista-faturas">
        {faturas.map((fatura) => (
          <div key={fatura.id} className="fatura-card">
            <h3>Fatura #{fatura.id}</h3>
            <p>Cliente: {fatura.cliente}</p>
            <p>Total: AOA {fatura.total}</p>
            <button onClick={() => handleVerDetalhes(fatura.id)}>
              Ver Detalhes
            </button>
          </div>
        ))}
      </div>

      {detalhes && (
        <div className="detalhes-modal">
          <h2>Detalhes da Fatura #{detalhes.id}</h2>
          <p>Cliente: {detalhes.cliente}</p>
          <p>Total: AOA {detalhes.total}</p>
          <p>Data: {new Date(detalhes.data_emissao).toLocaleString()}</p>
          <h3>Itens:</h3>
          <ul>
            {detalhes.itens.map((item, index) => (
              <li key={index}>
                {item.quantidade}x {item.produto} - AOA {item.preco * item.quantidade}
              </li>
            ))}
          </ul>
          <button onClick={() => setDetalhes(null)}>Fechar</button>
        </div>
      )}
    </div>
  );
};

export default ListaFaturas;
