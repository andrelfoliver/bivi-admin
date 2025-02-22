// src/History.jsx
import React, { useEffect, useState } from 'react';

const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '1.5rem',
    marginBottom: '1rem'
};

const styles = {
    filters: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '15px',
        marginBottom: '20px',
        alignItems: 'center'
    },
    filterInput: {
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #b2eae6',
        borderRadius: '5px',
        transition: 'all 0.2s'
    },
    filterButton: {
        padding: '10px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: '#5de5d9',
        color: '#fff',
        transition: 'background-color 0.2s'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px'
    },
    th: {
        padding: '12px 15px',
        textAlign: 'left',
        backgroundColor: '#5de5d9',
        color: '#fff'
    },
    td: {
        padding: '12px 15px',
        textAlign: 'left',
        borderBottom: '1px solid #ddd'
    },
    paginationContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        marginTop: '20px'
    },
    paginationButton: {
        backgroundColor: '#5de5d9',
        border: 'none',
        color: '#fff',
        padding: '10px 15px',
        cursor: 'pointer',
        borderRadius: '5px',
        fontSize: '16px',
        transition: 'background-color 0.3s'
    },
    paginationActive: {
        backgroundColor: '#272631'
    }
};

function History() {
    const [messages, setMessages] = useState([]);
    const [nameFilter, setNameFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [userType, setUserType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Constrói a URL da API com filtros e paginação
    const buildApiUrl = (page) => {
        let url = `/api/historico?page=${page}`;
        if (nameFilter.trim() !== '') {
            url += `&name=${encodeURIComponent(nameFilter)}`;
        }
        if (startDate) {
            url += `&startDate=${encodeURIComponent(startDate)}`;
        }
        if (endDate) {
            url += `&endDate=${encodeURIComponent(endDate)}`;
        }
        if (userType) {
            url += `&userType=${encodeURIComponent(userType)}`;
        }
        return url;
    };

    // Função para buscar as mensagens
    const fetchMessages = async (page = 1) => {
        try {
            const response = await fetch(buildApiUrl(page), { credentials: 'include' });
            if (!response.ok) throw new Error('Falha ao carregar mensagens');
            const data = await response.json();
            setMessages(data.mensagens);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Erro ao buscar mensagens:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const applyFilters = () => {
        fetchMessages(1);
    };

    const resetFilters = () => {
        setNameFilter('');
        setStartDate('');
        setEndDate('');
        setUserType('');
        fetchMessages(1);
    };

    const changePage = (offset) => {
        const newPage = currentPage + offset;
        if (newPage >= 1 && newPage <= totalPages) {
            fetchMessages(newPage);
        }
    };

    const downloadCSV = () => {
        window.location.href = '/api/historico/export-csv';
    };

    const renderRows = () => {
        if (messages.length === 0) {
            return (
                <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>
                        Nenhuma mensagem encontrada.
                    </td>
                </tr>
            );
        }
        return messages.map((msg) => (
            <tr key={msg._id}>
                <td style={styles.td}>{msg.name || 'Desconhecido'}</td>
                <td style={styles.td}>{msg.sender || 'Não informado'}</td>
                <td style={styles.td}>{msg.email || 'Não informado'}</td>
                <td style={styles.td}>{new Date(msg.timestamp).toLocaleString('pt-BR')}</td>
                <td style={styles.td}>{msg.message}</td>
            </tr>
        ));
    };

    return (
        <div style={cardStyle}>
            <h2>Histórico de Mensagens</h2>
            <div style={styles.filters}>
                <input
                    type="text"
                    placeholder="Filtrar por nome"
                    style={styles.filterInput}
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                />
                <input
                    type="date"
                    style={styles.filterInput}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    style={styles.filterInput}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <select
                    style={styles.filterInput}
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                >
                    <option value="">Todos os usuários</option>
                    <option value="IA">IA</option>
                    <option value="Usuário">Usuário</option>
                </select>
                <button style={styles.filterButton} onClick={applyFilters}>
                    Filtrar
                </button>
                <button style={styles.filterButton} onClick={resetFilters}>
                    Resetar Filtros
                </button>
                <button style={styles.filterButton} onClick={downloadCSV}>
                    Exportar para CSV
                </button>
                <button
                    style={{ ...styles.filterButton, backgroundColor: '#e53e3e' }}
                    onClick={() => window.history.back()}
                >
                    Voltar
                </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Nome</th>
                            <th style={styles.th}>Telefone</th>
                            <th style={styles.th}>E‑mail</th>
                            <th style={styles.th}>Data/Hora</th>
                            <th style={styles.th}>Mensagem</th>
                        </tr>
                    </thead>
                    <tbody>{renderRows()}</tbody>
                </table>
            </div>
            <div style={styles.paginationContainer}>
                <button
                    style={styles.paginationButton}
                    onClick={() => changePage(-1)}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                <span>
                    {currentPage} / {totalPages}
                </span>
                <button
                    style={styles.paginationButton}
                    onClick={() => changePage(1)}
                    disabled={currentPage === totalPages}
                >
                    Próximo
                </button>
            </div>
        </div>
    );
}

export default History;
