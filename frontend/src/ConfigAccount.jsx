// src/ConfigAccount.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ConfigAccount({ user }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const validatePassword = (password) => {
        // Exemplo de critérios de senha (mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula e um dígito)
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        // Verifica se as senhas atendem aos critérios
        if (!validatePassword(newPassword)) {
            setErrorMsg(
                "A nova senha deve ter no mínimo 8 caracteres, incluir pelo menos uma letra maiúscula, uma minúscula e um dígito."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMsg("As senhas não coincidem.");
            return;
        }

        try {
            const response = await fetch('/api/user/change-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });
            if (response.ok) {
                setSuccessMsg("Senha alterada com sucesso!");
                // Opcional: limpar os campos
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                const data = await response.json();
                setErrorMsg(data.error || "Erro ao alterar a senha.");
            }
        } catch (error) {
            setErrorMsg("Erro de conexão. Tente novamente.");
        }
    };

    // Se o usuário não for autenticado de forma manual, exibe mensagem informativa
    if (user.provider !== 'local') {
        return (
            <div>
                <h2>Alterar Senha</h2>
                <p>
                    Você está autenticado via <strong>{user.provider}</strong>. Para alterar sua senha, acesse a página do seu provedor (ex.: Google).
                </p>
            </div>
        );
    }

    return (
        <div>
            <h2>Alterar Senha</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#5de5d9', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>
                    Alterar Senha
                </button>
            </form>
            {errorMsg && <p style={{ color: 'red', marginTop: '1rem' }}>{errorMsg}</p>}
            {successMsg && <p style={{ color: 'green', marginTop: '1rem' }}>{successMsg}</p>}
        </div>
    );
}

export default ConfigAccount;
