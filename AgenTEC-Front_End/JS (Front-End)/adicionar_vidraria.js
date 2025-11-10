document.addEventListener('DOMContentLoaded', function () {
    // Referências aos elementos do formulário
    const btnMinus = document.querySelector('.btn-minus');
    const btnPlus = document.querySelector('.btn-plus');
    const quantityInput = document.getElementById('quantity');
    const confirmButtonSmall = document.querySelector('.btn-confirm-small');
    
    // ATUALIZADO: Referência do novo campo
    const nomeVidrariaInput = document.getElementById('nome_vidraria');
    const tipoVidrariaInput = document.getElementById('tipo_vidraria'); // NOVO: Campo Tipo
    
    const tabelaContainer = document.getElementById('tabela-vidrarias-container');
    const tabelaBody = document.getElementById('tabela-vidrarias-body');
    const confirmButton = document.getElementById('btn-confirmar');

    // Referências aos ELEMENTOS DE MENSAGEM DE ERRO INLINE
    const nomeErrorEl = document.getElementById('nome-error');
    const tipoErrorEl = document.getElementById('tipo-error'); // NOVO: Elemento de erro do Tipo
    const quantityErrorEl = document.getElementById('quantity-error');

    // Referência ao pop-up flutuante de SUCESSO 
    const successNotification = document.getElementById('notification-success');

    let successTimeout; 


    // =========================================================
    // === FUNÇÕES DE UTILIDADE ================================
    // =========================================================

    function clearError(element) {
        if (element && element.classList.contains('visible')) {
            element.classList.remove('visible');
            element.textContent = '';
        }
    }

    function clearAllErrors() {
        clearError(nomeErrorEl);
        clearError(tipoErrorEl); // NOVO: Limpar erro do Tipo
        clearError(quantityErrorEl);
    }
    
    function displayError(element, message) {
        if (element) {
            // Esconde sucesso flutuante se houver erro inline
            if (successNotification && successNotification.classList.contains('show')) {
                successNotification.classList.remove('show');
                if (successTimeout) clearTimeout(successTimeout);
            }
            element.textContent = message;
            element.classList.add('visible');
        }
    }

    function showSuccess(message = 'Ação realizada com sucesso!') {
        clearAllErrors();

        if (successNotification) {
            successNotification.classList.add('show');
            const successMessageSpan = successNotification.querySelector('span');
            if (successMessageSpan) {
                successMessageSpan.textContent = message;
            }

            successTimeout = setTimeout(() => {
                successNotification.classList.remove('show');
            }, 3000); 
        }
    }
    
    /**
     * Adiciona o event listener ao botão de remoção para excluir a linha.
     * @param {HTMLElement} button O elemento <button> de remoção.
     */
    function setupRemoveButton(button) {
        button.addEventListener('click', function() {
            // Encontra a linha (tr) mais próxima do botão clicado e a remove
            const rowToRemove = button.closest('tr');
            if (rowToRemove) {
                rowToRemove.remove();
                showSuccess('Vidraria removida da lista.');

                // Opcional: Esconder a tabela se não houver mais itens
                if (tabelaBody.children.length === 0) {
                    tabelaContainer.style.display = 'none';
                }
            }
        });
    }

    // =========================================================
    // === LÓGICA DE STEPPER E LIMPEZA =========================
    // =========================================================
    if (btnMinus && btnPlus && quantityInput) {
        btnMinus.addEventListener('click', function () {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 0) {
                quantityInput.value = currentValue - 1;
                clearError(quantityErrorEl); 
            }
        });

        btnPlus.addEventListener('click', function () {
            let currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
            clearError(quantityErrorEl);
        });
    }

    if (nomeVidrariaInput) {
        nomeVidrariaInput.addEventListener('input', () => {
            clearError(nomeErrorEl);
        });
    }
    
    // NOVO: Limpar erro do Tipo ao digitar
    if (tipoVidrariaInput) {
        tipoVidrariaInput.addEventListener('input', () => {
            clearError(tipoErrorEl);
        });
    }


    // =========================================================
    // === LÓGICA DE ADICIONAR ITEM NA TABELA (Atualizada) =====
    // =========================================================
    if (confirmButtonSmall) {
        confirmButtonSmall.addEventListener('click', function() {
            clearAllErrors(); 
            
            const nome = nomeVidrariaInput.value.trim();
            const tipo = tipoVidrariaInput.value.trim(); // NOVO: Obter o tipo
            const qtde = parseInt(quantityInput.value);

            // 1. VALIDAR OS DADOS (ERRO INLINE!)
            if (nome === '') {
                displayError(nomeErrorEl, 'Por favor, insira o nome da vidraria.');
                nomeVidrariaInput.focus(); 
                return;
            }
            // NOVO: Validação do campo Tipo
            if (tipo === '') {
                displayError(tipoErrorEl, 'Por favor, insira o tipo da vidraria.');
                tipoVidrariaInput.focus();
                return;
            }
            if (qtde <= 0) {
                displayError(quantityErrorEl, 'A quantidade deve ser maior que zero.');
                return;
            }

            // 2. Se a validação passou, continua com a lógica de adição:
            tabelaContainer.style.display = 'block';

            const newRow = document.createElement('tr');
            
            const cellNome = document.createElement('td');
            // ATUALIZADO: Combinar Nome e Tipo na exibição da tabela
            cellNome.textContent = `${nome} (${tipo})`;
            
            const cellQtde = document.createElement('td');
            cellQtde.textContent = qtde;
            
            // 3. Célula para o botão de remoção
            const cellAcao = document.createElement('td'); 
            const removeButton = document.createElement('button');
            removeButton.classList.add('btn-remover-item');
            removeButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Ícone de lixeira
            
            // Adiciona o listener de clique no botão 
            setupRemoveButton(removeButton); 
            
            cellAcao.appendChild(removeButton);

            // 4. Adicionar as células à linha
            newRow.appendChild(cellNome);
            newRow.appendChild(cellQtde);
            newRow.appendChild(cellAcao); // Adiciona a nova célula de ação

            tabelaBody.appendChild(newRow);

            // 5. Limpar os campos e mostrar sucesso na adição
            nomeVidrariaInput.value = '';
            tipoVidrariaInput.value = ''; // NOVO: Limpar campo Tipo
            quantityInput.value = '0';
            nomeVidrariaInput.focus();
            
            showSuccess('Vidraria adicionada à lista!'); 
        });
    }


    // =========================================================
    // === LÓGICA DO BOTÃO "CONFIRMAR" (Finalizar Pedido) ======
    // =========================================================
    if (confirmButton) {
        confirmButton.addEventListener('click', function(event) {
            event.preventDefault(); 
            clearAllErrors();

            // Verifica se há itens na tabela antes de confirmar
            if (tabelaBody.children.length === 0) {
                // Como não há um elemento de erro específico para a tabela, usamos o do nome
                displayError(nomeErrorEl, 'Adicione pelo menos uma vidraria antes de confirmar.');
                nomeVidrariaInput.focus(); 
                return;
            }
            
            // Lógica para coletar e enviar todos os dados
            const dadosParaEnvio = Array.from(tabelaBody.children).map(row => {
                const nomeCompleto = row.cells[0].textContent; // Ex: "Béquer 250ml (Béquer)"
                const quantidade = parseInt(row.cells[1].textContent);
                
                // Regex para extrair nome e tipo da string combinada
                const match = nomeCompleto.match(/(.*) \((.*)\)/);
                
                return {
                    nome: match ? match[1].trim() : nomeCompleto,
                    tipo: match ? match[2].trim() : 'N/A',
                    quantidade: quantidade
                };
            });
            
            console.log('Dados de vidrarias prontos para envio:', dadosParaEnvio);

            // 1. Mostra a notificação de SUCESSO (pop-up flutuante)
            showSuccess('Adição de vidrarias finalizada com sucesso!');

            // 2. Espera 1.5 segundos e depois redireciona
            setTimeout(() => {
                window.location.href = 'administradores.html'; 
            }, 1500); 
        });
    }

    // Código da busca do cabeçalho (mantido por contexto)
    const campoBuscaHeader = document.getElementById('campo-busca');
    if (campoBuscaHeader) {
        campoBuscaHeader.addEventListener('input', function () {
            // Lógica de busca global
        });
    }
});