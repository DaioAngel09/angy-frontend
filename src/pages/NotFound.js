import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-xl mt-4 text-gray-700">Página não encontrada!</p>
      <Link to="/dashboard">
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
          🔙 Voltar para o Dashboard
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
