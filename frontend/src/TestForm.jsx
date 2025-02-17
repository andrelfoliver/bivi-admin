import React, { useState } from 'react';

function TestForm() {
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("TestForm: handleSubmit acionado");
    try {
      const response = await fetch('/register-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: "Empresa Teste" }),
      });
      console.log("Status da resposta:", response.status);
      const data = await response.json();
      console.log("Resposta do servidor:", data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Testar Envio</button>
      {success && <p>Sucesso!</p>}
    </form>
  );
}

export default TestForm;
