    document.addEventListener('DOMContentLoaded', () => {
        const classSelectors = document.querySelectorAll('.class-selector');
        const roleInput = document.getElementById('role');
        const form = document.getElementById('cadastroForm');
        const messageEl = document.getElementById('cadastroMessage');

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

            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmar-senha').value;
            const funcao = roleInput.value;

            // Validações
            if (!nome || !email || !senha || !confirmarSenha) {
                messageEl.textContent = 'Preencha todos os campos.';
                messageEl.style.color = 'red';
                return;
            }

            if (senha !== confirmarSenha) {
                messageEl.textContent = 'As senhas não coincidem!';
                messageEl.style.color = 'red';
                return;
            }

            if (!funcao) {
                messageEl.textContent = 'Selecione a função do usuário.';
                messageEl.style.color = 'red';
                return;
            }

            // Envio para o servidor
            messageEl.textContent = 'Enviando cadastro...';
            messageEl.style.color = 'gray';

            try {
                const response = await fetch('http://localhost:3000/api/cadastrar-usuario', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, senha, funcao })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    messageEl.textContent = result.message;
                    messageEl.style.color = 'green';
                    form.reset();
                    roleInput.value = '';
                    classSelectors.forEach(b => b.classList.remove('selected'));
                } else {
                    messageEl.textContent = result.message || 'Erro ao cadastrar usuário.';
                    messageEl.style.color = 'red';
                }
            } catch (err) {
                console.error('Erro ao cadastrar usuário:', err);
                messageEl.textContent = 'Erro ao conectar ao servidor.';
                messageEl.style.color = 'red';
            }
        });
    });
