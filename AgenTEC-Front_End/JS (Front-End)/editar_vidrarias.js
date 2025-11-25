document.addEventListener('DOMContentLoaded', () => {
    const searchArea = document.getElementById('search-area');
    const itemsListContainer = document.getElementById('vidrarias-accordion');

    // ================== ELEMENTOS DOS MODAIS E NOTIFICAÇÕES ==================
    const notificationElement = document.getElementById('custom-notification');
    const notificationIcon = document.getElementById('notification-icon');
    const notificationMessage = document.getElementById('notification-message');

    const editModal = document.getElementById('edit-modal');
    const editCloseBtn = editModal.querySelector('.close-button');
    const confirmBtn = document.getElementById('modal-confirm-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const newQuantityInput = document.getElementById('new-quantity');

    const successModal = document.getElementById('success-modal');
    const successMessage = successModal.querySelector('.success-message');
    const successOkBtn = document.getElementById('success-ok-btn');

    const applyConfirmModal = document.getElementById('apply-confirm-modal');
    const applyConfirmBtn = document.getElementById('apply-confirm-btn');
    const applyCancelBtn = document.getElementById('apply-cancel-btn');

    const globalApplyBtn = document.getElementById('global-apply-btn');
    const logoutBtn = document.getElementById('btn-logout');

    let currentItemName = '';      // Ex: "Béquer - 100 ml" (Nome + Descrição)
    let currentItemDescription = ''; // Ex: "100 ml" (Descrição da variação)
    let currentItemUnit = '';      // Ex: "un."
    let openModalCount = 0;
    const body = document.body;
    const html = document.documentElement;

    // 💡 GARANTE O ESTADO INICIAL: Oculta as modais no carregamento da página 
    editModal.style.display = 'none';
    successModal.style.display = 'none';
    applyConfirmModal.style.display = 'none';


    // ================== FUNÇÕES DE NOTIFICAÇÃO E MODAL ==================
    
    /**
     * Exibe uma notificação 'toast'.
     */
    const showNotification = (message, type = 'success', duration = 3000) => {
        notificationElement.classList.remove('error');
        notificationIcon.className = 'fas';

        if (type === 'success') {
            notificationIcon.classList.add('fa-check-circle');
            notificationElement.classList.remove('error'); // Garante que a borda seja azul/ciano
        } else if (type === 'error') {
            notificationElement.classList.add('error');
            notificationIcon.classList.add('fa-times-circle');
        }

        notificationMessage.textContent = message;
        notificationElement.classList.add('show');

        setTimeout(() => notificationElement.classList.remove('show'), duration);
    };

    /**
     * Controla o bloqueio de scroll da página baseado no número de modais abertos.
     */
    const checkAndReleaseScroll = () => {
        if (openModalCount <= 0) {
            openModalCount = 0;
            body.classList.remove('modal-open-noscroll');
            html.classList.remove('modal-open-noscroll');
        } else {
            body.classList.add('modal-open-noscroll');
            html.classList.add('modal-open-noscroll');
        }
    };

    /**
     * Exibe o modal de edição (chamado ao clicar em "Editar").
     * @param {string} itemNome - Nome principal do item (ex: Béquer).
     * @param {string} itemDesc - Descrição da variação (ex: 100 ml).
     * @param {string} unidade - Unidade de medida (ex: un.).
     * @param {number} quantidadeAtual - Quantidade atual em estoque.
     */
    const showModal = (itemNome, itemDesc, unidade, quantidadeAtual) => {
        // Armazena o contexto da edição, usando a descrição completa
        currentItemName = `${itemNome} - ${itemDesc}`; 
        currentItemDescription = itemDesc; 
        currentItemUnit = unidade;

        document.querySelector('.modal-item-name').textContent = `${itemNome} - ${itemDesc}`;
        document.getElementById('modal-unit').textContent = unidade;
        document.getElementById('modal-current-qty').textContent = quantidadeAtual;
        newQuantityInput.value = quantidadeAtual;
        newQuantityInput.focus();

        editModal.style.display = 'flex';
        openModalCount++;
        checkAndReleaseScroll();
    };

    /**
     * Oculta um modal e atualiza o contador de modais.
     */
    const hideModal = (modal = editModal) => {
        if (modal.style.display !== 'none') openModalCount--;
        modal.style.display = 'none';
        if (modal === editModal) newQuantityInput.classList.remove('error');
        checkAndReleaseScroll();
    };

    /**
     * Exibe a modal de sucesso após a atualização.
     */
    const showSuccessModal = (itemName, newQty, unit) => {
        // Usa o nome completo da variação
        successMessage.textContent = `Quantidade de ${itemName} atualizada para: ${newQty} ${unit}`;
        successModal.style.display = 'flex';
        openModalCount++;
        checkAndReleaseScroll();
        showNotification(`Alteração de ${itemName} registrada.`, 'success');
    };

    /**
     * Exibe a modal de confirmação para o botão "Aplicar Global".
     */
    const showApplyConfirmModal = () => {
        applyConfirmModal.style.display = 'flex';
        openModalCount++;
        checkAndReleaseScroll();
    };

    // ================== EVENTOS DOS MODAIS ==================
    editCloseBtn.onclick = cancelBtn.onclick = () => {
        hideModal(editModal);
        showNotification('Edição cancelada.', 'error', 2500);
    };

    successOkBtn.onclick = () => hideModal(successModal);
    
    applyCancelBtn.onclick = () => {
        hideModal(applyConfirmModal);
        showNotification('Aplicação cancelada.', 'error', 2500);
    };

    applyConfirmBtn.onclick = () => {
        console.log("Alterações aplicadas e salvando...");
        showNotification('Alterações aplicadas com sucesso!', 'success', 3000);
        hideModal(applyConfirmModal);
        // Simula o salvamento e redireciona
        setTimeout(() => window.location.href = 'administradores.html', 1000);
    };

    globalApplyBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        showApplyConfirmModal();
    });

    logoutBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Você foi desconectado.', 'error', 2500);
        setTimeout(() => window.location.href = 'login.html', 1500);
    });

    // Fechar modal ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === editModal) { hideModal(editModal); showNotification('Edição cancelada.', 'error', 2500); }
        else if (e.target === successModal) hideModal(successModal);
        else if (e.target === applyConfirmModal) { hideModal(applyConfirmModal); showNotification('Aplicação cancelada.', 'error', 2500); }
    });

    /**
     * Lógica acionada pelo botão "Confirmar" no modal de edição.
     */
    confirmBtn.onclick = () => {
        const novaQuantidade = parseInt(newQuantityInput.value);
        
        if (!isNaN(novaQuantidade) && novaQuantidade >= 0) {
            
            // ATUALIZAÇÃO DA VARIACÃO NO DOM E DO TOTAL GERAL
            updateVariationTotal(currentItemName, currentItemDescription, novaQuantidade, currentItemUnit);
            
            hideModal(editModal);
            
            // CHAMA A MODAL DE SUCESSO COM O CONTEXTO COMPLETO
            showSuccessModal(currentItemName, novaQuantidade, currentItemUnit);
            
        } else {
            showNotification('Erro: Por favor, insira um número inteiro válido (>= 0).', 'error', 3500);
            newQuantityInput.classList.add('error');
            newQuantityInput.focus();
        }
    };

    // ================== LÓGICA DE VIDRARIAS COM VARIAÇÕES ==================
    
    /**
     * Renderiza as sub-linhas de variações dentro de um item principal.
     */
    const renderizarVariacoes = (variacoes, itemNome) => {
        // Usamos o nome principal e a descrição da variação para identificar
        return variacoes.map(v => `
            <div class="variation-row">
                <div class="variation-info">
                    <span class="variation-desc">${v.descricao}</span>
                    <span class="variation-qty">${v.quantidade} un.</span>
                </div>
                <div class="variation-actions">
                    <button class="btn-edit edit-variation"
                            data-item-name="${itemNome}"
                            data-desc="${v.descricao}"
                            data-qty="${v.quantidade}"
                            data-unit="un.">
                        <i class="fas fa-pencil-alt"></i> Editar
                    </button>
                </div>
            </div>
        `).join('');
    };

    /**
     * ATUALIZAÇÃO REVISADA: Encontra a variação correta no DOM e o total geral.
     * @param {string} fullItemName - Nome completo do item no modal (ex: "Béquer - 100 ml").
     * @param {string} variationDesc - Descrição da variação (ex: "100 ml").
     * @param {number} novaQty - Nova quantidade.
     * @param {string} unidade - Unidade.
     */
    const updateVariationTotal = (fullItemName, variationDesc, novaQty, unidade) => {
        // 1. Encontra e atualiza o elemento de quantidade da variação
        const targetButton = document.querySelector(`.edit-variation[data-item-name="${fullItemName.split(' - ')[0]}"][data-desc="${variationDesc}"]`);
        
        if (targetButton) {
            // Acha o elemento <span> que mostra a quantidade
            const qtyElement = targetButton.closest('.variation-row').querySelector('.variation-qty');
            
            // Atualiza o data-attribute do botão
            targetButton.dataset.qty = novaQty;
            
            // Atualiza o texto na tela
            if (qtyElement) {
                 qtyElement.textContent = `${novaQty} ${unidade}`;
            }

            // 2. Recalcula o total do item principal
            const mainItemName = targetButton.dataset.itemName;
            const allVariationButtons = document.querySelectorAll(`.edit-variation[data-item-name="${mainItemName}"]`);
            let total = 0;

            allVariationButtons.forEach(btn => {
                total += parseInt(btn.dataset.qty || 0);
            });

            // 3. Atualiza o elemento total na linha principal
            const totalSpan = document.querySelector(`.main-item[data-search*="${mainItemName.toLowerCase()}"] .item-total`);
            if (totalSpan) {
                totalSpan.textContent = `Total: ${total} ${unidade}s`; // Adiciona 's' para plural de "unidade"
            }
            
            showNotification(`Estoque de ${fullItemName} atualizado para ${novaQty} ${unidade}.`, 'success');

        } else {
             console.error(`Variação não encontrada para atualização: ${fullItemName}`);
             showNotification('Erro interno: Variação não pôde ser encontrada.', 'error', 4000);
        }
    };


    /**
     * Simula a busca e carregamento dos dados das vidrarias.
     */
    const fetchVidrarias = async () => {
        try {
            itemsListContainer.innerHTML = '<p style="text-align:center; font-size:1.6rem; color:#666;">Carregando vidrarias...</p>';
            // Tentativa de buscar os dados.
            const res = await fetch('http://localhost:3000/api/vidrarias');
            
            // Simulação de dados se o backend não estiver rodando (fallback)
            if (!res.ok) {
                console.warn('Backend indisponível. Usando dados de simulação.');
                const simData = {
                    success: true,
                    itens: [
                        { nome: "Béquer", tipo: "Vidraria Volumétrica", variacoes: [{ descricao: "100 ml", quantidade: 15 }, { descricao: "250 ml", quantidade: 20 }, { descricao: "500 ml", quantidade: 10 }] },
                        { nome: "Erlenmeyer", tipo: "Vidraria Volumétrica", variacoes: [{ descricao: "125 ml", quantidade: 30 }, { descricao: "250 ml", quantidade: 25 }] },
                        { nome: "Proveta", tipo: "Vidraria Graduada", variacoes: [{ descricao: "10 ml", quantidade: 8 }, { descricao: "100 ml", quantidade: 12 }] },
                        { nome: "Pipeta Graduada", tipo: "Vidraria Graduada", variacoes: [{ descricao: "1 ml", quantidade: 18 }, { descricao: "10 ml", quantidade: 15 }] },
                    ]
                };
                renderizarCards(simData.itens);
                return;
            }

            const data = await res.json();
            if (!data.success || !Array.isArray(data.itens)) throw new Error('Dados inválidos do servidor.');

            renderizarCards(data.itens);
        } catch (err) {
            console.error('Erro ao carregar vidrarias:', err);
            itemsListContainer.innerHTML = `<div class="error-message"><h3>Erro ao carregar vidrarias</h3><p>${err.message}</p></div>`;
        }
    };

    /**
     * Constrói e insere os cards de vidrarias agrupados por tipo (Accordion).
     */
    const renderizarCards = (vidrarias) => {
        itemsListContainer.innerHTML = '';
        
        // Agrupa os itens por tipo
        const agrupados = vidrarias.reduce((acc, i) => {
            const t = i.tipo || 'Outros';
            acc[t] ??= [];
            acc[t].push(i);
            return acc;
        }, {});

        for (const [tipo, itens] of Object.entries(agrupados)) {
            const group = document.createElement('div');
            group.className = 'accordion-group-vidraria';
            group.dataset.group = tipo.toLowerCase();

            const header = document.createElement('div');
            header.className = 'accordion-header';
            header.innerHTML = `<span>${tipo} (${itens.length} itens)</span><i class="fas fa-chevron-right accordion-icon"></i>`;
            group.appendChild(header);

            const content = document.createElement('div');
            content.className = 'accordion-content';
            content.style.display = 'none';

            itens.forEach(item => {
                const formatted = item.nome.replace(/[^a-zA-Z0-9]/g, '_');
                const searchText = `${item.nome} ${tipo}`.toLowerCase();
                const total = item.variacoes.reduce((s, v) => s + v.quantidade, 0);

                const card = document.createElement('div');
                card.className = 'item-card-inner';
                card.innerHTML = `
                    <div class="item-row main-item" data-search="${searchText}">
                        <div class="item-info">
                            <p class="item-name">${item.nome}</p>
                            <p class="item-total">Total: ${total} unidades</p>
                        </div>
                        <div class="item-actions">
                            <i class="fas fa-chevron-down toggle-variations" data-item="${formatted}"></i>
                        </div>
                    </div>
                    <div class="variations-container" id="variations-${formatted}" style="display:none;">
                        ${renderizarVariacoes(item.variacoes, item.nome)}
                    </div>
                `;
                content.appendChild(card);
            });

            group.appendChild(content);
            itemsListContainer.appendChild(group);
        }

        // --- Configuração dos Eventos ---

        // Accordion de tipo (expande/colapsa o grupo)
        document.querySelectorAll('.accordion-header').forEach(h => {
            h.onclick = () => {
                const content = h.nextElementSibling;
                h.classList.toggle('active');
                content.style.display = h.classList.contains('active') ? 'block' : 'none';
            };
        });

        // Toggle variações (expande/colapsa as variações de um item)
        document.querySelectorAll('.toggle-variations').forEach(icon => {
            icon.onclick = (e) => {
                e.stopPropagation(); // Evita que o evento se propague se a linha principal fosse clicável
                const id = `variations-${icon.dataset.item}`;
                const container = document.getElementById(id);
                const isOpen = container.style.display === 'block';
                container.style.display = isOpen ? 'none' : 'block';
                icon.classList.toggle('fa-chevron-down', isOpen);
                icon.classList.toggle('fa-chevron-up', !isOpen);
            };
        });

        // Botões de editar variação → abre modal
        document.querySelectorAll('.edit-variation').forEach(btn => {
            btn.onclick = () => {
                const nome = btn.dataset.itemName;
                const desc = btn.dataset.desc;
                const qty = btn.dataset.qty;
                const unit = btn.dataset.unit;
                
                // Passa o nome principal, a descrição, a unidade e a quantidade atual para o modal
                showModal(nome, desc, unit, parseInt(qty));
            };
        });
    };

    // ================== BUSCA ==================
    searchArea?.addEventListener('input', () => {
        const termo = searchArea.value.toLowerCase().trim();
        const allGroups = document.querySelectorAll('.accordion-group-vidraria');

        allGroups.forEach(group => {
            const header = group.querySelector('.accordion-header');
            const content = group.querySelector('.accordion-content');
            let temMatch = false;

            const innerCards = group.querySelectorAll('.item-card-inner');

            innerCards.forEach(innerCard => {
                const mainItemRow = innerCard.querySelector('.main-item');
                const variationsContainer = innerCard.querySelector('.variations-container');
                const toggleIcon = innerCard.querySelector('.toggle-variations');
                
                const itemText = mainItemRow.dataset.search; 
                let itemMatch = false;

                // 1. Verifica se o item principal corresponde
                if (itemText && itemText.includes(termo)) {
                    itemMatch = true;
                }

                // 2. Verifica se alguma variação corresponde (pelo texto de descrição)
                const variationRows = variationsContainer.querySelectorAll('.variation-row');
                variationRows.forEach(row => {
                    const descText = row.querySelector('.variation-desc').textContent.toLowerCase();
                    const descMatch = descText.includes(termo);
                    if (descMatch) {
                        itemMatch = true;
                    }
                    row.style.display = descMatch || itemMatch || termo === '' ? 'flex' : 'none';
                });


                if (itemMatch || termo === '') {
                    innerCard.style.display = 'block';
                    temMatch = true;
                    // Se estiver buscando, expande as variações do item que deu match
                    if (termo !== '') {
                        variationsContainer.style.display = 'block'; 
                        toggleIcon.classList.remove('fa-chevron-down');
                        toggleIcon.classList.add('fa-chevron-up');
                    } else {
                         // Se a busca estiver limpa, volta ao estado colapsado
                        variationsContainer.style.display = 'none';
                        toggleIcon.classList.remove('fa-chevron-up');
                        toggleIcon.classList.add('fa-chevron-down');
                    }
                } else {
                    innerCard.style.display = 'none';
                }
            });

            // Controla a visibilidade do grupo inteiro
            group.style.display = temMatch || termo === '' ? 'block' : 'none';
            
            // Se houver match ou se a busca estiver limpa, ajusta o accordion do grupo
            if (temMatch && termo !== '') {
                content.style.display = 'block';
                header.classList.add('active');
            } else if (termo === '') {
                content.style.display = 'none';
                header.classList.remove('active');
            }
        });
    });

    // ================== INICIA ==================
    fetchVidrarias();
});