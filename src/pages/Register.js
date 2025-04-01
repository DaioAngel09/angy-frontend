import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [userData, setUserData] = useState({
    nome: "",
    email: "",
    senha: "",
    role: "vendedor", // 🔹 Padrão para novos usuários
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      // 🔹 Criar usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.senha);
      const user = userCredential.user;

      // 🔹 Armazenar usuário no Firestore
      await setDoc(doc(db, "users", user.uid), {
        nome: userData.nome,
        email: userData.email,
        role: userData.role,
        uid: user.uid,
      });

      // 🔹 Salvar dados no LocalStorage para evitar erro 404
      localStorage.setItem("user", JSON.stringify({ uid: user.uid, nome: userData.nome, role: userData.role }));

      setMessage("✅ Usuário criado com sucesso! Redirecionando...");
      setTimeout(() => navigate("/dashboard"), 2000); // 🔹 Agora redireciona corretamente para o Dashboard
    } catch (error) {
      setError("❌ Erro ao criar usuário. Verifique as informações.");
      console.error("Erro:", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Criar Conta</h2>

        {message && <p className="text-green-600 text-center">{message}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" name="nome" placeholder="Nome Completo" value={userData.nome} onChange={handleChange} className="w-full p-3 border rounded" required />
          <input type="email" name="email" placeholder="E-mail" value={userData.email} onChange={handleChange} className="w-full p-3 border rounded" required />
          <input type="password" name="senha" placeholder="Senha" value={userData.senha} onChange={handleChange} className="w-full p-3 border rounded" required />

          {/* 🔹 Seleção de Tipo de Usuário */}
          <select name="role" value={userData.role} onChange={handleChange} className="w-full p-3 border rounded">
            <option value="admin">Administrador</option>
            <option value="vendedor">Vendedor</option>
            <option value="estoquista">Estoquista</option>
          </select> 

          <button type="submit" className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600">Criar Conta</button>
        </form>

        <p className="text-center text-sm mt-4">
          Já tem uma conta? <a href="/login" className="text-blue-500">Faça login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
