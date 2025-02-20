import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfigEmpresa from './ConfigEmpresa';

function Dashboard({ user, onLogout }) {
    const navigate = useNavigate();

    const [selectedModule, setSelectedModule] = useState('inicio');
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);

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

    const [saveMsg, setSaveMsg] = useState('');

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

    // Função que atualiza apenas o campo editado
    const handleFieldSave = async (field) => {
        try {
            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                // Envia somente o campo que foi alterado
                body: JSON.stringify({ [field]: userInfo[field] }),
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
                        {/* Nome Completo */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontWeight: 'bold' }}>Nome Completo:</label>
                            {editing.fullName ? (
                                <>
                                    <input
                                        type="text"
                                        value={userInfo.fullName}
                                        onChange={(e) =>
                                            setUserInfo({ ...userInfo, fullName: e.target.value })
                                        }
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                        required
                                    />
                                    <button
                                        onClick={() => handleFieldSave('fullName')}
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
                                        onClick={() => setEditing({ ...editing, fullName: false })}
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
                                <div
                                    onClick={() => setEditing({ ...editing, fullName: true })}
                                    style={{ padding: '0.5rem', cursor: 'pointer' }}
                                >
                                    {userInfo.fullName || 'Clique para editar'}
                                </div>
                            )}
                        </div>

                        {/* E‑mail */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontWeight: 'bold' }}>E‑mail:</label>
                            {editing.email ? (
                                <>
                                    <input
                                        type="email"
                                        value={userInfo.email}
                                        onChange={(e) =>
                                            setUserInfo({ ...userInfo, email: e.target.value })
                                        }
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                        required
                                    />
                                    <button
                                        onClick={() => handleFieldSave('email')}
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
                                        onClick={() => setEditing({ ...editing, email: false })}
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
                                <div
                                    onClick={() => setEditing({ ...editing, email: true })}
                                    style={{ padding: '0.5rem', cursor: 'pointer' }}
                                >
                                    {userInfo.email || 'Clique para editar'}
                                </div>
                            )}
                        </div>

                        {/* Empresa */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontWeight: 'bold' }}>Empresa:</label>
                            {editing.company ? (
                                <>
                                    <input
                                        type="text"
                                        value={userInfo.company}
                                        onChange={(e) =>
                                            setUserInfo({ ...userInfo, company: e.target.value })
                                        }
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                        required
                                    />
                                    <button
                                        onClick={() => handleFieldSave('company')}
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
                                        onClick={() => setEditing({ ...editing, company: false })}
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
                                <div
                                    onClick={() => setEditing({ ...editing, company: true })}
                                    style={{ padding: '0.5rem', cursor: 'pointer' }}
                                >
                                    {userInfo.company || 'Clique para editar'}
                                </div>
                            )}
                        </div>

                        {/* Telefone */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontWeight: 'bold' }}>Telefone:</label>
                            {editing.telefone ? (
                                <>
                                    <input
                                        type="text"
                                        value={userInfo.telefone}
                                        onChange={(e) =>
                                            setUserInfo({ ...userInfo, telefone: e.target.value })
                                        }
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                        required
                                    />
                                    <button
                                        onClick={() => handleFieldSave('telefone')}
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
                                        onClick={() => setEditing({ ...editing, telefone: false })}
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
                                <div
                                    onClick={() => setEditing({ ...editing, telefone: true })}
                                    style={{ padding: '0.5rem', cursor: 'pointer' }}
                                >
                                    {userInfo.telefone || 'Clique para editar'}
                                </div>
                            )}
                        </div>
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

    // Ajuste de espaçamento para os botões do menu lateral
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
            <div style={mainContainerStyle}>{renderModuleContent()}</div>
            <footer style={footerStyle}>
                &copy; {new Date().getFullYear()} BiVisualizer. Todos os direitos reservados.
            </footer>
        </div>
    );
}

export default Dashboard;
