import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfigEmpresa from './ConfigEmpresa';

function Dashboard({ user, onLogout }) {
    const navigate = useNavigate();

    const [selectedModule, setSelectedModule] = useState('inicio');
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');

    // Estado para os dados pessoais (inicializados com os valores do usuário)
    const [userInfo, setUserInfo] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        company: user?.company || '',
        telefone: user?.telefone || ''
    });

    // Estado para controlar quais campos estão em modo de edição
    const [editing, setEditing] = useState({
        fullName: false,
        email: false,
        company: false,
        telefone: false
    });

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/users', { credentials: 'include' });
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/companies', { credentials: 'include' });
            const data = await response.json();
            setCompanies(data);
        } catch (error) {
            console.error('Erro ao buscar empresas:', error);
        } finally {
            setLoading(false);
        }
    };

    const adminModules = [
        { id: 'inicio', label: 'Início' },
        { id: 'usuarios', label: 'Usuários cadastrados' },
        { id: 'empresas', label: 'Empresas cadastradas' },
        { id: 'assistentes', label: 'Assistentes virtuais cadastradas' },
        { id: 'config', label: 'Configuração' },
        { id: 'sair', label: 'Sair' },
    ];

    const clientModules = [
        { id: 'inicio', label: 'Início' },
        { id: 'bizap', label: 'Bizap' },
        { id: 'historico', label: 'Histórico de Mensagens' },
        { id: 'assistenteVirtual', label: 'Assistente Virtual' },
        { id: 'config', label: 'Configuração' },
        { id: 'sair', label: 'Sair' },
    ];

    const modules = user?.role === 'admin' ? adminModules : clientModules;

    const handleModuleClick = (mod) => {
        if (mod === 'sair') {
            onLogout();
        } else {
            setSelectedModule(mod);
            setSaveMsg('');
            // Reseta os modos de edição ao mudar de módulo
            setEditing({ fullName: false, email: false, company: false, telefone: false });
            if (mod === 'usuarios') fetchUsers();
            if (mod === 'empresas') fetchCompanies();
        }
    };

    // Função que atualiza apenas o campo editado (para fullName, envia como name)
    const handleFieldSave = async (field) => {
        const fieldToSend = field === 'fullName' ? 'name' : field;
        try {
            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ [fieldToSend]: userInfo[field] }),
            });
            if (response.ok) {
                setSaveMsg('Informações atualizadas com sucesso!');
                setEditing((prev) => ({ ...prev, [field]: false }));
            } else {
                setSaveMsg('Erro ao atualizar informações.');
            }
        } catch (error) {
            setSaveMsg('Erro ao atualizar informações: ' + error.message);
        }
    };

    // Função auxiliar para renderizar um campo editável com botão "Editar"
    const renderEditableField = (label, field, type = 'text') => {
        return (
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 'bold' }}>{label}:</label>
                {editing[field] ? (
                    <>
                        <input
                            type={type}
                            value={userInfo[field]}
                            onChange={(e) => setUserInfo({ ...userInfo, [field]: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                        <button
                            onClick={() => handleFieldSave(field)}
                            style={{
                                marginTop: '0.5rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: '#5de5d9',
                                border: 'none',
                                borderRadius: '4px',
                                color: '#fff',
                                cursor: 'pointer',
                            }}
                        >
                            Salvar
                        </button>
                        <button
                            onClick={() => setEditing({ ...editing, [field]: false })}
                            style={{
                                marginLeft: '0.5rem',
                                marginTop: '0.5rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: '#ccc',
                                border: 'none',
                                borderRadius: '4px',
                                color: '#000',
                                cursor: 'pointer',
                            }}
                        >
                            Cancelar
                        </button>
                    </>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ flex: 1, padding: '0.5rem' }}>
                            {userInfo[field] || 'Sem informação'}
                        </span>
                        <button
                            onClick={() => setEditing({ ...editing, [field]: true })}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#5de5d9',
                                border: 'none',
                                borderRadius: '4px',
                                color: '#fff',
                                cursor: 'pointer',
                            }}
                        >
                            Editar
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderModuleContent = () => {
        const cardStyle = {
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            marginBottom: '1rem',
        };

        switch (selectedModule) {
            case 'inicio':
                return (
                    <div style={cardStyle}>
                        <h2>Dados Pessoais</h2>
                        {renderEditableField('Nome Completo', 'fullName')}
                        {renderEditableField('E‑mail', 'email', 'email')}
                        {renderEditableField('Empresa', 'company')}
                        {renderEditableField('Telefone', 'telefone')}
                        {saveMsg && <p style={{ marginTop: '1rem', color: '#5de5d9' }}>{saveMsg}</p>}
                    </div>
                );
            case 'usuarios':
                return (
                    <div style={cardStyle}>
                        <h2>Usuários Cadastrados</h2>
                        {loading ? (
                            <p>Carregando usuários...</p>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#5de5d9', color: '#000' }}>
                                            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Nome</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Permissão</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Cadastrado em</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users
                                            .sort((a, b) => {
                                                const nameA = (a.name || a.email).toLowerCase();
                                                const nameB = (b.name || b.email).toLowerCase();
                                                if (nameA < nameB) return -1;
                                                if (nameA > nameB) return 1;
                                                return 0;
                                            })
                                            .map((u) => {
                                                const isSelf = u._id.toString() === user._id.toString();
                                                return (
                                                    <tr key={u._id} style={{ borderBottom: '1px solid #ccc' }}>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            {u.name || u.email}
                                                        </td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            {u.role === 'admin' ? 'Admin' : 'Cliente'}
                                                        </td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            {new Date(u.createdAt).toLocaleString('pt-BR')}
                                                        </td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            {!isSelf && (
                                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                    {u.role === 'client' ? (
                                                                        <button
                                                                            onClick={() => handlePromoteUser(u._id)}
                                                                            style={{
                                                                                padding: '0.5rem',
                                                                                backgroundColor: '#5de5d9',
                                                                                border: 'none',
                                                                                borderRadius: '4px',
                                                                                color: '#fff',
                                                                                cursor: 'pointer'
                                                                            }}
                                                                        >
                                                                            Promover
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleDemoteUser(u._id)}
                                                                            style={{
                                                                                padding: '0.5rem',
                                                                                backgroundColor: '#f0ad4e',
                                                                                border: 'none',
                                                                                borderRadius: '4px',
                                                                                color: '#fff',
                                                                                cursor: 'pointer'
                                                                            }}
                                                                        >
                                                                            Demover
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={() => handleDeleteUser(u._id)}
                                                                        style={{
                                                                            padding: '0.5rem',
                                                                            backgroundColor: '#d9534f',
                                                                            border: 'none',
                                                                            borderRadius: '4px',
                                                                            color: '#fff',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                    >
                                                                        Excluir
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {saveMsg && <p style={{ marginTop: '1rem', color: '#5de5d9' }}>{saveMsg}</p>}
                    </div>
                );
            case 'empresas':
                return (
                    <div style={cardStyle}>
                        <h2>Empresas Cadastradas</h2>
                        {loading ? (
                            <p>Carregando empresas...</p>
                        ) : (
                            <ul>
                                {companies.map((c) => (
                                    <li key={c._id}>{c.nome}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            case 'assistentes':
                return (
                    <div style={cardStyle}>
                        <h2>Assistentes Virtuais Cadastradas</h2>
                        <p>Gerencie os assistentes virtuais aqui.</p>
                    </div>
                );
            case 'bizap':
                return (
                    <div style={cardStyle}>
                        <h2>Bizap</h2>
                        <p>Módulo em desenvolvimento.</p>
                    </div>
                );
            case 'historico':
                return (
                    <div style={cardStyle}>
                        <h2>Histórico de Mensagens</h2>
                        <p>Módulo em desenvolvimento.</p>
                    </div>
                );
            case 'assistenteVirtual':
                return (
                    <div style={cardStyle}>
                        <ConfigEmpresa user={user} onLogout={onLogout} />
                    </div>
                );
            case 'config':
                return (
                    <div style={cardStyle}>
                        <h2>Configuração</h2>
                        <p>Módulo em desenvolvimento.</p>
                    </div>
                );
            default:
                return (
                    <div style={cardStyle}>
                        <h2>Módulo não encontrado</h2>
                    </div>
                );
        }
    };

    // Funções para promover, demover e excluir usuários
    const handlePromoteUser = async (userId) => {
        try {
            const response = await fetch(`/api/users/${userId}/promote`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ role: 'admin' }),
            });
            if (response.ok) {
                alert('Usuário promovido com sucesso!');
                fetchUsers();
            } else {
                alert('Erro ao promover usuário.');
            }
        } catch (error) {
            alert('Erro ao promover usuário: ' + error.message);
        }
    };

    const handleDemoteUser = async (userId) => {
        try {
            const response = await fetch(`/api/users/${userId}/demote`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            if (response.ok) {
                alert('Usuário demovido com sucesso!');
                fetchUsers();
            } else {
                alert('Erro ao demover usuário.');
            }
        } catch (error) {
            alert('Erro ao demover usuário: ' + error.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                alert('Usuário excluído com sucesso!');
                fetchUsers();
            } else {
                alert('Erro ao excluir usuário.');
            }
        } catch (error) {
            alert('Erro ao excluir usuário: ' + error.message);
        }
    };

    // Estilos gerais do Dashboard
    const pageWrapperStyle = {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        fontFamily: 'Arial, sans-serif',
    };

    const sidebarStyle = {
        width: '250px',
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
    };

    const userInfoStyle = {
        marginBottom: '1rem',
        textAlign: 'center',
    };

    const avatarStyle = {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        objectFit: 'cover',
        margin: '0 auto 0.5rem',
    };

    const defaultAvatarStyle = {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        color: '#fff',
        margin: '0 auto 0.5rem',
    };

    const moduleListStyle = {
        listStyle: 'none',
        padding: 0,
        marginTop: '1rem',
    };

    const moduleItemStyle = {
        padding: '0.75rem 1.5rem',
        cursor: 'pointer',
        borderRadius: '4px',
        transition: 'background-color 0.3s',
        marginBottom: '0.5rem',
    };

    const moduleItemHoverStyle = {
        backgroundColor: '#5de5d9',
        color: '#000',
    };

    const mainContainerStyle = {
        flex: 1,
        padding: '1rem 2rem',
        paddingBottom: '4rem',
    };

    const footerStyle = {
        position: 'fixed',
        bottom: 0,
        left: '250px',
        right: 0,
        backgroundColor: '#4cc9c0',
        color: '#fff',
        textAlign: 'center',
        padding: '0.75rem 1rem',
    };

    return (
        <div style={pageWrapperStyle}>
            <div style={sidebarStyle}>
                <div style={userInfoStyle}>
                    {user?.picture ? (
                        <img src={user.picture} alt="Avatar" style={avatarStyle} />
                    ) : (
                        <div style={defaultAvatarStyle}>
                            {user?.name?.charAt(0).toUpperCase() ||
                                user?.username?.charAt(0).toUpperCase() ||
                                'U'}
                        </div>
                    )}
                    <h3 style={{ margin: 0 }}>{user?.name || user?.username}</h3>
                    <small>{user?.role}</small>
                </div>
                <ul style={moduleListStyle}>
                    {modules.map((mod) => (
                        <li
                            key={mod.id}
                            style={{
                                ...moduleItemStyle,
                                ...(selectedModule === mod.id ? moduleItemHoverStyle : {}),
                            }}
                            onClick={() => handleModuleClick(mod.id)}
                        >
                            {mod.label}
                        </li>
                    ))}
                </ul>
            </div>
            <div style={mainContainerStyle}>
                {selectedModule === 'usuarios' ? (
                    <div
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            padding: '1.5rem',
                            marginBottom: '1rem',
                            overflowX: 'auto'
                        }}
                    >
                        <h2>Usuários Cadastrados</h2>
                        {loading ? (
                            <p>Carregando usuários...</p>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#5de5d9', color: '#000' }}>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Nome</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Permissão</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Cadastrado em</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users
                                        .sort((a, b) => {
                                            const nameA = (a.name || a.email).toLowerCase();
                                            const nameB = (b.name || b.email).toLowerCase();
                                            if (nameA < nameB) return -1;
                                            if (nameA > nameB) return 1;
                                            return 0;
                                        })
                                        .map((u) => {
                                            const isSelf = u._id.toString() === user._id.toString();
                                            return (
                                                <tr key={u._id} style={{ borderBottom: '1px solid #ccc' }}>
                                                    <td style={{ padding: '0.75rem' }}>{u.name || u.email}</td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        {u.role === 'admin' ? 'Admin' : 'Cliente'}
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        {new Date(u.createdAt).toLocaleString('pt-BR')}
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        {!isSelf && (
                                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                {u.role === 'client' ? (
                                                                    <button
                                                                        onClick={() => handlePromoteUser(u._id)}
                                                                        style={{
                                                                            padding: '0.5rem',
                                                                            backgroundColor: '#5de5d9',
                                                                            border: 'none',
                                                                            borderRadius: '4px',
                                                                            color: '#fff',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                    >
                                                                        Promover
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleDemoteUser(u._id)}
                                                                        style={{
                                                                            padding: '0.5rem',
                                                                            backgroundColor: '#f0ad4e',
                                                                            border: 'none',
                                                                            borderRadius: '4px',
                                                                            color: '#fff',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                    >
                                                                        Demover
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => handleDeleteUser(u._id)}
                                                                    style={{
                                                                        padding: '0.5rem',
                                                                        backgroundColor: '#d9534f',
                                                                        border: 'none',
                                                                        borderRadius: '4px',
                                                                        color: '#fff',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    Excluir
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        )}
                        {saveMsg && <p style={{ marginTop: '1rem', color: '#5de5d9' }}>{saveMsg}</p>}
                    </div>
                ) : (
                    renderModuleContent()
                )}
            </div>
            <footer style={footerStyle}>
                &copy; {new Date().getFullYear()} BiVisualizer. Todos os direitos reservados.
            </footer>
        </div>
    );
}

// Funções para promover, demover e excluir usuários
const handlePromoteUser = async (userId) => {
    try {
        const response = await fetch(`/api/users/${userId}/promote`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ role: 'admin' }),
        });
        if (response.ok) {
            alert('Usuário promovido com sucesso!');
            fetchUsers();
        } else {
            alert('Erro ao promover usuário.');
        }
    } catch (error) {
        alert('Erro ao promover usuário: ' + error.message);
    }
};

const handleDemoteUser = async (userId) => {
    try {
        const response = await fetch(`/api/users/${userId}/demote`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (response.ok) {
            alert('Usuário demovido com sucesso!');
            fetchUsers();
        } else {
            alert('Erro ao demover usuário.');
        }
    } catch (error) {
        alert('Erro ao demover usuário: ' + error.message);
    }
};

const handleDeleteUser = async (userId) => {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            alert('Usuário excluído com sucesso!');
            fetchUsers();
        } else {
            alert('Erro ao excluir usuário.');
        }
    } catch (error) {
        alert('Erro ao excluir usuário: ' + error.message);
    }
};

export default Dashboard;
