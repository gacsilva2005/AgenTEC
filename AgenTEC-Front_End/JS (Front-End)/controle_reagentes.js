/**
 * Arquivo JS para o controle de Reagentes:
 * 1. Faz a requisição dos dados de reagentes do back-end.
 * 2. Renderiza os cards de reagentes dinamicamente.
 * 3. Implementa a lógica de filtro de busca na página.
 */

const BACKEND_URL = 'http://localhost:3000/api'; // Ajuste se seu servidor rodar em outra porta/URL

document.addEventListener('DOMContentLoaded', () => {
    const searchArea = document.getElementById('search-area');
    const itemsListContainer = document.querySelector('.items-list-container');

    // 1. Função para buscar os dados do servidor
    const fetchReagentes = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/reagentes`);
            const data = await response.json();

            if (data.success && data.itens) {
                renderizarCards(data.itens);
            } else {
                itemsListContainer.innerHTML = '<p class="error-message">Erro ao carregar reagentes: ' + (data.message || 'Dados inválidos.') + '</p>';
            }
        } catch (error) {
            console.error('Erro na comunicação com o back-end:', error);
            itemsListContainer.innerHTML = '<p class="error-message">Não foi possível conectar ao servidor. Verifique se o back-end (server.js) está rodando (porta 3000).</p>';
        }
    };

    // 2. Função para renderizar os cards dinamicamente
    const renderizarCards = (reagentes) => {
        itemsListContainer.innerHTML = ''; 

        // Agrupa os itens pelo campo 'tipo' (Tipo do Item)
        const reagentesAgrupados = reagentes.reduce((acc, item) => {
            const tipo = item.tipo || 'Outros'; 
            if (!acc[tipo]) {
                acc[tipo] = [];
            }
            acc[tipo].push(item);
            return acc;
        }, {});

        // Gera o HTML para cada grupo (card)
        for (const tipo in reagentesAgrupados) {
            const itensDoTipo = reagentesAgrupados[tipo];
            
            const cardHTML = document.createElement('div');
            cardHTML.classList.add('item-card');

            // Título do card (Tipo do Item)
            let innerHTML = `<div class="table-title"><h3>${tipo}</h3></div>`;

            // Linhas de itens dentro do card
            itensDoTipo.forEach(item => {
                const observacao = item.observacoes || 'Sem observação';
                const nomeCompleto = `${item.nome} (${item.quantidade} unidades)`;

                innerHTML += `
                    <div class="item-row" data-search="${nomeCompleto.toLowerCase()}">
                        <p class="item-name">${item.nome} (${item.quantidade} unidades)</p>
                        <div class="item-details">
                            <p class="item-qty">${item.quantidade} unidades</p>
                            <i class="fas fa-comment-dots item-action view-obs" title="Ver Observação" data-obs="${observacao}"></i>
                            <i class="fas fa-pencil-alt item-action edit-qty" title="Editar Quantidade"></i>
                        </div>
                    </div>
                `;
            });

            cardHTML.innerHTML = innerHTML;
            itemsListContainer.appendChild(cardHTML);
        }

        // Adiciona evento de clique para a observação
        document.querySelectorAll('.view-obs').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const obs = e.currentTarget.dataset.obs;
                alert('Observação: ' + obs);
            });
        });
    };

    // 3. Lógica de filtro de busca na página (melhorada)
    if (searchArea && itemsListContainer) {
        searchArea.addEventListener('input', () => {
            const termoBuscado = searchArea.value.toLowerCase();
            const todosOsCards = itemsListContainer.querySelectorAll('.item-card');

            todosOsCards.forEach(card => {
                let cardVisivel = false;
                const linhas = card.querySelectorAll('.item-row');
                
                // Verifica se alguma linha dentro do card corresponde ao termo
                linhas.forEach(linha => {
                    const textoLinha = linha.dataset.search; 
                    if (textoLinha.includes(termoBuscado)) {
                        linha.style.display = 'flex'; // Exibe a linha
                        cardVisivel = true;
                    } else {
                        linha.style.display = 'none'; // Oculta a linha
                    }
                });

                // Se pelo menos uma linha estiver visível, o card deve ser exibido
                card.style.display = cardVisivel ? 'block' : 'none';
            });
        });
    }

    // Inicia o carregamento dos dados
    fetchReagentes();
});