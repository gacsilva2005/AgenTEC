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

    let currentItemName = '';
    let currentItemUnit = '';
    let openModalCount = 0;
    const body = document.body;
    const html = document.documentElement;

    // ================== FUNÇÕES DE NOTIFICAÇÃO E MODAL ==================
    const showNotification = (message, type = 'success', duration = 3000) => {
        notificationElement.classList.remove('error');
        notificationIcon.className = 'fas';

        if (type === 'success') {
            notificationIcon.classList.add('fa-check-circle');
        } else if (type === 'error') {
            notificationElement.classList.add('error');
            notificationIcon.classList.add('fa-times-circle');
        }

        notificationMessage.textContent = message;
        notificationElement.classList.add('show');

        setTimeout(() => notificationElement.classList.remove('show'), duration);
    };

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

    const hideModal = (modal = editModal) => {
        if (modal.style.display !== 'none') openModalCount--;
        modal.style.display = 'none';
        if (modal === editModal) newQuantityInput.classList.remove('error');
        checkAndReleaseScroll();
    };

    const showSuccessModal = (itemName, newQty, unit) => {
        successMessage.textContent = `Quantidade de ${itemName} atualizada para: ${newQty} ${unit}`;
        successModal.style.display = 'flex';
        openModalCount++;
        checkAndReleaseScroll();
        showNotification(`Alteração de ${itemName} registrada.`, 'success');
    };

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
        showNotification('Alterações aplicadas com sucesso!', 'success', 3000);
        hideModal(applyConfirmModal);
        setTimeout(() => window.location.href = 'tecnicos.html', 1000);
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

    window.addEventListener('click', (e) => {
        if (e.target === editModal) { hideModal(editModal); showNotification('Edição cancelada.', 'error', 2500); }
        else if (e.target === successModal) hideModal(successModal);
        else if (e.target === applyConfirmModal) { hideModal(applyConfirmModal); showNotification('Aplicação cancelada.', 'error', 2500); }
    });

    confirmBtn.onclick = () => {
        const novaQuantidade = parseFloat(newQuantityInput.value);
        if (!isNaN(novaQuantidade) && novaQuantidade >= 0) {
            updateVariationTotal(currentItemName, novaQuantidade, currentItemUnit);
            hideModal(editModal);
            showSuccessModal(currentItemName, novaQuantidade, currentItemUnit);
        } else {
            showNotification('Insira um número válido.', 'error', 3500);
            newQuantityInput.classList.add('error');
            newQuantityInput.focus();
        }
    };

    // ================== LÓGICA DE VIDRARIAS COM VARIAÇÕES ==================
    const renderizarVariacoes = (variacoes, itemNome) => {
        return variacoes.map(v => `
            <div class="variation-row">
                <div class="variation-info">
                    <span class="variation-desc">${v.descricao}</span>
                    <span class="variation-qty">${v.quantidade} un.</span>
                </div>
                <div class="variation-actions">
                    <button class="btn-edit edit-variation"
                            data-item="${itemNome}"
                            data-desc="${v.descricao}"
                            data-qty="${v.quantidade}">
                        Editar
                    </button>
                </div>
            </div>
        `).join('');
    };

    const updateVariationTotal = (itemNome, novaQty, unidade) => {
        const buttons = document.querySelectorAll(`.edit-variation[data-item="${itemNome}"]`);
        let total = 0;

        buttons.forEach(btn => {
            if (btn.dataset.desc === document.querySelector(`button[data-item="${itemNome}"][data-qty]`)?.closest('.variation-row')?.querySelector('.variation-desc')?.textContent.trim()) {
                if (parseInt(btn.dataset.qty) === parseInt(document.querySelector(`button[data-qty="${btn.dataset.qty}"]`)?.dataset.qty)) {
                    btn.dataset.qty = novaQty;
                    btn.closest('.variation-row').querySelector('.variation-qty').textContent = `${novaQty} un.`;
                }
            }
            total += parseInt(btn.dataset.qty);
        });

        const totalSpan = document.querySelector(`.main-item[data-search*="${itemNome.toLowerCase()}"] .item-total`);
        if (totalSpan) totalSpan.textContent = `Total: ${total} unidades`;
    };

    const fetchVidrarias = async () => {
        try {
            itemsListContainer.innerHTML = '<p style="text-align:center; font-size:1.6rem; color:#666;">Carregando vidrarias...</p>';
            const res = await fetch('http://localhost:3000/api/vidrarias');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            if (!data.success || !Array.isArray(data.itens)) throw new Error('Dados inválidos');

            renderizarCards(data.itens);
        } catch (err) {
            console.error(err);
            itemsListContainer.innerHTML = `<div class="error-message"><h3>Erro ao carregar vidrarias</h3><p>${err.message}</p></div>`;
        }
    };

    const renderizarCards = (vidrarias) => {
        itemsListContainer.innerHTML = '';
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

        // Accordion de tipo
        document.querySelectorAll('.accordion-header').forEach(h => {
            h.onclick = () => {
                const content = h.nextElementSibling;
                h.classList.toggle('active');
                content.style.display = h.classList.contains('active') ? 'block' : 'none';
            };
        });

        // Toggle variações
        document.querySelectorAll('.toggle-variations').forEach(icon => {
            icon.onclick = () => {
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
                const nome = btn.dataset.item;
                const desc = btn.dataset.desc;
                const qty = btn.dataset.qty;
                showModal(`${nome} - ${desc}`, 'un.', qty);
            };
        });
    };

    // ================== BUSCA ==================
    searchArea?.addEventListener('input', () => {
        const termo = searchArea.value.toLowerCase().trim();
        document.querySelectorAll('.accordion-group-vidraria').forEach(group => {
            const header = group.querySelector('.accordion-header');
            const content = group.querySelector('.accordion-content');
            let temMatch = false;

            group.querySelectorAll('.main-item, .variation-desc').forEach(el => {
                const texto = el.getAttribute('data-search') || el.textContent.toLowerCase();
                const visivel = texto.includes(termo);
                if (visivel) temMatch = true;
                el.closest('.item-card-inner, .variation-row')?.style.setProperty('display', visivel || termo === '' ? 'block' : 'none');
            });

            group.style.display = temMatch || termo === '' ? 'block' : 'none';
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