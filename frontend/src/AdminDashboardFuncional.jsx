import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Componente de mddodal para confirmação de ações
function ConfirmationModal({ message, onConfirm, onCancel }) {
  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalStyle = {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "8px",
    maxWidth: "400px",
    width: "100%",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  };

  const buttonStyle = {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#ccc",
    color: "#333",
  };

  const confirmButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#5de5d9",
    color: "#fff",
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <p>{message}</p>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
            marginTop: "1rem",
          }}
        >
          <button onClick={onCancel} style={cancelButtonStyle}>
            Cancelar
          </button>
          <button onClick={onConfirm} style={confirmButtonStyle}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente para exibir notificações na tela
function Notification({ message, type }) {
  const notificationStyle = {
    position: "fixed",
    top: "1rem",
    right: "1rem",
    backgroundColor: type === "success" ? "#5cb85c" : "#d9534f",
    color: "#fff",
    padding: "1rem 1.5rem",
    borderRadius: "4px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 1001,
  };

  return <div style={notificationStyle}>{message}</div>;
}

function AdminDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [companyActionLoading, setCompanyActionLoading] = useState({});
  const [confirmation, setConfirmation] = useState(null);
  const [notification, setNotification] = useState(null);

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

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const openConfirmationModal = (message, onConfirm) => {
    setConfirmation({ message, onConfirm });
  };

  const closeConfirmationModal = () => {
    setConfirmation(null);
  };

  // Funções de ações para usuários
  const handlePromoteUser = (userId) => {
    openConfirmationModal("Tem certeza que deseja tornar este usuário administrador?", async () => {
      try {
        setActionLoading((prev) => ({ ...prev, [userId]: "promote" }));
        const response = await fetch(`/api/users/${userId}/promote`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ role: "admin" }),
        });
        if (response.ok) {
          showNotification("Usuário promovido a administrador com sucesso!", "success");
          fetchUsers();
        } else {
          const data = await response.json();
          showNotification(data.error || "Erro ao promover usuário.", "error");
        }
      } catch (error) {
        showNotification("Erro ao promover usuário: " + error.message, "error");
      } finally {
        setActionLoading((prev) => ({ ...prev, [userId]: null }));
      }
      closeConfirmationModal();
    });
  };

  const handleDemoteUser = (userId) => {
    openConfirmationModal("Tem certeza que deseja tornar este usuário cliente?", async () => {
      try {
        setActionLoading((prev) => ({ ...prev, [userId]: "demote" }));
        const response = await fetch(`/api/users/${userId}/demote`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ role: "client" }),
        });
        if (response.ok) {
          showNotification("Usuário demovido para cliente com sucesso!", "success");
          fetchUsers();
        } else {
          const data = await response.json();
          showNotification(data.error || "Erro ao demover usuário.", "error");
        }
      } catch (error) {
        showNotification("Erro ao demover usuário: " + error.message, "error");
      } finally {
        setActionLoading((prev) => ({ ...prev, [userId]: null }));
      }
      closeConfirmationModal();
    });
  };

  const handleDeleteUser = (userId) => {
    openConfirmationModal("Tem certeza que deseja excluir este usuário?", async () => {
      try {
        setActionLoading((prev) => ({ ...prev, [userId]: "delete" }));
        const response = await fetch(`/api/users/${userId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (response.ok) {
          showNotification("Usuário excluído com sucesso!", "success");
          fetchUsers();
        } else {
          const data = await response.json();
          showNotification(data.error || "Erro ao excluir usuário.", "error");
        }
      } catch (error) {
        showNotification("Erro ao excluir usuário: " + error.message, "error");
      } finally {
        setActionLoading((prev) => ({ ...prev, [userId]: null }));
      }
      closeConfirmationModal();
    });
  };

  // Função de ação para empresas
  const handleDeleteCompany = (companyId) => {
    openConfirmationModal("Tem certeza que deseja excluir esta empresa?", async () => {
      try {
        setCompanyActionLoading((prev) => ({ ...prev, [companyId]: "delete" }));
        const response = await fetch(`/api/companies/${companyId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (response.ok) {
          showNotification("Empresa excluída com sucesso!", "success");
          fetchCompanies();
        } else {
          const data = await response.json();
          showNotification(data.error || "Erro ao excluir empresa.", "error");
        }
      } catch (error) {
        showNotification("Erro ao excluir empresa: " + error.message, "error");
      } finally {
        setCompanyActionLoading((prev) => ({ ...prev, [companyId]: null }));
      }
      closeConfirmationModal();
    });
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
          {companies.length === 0 ? (
            <p>Nenhuma empresa cadastrada.</p>
          ) : (
            <ul style={listStyle}>
              {companies.map((c) => (
                <li key={c._id} style={listItemStyle}>
                  <div>
                    <strong>{c.nome}</strong>
                  </div>
                  <div style={buttonGroupStyle}>
                    <button
                      onClick={() => handleDeleteCompany(c._id)}
                      style={deleteButtonStyle}
                      disabled={companyActionLoading[c._id] === "delete"}
                    >
                      {companyActionLoading[c._id] === "delete"
                        ? "Excluindo..."
                        : "Excluir"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      {confirmation && (
        <ConfirmationModal
          message={confirmation.message}
          onConfirm={confirmation.onConfirm}
          onCancel={closeConfirmationModal}
        />
      )}
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </div>
  );
}

export default AdminDashboard;
