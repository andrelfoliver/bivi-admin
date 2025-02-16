import React from 'react';
import { Container, Form, Button, Navbar, Nav } from 'react-bootstrap';

function App() {
  return (
    <>
      {/* Navbar com identidade visual personalizada */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
            Bivisualizer
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link href="#">Configuração</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Container para centralizar o formulário */}
      <Container className="d-flex vh-100">
        <div className="m-auto w-50">
          <h1 className="text-center mb-4" style={{ color: '#003366' }}>
            Configuração da Empresa
          </h1>
          <Form>
            <Form.Group className="mb-3" controlId="formEmpresaNome">
              <Form.Label>Nome da Empresa</Form.Label>
              <Form.Control type="text" placeholder="Digite o nome da empresa" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmpresaAPI">
              <Form.Label>API Key OpenAI</Form.Label>
              <Form.Control type="text" placeholder="Digite a API Key" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmpresaTelefone">
              <Form.Label>Telefone</Form.Label>
              <Form.Control type="text" placeholder="Digite o telefone" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmpresaEmail">
              <Form.Label>E-mail para Contato</Form.Label>
              <Form.Control type="email" placeholder="Digite o e-mail" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmpresaSaudacao">
              <Form.Label>Saudação</Form.Label>
              <Form.Control type="text" placeholder="Mensagem de saudação" />
            </Form.Group>
            <div className="d-grid">
              <Button variant="warning" type="submit" size="lg" style={{ fontWeight: 'bold' }}>
                Salvar Configuração
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </>
  );
}

export default App;
