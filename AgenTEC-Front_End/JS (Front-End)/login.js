document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) {
        console.error('Formulário com ID "loginForm" não encontrado.');
        return;
    }

    // Função para exibir notificações
    function showMessage(message, isSuccess = false) {
        // Remove notificação anterior se existir
        const existingMessage = document.getElementById('notificationMessage');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Cria elemento de notificação
        const messageElement = document.createElement('div');
        messageElement.id = 'notificationMessage';
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            background-color: ${isSuccess ? '#4CAF50' : '#f44336'};
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;

        document.body.appendChild(messageElement);

        // Animação de entrada
        setTimeout(() => {
            messageElement.style.opacity = '1';
        }, 10);

        // Remove após 5 segundos (ou 3 segundos para sucesso)
        const duration = isSuccess ? 3000 : 5000;
        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 300);
        }, duration);
    }

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        
        const emailInput = document.getElementById('email');
        const senhaInput = document.getElementById('senha');
        
        const email = emailInput.value.trim();
        const senha = senhaInput.value;
        
        if (!email || !senha) {
            showMessage('Por favor, preencha o e-mail e a senha.', false);
            return;
        }

        const data = { email, senha };
        const serverUrl = 'http://localhost:3000/login';

        try {
            showMessage('Tentando autenticar...', true);

            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                showMessage('Login realizado com sucesso! Redirecionando...', true);
                
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
                        showMessage('Tipo de usuário desconhecido. Verifique o servidor.', false);
                    }
                }, 1500);

            } else {
                const errorMessage = result.message || 'Erro de autenticação desconhecido.';
                showMessage(`Erro: ${errorMessage}`, false);
            }

        } catch (error) {
            console.error('Erro completo:', error);
            
            // Verifica se é erro de rede
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                showMessage('Erro de rede: servidor não está acessível.', false);
            }
            // Verifica se é JSON inválido
            else if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
                showMessage('Erro: resposta do servidor não é JSON válido.', false);
            }
            else {
                showMessage('Erro inesperado. Veja o console.', false);
            }
        }
    });
});