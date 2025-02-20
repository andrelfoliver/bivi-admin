import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [promoteLoading, setPromoteLoading] = useState({});

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
      setLoadingUsers(true);
      const response = await fetch("/api/users", { credentials: "include" });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/companies", { credentials: "include" });
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
    }
  };

  const handlePromoteUser = async (userId) => {
    if (!window.confirm("Tem certeza que deseja tornar este usuário administrador?")) {
      return;
    }
    try {
      setPromoteLoading((prev) => ({ ...prev, [userId]: true }));
      const response = await fetch(`/api/users/${userId}/promote`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: "admin" }),
      });
      if (response.ok) {
        alert("Usuário promovido a administrador com sucesso!");
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || "Erro ao promover usuário.");
      }
    } catch (error) {
      alert("Erro ao promover usuário: " + error.message);
    } finally {
      setPromoteLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Estilos para manter o padrão visual
  const pageWrapperStyle = {
    backgroundColor: "#f0f2f5",
    minHeight: "100vh",
    padding: "1rem",
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "2rem auto",
    padding: "2rem",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    fontFamily: "Arial, sans-serif",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  };

  const logoutButtonStyle = {
    padding: "0.5rem 1rem",
    backgroundColor: "#e74c3c",
    border: "none",
    borderRadius: "4px",
    color: "#fff",
    cursor: "pointer",
  };

  const sectionStyle = {
    marginBottom: "2rem",
  };

  const listStyle = {
    listStyle: "none",
    padding: 0,
  };

  const listItemStyle = {
    padding: "0.75rem",
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const promoteButtonStyle = {
    padding: "0.3rem 0.75rem",
    backgroundColor: "#5de5d9",
    border: "none",
    borderRadius: "4px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.9rem",
  };

  return (
    <div style={pageWrapperStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <h1>Painel de Administração</h1>
          <button onClick={onLogout} style={logoutButtonStyle}>
            Sair
          </button>
        </header>

        <section style={sectionStyle}>
          <h2>Usuários</h2>
          {loadingUsers ? (
            <p>Carregando usuários...</p>
          ) : (
            <ul style={listStyle}>
              {users.map((u) => (
                <li key={u._id} style={listItemStyle}>
                  <div>
                    <strong>{u.username || u.email}</strong> - {u.role}
                  </div>
                  {u.role !== "admin" && (
                    <button
                      onClick={() => handlePromoteUser(u._id)}
                      style={promoteButtonStyle}
                      disabled={promoteLoading[u._id]}
                    >
                      {promoteLoading[u._id] ? "Promovendo..." : "Tornar Admin"}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section style={sectionStyle}>
          <h2>Empresas</h2>
          <ul style={listStyle}>
            {companies.map((c) => (
              <li key={c._id} style={listItemStyle}>
                {c.name}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
