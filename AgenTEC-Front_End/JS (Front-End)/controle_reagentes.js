// controle_reagentes.js (Versão Final com Lógica de Fechar, Notificações e Redirecionamento)

const BACKEND_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    const searchArea = document.getElementById('search-area');
    const accordionContainer = document.getElementById('reagent-accordion');
    
    // --- 1. Elementos da Notificação ---
    const notificationElement = document.getElementById('custom-notification');
    const notificationIcon = document.getElementById('notification-icon');
    const notificationMessage = document.getElementById('notification-message');
    // ------------------------------------------

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

    // Botão Global "Aplicar" no final da página (CORRIGIDO PARA USAR O ID)
    const globalApplyBtn = document.getElementById('global-apply-btn');
    
    // Botão Sair (Logout)
    const logoutBtn = document.getElementById('btn-logout');
    
    // Variáveis para guardar o contexto de edição
    let currentItemName = '';
    let currentItemUnit = '';

    // --- Contador para rastrear quantos modais estão abertos ---
    let openModalCount = 0;

    // Variáveis para o body e html (necessário para travar o scroll)
    const body = document.body;
    const html = document.documentElement; // Referência ao elemento <html>
    
    // 💡 GARANTE O ESTADO INICIAL: Oculta as modais no carregamento da página (Prevenção)
    if (editModal) editModal.style.display = 'none';
    if (successModal) successModal.style.display = 'none';
    if (applyConfirmModal) applyConfirmModal.style.display = 'none';
    
    
    // --- FUNÇÃO: EXIBE A NOTIFICAÇÃO (TOAST) ---
    /**
     * Exibe a notificação Toast no canto superior direito.
     * @param {string} message - Mensagem a ser exibida.
     * @param {string} type - Tipo de notificação ('success' ou 'error').
     * @param {number} duration - Duração em milissegundos.
     */
    const showNotification = (message, type = 'success', duration = 3000) => {
        notificationElement.classList.remove('error');
        notificationIcon.className = 'fas'; 
        
        if (type === 'success') {
            notificationElement.classList.remove('error');
            notificationIcon.classList.add('fa-check-circle');
        } else if (type === 'error') {
            notificationElement.classList.add('error');
            notificationIcon.classList.add('fa-times-circle');
        }

        notificationMessage.textContent = message;

        notificationElement.classList.add('show');

        setTimeout(() => {
            notificationElement.classList.remove('show');
        }, duration);
    };


    // --- FUNÇÃO CORE: VERIFICA E LIBERA O SCROLL (BASEADO NO CONTADOR) ---
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

    // --- FUNÇÕES DE CONTROLE DO MODAL ---
    const showModal = (itemNome, unidade, quantidadeAtual) => {
        currentItemName = itemNome;
        currentItemUnit = unidade;

        document.querySelector('.modal-item-name').textContent = itemNome;
        document.getElementById('modal-unit').textContent = unidade;
        document.getElementById('modal-current-qty').textContent = quantidadeAtual;
        newQuantityInput.value = quantidadeAtual; 
        newQuantityInput.focus(); 
        
        editModal.style.display = 'flex'; 
        
        openModalCount++;
        checkAndReleaseScroll();
    };

    /**
     * Oculta o modal e atualiza o contador.
     * @param {HTMLElement} modalToHide - O elemento modal a ser escondido.
     */
    const hideModal = (modalToHide = editModal) => {
        if (modalToHide.style.display !== 'none') {
             openModalCount--;
        }

        modalToHide.style.display = 'none';
        
        if (modalToHide === editModal) {
            newQuantityInput.classList.remove('error');
        }
        
        checkAndReleaseScroll();
    };

    const showSuccessModal = (itemName, newQty, unit) => {
        successMessage.textContent = `Quantidade de ${itemName} atualizada para: ${newQty} ${unit}`;
        successModal.style.display = 'flex';
        
        openModalCount++;
        checkAndReleaseScroll();
        
        showNotification(`Alteração de ${itemName} registrada.`, 'success', 3000);
    };
    
    const showApplyConfirmModal = () => {
        applyConfirmModal.style.display = 'flex';
        openModalCount++;
        checkAndReleaseScroll();
    };

    // --- EVENT LISTENERS E INTEGRAÇÃO DE NOTIFICAÇÃO ---

    // Lógica de fechar a modal de edição pelo "X"
    if (editCloseBtn) {
        editCloseBtn.addEventListener('click', () => {
            hideModal(editModal);
            showNotification('Edição cancelada.', 'error', 2500);
        });
    }

    // Lógica de fechar a modal de edição pelo "Cancelar"
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            hideModal(editModal);
            showNotification('Edição cancelada.', 'error', 2500);
        });
    }
    
    successOkBtn.addEventListener('click', () => hideModal(successModal));
    
    applyCancelBtn.addEventListener('click', () => {
        hideModal(applyConfirmModal);
        showNotification('Aplicação cancelada.', 'error', 2500);
    });

    // 🚨 LÓGICA DE FECHAMENTO APÓS APLICAR E SAIR
    applyConfirmBtn.addEventListener('click', () => {
        console.log("Alterações aplicadas e salvando...");
        
        // 1. Exibe a notificação de sucesso
        showNotification('Alterações aplicadas com sucesso!', 'success', 3000);

        // 2. Oculta a modal de confirmação
        hideModal(applyConfirmModal); 
        
        // 3. Redireciona para tecnicos.html após 1 segundo
        setTimeout(() => {
            window.location.href = 'tecnicos.html';
        }, 1000); 
    });


    // Fechar qualquer modal ao clicar fora
    window.addEventListener('click', (event) => {
        if (event.target == editModal) {
            hideModal(editModal);
            showNotification('Edição cancelada.', 'error', 2500);
        } else if (event.target == successModal) {
             hideModal(successModal);
        } else if (event.target == applyConfirmModal) {
             hideModal(applyConfirmModal);
             showNotification('Aplicação cancelada.', 'error', 2500);
        }
    });

    // Lógica de Confirmação (Modal de Edição)
    confirmBtn.addEventListener('click', () => {
        const novaQuantidade = parseFloat(newQuantityInput.value);
        
        if (!isNaN(novaQuantidade) && novaQuantidade >= 0) {
            updateItemTotal(currentItemName, novaQuantidade, currentItemUnit);
            
            // Esconde o modal de edição
            hideModal(editModal);
            
            // Mostra o modal de sucesso
            showSuccessModal(currentItemName, novaQuantidade, currentItemUnit);

        } else {
            // Mostra a notificação de erro
            showNotification('Erro: Por favor, insira um número válido.', 'error', 3500);
            newQuantityInput.classList.add('error'); 
            newQuantityInput.focus();
        }
    });
    
    // Botão Sair (Logout)
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            showNotification('Você foi desconectado.', 'error', 2500);
            
            setTimeout(() => {
                window.location.href = 'login.html'; 
            }, 1500); 
        });
    }

    // Lógica de botões inferiores
    if (globalApplyBtn) {
        globalApplyBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            showApplyConfirmModal(); // Abre o modal de confirmação
        });
    }


    // --- FUNÇÕES DE LÓGICA EXISTENTES (MANTIDAS/AJUSTADAS) ---

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
    
    const updateItemTotal = (itemNome, novaQuantidade, unidade) => {
        console.log(`Recalculando total para: ${itemNome}. Nova Quantidade: ${novaQuantidade}`);
        
        const linhasDeItem = document.querySelectorAll('.item-row');
        linhasDeItem.forEach(row => {
            const dataItemName = row.dataset.itemName;
            
            if (dataItemName === itemNome) {
                const qtyElement = row.querySelector('.item-total');
                const unidadeTexto = unidade || row.dataset.itemUnit || 'unidades';
                
                if (qtyElement) {
                    qtyElement.textContent = `Total: ${novaQuantidade} ${unidadeTexto}`;
                    
                    row.dataset.itemQty = novaQuantidade;
                    const novoSearch = `${itemNome} ${novaQuantidade} ${unidadeTexto}`.toLowerCase();
                    row.dataset.search = novoSearch;
                }
                
                const itemNomeFormatted = itemNome.replace(/[^a-zA-Z0-9]/g, '_');
                const detailsContainer = document.getElementById(`details-${itemNomeFormatted}`);
                if (detailsContainer) {
                    
                    // --- NOVA LÓGICA DE CONVERSÃO ---
                    const unidadeBase = unidadeTexto.toLowerCase();
                    let valorConvertido = novaQuantidade;
                    let textoConversao = '';
                    
                    if (unidadeBase === 'g') {
                        valorConvertido = novaQuantidade * 1000;
                        // g -> mg
                        textoConversao = `Conversão (g &rarr; mg): ${valorConvertido.toFixed(2)} mg`;
                    } else if (unidadeBase === 'ml') {
                        valorConvertido = novaQuantidade * 1000;
                        // mL -> µL (Microlitros)
                        textoConversao = `Conversão (mL &rarr; µL): ${valorConvertido.toFixed(2)} µL`;
                    } else {
                        // Unidades que não são g ou mL (ex: 'unidades', 'caixas')
                        textoConversao = `Conversão: ${valorConvertido.toFixed(2)} ${unidadeBase}`;
                    }
                    // --- FIM DA NOVA LÓGICA ---

                    const qtyGramasSpan = detailsContainer.querySelector('.variation-qty');
                    if (qtyGramasSpan) {
                         qtyGramasSpan.textContent = `${novaQuantidade} ${unidadeTexto}`;
                    }
                    const descSpan = detailsContainer.querySelector('.variation-desc');
                    if (descSpan) {
                        // Usa o novo texto de conversão
                        descSpan.innerHTML = textoConversao;
                    }
                    const editButton = detailsContainer.querySelector('.btn-edit');
                    if (editButton) {
                        editButton.dataset.itemQty = novaQuantidade;
                    }
                }
            }
        });
    };
    
    const fetchReagentes = async () => {
        accordionContainer.innerHTML = '<p style="text-align:center; font-size:1.6rem; color:#666;">Carregando reagentes...</p>';
        
        try {
            const response = await fetch('../../../AgenTEC-DataBase-(JSON)/reagentes.json');
             if (!response.ok) {
                const fallbackResponse = await fetch('reagentes.json');
                if (!fallbackResponse.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                const data = await fallbackResponse.json();
                const reagentes = Array.isArray(data) ? data : data.reagentes || data.items || data.itens || [];
                renderizarCards(reagentes);
                return;
            }

            const data = await response.json();
            const reagentes = Array.isArray(data) ? data : data.reagentes || data.items || data.itens || [];

            if (reagentes.length === 0) {
                accordionContainer.innerHTML = '<p class="error-message">Nenhum reagente encontrado ou estrutura de dados inválida.</p>';
                return;
            }

            renderizarCards(reagentes);

        } catch (error) {
            console.error('Erro ao carregar reagentes:', error);
            accordionContainer.innerHTML = '<p class="error-message" style="text-align:center; color:var(--primary-red);">Erro ao carregar os dados dos reagentes. Verifique o console para detalhes.</p>';
        }
    };

    const renderizarCards = (reagentes) => {
        const itemsListContainer = document.getElementById('reagent-accordion') || document.querySelector('.items-list-container');
        itemsListContainer.innerHTML = '';

        const reagentesAgrupados = reagentes.reduce((acc, item) => {
            const tipo = item.tipo || 'Outros';
            if (!acc[tipo]) {
                acc[tipo] = [];
            }
            acc[tipo].push(item);
            return acc;
        }, {});

        for (const tipo in reagentesAgrupados) {
            const itensDoTipo = reagentesAgrupados[tipo];

            const groupHTML = document.createElement('div');
            groupHTML.classList.add('accordion-group');
            groupHTML.dataset.group = tipo.toLowerCase(); 

            const headerHTML = document.createElement('div');
            headerHTML.classList.add('accordion-header');
            headerHTML.innerHTML = `
                <span>${tipo} (${itensDoTipo.length} itens)</span>
                <i class="fas fa-chevron-right accordion-icon"></i>
            `;
            groupHTML.appendChild(headerHTML);

            const contentHTML = document.createElement('div');
            contentHTML.classList.add('accordion-content');
            contentHTML.style.display = 'none'; 

            itensDoTipo.forEach(item => {
                const unidadeTexto = item.unidade || 'unidades'; 
                const quantidade = item.quantidade || 0;
                const itemNomeFormatted = item.nome.replace(/[^a-zA-Z0-9]/g, '_'); 
                
                const unidadeComQtd = `${quantidade} ${unidadeTexto}`;
                const textoBuscaCompleto = `${item.nome} ${unidadeComQtd} ${unidadeTexto.toLowerCase() === 'g' ? 'miligramas' : ''}`.toLowerCase();
                
                // --- NOVA LÓGICA DE CONVERSÃO NO RENDER ---
                const unidadeBase = unidadeTexto.toLowerCase();
                let valorConvertido = quantidade;
                let textoConversao = '';

                if (unidadeBase === 'g') {
                    valorConvertido = quantidade * 1000;
                    textoConversao = `Conversão (g &rarr; mg): ${valorConvertido.toFixed(2)} mg`;
                } else if (unidadeBase === 'ml') {
                    valorConvertido = quantidade * 1000;
                    textoConversao = `Conversão (mL &rarr; µL): ${valorConvertido.toFixed(2)} µL`;
                } else {
                    textoConversao = `Conversão: ${valorConvertido.toFixed(2)} ${unidadeBase}`;
                }
                // --- FIM DA NOVA LÓGICA NO RENDER ---

                const itemInnerCard = document.createElement('div');
                itemInnerCard.classList.add('item-card-inner');

                let itemRowHTML = `
                    <div class="item-row main-item" 
                        data-search="${textoBuscaCompleto}"
                        data-item-name="${item.nome}"
                        data-item-qty="${quantidade}"
                        data-item-unit="${unidadeTexto}">
                        <div class="item-info">
                            <p class="item-name">${item.nome}</p>
                            <p class="item-total">Total: ${unidadeComQtd}</p>
                        </div>
                        <div class="item-actions">
                            <i class="fas fa-chevron-down item-action toggle-details" 
                                title="Ver Conversão"
                                data-item="${itemNomeFormatted}">
                            </i>
                        </div>
                    </div>
                `;
                
                const detailsContainer = `
                    <div class="variations-container reagent-details-container" 
                         id="details-${itemNomeFormatted}" 
                         style="display: none;">
                        <div class="variation-row">
                            <div class="variation-info" style="flex-direction: column; align-items: flex-start;">
                                <span class="variation-desc">
                                    ${textoConversao} 
                                </span>
                            </div>
                            <span class="variation-qty">${unidadeComQtd}</span>
                            <div class="variation-actions">
                                <button class="btn-edit edit-qty" 
                                        data-item-name="${item.nome}"
                                        data-item-qty="${quantidade}"
                                        data-item-unit="${unidadeTexto}">
                                    <i class="fas fa-pencil-alt"></i> Editar
                                </button>
                            </div>
                        </div>
                    </div>
                `;

                itemInnerCard.innerHTML = itemRowHTML + detailsContainer;
                contentHTML.appendChild(itemInnerCard);
            });

            groupHTML.appendChild(contentHTML);
            itemsListContainer.appendChild(groupHTML);
        }

        setupAccordion();
        
        document.querySelectorAll('.toggle-details').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const itemNomeFormatted = e.target.dataset.item; 
                const containerId = `details-${itemNomeFormatted}`;
                const container = document.getElementById(containerId);
                const icon = e.target;
                
                if (container.style.display === 'none') {
                    container.style.display = 'block';
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                } else {
                    container.style.display = 'none';
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            });
        });
        
        itemsListContainer.querySelectorAll('.btn-edit.edit-qty').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemName = e.currentTarget.dataset.itemName;
                const itemQty = e.currentTarget.dataset.itemQty;
                const itemUnit = e.currentTarget.dataset.itemUnit;
                
                showModal(itemName, itemUnit, parseFloat(itemQty));
            });
        });
    };

    if (searchArea && accordionContainer) {
        searchArea.addEventListener('input', () => {
            const termoBuscado = searchArea.value.toLowerCase().trim();
            const todosOsGrupos = accordionContainer.querySelectorAll('.accordion-group');

            todosOsGrupos.forEach(group => {
                let grupoVisivel = false;
                const content = group.querySelector('.accordion-content');
                const header = group.querySelector('.accordion-header');
                
                const innerCards = group.querySelectorAll('.item-card-inner');

                if (termoBuscado === '') {
                    innerCards.forEach(innerCard => {
                        innerCard.style.display = 'block';
                        innerCard.querySelector('.toggle-details').classList.remove('fa-chevron-up');
                        innerCard.querySelector('.toggle-details').classList.add('fa-chevron-down');
                        innerCard.querySelector('.reagent-details-container').style.display = 'none';
                    });
                    group.style.display = 'block'; 
                    content.style.display = 'none'; 
                    header.classList.remove('active'); 
                    return;
                }

                innerCards.forEach(innerCard => {
                    let innerCardVisivel = false;
                    const mainItemRow = innerCard.querySelector('.main-item');
                    const detailsContainer = innerCard.querySelector('.reagent-details-container');
                    const toggleIcon = innerCard.querySelector('.toggle-details');
                    
                    const itemText = mainItemRow.dataset.search; 

                    if (itemText && itemText.includes(termoBuscado)) {
                        innerCardVisivel = true;
                        
                        detailsContainer.style.display = 'block'; 
                        toggleIcon.classList.remove('fa-chevron-down');
                        toggleIcon.classList.add('fa-chevron-up');
                    } else {
                        detailsContainer.style.display = 'none';
                        toggleIcon.classList.remove('fa-chevron-up');
                        toggleIcon.classList.add('fa-chevron-down');
                    }
                    
                    if (innerCardVisivel) {
                        innerCard.style.display = 'block';
                        grupoVisivel = true;
                    } else {
                        innerCard.style.display = 'none';
                    }
                });

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

    // Inicia o carregamento dos dados
    fetchReagentes();
});