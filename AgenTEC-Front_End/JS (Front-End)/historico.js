document.addEventListener('DOMContentLoaded', () => {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const inputPesquisa = document.getElementById('input-pesquisa-historico');
    const btnPesquisa = document.querySelector('.btn-pesquisa-historico');
    const accordionListContainer = document.querySelector('.accordion-list-container');

    // --- Lógica de Abertura/Fechamento do Accordion ---
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.parentNode.querySelector('.accordion-content');
            const summary = header.parentNode.querySelector('.accordion-summary');
            const isExpanded = header.getAttribute('aria-expanded') === 'true' || false;

            // Fechar todos os outros accordions e esconder seus resumos
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.setAttribute('aria-expanded', 'false');
                    const otherContent = otherHeader.parentNode.querySelector('.accordion-content');
                    const otherSummary = otherHeader.parentNode.querySelector('.accordion-summary');

                    otherContent.classList.remove('show');
                    if (otherSummary) {
                        // Certifica-se de que o resumo é mostrado ao fechar
                        otherSummary.style.display = 'block'; 
                    }
                }
            });

            // Alternar o accordion clicado
            header.setAttribute('aria-expanded', !isExpanded);
            content.classList.toggle('show');

            // Gerenciar a visibilidade do resumo
            if (summary) {
                if (!isExpanded) {
                    summary.style.display = 'none'; // Esconder resumo ao expandir
                } else {
                    // Dar um pequeno atraso para mostrar o resumo após a transição de fechar
                    setTimeout(() => {
                        summary.style.display = 'block';
                    }, 300); 
                }
            }
        });
    });
    
    // --- Lógica de Pesquisa ---
    
    const realizarPesquisa = () => {
        const termoPesquisa = inputPesquisa.value.toLowerCase().trim();
        const accordionItems = document.querySelectorAll('.accordion-item');

        accordionItems.forEach(item => {
            const emailElement = item.querySelector('.header-email');
            const dataElement = item.querySelector('.header-data');

            // Verifica se os elementos existem antes de tentar acessar textContent
            if (emailElement && dataElement) {
                const email = emailElement.textContent.toLowerCase();
                const data = dataElement.textContent.toLowerCase();

                // Verifica se o termo de pesquisa está contido no email OU na data
                if (email.includes(termoPesquisa) || data.includes(termoPesquisa)) {
                    item.style.display = 'block'; // Mostrar item
                } else {
                    item.style.display = 'none'; // Esconder item
                }
            }
        });
    };

    // Aplica a pesquisa ao clicar no botão
    btnPesquisa.addEventListener('click', realizarPesquisa);

    // Aplica a pesquisa ao digitar no campo (opcional, mas recomendado para UX)
    inputPesquisa.addEventListener('input', realizarPesquisa);

    // Adiciona suporte a tecla Enter no campo de busca
    inputPesquisa.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Impede o submit de um formulário se houver
            realizarPesquisa();
        }
    });
});