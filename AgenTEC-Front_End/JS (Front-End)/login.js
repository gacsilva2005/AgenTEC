// Arquivo: ../JS (Front-End)/login.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Pega o formulário pelo ID
    const loginForm = document.getElementById('loginForm');
    
    // Certifica-se de que o formulário existe antes de adicionar o listener
    if (!loginForm) {
        console.error('Formulário com ID "loginForm" não encontrado.');
        return;
    }

    loginForm.addEventListener('submit', async function(event) {
        // Impede o envio padrão do formulário (evita recarregar a página)
        event.preventDefault(); 
        
        // 2. Coleta os valores dos campos
        const emailInput = document.getElementById('email');
        const senhaInput = document.getElementById('senha');
        
        const email = emailInput.value.trim();
        const senha = senhaInput.value;
        
        // (Opcional) Elemento para exibir mensagens de erro/sucesso
        let messageElement = document.getElementById('loginMessage');
        if (!messageElement) {
            // Se o elemento não existir, cria ele para exibir mensagens
            messageElement = document.createElement('p');
            messageElement.id = 'loginMessage';
            loginForm.after(messageElement); // Insere após o formulário
        }
        
        // 3. Verifica se os campos estão preenchidos (embora o 'required' no HTML ajude)
        if (!email || !senha) {
            messageElement.textContent = 'Por favor, preencha o e-mail e a senha.';
            messageElement.style.color = 'red';
            return;
        }

        // 4. Configurações para a requisição POST
        const data = { email, senha };
        const serverUrl = 'http://localhost:3000/login'; // Verifique se a porta está correta (3000 é a do seu Server.js)

        try {
            messageElement.textContent = 'Tentando autenticar...';
            messageElement.style.color = 'gray';

            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: {
                    // CRUCIAL: Diz ao Express que o corpo é JSON para o body-parser funcionar
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(data) // Converte o objeto JS para uma string JSON
            });

            // Converte a resposta do servidor (que será um JSON)
            const result = await response.json(); 

            // 5. Trata a resposta do servidor
            if (response.ok && result.success) { // Status 200-299 e success: true
                messageElement.textContent = 'Login realizado com sucesso! Redirecionando...';
                messageElement.style.color = 'green';
                
                // *** Ação de Sucesso: Redirecionar para a área logada (exemplo) ***
                setTimeout(() => {
                    window.location.href = '../HTML/AdmScreen/administradores.html'; // Altere para a página correta
                }, 1500);

            } else { // Erro de autenticação (401) ou outro erro do servidor
                const errorMessage = result.message || 'Erro de autenticação desconhecido.';
                messageElement.textContent = `Erro: ${errorMessage}`;
                messageElement.style.color = 'red';
            }

        } catch (error) {
            // Erro de rede (servidor offline ou CORS bloqueando)
            messageElement.textContent = 'Falha ao conectar ao servidor. Verifique se o back-end está rodando.';
            messageElement.style.color = 'red';
            console.error('Erro na requisição fetch:', error);
        }
    });
});