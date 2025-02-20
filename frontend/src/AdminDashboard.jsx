import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard({ user }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);

  // Verifica se o usuário tem permissão de admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/"); // Redireciona para a home se não for admin
    }
    fetchUsers();
    fetchCompanies();
  }, [user, navigate]);

  // Função para buscar todos os usuários do banco
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  // Função para buscar todas as empresas
  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/companies");
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Painel de Administração</h1>
      <h2>Usuários</h2>
      <ul>
        {users.map((u) => (
          <li key={u._id}>
            {u.username} - {u.role}
          </li>
        ))}
      </ul>

      <h2>Empresas</h2>
      <ul>
        {companies.map((c) => (
          <li key={c._id}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
