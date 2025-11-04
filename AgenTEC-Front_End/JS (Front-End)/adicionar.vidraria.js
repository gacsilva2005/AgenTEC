document.addEventListener('DOMContentLoaded', function () {
    const campoBuscaHeader = document.getElementById('campo-busca');
    if (campoBuscaHeader) {
    campoBuscaHeader.addEventListener('input', function () {
        // Add your logic here for the input event
        });
    }
        const btnMinus = document.querySelector('.btn-minus');
    const btnPlus = document.querySelector('.btn-plus');
    const quantityInput = document.getElementById('quantity'); // Input da quantidade

    if (btnMinus && btnPlus && quantityInput) {
        btnMinus.addEventListener('click', function () {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 0) {
                quantityInput.value = currentValue - 1;
            }
        });

        btnPlus.addEventListener('click', function () {
            let currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });
    }

    // --- CÓDIGO PARA A PESQUISA LOCAL ---
    const searchButtonLocal = document.querySelector('.search-local-button');
    const searchInputLocal = document.getElementById('search-local-input');
    const searchResultsContainer = document.querySelector('.search-results');
    const searchTermSpan = document.getElementById('search-term');

    if (searchButtonLocal) {
        searchButtonLocal.addEventListener('click', function () {
            const query = searchInputLocal.value;
            if (query.trim() !== '') {
                searchTermSpan.textContent = query;
                searchResultsContainer.style.display = 'block';
                // Lógica de busca real iria aqui
            } else {
                searchResultsContainer.style.display = 'none';
            }
        });
    }

    // --- NOVO CÓDIGO PARA ADICIONAR ITEM NA TABELA ---
    
    // 1. Pegar os elementos
    const confirmButtonSmall = document.querySelector('.btn-confirm-small');
    const nomeVidrariaInput = document.getElementById('nome_vidraria');
    const tabelaContainer = document.getElementById('tabela-vidrarias-container');
    const tabelaBody = document.getElementById('tabela-vidrarias-body');

    if (confirmButtonSmall) {
        // 2. Adicionar o "ouvinte" de clique
        confirmButtonSmall.addEventListener('click', function() {
            
            // 3. Pegar os valores dos inputs
            const nome = nomeVidrariaInput.value;
            const qtde = quantityInput.value;

            // 4. Validar os dados
            if (nome.trim() === '') {
                alert('Por favor, insira o nome da vidraria.');
                nomeVidrariaInput.focus(); // Foca no campo de nome
                return; // Para a execução
            }
            if (parseInt(qtde) <= 0) {
                alert('A quantidade deve ser maior que zero.');
                return; // Para a execução
            }

            // 5. Mostrar a tabela (caso seja a primeira vez)
            tabelaContainer.style.display = 'block';

            // 6. Criar a nova linha e as células
            const newRow = document.createElement('tr');
            
            const cellNome = document.createElement('td');
            cellNome.textContent = nome; // Adiciona o nome
            
            const cellQtde = document.createElement('td');
            cellQtde.textContent = qtde; // Adiciona a quantidade

            // 7. Adicionar as células à linha
            newRow.appendChild(cellNome);
            newRow.appendChild(cellQtde);

            // 8. Adicionar a nova linha ao corpo da tabela
            tabelaBody.appendChild(newRow);

            // 9. (Bônus) Limpar os campos para o próximo item
            nomeVidrariaInput.value = '';
            quantityInput.value = '0';
            nomeVidrariaInput.focus(); // Foca no campo de nome novamente
        });
    }

    // --- LÓGICA DE NOTIFICAÇÃO (Antiga e Nova) ---
    
    // Pega os elementos da notificação e do botão
    const notification = document.getElementById('notification');
    const confirmButton = document.getElementById('btn-confirmar');

    // NOVA LÓGICA: Clique no botão "Confirmar"
    if (confirmButton && notification) {
        confirmButton.addEventListener('click', function(event) {
            event.preventDefault(); 
            notification.classList.add('show');
            setTimeout(() => {
                window.location.href = 'administradores.html'; 
            }, 1500); 
        });
    }
})