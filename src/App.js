import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Estoque from "./pages/Estoque";
import Produtos from "./pages/Produtos";
import Faturas from "./pages/Faturas";
import EmitirFatura from "./pages/EmitirFatura";
import Vendas from "./pages/Vendas";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import Pedidos from "./pages/Pedidos";
import Clientes from "./pages/Clientes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./routes/PrivateRoute";
import { monitorarUsuario, logout } from "./services/auth";

console.log("API Base URL:", process.env.REACT_APP_API_URL);
console.log("Firebase API Key:", process.env.REACT_APP_FIREBASE_API_KEY);

function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = monitorarUsuario((user) => {
      setUsuario(user);
      setCarregando(false);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        🔄 Carregando...
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* 🔹 Rotas Públicas */}
          <Route path="/" element={usuario ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={usuario ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* 🔹 Rotas Protegidas */}
          {usuario && (
            <>
              <Route path="/dashboard" element={<Dashboard usuario={usuario} onLogout={logout} />} />
              <Route path="/dashboard/estoque" element={<PrivateRoute usuario={usuario} requiredRole={["estoquista", "admin"]}><Estoque /></PrivateRoute>} />
              <Route path="/dashboard/produtos" element={<PrivateRoute usuario={usuario} requiredRole="admin"><Produtos /></PrivateRoute>} />
              <Route path="/dashboard/faturas" element={<PrivateRoute usuario={usuario} requiredRole={["vendedor", "admin"]}><Faturas /></PrivateRoute>} />
              <Route path="/dashboard/emitir-fatura" element={<PrivateRoute usuario={usuario} requiredRole={["vendedor", "admin"]}><EmitirFatura /></PrivateRoute>} />
              <Route path="/dashboard/vendas" element={<PrivateRoute usuario={usuario} requiredRole={["vendedor", "admin"]}><Vendas /></PrivateRoute>} />
              <Route path="/dashboard/relatorios" element={<PrivateRoute usuario={usuario} requiredRole={["admin", "vendedor"]}><Relatorios /></PrivateRoute>} />
              <Route path="/dashboard/configuracoes" element={<PrivateRoute usuario={usuario} requiredRole="admin"><Configuracoes /></PrivateRoute>} />
              <Route path="/dashboard/pedidos" element={<PrivateRoute usuario={usuario} requiredRole={["vendedor", "admin"]}><Pedidos /></PrivateRoute>} />
              <Route path="/dashboard/clientes" element={<PrivateRoute usuario={usuario} requiredRole="admin"><Clientes /></PrivateRoute>} />
            </>
          )}

          {/* 🔹 Página 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
