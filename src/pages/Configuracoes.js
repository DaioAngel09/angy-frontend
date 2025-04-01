// src/pages/Configuracoes.js
import React, { useState } from "react";
import { FaUserCog, FaLock, FaPalette, FaSave } from "react-icons/fa";

const Configuracoes = () => {
  const [tema, setTema] = useState("claro");
  const [senha, setSenha] = useState("");
  const [notificacoes, setNotificacoes] = useState(true);

  const salvarConfiguracoes = () => {
    alert("Configurações salvas com sucesso!");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800">⚙️ Configurações</h1>
      <p className="mt-2 text-lg text-gray-700">Gerencie as configurações do sistema.</p>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FaUserCog /> Perfil
        </h2>
        <div className="mt-4">
          <label className="block font-medium">Nome:</label>
          <input type="text" className="p-2 border w-full rounded-lg mt-1" placeholder="Seu nome" />
        </div>
        <div className="mt-4">
          <label className="block font-medium">Email:</label>
          <input type="email" className="p-2 border w-full rounded-lg mt-1" placeholder="Seu email" />
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FaLock /> Segurança
        </h2>
        <div className="mt-4">
          <label className="block font-medium">Nova Senha:</label>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="p-2 border w-full rounded-lg mt-1" placeholder="Digite uma nova senha" />
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FaPalette /> Aparência
        </h2>
        <div className="mt-4">
          <label className="block font-medium">Tema:</label>
          <select value={tema} onChange={(e) => setTema(e.target.value)} className="p-2 border w-full rounded-lg mt-1">
            <option value="claro">Claro</option>
            <option value="escuro">Escuro</option>
          </select>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          📢 Notificações
        </h2>
        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={notificacoes} onChange={() => setNotificacoes(!notificacoes)} />
            Ativar notificações por email
          </label>
        </div>
      </div>

      <button onClick={salvarConfiguracoes} className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-blue-700">
        <FaSave /> Salvar Configurações
      </button>
    </div>
  );
};

export default Configuracoes; 