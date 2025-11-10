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

        on: {
            progress: updateSlideOpacity,
            slideChangeTransitionEnd: updateSlideOpacity,
            setTransition: function (speed) {
                for (let i = 0; i < this.slides.length; i++) {
                    this.slides[i].style.transition = `${speed}ms`;
                }
            }
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

    window.confirmarAdicao = function () {
        const quantidade = parseFloat(quantidadeInput.value);
        if (!quantidade || quantidade <= 0) {
            alert('Por favor, insira uma quantidade válida.');
            return;
        }

        if (quantidade > currentReagente.quantidade) {
            alert(`Quantidade indisponível! Máximo: ${currentReagente.quantidade}${currentReagente.unidade}`);
            return;
        }

        console.log(`Adicionado: ${currentReagente.nome} - ${quantidade}${currentReagente.unidade}`);
        fecharModal();
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

    function updateSlideOpacity(swiper) {
        for (let i = 0; i < swiper.slides.length; i++) {
            const slide = swiper.slides[i];
            const slideProgress = swiper.slides[i].progress;
            const absProgress = Math.abs(slideProgress);
            let opacity = absProgress <= 1.1 ? 1 - (absProgress * 0.3) : 0.4;
            opacity = Math.max(opacity, 0.4);
            slide.style.opacity = opacity;
            slide.style.transition = 'opacity 0.3s ease';
        }
    }
});