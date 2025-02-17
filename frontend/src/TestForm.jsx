import React, { useState } from 'react';

function TestForm() {
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit acionado");
    try {
      const response = await fetch('/register-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: "valor" }), // Dados de teste
      });
      const data = await response.json();
      console.log("Resposta do servidor:", data);
      setSuccess(true);
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Salvar Configuração</button>
      {success && <p>Sucesso!</p>}
    </form>
  );
}

export default TestForm;
