import React, { useState } from 'react';

function Settings({ onLogout }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await fetch('/api/user/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Erro ao atualizar senha.");
            } else {
                setMessage(data.message);
                // Opcional: Limpar os campos
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (err) {
            setError("Erro ao enviar dados: " + err.message);
        }
    };

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
