import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔹 Obtendo dados do usuário no Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("Usuário não encontrado no banco de dados.");
      }

      const userData = userSnap.data();
      localStorage.setItem("user", JSON.stringify(userData)); // ✅ Salva os dados no localStorage

      // 🔹 Redirecionamento baseado no cargo
      const redirectPath = {
        admin: "/dashboard/admin",
        vendedor: "/dashboard/vendas",
        estoquista: "/dashboard/estoque",
      }[userData.role] || "/dashboard"; // 🔹 Redireciona para um local seguro caso o role seja desconhecido

      navigate(redirectPath);
    } catch (err) {
      let errorMessage = "❌ Email ou senha incorretos. Tente novamente.";
      
      // 🔹 Tratamento de erros específicos do Firebase
      if (err.code === "auth/user-not-found") {
        errorMessage = "❌ Usuário não encontrado.";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "❌ Senha incorreta.";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "⚠️ Muitas tentativas. Tente novamente mais tarde.";
      } else {
        console.error("Erro no login:", err.message);
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">🔑 Login</h2>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form onSubmit={handleLogin} className="mt-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            className="w-full p-3 border rounded-lg mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className={`w-full py-2 rounded-lg transition ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Não tem uma conta?{" "}
          <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/register")}>
            Cadastrar-se ou contactar a Elsa Carrinho
          </span>
        </p>

        <p className="text-center text-sm mt-2">
          Esqueceu a senha?{" "}
          <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/reset-password")}>
            Recuperar senha
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
