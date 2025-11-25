document.addEventListener('DOMContentLoaded', async function () {
    const cardList = document.querySelector('.card-list');
    const modal = document.getElementById('reagenteModal');
    const modalTitle = document.getElementById('modalReagenteTitle');
    const quantidadeInput = document.getElementById('quantidadeInput');
    const unitSpan = document.querySelector('.input-group .unit');

    let reagentes = [];
    let currentReagente = null;

    try {
        const response = await fetch('../../../AgenTEC-DataBase-(JSON)/reagentes.json');
        if (!response.ok) throw new Error('Erro ao carregar JSON');
        reagentes = await response.json();
    } catch (error) {
        console.error(error);
        cardList.innerHTML = '<p style="color: red; text-align: center;">Erro ao carregar reagentes.</p>';
        return;
    }

    cardList.innerHTML = '';

    reagentes.forEach((reagente, index) => {
        const li = document.createElement('li');
        li.className = 'card-item swiper-slide';
        li.dataset.index = index;

        const descricao = `${reagente.tipo} • ${reagente.quantidade}${reagente.unidade}`;

        li.innerHTML = `
            <div class="card-link">
                <div class="chemical-icon">
                    <span class="material-symbols-outlined icon">experiment</span>
                </div>
                <h3 class="card-title">${reagente.nome}</h3>
                <p class="card-description">${descricao}</p>
                <a class="add-button" data-nome="${reagente.nome}" data-unidade="${reagente.unidade}">
                    Adicionar
                </a>
            </div>
        `;

        const addButton = li.querySelector('.add-button');
        addButton.addEventListener('click', (e) => {
            e.stopPropagation();
            abrirModal(reagente);
        });

        li.addEventListener('click', () => {
            const swiper = document.querySelector('.card-wrapper').swiper;
            swiper.slideToLoop(index, 500);
        });

        cardList.appendChild(li);
    });

    const swiper = new Swiper('.card-wrapper', {
        spaceBetween: 30,
        loop: true,
        slidesPerView: 3,
        centeredSlides: true,
        watchSlidesProgress: true,

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        breakpoints: {
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });

    function abrirModal(reagente) {
        currentReagente = reagente;
        modalTitle.innerText = `Adicionar ${reagente.nome}`;
        quantidadeInput.value = '';
        unitSpan.innerText = reagente.unidade;
        modal.classList.add('show');
    }

    window.abrirModal = abrirModal;

    window.fecharModal = function () {
        modal.classList.remove('show');
    };

    // Função para enviar reagente para o array no servidor
    async function enviarReagenteParaArray(reagenteData) {
        try {
            console.log('📤 Enviando reagente para array no servidor:', reagenteData);

            const response = await fetch('http://localhost:3000/api/reagentes-selecionados/adicionar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reagenteData)
            });

            console.log('📥 Resposta do servidor - Status:', response.status);

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Reagente adicionado ao array com sucesso:', result);
            return result;

        } catch (error) {
            console.error('❌ Erro ao enviar reagente para o servidor:', error);
            throw error;
        }
    }

    // Função para mostrar notificação
    function showNotification(message, isSuccess = true) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${isSuccess ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            animation: slideIn 0.3s ease-out;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (notification.parentNode) notification.remove();
            }, 300);
        }, 3000);
    }

    // Adiciona os estilos de animação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Função para enviar reagente para o array de kits no servidor - VERSÃO COM DEBUG
    async function enviarReagenteParaKits(reagenteData) {
        try {
            console.log('🧪 Enviando reagente para array de KITS:', reagenteData);

            const response = await fetch('http://localhost:3000/api/reagentes-kits/adicionar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reagenteData)
            });

            console.log('📥 Resposta do servidor (KITS) - Status:', response.status);
            console.log('📥 Resposta do servidor (KITS) - OK:', response.ok);

            // Se a resposta não for OK, tente ler a mensagem de erro
            if (!response.ok) {
                let errorMessage = `Erro HTTP: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                    console.log('📥 Detalhes do erro:', errorData);
                } catch (e) {
                    // Se não conseguir parsear como JSON, usa o texto da resposta
                    const textError = await response.text();
                    errorMessage = textError || errorMessage;
                    console.log('📥 Erro como texto:', textError);
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('✅ Reagente adicionado ao array de KITS com sucesso:', result);
            return result;

        } catch (error) {
            console.error('❌ Erro detalhado ao enviar reagente para o array de kits:', error);
            console.error('❌ Stack trace:', error.stack);
            throw error;
        }
    }

    window.confirmarAdicao = async function () {
        const quantidade = parseFloat(quantidadeInput.value);

        if (!quantidade || quantidade <= 0) {
            showNotification('Por favor, insira uma quantidade válida.', false);
            return;
        }

        if (quantidade > currentReagente.quantidade) {
            showNotification(`Quantidade indisponível! Máximo: ${currentReagente.quantidade}${currentReagente.unidade}`, false);
            return;
        }

        try {
            // Prepara os dados do reagente
            const reagenteData = {
                id: currentReagente.id || Date.now(),
                nome: currentReagente.nome,
                tipo: currentReagente.tipo,
                quantidade_escolhida: quantidade,
                unidade: currentReagente.unidade,
                quantidade_disponivel: currentReagente.quantidade,
                data_selecao: new Date().toISOString()
            };

            console.log('🔄 Enviando reagente para array de KITS...', reagenteData);

            // ENVIA PARA O ARRAY DE KITS (separado)
            await enviarReagenteParaArray(reagenteData);

            // Feedback visual de sucesso
            showNotification(`${currentReagente.nome} adicionado ao kit com sucesso!`);

            console.log(`✅ Adicionado ao array de KITS: ${currentReagente.nome} - ${quantidade}${currentReagente.unidade}`);

            // Fecha o modal
            fecharModal();

        } catch (error) {
            console.error('❌ Erro ao adicionar reagente ao array de kits:', error);
            showNotification('Erro ao adicionar reagente ao kit. Tente novamente.', false);
        }
    };

    const searchInput = document.getElementById('search-area');
    searchInput.addEventListener('input', function () {
        const termo = this.value.toLowerCase().trim();
        const slides = document.querySelectorAll('.swiper-slide');

        slides.forEach((slide, index) => {
            const reagente = reagentes[index];
            const texto = `${reagente.nome} ${reagente.tipo}`.toLowerCase();
            slide.style.display = texto.includes(termo) ? 'flex' : 'none';
        });

        swiper.update();
    });
});