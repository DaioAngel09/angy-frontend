// src/pages/Cadastro.js
import React from "react";
import { useNavigate } from "react-router-dom";



const Cadastro = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Cadastro</h1>
        <form>
          <input
            type="text"
            placeholder="Nome"
            className="w-full p-3 mb-4 border border-gray-300 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-3 mb-6 border border-gray-300 rounded"
          />
          <button
            type="button"
            onClick={handleRegister}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
