import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      fetchUsers();
      fetchCompanies();
    }
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

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
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1>Painel de Administração</h1>
        <button
          onClick={onLogout}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#e74c3c",
            border: "none",
            borderRadius: "4px",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Sair
        </button>
      </header>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Usuários</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {users.map((u) => (
            <li
              key={u._id}
              style={{
                padding: "0.5rem 0",
                borderBottom: "1px solid #ccc",
              }}
            >
              {u.username} - {u.role}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Empresas</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {companies.map((c) => (
            <li
              key={c._id}
              style={{
                padding: "0.5rem 0",
                borderBottom: "1px solid #ccc",
              }}
            >
              {c.name}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default AdminDashboard;
