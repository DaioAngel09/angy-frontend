import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Um link de redefinição de senha foi enviado para o seu email.");
    } catch (err) {
      setError("Erro ao enviar email. Verifique se o email está correto.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Redefinir Senha</h2>
        {message && <p className="text-green-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
            Enviar Link de Redefinição
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/" className="text-blue-600 hover:underline">Voltar para o Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
