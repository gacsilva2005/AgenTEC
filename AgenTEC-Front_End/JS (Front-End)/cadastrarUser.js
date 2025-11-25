document.addEventListener('DOMContentLoaded', () => {
    const classSelectors = document.querySelectorAll('.class-selector');
    const roleInput = document.getElementById('role');
    const form = document.getElementById('cadastroForm');
    
    // Elemento de mensagem geral de sucesso/falha (se mantiver no HTML, ex: <p id="cadastroMessage"></p>)
    const messageEl = document.getElementById('cadastroMessage'); 
    
    // Elementos de erro específicos
    const emailErrorEl = document.getElementById('email-error');
    const senhaErrorEl = document.getElementById('senha-error');
    const confirmarSenhaErrorEl = document.getElementById('confirmar-senha-error');
    
    // Inputs para manipulação da classe 'error' (borda vermelha)
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const confirmarSenhaInput = document.getElementById('confirmar-senha');

    // Função para limpar todas as mensagens e classes de erro
    const clearErrors = () => {
        // Limpar texto de erro e remover a classe de visualização dinâmica
        emailErrorEl.textContent = '';
        emailErrorEl.classList.remove('show-error'); 
        
        senhaErrorEl.textContent = '';
        senhaErrorEl.classList.remove('show-error');
        
        confirmarSenhaErrorEl.textContent = '';
        confirmarSenhaErrorEl.classList.remove('show-error');

        if (messageEl) messageEl.textContent = ''; 

        // Remover classe de borda vermelha dos inputs
        nomeInput.classList.remove('error');
        emailInput.classList.remove('error');
        senhaInput.classList.remove('error');
        confirmarSenhaInput.classList.remove('error');
    };

    // --- Lógica para mostrar/ocultar senha ---
    const toggleSenhaIcons = document.querySelectorAll('.toggle-senha');

    toggleSenhaIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const targetId = icon.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
            passwordInput.focus();
        });
    });
    // ------------------------------------------

    // Seleção de função
    classSelectors.forEach(btn => {
        btn.addEventListener('click', () => {
            roleInput.value = btn.getAttribute('data-role');
            classSelectors.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    // Submissão do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors(); // Limpa erros anteriores no início da submissão
        
        // Coleta de dados
        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();
        const senha = senhaInput.value;
        const confirmarSenha = confirmarSenhaInput.value;
        const funcao = roleInput.value;
        let hasError = false; // Flag para parar a submissão se houver erro

        // VALIDAÇÕES
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;

        // 1. Preenchimento de Campos
        if (!nome || !email || !senha || !confirmarSenha) {
            if (!nome) nomeInput.classList.add('error');
            if (!email) emailInput.classList.add('error');
            if (!senha) senhaInput.classList.add('error');
            if (!confirmarSenha) confirmarSenhaInput.classList.add('error');
            
            // Usamos a mensagem geral para o erro de preenchimento
            if (messageEl) {
                messageEl.textContent = 'Preencha todos os campos.';
                messageEl.style.color = 'red';
            }
            hasError = true;
        }

        // 2. Validação de Formato de E-mail
        if (email && !emailRegex.test(email)) {
            emailErrorEl.textContent = 'Por favor, insira um e-mail válido.';
            emailErrorEl.classList.add('show-error');
            emailInput.classList.add('error');
            hasError = true;
        }

        // 3. Validação de Complexidade da Senha
        if (senha && !senhaRegex.test(senha)) {
            senhaErrorEl.textContent = 'A senha deve conter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma minúscula e um número.';
            senhaErrorEl.classList.add('show-error');
            senhaInput.classList.add('error');
            hasError = true;
        }

        // 4. Senhas Coincidentes
        if (senha && confirmarSenha && senha !== confirmarSenha) {
            confirmarSenhaErrorEl.textContent = 'As senhas não coincidem!';
            confirmarSenhaErrorEl.classList.add('show-error');
            confirmarSenhaInput.classList.add('error');
            hasError = true;
        }
        
        // Se houver qualquer erro de campo específico, paramos aqui
        if (hasError) {
            return;
        }

        // 5. Seleção de Função (se não houver outros erros, verifica a função)
        if (!funcao) {
            if (messageEl) {
                messageEl.textContent = 'Selecione a função do usuário.';
                messageEl.style.color = 'red';
            }
            return;
        }

        // --- Se não houver erros de validação, procede com o envio ---
        if (messageEl) {
            messageEl.textContent = 'Enviando cadastro...';
            messageEl.style.color = 'gray';
        }

        try {
            const response = await fetch('http://localhost:3000/api/cadastrar-usuario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha, funcao })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                if (messageEl) {
                    messageEl.textContent = result.message;
                    messageEl.style.color = 'green';
                }
                form.reset();
                roleInput.value = '';
                classSelectors.forEach(b => b.classList.remove('selected'));
            } else {
                if (messageEl) {
                    messageEl.textContent = result.message || 'Erro ao cadastrar usuário.';
                    messageEl.style.color = 'red';
                }
            }
        } catch (err) {
            console.error('Erro ao cadastrar usuário:', err);
            if (messageEl) {
                messageEl.textContent = 'Erro ao conectar ao servidor.';
                messageEl.style.color = 'red';
            }
        }
    });
});