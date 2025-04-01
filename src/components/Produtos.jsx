import React, { useEffect, useState } from "react";
import api from "../services/api";

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get("/produtos"); // Rota do backend
        setProdutos(response.data);
      } catch (err) {
        setError("Erro ao carregar produtos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  if (loading) {
    return <p>Carregando produtos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">Lista de Produtos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {produtos.map((produto) => (
          <div
            key={produto.id}
            className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">{produto.nome}</h2>
            <p className="text-gray-600 mt-2">{produto.descricao}</p>
            <p className="text-lg font-bold text-green-600 mt-4">
              {produto.preco} Kz
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Produtos;
