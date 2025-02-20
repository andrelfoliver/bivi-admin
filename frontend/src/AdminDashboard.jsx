import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

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
      setActionLoading((prev) => ({ ...prev, [userId]: "promote" }));
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
      setActionLoading((prev) => ({ ...prev, [userId]: null }));
    }
  };

  const handleDemoteUser = async (userId) => {
    if (!window.confirm("Tem certeza que deseja tornar este usuário cliente?")) {
      return;
    }
    try {
      setActionLoading((prev) => ({ ...prev, [userId]: "demote" }));
      const response = await fetch(`/api/users/${userId}/demote`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: "client" }),
      });
      if (response.ok) {
        alert("Usuário demovido para cliente com sucesso!");
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || "Erro ao demover usuário.");
      }
    } catch (error) {
      alert("Erro ao demover usuário: " + error.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: null }));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) {
      return;
    }
    try {
      setActionLoading((prev) => ({ ...prev, [userId]: "delete" }));
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        alert("Usuário excluído com sucesso!");
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || "Erro ao excluir usuário.");
      }
    } catch (error) {
      alert("Erro ao excluir usuário: " + error.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: null }));
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

  const buttonGroupStyle = {
    display: "flex",
    gap: "0.5rem",
  };

  const actionButtonStyle = {
    padding: "0.3rem 0.75rem",
    border: "none",
    borderRadius: "4px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.9rem",
  };

  const promoteButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: "#5de5d9",
  };

  const demoteButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: "#f39c12",
  };

  const deleteButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: "#e74c3c",
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
                  <div style={buttonGroupStyle}>
                    {u._id === user._id ? (
                      <span style={{ fontStyle: "italic", color: "#888" }}>
                        Seu usuário
                      </span>
                    ) : (
                      <>
                        {u.role === "admin" ? (
                          <button
                            onClick={() => handleDemoteUser(u._id)}
                            style={demoteButtonStyle}
                            disabled={actionLoading[u._id] === "demote"}
                          >
                            {actionLoading[u._id] === "demote"
                              ? "Processando..."
                              : "Tornar Cliente"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePromoteUser(u._id)}
                            style={promoteButtonStyle}
                            disabled={actionLoading[u._id] === "promote"}
                          >
                            {actionLoading[u._id] === "promote"
                              ? "Processando..."
                              : "Tornar Admin"}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          style={deleteButtonStyle}
                          disabled={actionLoading[u._id] === "delete"}
                        >
                          {actionLoading[u._id] === "delete"
                            ? "Excluindo..."
                            : "Excluir"}
                        </button>
                      </>
                    )}
                  </div>
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
