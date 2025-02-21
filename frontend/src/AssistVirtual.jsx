import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const AssistVirtual = ({ onClose }) => {
    const [assistentes, setAssistentes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedAssistente, setSelectedAssistente] = useState(null);
    const [msg, setMsg] = useState('');

    // Busca as empresas que possuem assistente virtual cadastrada
    const fetchAssistentes = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/companies', { credentials: 'include' });
            const data = await response.json();
            // Filtra as empresas com o campo "nomeAssistenteVirtual" preenchido
            const filtered = data.filter(comp => comp.nomeAssistenteVirtual && comp.nomeAssistenteVirtual.trim() !== '');
            setAssistentes(filtered);
        } catch (error) {
            console.error("Erro ao buscar assistentes virtuais:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssistentes();
    }, []);

    // Função para excluir uma assistente virtual
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/companies/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                setMsg('Assistente virtual excluída com sucesso!');
                fetchAssistentes();
                setSelectedAssistente(null);
            } else {
                setMsg('Erro ao excluir assistente virtual.');
            }
        } catch (error) {
            setMsg('Erro ao excluir assistente virtual: ' + error.message);
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Assistentes Virtuais Cadastradas</h2>
            {loading && <p>Carregando assistentes virtuais...</p>}
            {msg && <p style={{ color: '#5de5d9' }}>{msg}</p>}
            {!loading && assistentes.length === 0 && <p>Nenhuma assistente virtual cadastrada.</p>}
            {!loading && assistentes.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#5de5d9', color: '#000' }}>
                            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Nome da Assistente Virtual</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assistentes.map((assist) => (
                            <tr key={assist._id} style={{ borderBottom: '1px solid #ccc' }}>
                                <td
                                    style={{ padding: '0.75rem', cursor: 'pointer' }}
                                    onClick={() => setSelectedAssistente(assist)}
                                >
                                    {assist.nomeAssistenteVirtual}
                                </td>
                                <td style={{ padding: '0.75rem' }}>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(assist._id)}>
                                        Excluir
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal para exibir os detalhes da assistente virtual */}
            {selectedAssistente && (
                <Modal show onHide={() => setSelectedAssistente(null)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Detalhes da Assistente Virtual</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <pre style={{
                            backgroundColor: '#f8f9fa',
                            padding: '1rem',
                            borderRadius: '4px',
                            maxHeight: '400px',
                            overflowY: 'auto'
                        }}>
                            {JSON.stringify(selectedAssistente, null, 2)}
                        </pre>
                        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            Você pode copiar os dados conforme necessário.
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setSelectedAssistente(null)}>
                            Fechar
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Botão para fechar o componente e voltar ao Dashboard 
            <Button variant="primary" style={{ marginTop: '1rem' }} onClick={onClose}>
                Voltar
            </Button>*/}
        </div>
    );
};

export default AssistVirtual;
