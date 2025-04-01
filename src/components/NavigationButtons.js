import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const NavigationButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="navigation-buttons">
      <button onClick={() => navigate('/faturas')} className="nav-btn">Faturas</button>
      <button onClick={() => navigate('/estoque')} className="nav-btn">Estoque</button>
      <button onClick={() => navigate('/relatorios')} className="nav-btn">Relatórios</button>
      <button onClick={() => navigate('/produtos')} className="nav-btn">Produtos</button>
      
      <button 
        onClick={() => navigate('/')}
        className="nav-btn home-btn"
      >
        <FaHome size={20} /> Voltar
      </button>
    </div>
  );
};

export default NavigationButtons;
