import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard({ user, onLogout }) {
    const navigate = useNavigate();
    const [selectedModule, setSelectedModule] = useState('inicio');
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);

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
            if (mod === 'usuarios') fetchUsers();
            if (mod === 'empresas') fetchCompanies();
        }
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
                        <h2>Bem-vindo(a), {user?.name || user?.username}!</h2>
                        <p>E-mail: {user?.email}</p>
                        <p>Role: {user?.role}</p>
                        <p>
                            Esta é a página inicial do seu painel. Personalize com informações
                            relevantes.
                        </p>
                    </div>
                );
            case 'usuarios':
                return (
                    <div style={cardStyle}>
                        <h2>Usuários Cadastrados</h2>
                        {loading ? (
                            <p>Carregando usuários...</p>
                        ) : (
                            <ul>
                                {users.map((u) => (
                                    <li key={u._id}>
                                        {u.username || u.email} - <strong>{u.role}</strong>
                                    </li>
                                ))}
                            </ul>
                        )}
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
                        <h2>Assistente Virtual</h2>
                        <p>Aqui pode ser incorporado o componente de configuração.</p>
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
        ...avatarStyle,
        backgroundColor: '#333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        color: '#fff',
    };

    const moduleListStyle = {
        listStyle: 'none',
        padding: 0,
        marginTop: '1rem',
    };

    const moduleItemStyle = {
        padding: '0.5rem 0',
        cursor: 'pointer',
        borderRadius: '4px',
        transition: 'background-color 0.3s',
    };

    const moduleItemHoverStyle = {
        backgroundColor: '#5de5d9',
        color: '#000',
    };

    const mainContentStyle = {
        flex: 1,
        padding: '1rem 2rem',
    };

    return (
        <div style={pageWrapperStyle}>
            <div style={sidebarStyle}>
                <div style={userInfoStyle}>
                    {user?.picture ? (
                        <img src={user.picture} alt="Avatar" style={avatarStyle} />
                    ) : (
                        <div style={defaultAvatarStyle}>
                            {user?.name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U'}
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
            <div style={mainContentStyle}>{renderModuleContent()}</div>
        </div>
    );
}

export default Dashboard;
