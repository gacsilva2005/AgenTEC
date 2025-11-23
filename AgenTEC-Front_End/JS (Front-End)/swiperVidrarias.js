document.addEventListener('DOMContentLoaded', async function () {
    const cardList = document.querySelector('.card-list');
    const modal = document.getElementById('reagenteModal');
    const modalTitle = document.getElementById('modalReagenteTitle');
    const quantidadeSelect = document.getElementById('quantidade-vidraria');

    let vidrarias = [];
    let vidrariaAtual = null;

    // === 1. CARREGAR JSON ===
    try {
        const response = await fetch('../../../AgenTEC-DataBase-(JSON)/vidrarias.json');
        if (!response.ok) throw new Error('Erro ao carregar vidrarias.json');
        vidrarias = await response.json();
    } catch (error) {
        console.error(error);
        cardList.innerHTML = '<p style="color: red; text-align: center;">Erro ao carregar vidrarias.</p>';
        return;
    }

    // === 2. AGRUPAR POR NOME ===
    const agrupadas = {};
    vidrarias.forEach(v => {
        const nome = v.nome;
        if (!agrupadas[nome]) {
            agrupadas[nome] = {
                nome,
                capacidades: [],
                unidade: v.unidade || 'un'
            };
        }
        if (v.capacidade) {
            const cap = `${v.capacidade} ${v.unidade || ''}`.trim();
            if (!agrupadas[nome].capacidades.includes(cap)) {
                agrupadas[nome].capacidades.push(cap);
            }
        }
    });

    const vidrariasAgrupadas = Object.values(agrupadas);

    // === 3. GERAR CARDS ===
    cardList.innerHTML = '';
    vidrariasAgrupadas.forEach((grupo, index) => {
        const li = document.createElement('li');
        li.className = 'card-item swiper-slide';
        li.dataset.nome = grupo.nome;

        const temCapacidade = grupo.capacidades.length > 0;
        const descricao = temCapacidade
            ? grupo.capacidades.length === 1
                ? grupo.capacidades[0]
                : `${grupo.capacidades.length} tamanhos`
            : '—';

        li.innerHTML = `
            <div class="card-link">
                <div class="chemical-icon">
                    <span class="material-symbols-outlined icon">experiment</span>
                </div>
                <h3 class="card-title">${grupo.nome}</h3>
                <p class="card-description">${descricao}</p>
                <a href="javascript:void(0)" class="add-button">Adicionar</a>
            </div>
        `;

        li.querySelector('.add-button').addEventListener('click', (e) => {
            e.stopPropagation();
            abrirModal(grupo);
        });

        cardList.appendChild(li);
    });

    // === 4. SWIPER ===
    const swiper = new Swiper('.card-wrapper', {
        loop: true,
        slidesPerView: 3,
        spaceBetween: 30,
        centeredSlides: true,
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
            320: {  // Mobile pequeno
                slidesPerView: 1.5,
                spaceBetween: 15,
                centeredSlides: true
            },
            480: {  // Mobile
                slidesPerView: 2,
                spaceBetween: 20,
                centeredSlides: false
            },
            768: {  // Tablet
                slidesPerView: 3,
                spaceBetween: 25
            },
            1024: { // Desktop
                slidesPerView: 5,
                spaceBetween: 30
            }
        },

        observer: true,
        observeParents: true
    });

    // === 5. MODAL ===
    function abrirModal(grupo) {
        vidrariaAtual = grupo;
        modalTitle.textContent = `Adicionar ${grupo.nome}`;
        quantidadeSelect.innerHTML = '<option value="">Selecione a capacidade</option>';

        if (grupo.capacidades.length === 0) {
            const opt = document.createElement('option');
            opt.value = 'única';
            opt.textContent = 'Item único';
            quantidadeSelect.appendChild(opt);
        } else {
            grupo.capacidades
                .sort((a, b) => parseFloat(a) - parseFloat(b))
                .forEach(cap => {
                    const opt = document.createElement('option');
                    opt.value = cap;
                    opt.textContent = cap;
                    quantidadeSelect.appendChild(opt);
                });
        }
        modal.classList.add('show');
    }

    // Função para mostrar notificação
    function showNotification(message, isSuccess = true) {
        console.log(`Notificação: ${message}`);

        const existingMessage = document.getElementById('customNotification');
        if (existingMessage) existingMessage.remove();

        const messageElement = document.createElement('div');
        messageElement.id = 'customNotification';
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            background-color: ${isSuccess ? '#4CAF50' : '#f44336'};
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;

        document.body.appendChild(messageElement);

        setTimeout(() => messageElement.style.opacity = '1', 10);
        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                if (messageElement.parentNode) messageElement.remove();
            }, 300);
        }, 3000);
    }

    // Função para adicionar vidraria ao servidor
    async function adicionarVidrariaSelecionada(vidrariaData) {
        try {
            console.log('📤 Enviando vidraria para o servidor:', vidrariaData);

            const response = await fetch('http://localhost:3000/api/vidrarias-selecionadas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vidrariaData)
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                showNotification('Vidraria adicionada com sucesso!', true);
                console.log('✅ Vidraria adicionada:', result.vidraria);
                return true;
            } else {
                throw new Error(result.message || 'Erro ao adicionar vidraria');
            }

        } catch (error) {
            console.error('❌ Erro ao adicionar vidraria:', error);
            showNotification('Erro ao adicionar vidraria. Tente novamente.', false);
            return false;
        }
    }

    // Função para confirmar adição - ATUALIZADA
    window.confirmarAdicao = async () => {
        const capacidade = quantidadeSelect.value;
        if (!capacidade) {
            showNotification('Selecione uma capacidade.', false);
            return;
        }

        // Prepara os dados da vidraria CORRETAMENTE
        const vidrariaData = {
            nome: vidrariaAtual.nome,
            capacidade: capacidade,
            tipo: 'Vidraria',
            unidade: vidrariaAtual.unidade || 'un'
        };

        // Envia para o servidor
        const sucesso = await adicionarVidrariaSelecionada(vidrariaData);

        if (sucesso) {
            fecharModal();
        }
    };
    
    window.abrirModal = abrirModal;
    window.fecharModal = () => modal.classList.remove('show');

    // === 6. BUSCA ===
    document.getElementById('search-area').addEventListener('input', function () {
        const termo = this.value.toLowerCase().trim();
        const slides = document.querySelectorAll('.swiper-slide');
        slides.forEach(slide => {
            const nome = slide.dataset.nome.toLowerCase();
            slide.style.display = nome.includes(termo) ? '' : 'none';
        });
        swiper.update();
    });
});