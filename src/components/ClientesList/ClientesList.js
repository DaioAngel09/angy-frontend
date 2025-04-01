import React, { useEffect, useState } from "react";
import apiClient from "../../services/apiClient"; // Cliente axios configurado
//import React, { useEffect, useState } from 'react';
import { listarClientes } from '../../api/clientesApi';

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await listarClientes();
        setClientes(data);
      } catch (err) {
        setError('Erro ao carregar os clientes.');
      }
    };

    fetchClientes();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Lista de Clientes</h2>
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>{cliente.nome}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClientesList;

