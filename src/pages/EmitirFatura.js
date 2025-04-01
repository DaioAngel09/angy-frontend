import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EmitirFatura.css";

const EmitirFatura = () => {
  const navigate = useNavigate();

  const [cliente, setCliente] = useState("");
  const [itens, setItens] = useState([]);
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [preco, setPreco] = useState(0);
  const [total, setTotal] = useState(0);

  const handleAddItem = () => {
    if (!produto || quantidade <= 0 || preco <= 0) {
      alert("Selecione um produto e insira valores válidos.");
      return;
    }
    const novoItem = { produto, quantidade, preco };
    setItens([...itens, novoItem]);
    setTotal(total + novoItem.preco * quantidade);
    setProduto("");
    setQuantidade(1);
    setPreco(0);
  };

  const handleEmitirFatura = () => {
    if (!cliente || itens.length === 0) {
      alert("Preencha todos os campos antes de emitir a fatura.");
      return;
    }

    const fatura = { cliente, itens, total };

    fetch("http://localhost:5000/faturas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fatura),
    })
      .then((response) => response.json())
      .then(() => {
        alert("Fatura emitida com sucesso!");
        setCliente("");
        setItens([]);
        setTotal(0);
      })
      .catch((error) => console.error("Erro ao emitir fatura:", error));
  };

  return (
    <div className="emitir-fatura-container">
      <div className="header">
        <button className="back-button" onClick={() => navigate("/dashboard")}>🏠 Voltar</button>
        <h1>📄 Emitir Fatura</h1>
      </div>

      <div className="form-group">
        <label>Cliente:</label>
        <input type="text" placeholder="Nome do cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Produto:</label>
        <input type="text" placeholder="Nome do produto" value={produto} onChange={(e) => setProduto(e.target.value)} />
        <label>Quantidade:</label>
        <input type="number" min="1" value={quantidade} onChange={(e) => setQuantidade(parseInt(e.target.value, 10))} />
        <label>Preço (AOA):</label>
        <input type="number" min="0" value={preco} onChange={(e) => setPreco(parseFloat(e.target.value))} />
        <button className="add-item-button" onClick={handleAddItem}>Adicionar Item</button>
      </div>

      <div className="itens-lista">
        <h3>Itens adicionados:</h3>
        {itens.length === 0 ? (
          <p>Nenhum item adicionado.</p>
        ) : (
          <ul>
            {itens.map((item, index) => (
              <li key={index}>
                {item.quantidade}x {item.produto} - AOA {item.preco * item.quantidade}
              </li>
            ))}
          </ul>
        )}
      </div>

      <h2>Total: AOA {total}</h2>
      <button className="emitir-button" onClick={handleEmitirFatura}>💳 Emitir Fatura</button>
    </div>
  );
};

export default EmitirFatura;
