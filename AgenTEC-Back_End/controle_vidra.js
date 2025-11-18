/**
 * Arquivo JS para o controle de Vidrarias:
 * - Faz a requisição dos dados de vidrarias do back-end.
 * - Renderiza os cards e configura o filtro de busca.
 */

const BACKEND_URL = 'http://localhost:3000/api'; 

document.addEventListener('DOMContentLoaded', () => {
    const searchArea = document.getElementById('search-area');
    const itemsListContainer = document.querySelector('.items-list-container');
    const endpoint = '/vidrarias';
    const tipoItem = 'vidrarias';

    // Função principal para buscar os dados do servidor, renderizar e configurar o filtro
    const iniciarControle = async (url, tipoItem) => {
        itemsListContainer.innerHTML = `<p>Carregando ${tipoItem}...</p>`;

        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                // Captura erros de status HTTP (404, 500, etc.)
                throw new Error(`Erro de rede (${response.status}) ao buscar ${tipoItem}.`);
            }
            
            const data = await response.json();

            if (data.success && data.itens) {
                renderizarCards(data.itens);
            } else {
                itemsListContainer.innerHTML = `<p class="error-message">Erro ao carregar ${tipoItem}: ${data.message || 'Dados do servidor inválidos.'} **(Verifique as queries no server.js)**</p>`;
            }
        } catch (error) {
            console.error('Erro na comunicação com o back-end:', error);
            // Mensagem de erro aprimorada para ajudar no diagnóstico
            itemsListContainer.innerHTML = `<p class="error-message">
                **ERRO DE CONEXÃO!** Não foi possível carregar os dados de ${tipoItem}.<br> 
                Verifique se o **servidor back-end (Node.js/server.js)** está **rodando** e se está acessível em **${BACKEND_URL}${endpoint}**.<br>
                Detalhe: ${error.message}
            </p>`;
        }
    };
    
    // Função para renderizar os cards dinamicamente
    const renderizarCards = (itens) => {
        itemsListContainer.innerHTML = ''; 

        // Agrupa os itens pelo campo 'tipo' (Tipo do Item)
        const itensAgrupados = itens.reduce((acc, item) => {
            const tipo = item.tipo || 'Outros'; 
            if (!acc[tipo]) {
                acc[tipo] = [];
            }
            acc[tipo].push(item);
            return acc;
        }, {});

        // Gera o HTML para cada grupo (card)
        for (const tipo in itensAgrupados) {
            const itensDoTipo = itensAgrupados[tipo];
            
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
        
        // Adiciona evento de clique para a observação (delegado para o documento)
        document.querySelectorAll('.view-obs').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const obs = e.currentTarget.dataset.obs;
                alert('Observação: ' + obs);
            });
        });
    };

    // Lógica de filtro de busca na página (melhorada e desacoplada do load)
    if (searchArea && itemsListContainer) {
        searchArea.addEventListener('input', () => {
            const termoBuscado = searchArea.value.toLowerCase();
            const todosOsCards = itemsListContainer.querySelectorAll('.item-card');

            todosOsCards.forEach(card => {
                let cardVisivel = false;
                const linhas = card.querySelectorAll('.item-row');
                
                // Exibe apenas as linhas que correspondem à busca
                linhas.forEach(linha => {
                    const textoLinha = linha.dataset.search; 
                    if (textoLinha && textoLinha.includes(termoBuscado)) {
                        linha.style.display = 'flex'; // Exibe a linha
                        cardVisivel = true;
                    } else {
                        linha.style.display = 'none'; // Oculta a linha
                    }
                });

                // Se houver alguma linha visível, o card permanece visível
                card.style.display = cardVisivel ? 'block' : 'none';
            });
        });
    }

    // Inicia o carregamento dos dados
    iniciarControle(`${BACKEND_URL}${endpoint}`, tipoItem);
}); 