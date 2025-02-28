// src/Settings.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Settings({ user, onLogout }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Validação da senha: mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula, um dígito e um caractere especial.
    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError("A nova senha e a confirmação não coincidem.");
            return;
        }
        if (!validatePassword(newPassword)) {
            setError("A nova senha deve ter no mínimo 8 caracteres, com pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.");
            return;
        }

        try {
            const response = await fetch('/api/user/change-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Erro ao atualizar a senha.");
            } else {
                setMessage(data.message || "Senha atualizada com sucesso!");
                // Limpa os campos após sucesso
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (err) {
            setError("Erro ao enviar dados: " + err.message);
        }
    };

    // Se o usuário não for autenticado de forma manual, exibe mensagem informativa
    if (user.provider !== 'local') {
        return (
            <div style={{ padding: '1rem' }}>
                <h2>Alterar Senha</h2>
                <p>
                    Você está autenticado via <strong>{user.provider}</strong>. Para alterar sua senha, acesse a página do seu provedor (ex.: Google).
                </p>
            </div>
        );
    }

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Alterar Senha</h2>
            <form onSubmit={handlePasswordChange}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Senha Atual:</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nova Senha:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Confirmar Nova Senha:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#5de5d9',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#fff',
                        cursor: 'pointer'
                    }}
                >
                    Atualizar Senha
                </button>
            </form>
            {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </div>
    );
}

export default Settings;
