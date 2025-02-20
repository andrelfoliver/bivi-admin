import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Exemplo de Dashboard único para todos os perfis (cliente/admin).
 * Muda os módulos do menu lateral de acordo com o user.role.
 */

function Dashboard({ user, onLogout }) {
    const navigate = useNavigate();

    // Estado para definir qual módulo está selecionado
    const [selectedModule, setSelectedModule] = useState('inicio');

    // Estado para listas (apenas usado se for admin e selecionar “usuários” ou “empresas”)
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);

    // Se não houver usuário ou não estiver logado, volta para /
    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    // Carrega lista de usuários
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

    // Carrega lista de empresas
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

    // Define os módulos que cada perfil enxerga
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

    // Retorna o array de módulos de acordo com o perfil do usuário
    const modules = user?.role === 'admin' ? adminModules : clientModules;

    // Ao clicar em um módulo
    const handleModuleClick = (mod) => {
        // Se for “sair”, chama logout
        if (mod === 'sair') {
            onLogout();
        } else {
            setSelectedModule(mod);
            // Se o admin clicou em “usuarios”, carrega a lista
            if (mod === 'usuarios') fetchUsers();
            // Se o admin clicou em “empresas”, carrega a lista
            if (mod === 'empresas') fetchCompanies();
        }
    };

    // Renderiza o conteúdo principal de acordo com o módulo selecionado
    const renderModuleContent = () => {
        // Card style genérico
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
                            Aqui é a página inicial do seu painel. Personalize com informações
                            relevantes ao usuário.
                        </p>
                    </div>
                );

            case 'usuarios':
                // Apenas admin vê esse módulo
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
                // Apenas admin vê esse módulo
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
                // Apenas admin vê esse módulo (placeholder)
                return (
                    <div style={cardStyle}>
                        <h2>Assistentes Virtuais Cadastradas</h2>
                        <p>Aqui você pode listar e gerenciar assistentes virtuais.</p>
                    </div>
                );

            case 'bizap':
                // Cliente vê esse módulo (placeholder)
                return (
                    <div style={cardStyle}>
                        <h2>Bizap</h2>
                        <p>Módulo em desenvolvimento.</p>
                    </div>
                );

            case 'historico':
                // Cliente vê esse módulo (placeholder)
                return (
                    <div style={cardStyle}>
                        <h2>Histórico de Mensagens</h2>
                        <p>Módulo em desenvolvimento.</p>
                    </div>
                );

            case 'assistenteVirtual':
                // Cliente vê esse módulo (ex: chamando ConfigEmpresa ou placeholder)
                return (
                    <div style={cardStyle}>
                        <h2>Assistente Virtual</h2>
                        <p>
                            Aqui poderia ser incorporado o <em>ConfigEmpresa.jsx</em> ou outro
                            componente específico.
                        </p>
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

    // =======================
    // ESTILOS PRINCIPAIS
    // =======================
    const pageWrapperStyle = {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        fontFamily: 'Arial, sans-serif',
    };

    // Barra lateral escura
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
    };

    const avatarStyle = {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        marginBottom: '0.5rem',
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
    };

    const moduleItemHoverStyle = {
        backgroundColor: '#5de5d9',
        color: '#000',
    };

    // Área principal
    const mainContentStyle = {
        flex: 1,
        padding: '1rem 2rem',
    };

    // =======================
    // RENDER
    // =======================
    return (
        <div style={pageWrapperStyle}>
            {/* Sidebar */}
            <div style={sidebarStyle}>
                {/* Informações do usuário no topo */}
                <div style={userInfoStyle}>
                    <div style={avatarStyle}>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <h3 style={{ margin: 0 }}>{user?.name || user?.username}</h3>
                    <small>{user?.role}</small>
                </div>

                {/* Opções de menu */}
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

            {/* Conteúdo principal */}
            <div style={mainContentStyle}>
                {renderModuleContent()}
            </div>
        </div>
    );
}

export default Dashboard;
