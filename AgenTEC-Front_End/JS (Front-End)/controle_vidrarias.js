// controle_vidraria.js

const BACKEND_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    // ======================================================
    // INÍCIO: Lógica dos Formulários de Adicionar (Vidrarias e Reagentes)
    // ======================================================

    // 1. Lógica para os botões de + e - (Genérico para qualquer formulário)
    const setupFormSteppers = () => {
        const increaseButtons = document.querySelectorAll('.btn-plus');
        const decreaseButtons = document.querySelectorAll('.btn-minus');

        const handleStep = (btn, increment) => {
            // Clona o botão para remover ouvintes antigos e evitar cliques duplos
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            newBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Previne comportamentos estranhos de form
                const container = e.target.closest('.quantity-stepper');
                const input = container.querySelector('input');

                if (input) {
                    let value = parseInt(input.value) || 0;
                    if (increment) {
                        input.value = value + 1;
                    } else {
                        if (value > 0) input.value = value - 1;
                    }
                }
            });
        };

        increaseButtons.forEach(btn => handleStep(btn, true));
        decreaseButtons.forEach(btn => handleStep(btn, false));
    };

    // 2. Lógica do Acordeão (Abrir/Fechar abas de "Adicionar")
    const setupAddAccordion = () => {
        // ======================================================
        // INÍCIO: Lógica para ADICIONAR NA TABELA (Vidrarias e Reagentes)
        // ======================================================

        const tabelaBody = document.getElementById('tabela-vidrarias-body');
        const notificationSuccess = document.getElementById('notification-success');

        // Função auxiliar para mostrar notificação
        const showNotification = (msg) => {
            const span = notificationSuccess.querySelector('span');
            if (span) span.textContent = msg;
            notificationSuccess.classList.add('show');
            setTimeout(() => {
                notificationSuccess.classList.remove('show');
            }, 3000);
        };

        // Função que cria a linha na tabela HTML
        const adicionarNaTabela = (nome, tipo, quantidade) => {
            // 1. Remove a linha de "Nenhum item na lista" se ela existir
            const emptyRow = document.getElementById('row-empty');
            if (emptyRow) {
                emptyRow.remove();
            }

            // 2. Cria a nova linha (TR)
            const tr = document.createElement('tr');

            tr.innerHTML = `
            <td>
                <strong>${nome}</strong><br>
                <span style="font-size: 0.9em; color: #666;">${tipo}</span>
            </td>
            <td style="text-align: center;">${quantidade}</td>
            <td style="text-align: center;">
                <button class="btn-remover-item">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;

            // 3. Adiciona funcionalidade ao botão de remover desta nova linha
            const btnRemove = tr.querySelector('.btn-remover-item');
            btnRemove.addEventListener('click', function () {
                tr.remove();
                // Se não sobrar nada, coloca a mensagem de vazio de volta
                if (tabelaBody.children.length === 0) {
                    tabelaBody.innerHTML = `
                    <tr id="row-empty">
                        <td colspan="3" style="text-align:center; font-size:1.2rem; color:#999;">Nenhum item na lista</td>
                    </tr>
                `;
                }
            });

            // 4. Insere a linha na tabela
            tabelaBody.appendChild(tr);
        };

        // --- EVENTO 1: Confirmar VIDRARIA ---
        const btnConfirmVidraria = document.querySelector('.btn-confirm-vidraria');

        if (btnConfirmVidraria) {
            btnConfirmVidraria.addEventListener('click', (e) => {
                e.preventDefault(); // Evita comportamento padrão

                // Pega os valores dos inputs
                const nomeInput = document.getElementById('nome_vidraria');
                const tipoInput = document.getElementById('tipo_vidraria');
                const qtdInput = document.getElementById('quantity');

                const nome = nomeInput.value.trim();
                const tipo = tipoInput.value.trim();
                const qtd = parseInt(qtdInput.value);

                // Validação simples
                if (!nome) {
                    alert("Por favor, digite o nome da vidraria.");
                    return;
                }
                if (qtd <= 0) {
                    alert("A quantidade deve ser maior que zero.");
                    return;
                }

                // Adiciona na tabela
                adicionarNaTabela(nome, tipo, qtd);
                showNotification("Vidraria adicionada à lista!");

                // Limpa os campos
                nomeInput.value = '';
                tipoInput.value = '';
                qtdInput.value = '0';
            });
        }

        // --- EVENTO 2: Confirmar REAGENTE ---
        const btnConfirmReagente = document.querySelector('.btn-confirm-reagente');

        if (btnConfirmReagente) {
            btnConfirmReagente.addEventListener('click', (e) => {
                e.preventDefault();

                // Pega os valores dos inputs (IDs diferentes para reagentes)
                const nomeInput = document.getElementById('nome_reagente');
                const tipoInput = document.getElementById('tipo_reagente');
                const qtdInput = document.getElementById('quantity_reagente');

                const nome = nomeInput.value.trim();
                const tipo = tipoInput.value.trim();
                const qtd = parseInt(qtdInput.value);

                // Validação
                if (!nome) {
                    alert("Por favor, digite o nome do reagente.");
                    return;
                }
                if (qtd <= 0) {
                    alert("A quantidade deve ser maior que zero.");
                    return;
                }

                // Adiciona na tabela
                adicionarNaTabela(nome, tipo, qtd);
                showNotification("Reagente adicionado à lista!");

                // Limpa os campos
                nomeInput.value = '';
                tipoInput.value = '';
                qtdInput.value = '0';
            });
        }
        const accordionHeaders = document.querySelectorAll('.accordion-wrapper .accordion-header');

        accordionHeaders.forEach(acc => {
            // Removemos clones antigos para segurança
            const newAcc = acc.cloneNode(true);
            acc.parentNode.replaceChild(newAcc, acc);

            newAcc.addEventListener("click", function (e) {
                e.preventDefault();
                this.classList.toggle("active");

                // Ícone de seta
                const icon = this.querySelector('i');
                if (icon) icon.style.transform = this.classList.contains("active") ? "rotate(180deg)" : "rotate(0deg)";

                const panel = this.nextElementSibling;
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                    panel.classList.remove("show");
                } else {
                    panel.classList.add("show");
                    // O "+ 50" garante que os botões grandes não sejam cortados
                    panel.style.maxHeight = (panel.scrollHeight + 60) + "px";
                }
            });
        });
    };

    // Executa as funções imediatamente
    setupFormSteppers();
    setupAddAccordion();

    // ======================================================
    // FIM: Lógica dos Formulários
    // ======================================================
    const searchArea = document.getElementById('search-area');
    const accordionContainer = document.getElementById('vidrarias-accordion');

    // Elementos do Modal de Edição
    const editModal = document.getElementById('edit-modal');
    const editCloseBtn = editModal.querySelector('.close-button');
    const confirmBtn = document.getElementById('modal-confirm-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const newQuantityInput = document.getElementById('new-quantity');

    // Elementos do Modal de Sucesso
    const successModal = document.getElementById('success-modal');
    const successMessage = successModal.querySelector('.success-message');
    const successOkBtn = document.getElementById('success-ok-btn');

    // Elementos do Modal de Confirmação (APLICAR)
    const applyConfirmModal = document.getElementById('apply-confirm-modal');
    const applyConfirmBtn = document.getElementById('apply-confirm-btn');
    const applyCancelBtn = document.getElementById('apply-cancel-btn');

    // Variáveis para o body e html (necessário para travar o scroll)
    const body = document.body;
    const html = document.documentElement;

    // Variáveis para guardar o contexto de edição
    let currentItemName = '';
    let currentItemDesc = ''; // Nova variável para a descrição específica (ex: 100ml)
    let currentItemUnit = '';

    // --- LÓGICA DOS BOTÕES + E - (Adicionar Vidrarias e Reagentes) ---
    // Esta função detecta qual botão foi clicado e altera o input vizinho a ele

    // CHAME A FUNÇÃO IMEDIATAMENTE PARA ATIVAR OS BOTÕES
    setupFormSteppers();

    // Lógica para abrir/fechar os formulários de Adicionar
    const accordionHeaders = document.querySelectorAll('.accordion-wrapper .accordion-header');
    accordionHeaders.forEach(acc => {
        acc.addEventListener("click", function () {
            this.classList.toggle("active");
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
                panel.classList.remove("show");
            } else {
                panel.classList.add("show");
                panel.style.maxHeight = (panel.scrollHeight + 50) + "px";
            }
        });
    });

    // --- FUNÇÕES DE CONTROLE DO MODAL DE EDIÇÃO ---
    const showModal = (itemNome, itemDescricao, unidade, quantidadeAtual) => {
        currentItemName = itemNome;
        currentItemDesc = itemDescricao;
        currentItemUnit = unidade;

        // Preenche o modal com os dados atuais
        document.querySelector('.modal-item-name').textContent = itemNome;
        document.getElementById('modal-desc').textContent = itemDescricao; // Novo campo
        document.getElementById('modal-unit').textContent = unidade;
        document.getElementById('modal-current-qty').textContent = quantidadeAtual;
        newQuantityInput.value = quantidadeAtual;
        newQuantityInput.focus();

        editModal.style.display = 'flex';

        // Trava o scroll da página
        body.classList.add('modal-open-noscroll');
        html.classList.add('modal-open-noscroll');
    };

    const hideModal = (modalToHide = editModal) => {
        modalToHide.style.display = 'none';
        newQuantityInput.classList.remove('error');

        // Libera o scroll da página se for o último modal a fechar
        if (editModal.style.display === 'none' && successModal.style.display === 'none' && applyConfirmModal.style.display === 'none') {
            body.classList.remove('modal-open-noscroll');
            html.classList.remove('modal-open-noscroll');
        }
    };

    // --- FUNÇÃO DE CONTROLE DO MODAL DE SUCESSO ---
    const showSuccessModal = (itemName, itemDesc, newQty, unit) => {
        successMessage.textContent = `Quantidade de ${itemName} (${itemDesc}) atualizada para: ${newQty} ${unit}`;
        successModal.style.display = 'flex';

        // Trava o scroll 
        body.classList.add('modal-open-noscroll');
        html.classList.add('modal-open-noscroll');
    };

    // --- FUNÇÃO PARA MOSTRAR O MODAL DE CONFIRMAÇÃO DE APLICAÇÃO ---
    const showApplyConfirmModal = () => {
        applyConfirmModal.style.display = 'flex';
        body.classList.add('modal-open-noscroll');
        html.classList.add('modal-open-noscroll');
    };

    // Event listeners dos Modais
    editCloseBtn.addEventListener('click', () => hideModal(editModal));
    cancelBtn.addEventListener('click', () => hideModal(editModal));
    successOkBtn.addEventListener('click', () => hideModal(successModal));
    applyCancelBtn.addEventListener('click', () => hideModal(applyConfirmModal));

    applyConfirmBtn.addEventListener('click', () => {
        // Ação de aplicar (salvamento seria aqui)
        console.log("Alterações aplicadas e salvando...");

        // Redireciona para tecnicos.html
        window.location.href = 'tecnicos.html';
    });


    // Fechar qualquer modal ao clicar fora
    window.addEventListener('click', (event) => {
        if (event.target == editModal) {
            hideModal(editModal);
        } else if (event.target == successModal) {
            hideModal(successModal);
        } else if (event.target == applyConfirmModal) {
            hideModal(applyConfirmModal);
        }
    });

    // Lógica de Confirmação (Modal de Edição)
    confirmBtn.addEventListener('click', () => {
        const novaQuantidade = parseInt(newQuantityInput.value);

        if (!isNaN(novaQuantidade) && novaQuantidade >= 0) {
            // 1. Atualiza os dados na interface
            updateItemQuantity(currentItemName, currentItemDesc, novaQuantidade, currentItemUnit);

            // 2. Esconde o modal de edição
            hideModal(editModal);

            // 3. Mostra o modal de sucesso 
            showSuccessModal(currentItemName, currentItemDesc, novaQuantidade, currentItemUnit);

        } else {
            alert('Por favor, insira um número inteiro válido (0 ou maior).');
            newQuantityInput.classList.add('error');
            newQuantityInput.focus();
        }
    });

    // --- FUNÇÕES DE LÓGICA DE VIDRARIAS (ADAPTADAS) ---

    // Função para atualizar a quantidade do item específico (vidraria)
    const updateItemQuantity = (nome, descricao, novaQuantidade, unidade) => {
        console.log(`Atualizando ${nome} (${descricao}) para: ${novaQuantidade}`);

        // Encontra a linha de variação específica
        const variationRows = document.querySelectorAll('.variation-row');
        variationRows.forEach(row => {
            const rowItemName = row.closest('.accordion-group-vidraria').dataset.groupName;
            const rowItemDesc = row.querySelector('.variation-desc').textContent.trim();

            // Acha a combinação exata (Nome do Grupo + Descrição da Variação)
            if (rowItemName.toLowerCase() === nome.toLowerCase() && rowItemDesc === descricao) {
                const qtyElement = row.querySelector('.variation-qty');
                const editButton = row.querySelector('.btn-edit');

                if (qtyElement) {
                    qtyElement.textContent = `${novaQuantidade} ${unidade}`;
                    editButton.dataset.itemQty = novaQuantidade; // Atualiza o dataset do botão
                }

                // 1. ATUALIZA O TOTAL DA LINHA PRINCIPAL/GRUPO
                updateGroupTotal(row);

                // 2. Atualiza o texto de busca para refletir o novo valor (opcional, mas bom)
                const mainItemRow = row.closest('.item-card-inner').querySelector('.main-item');
                if (mainItemRow) {
                    const oldSearch = mainItemRow.dataset.search;
                    const newSearch = oldSearch.replace(
                        new RegExp(`\\b${unidade}s\\b`, 'i'),
                        `${novaQuantidade} ${unidade}s`
                    );
                    mainItemRow.dataset.search = newSearch;
                }
            }
        });
    };

    // Função para recalcular o total do grupo
    const updateGroupTotal = (variationRow) => {
        // 1. Encontra o contêiner principal do grupo
        const groupContainer = variationRow.closest('.accordion-group-vidraria');
        if (!groupContainer) return;

        let total = 0;
        const totalQtyElement = groupContainer.querySelector('.item-total');

        // 2. Itera sobre TODAS as linhas de variação para recalcular o total
        groupContainer.querySelectorAll('.variation-row').forEach(row => {
            const qtySpan = row.querySelector('.variation-qty');
            if (qtySpan) {
                // Remove a unidade e converte para número
                const qtyText = qtySpan.textContent.replace(/[^\d]/g, '').trim();
                total += parseInt(qtyText || 0);
            }
        });

        // 3. Atualiza o texto do Total
        if (totalQtyElement) {
            // Assume que vidrarias usam "unidades" no total
            totalQtyElement.textContent = `Total: ${total} unidades`;
        }
    };

    // Funções de Accordion (MANTIDAS)
    const setupAccordion = () => {
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const isActive = header.classList.contains('active');

                header.classList.toggle('active');

                if (isActive) {
                    content.style.display = 'none';
                } else {
                    content.style.display = 'block';
                }
            });
        });
    };

    // 1. Função para buscar os dados de Vidrarias
    const fetchVidrarias = async () => {
        accordionContainer.innerHTML = '<p style="text-align:center; font-size:1.6rem; color:#666;">Carregando vidrarias...</p>';

        try {
            const response = await fetch('../../../AgenTEC-DataBase-(JSON)/vidrarias.json');
            // ... (código fallback) ...
            if (!response.ok) {
                const fallbackResponse = await fetch('vidrarias.json');
                if (!fallbackResponse.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                const data = await fallbackResponse.json();
                renderizarCards(data);
                return;
            }

            const data = await response.json();
            const vidrarias = Array.isArray(data) ? data : data.vidrarias || data.items || data.itens || [];

            if (vidrarias.length === 0) {
                accordionContainer.innerHTML = '<p class="error-message">Nenhuma vidraria encontrada ou estrutura de dados inválida.</p>';
                return;
            }

            renderizarCards(vidrarias);

        } catch (error) {
            console.error('Erro ao carregar vidrarias:', error);
            accordionContainer.innerHTML = '<p class="error-message" style="text-align:center; color:var(--primary-red);">Erro ao carregar os dados das vidrarias. Verifique o console para detalhes.</p>';
        }
    };

    // 2. Função para renderizar os cards COMO ACCORDION (VIDRARIAS)
    const renderizarCards = (vidrarias) => {
        const itemsListContainer = document.getElementById('vidrarias-accordion');
        itemsListContainer.innerHTML = '';

        // Agrupa os itens pelo campo 'tipo' (ex: Beakers, Balões Volumétricos)
        const vidrariasAgrupadas = vidrarias.reduce((acc, item) => {
            const tipo = item.tipo || 'Outras';
            if (!acc[tipo]) {
                acc[tipo] = [];
            }
            acc[tipo].push(item);
            return acc;
        }, {});

        // Gera o HTML para cada grupo (Accordion Group)
        for (const tipo in vidrariasAgrupadas) {
            const itensDoTipo = vidrariasAgrupadas[tipo];
            let totalUnidades = 0; // Para calcular o total do grupo

            const groupHTML = document.createElement('div');
            groupHTML.classList.add('accordion-group-vidraria');
            groupHTML.dataset.groupName = tipo;

            const headerHTML = document.createElement('div');
            headerHTML.classList.add('accordion-header');
            headerHTML.innerHTML = `
                <span>${tipo}</span>
                <i class="fas fa-chevron-right accordion-icon"></i>
            `;
            groupHTML.appendChild(headerHTML);

            const contentHTML = document.createElement('div');
            contentHTML.classList.add('accordion-content');
            contentHTML.style.display = 'none';

            // 4. ADICIONA OS ITENS DE VARIAÇÃO DENTRO DE UM ÚNICO item-card-inner

            const itemInnerCard = document.createElement('div');
            itemInnerCard.classList.add('item-card-inner');

            // Cria a linha principal (o nome do item, ex: "Béquer")
            const itemPrincipal = itensDoTipo[0].nome; // Assume que o nome é o mesmo dentro do grupo
            const itemNomeFormatted = itemPrincipal.replace(/[^a-zA-Z0-9]/g, '_');

            let itemRowHTML = `
                <div class="item-row main-item" 
                    data-search="${itemPrincipal.toLowerCase()}"
                    data-item-name="${itemPrincipal}">
                    <div class="item-info">
                        <p class="item-name">${itemPrincipal}</p>
                        <p class="item-total">Total: 0 unidades</p>
                    </div>
                </div>
            `;

            // Container para as variações (detalhes)
            const detailsContainer = document.createElement('div');
            detailsContainer.classList.add('variations-container');
            detailsContainer.id = `details-${itemNomeFormatted}`; // Usando o nome principal para o ID

            itensDoTipo.forEach(item => {
                const unidadeTexto = item.unidade || 'unid.';
                const quantidade = item.quantidade || 0;

                totalUnidades += parseInt(quantidade);

                // Variáveis para a descrição/conversão
                const variationDescText = item.descricao || item.capacidade || '';
                const unidadeComQtd = `${quantidade} ${unidadeTexto}`;

                // Atualiza o texto de busca para incluir as variações
                itemRowHTML = itemRowHTML.replace(`data-search="${itemPrincipal.toLowerCase()}"`, `data-search="${itemPrincipal.toLowerCase()} ${variationDescText.toLowerCase()} ${quantidade} ${unidadeTexto}"`);

                // Adiciona a linha de variação
                const variationRow = document.createElement('div');
                variationRow.classList.add('variation-row');
                variationRow.innerHTML = `
                    <div class="variation-info">
                        <span class="variation-desc">${variationDescText}</span>
                    </div>
                    <span class="variation-qty">${unidadeComQtd}</span>
                    <div class="variation-actions">
                        <button class="btn-edit edit-qty" 
                                data-item-name="${itemPrincipal}"
                                data-item-desc="${variationDescText}"
                                data-item-qty="${quantidade}"
                                data-item-unit="${unidadeTexto}">
                            <i class="fas fa-pencil-alt"></i> Ajustar
                        </button>
                    </div>
                `;
                detailsContainer.appendChild(variationRow);
            });

            itemInnerCard.innerHTML = itemRowHTML;
            itemInnerCard.appendChild(detailsContainer);

            // Atualiza o total do grupo na linha principal (agora que calculamos)
            itemInnerCard.querySelector('.item-total').textContent = `Total: ${totalUnidades} unidades`;

            contentHTML.appendChild(itemInnerCard);
            groupHTML.appendChild(contentHTML);
            itemsListContainer.appendChild(groupHTML);
        }

        // --- Configurações de Interatividade ---
        setupAccordion();

        // Evento de clique para edição
        itemsListContainer.querySelectorAll('.btn-edit.edit-qty').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemName = e.currentTarget.dataset.itemName;
                const itemDesc = e.currentTarget.dataset.itemDesc; // Nova variável
                const itemQty = e.currentTarget.dataset.itemQty;
                const itemUnit = e.currentTarget.dataset.itemUnit;

                // CHAMANDO O NOVO MODAL CUSTOMIZADO
                showModal(itemName, itemDesc, itemUnit, parseInt(itemQty));
            });
        });
    };

    // 3. Lógica de filtro de busca na página (AJUSTADA para Vidrarias)
    if (searchArea && accordionContainer) {
        searchArea.addEventListener('input', () => {
            const termoBuscado = searchArea.value.toLowerCase().trim();
            const todosOsGrupos = accordionContainer.querySelectorAll('.accordion-group-vidraria');

            todosOsGrupos.forEach(group => {
                let grupoVisivel = false;
                const content = group.querySelector('.accordion-content');
                const header = group.querySelector('.accordion-header');

                const innerCards = group.querySelectorAll('.item-card-inner');

                // Lógica de retorno ao estado FECHADO quando a busca está vazia
                if (termoBuscado === '') {
                    innerCards.forEach(innerCard => {
                        innerCard.style.display = 'block';
                        // Garante que o container de detalhes esteja visível ou não conforme o design original
                        innerCard.querySelector('.variations-container').style.display = 'block';
                    });
                    group.style.display = 'block';
                    content.style.display = 'none';
                    header.classList.remove('active');
                    return;
                }

                // Lógica de busca: 
                innerCards.forEach(innerCard => {
                    let innerCardVisivel = false;
                    const mainItemRow = innerCard.querySelector('.main-item');
                    const detailsContainer = innerCard.querySelector('.variations-container');

                    const itemText = mainItemRow.dataset.search;

                    // Busca no texto principal e nas variações
                    if (itemText && itemText.includes(termoBuscado)) {
                        innerCardVisivel = true;
                        // Expande o bloco de detalhes se o termo de busca for encontrado
                        detailsContainer.style.display = 'block';
                    } else {
                        detailsContainer.style.display = 'none';
                    }

                    if (innerCardVisivel) {
                        innerCard.style.display = 'block';
                        grupoVisivel = true;
                    } else {
                        innerCard.style.display = 'none';
                    }
                });

                // 3. Controla a exibição e estado do Accordion (Grupo)
                if (grupoVisivel) {
                    group.style.display = 'block';
                    content.style.display = 'block';
                    header.classList.add('active');
                } else {
                    group.style.display = 'none';
                }
            });
        });
    }


    // Configura o botão global "Confirmar"
    const globalConfirmBtn = document.getElementById('btn-confirmar'); 
    if (globalConfirmBtn) {
        globalConfirmBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Impede que o link navegue ou recarregue
            showApplyConfirmModal(); // Abre o modal de confirmação
        });
    }

    // NOVO: Configura o botão "Voltar" no final da página 
    const btnVoltarInferior = document.getElementById('btn-voltar-inferior'); 
    if (btnVoltarInferior) {
        btnVoltarInferior.addEventListener('click', (e) => {
            e.preventDefault();
            // Redireciona para a página de administradores
            window.location.href = 'administradores.html'; 
        });
    }

    // Inicia o carregamento dos dados
    fetchVidrarias();
});