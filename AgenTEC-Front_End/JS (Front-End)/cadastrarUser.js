document.addEventListener('DOMContentLoaded', () => {
    const classSelectors = document.querySelectorAll('.class-selector');
    const roleInput = document.getElementById('role');

    classSelectors.forEach(btn => {
        btn.addEventListener('click', () => {
            // Atualiza o input escondido com o valor da função
            roleInput.value = btn.getAttribute('data-role');

            // Marcar visualmente o selecionado (opcional)
            classSelectors.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    const form = document.querySelector('form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;
        const funcao = roleInput.value;

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }

        if (!funcao) {
            alert('Selecione a função do usuário.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/cadastrar-usuario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha, funcao })
            });

            const result = await response.json();
            alert(result.message);
        } catch (err) {
            console.error(err);
            alert('Erro ao cadastrar usuário.');
        }
    });
});
