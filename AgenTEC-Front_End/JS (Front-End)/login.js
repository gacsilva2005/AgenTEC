    document.addEventListener('DOMContentLoaded', () => {
        const loginForm = document.getElementById('loginForm');
        
        if (!loginForm) {
            console.error('Formulário com ID "loginForm" não encontrado.');
            return;
        }

        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault(); 
            
            const emailInput = document.getElementById('email');
            const senhaInput = document.getElementById('senha');
            
            const email = emailInput.value.trim();
            const senha = senhaInput.value;
            
            let messageElement = document.getElementById('loginMessage');
            if (!messageElement) {
                messageElement = document.createElement('p');
                messageElement.id = 'loginMessage';
                loginForm.after(messageElement);
            }
            
            if (!email || !senha) {
                messageElement.textContent = 'Por favor, preencha o e-mail e a senha.';
                messageElement.style.color = 'red';
                return;
            }

            const data = { email, senha };
            const serverUrl = 'http://localhost:3000/login';

            try {
                messageElement.textContent = 'Tentando autenticar...';
                messageElement.style.color = 'gray';

                const response = await fetch(serverUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    messageElement.textContent = 'Login realizado com sucesso! Redirecionando...';
                    messageElement.style.color = 'green';
                    
                    // Identifica o tipo retornado pelo servidor
                    const tipo = result.usuario?.tipo;

                    setTimeout(() => {
                        if (tipo === 'administrador') {
                            window.location.href = '../HTML/AdmScreen/administradores.html';
                        } else if (tipo === 'professor') {
                            window.location.href = '../HTML/ProfScreen/professor.html';
                        } else if (tipo === 'tecnico'){
                            window.location.href = '../HTML/TecScreen/tecnicos.html';
                        } else{
                            alert('Tipo de usuário desconhecido. Verifique o servidor.');
                        }
                    }, 1500);

                } else {
                    const errorMessage = result.message || 'Erro de autenticação desconhecido.';
                    messageElement.textContent = `Erro: ${errorMessage}`;
                    messageElement.style.color = 'red';
                }

            } catch (error) {
                console.error('Erro completo:', error);
                console.error('Nome:', error.name);
                console.error('Mensagem:', error.message);
                console.error('Stack:', error.stack);
            
                // Verifica se é erro de rede
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    messageElement.textContent = 'Erro de rede: servidor não está acessível.';
                }
                // Verifica se é JSON inválido
                else if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
                    messageElement.textContent = 'Erro: resposta do servidor não é JSON válido.';
                    console.log('Resposta bruta do servidor:', error.response?.data);
                }
                else {
                    messageElement.textContent = 'Erro inesperado. Veja o console.';
                }
                messageElement.style.color = 'red';
            }
        });
    });
