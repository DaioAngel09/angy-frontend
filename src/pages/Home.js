import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css'; // Arquivo de estilos

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h2>Bem-vindo ao <span>Angy</span> - Gestão Empresarial</h2>
      <p>Escolha uma opção abaixo para começar:</p>
      <div className="button-group">
        <button className="btn-primary" onClick={() => navigate('/faturas')}>📄 Faturas</button>
        <button className="btn-secondary" onClick={() => navigate('/estoque')}>📦 Estoque</button>
        <button className="btn-tertiary" onClick={() => navigate('/relatorios')}>📊 Relatórios</button>
        <button className="btn-quaternary" onClick={() => navigate('/produtos')}>🛒 Produtos</button>
      </div>
    </div>
  );
};

export default Home;

