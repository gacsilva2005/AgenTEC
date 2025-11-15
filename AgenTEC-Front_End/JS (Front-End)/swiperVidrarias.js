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
            agrupadas[nome] = { nome, capacidades: [] };
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
        quantidadeSelect.innerHTML = '<option value="" id = "quantidade-vidraria" >Selecione a capacidade</option>';

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

    window.abrirModal = abrirModal;
    window.fecharModal = () => modal.classList.remove('show');
    window.confirmarAdicao = () => {
        const cap = quantidadeSelect.value;
        if (!cap) return alert("Selecione uma capacidade.");
        alert(`Adicionado: ${cap} de ${vidrariaAtual.nome}`);
        fecharModal();
    };

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