// src/routes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Cadastro from "../pages/Cadastro";
import Faturas from "../pages/Faturas";
import Estoque from "../pages/Estoque";
import Relatorios from "../pages/Relatorios";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/faturas" element={<Faturas />} />
      <Route path="/dashboard/estoque" element={<Estoque />} />
      <Route path="/dashboard/relatorios" element={<Relatorios />} />
    </Routes>
  );
};

export default AppRoutes;
