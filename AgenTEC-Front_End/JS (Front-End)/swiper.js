function updateSlideOpacity(swiper) {
    for (let i = 0; i < swiper.slides.length; i++) {
        const slide = swiper.slides[i];
        
        // Esta linha é crucial: usa o 'progress' individual do slide
        const slideProgress = swiper.slides[i].progress; 
        const absProgress = Math.abs(slideProgress); 
        
        let opacity;

        // --- LÓGICA DE OPACIDADE AJUSTADA ---
        
        // absProgress: 
        // ~0: Slide Central
        // ~1: Vizinhos imediatos (esquerda e direita)
        // >1: Slides mais distantes
        
        if (absProgress <= 1.1) { 
            // Os slides que estão muito próximos do centro (incluindo os vizinhos)
            
            // Calcula opacidade: 1 - 0.3 (contraste) * absProgress (distância)
            // Central (0) = 1. Vizinhos (1) = 0.7.
            opacity = 1 - (absProgress * 0.3); 
        } else { 
            // Slides distantes
            opacity = 0.4; 
        }

        // Garante a opacidade mínima
        opacity = Math.max(opacity, 0.4); 
        // ------------------------------------
        
        slide.style.opacity = opacity;
        slide.style.transition = 'opacity 0.3s ease';

        // Lógica de Desativação
        const threshold = 0.6; 
        if (absProgress > threshold) {
            slide.classList.add('is-disabled');
        } else {
            slide.classList.remove('is-disabled');
        }
    }
}
// ===============================================
const mySwiper = new Swiper('.card-wrapper', {
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
        // Chamado durante o movimento (para animação suave)
        progress: function() {
            updateSlideOpacity(this);
        },
        
        // Chamado ao final do movimento (para corrigir a inconsistência do loop)
        slideChangeTransitionEnd: function() {
            updateSlideOpacity(this);
        },
        
        // Mantém a transição CSS que você já tinha
        setTransition: function(speed) {
            const swiper = this;
            for (let i = 0; i < swiper.slides.length; i++) {
                swiper.slides[i].style.transition = `${speed}ms`;
            }
        },
        
        // Adiciona o listener de clique para centralização
        init: function() {
            const swiper = this;
            swiper.slides.forEach((slideEl) => {
                slideEl.addEventListener('click', () => {
                    const clickedIndex = parseInt(slideEl.dataset.swiperSlideIndex);
                    
                    if (!isNaN(clickedIndex)) {
                        swiper.slideToLoop(clickedIndex, 500); 
                    }
                });
            });
        }
    },

    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        }
    }
});

// ===============================================
function abrirModal(nomeReagente) {
    // A função de clique do slide acima agora centraliza o card.
    // O botão 'Adicionar' (no HTML) deve chamar esta função com event.stopPropagation()
    
    document.getElementById('modalReagenteTitle').innerText = `Adicionar ${nomeReagente}`;
    document.getElementById('quantidadeInput').value = ''; // Limpa o input
    document.getElementById('reagenteModal').classList.add('show');
}

function fecharModal() {
    document.getElementById('reagenteModal').classList.remove('show');
}

function confirmarAdicao() {
    const quantidade = document.getElementById('quantidadeInput').value;
    const reagente = document.getElementById('modalReagenteTitle').innerText.replace('Adicionar ', '');

    if (quantidade && parseInt(quantidade) > 0) {
        console.log(`Adicionado ${reagente}: ${quantidade}g`);
        // Aqui entra a sua LÓGICA DE NEGÓCIO (método da classe Sistema)
        
        fecharModal();
    } else {
        alert('Por favor, insira uma quantidade válida.');
    }
}