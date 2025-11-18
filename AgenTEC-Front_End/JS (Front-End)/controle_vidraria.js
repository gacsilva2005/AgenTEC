/**
 * Arquivo JS para o controle de Vidrarias:
 * 1. Faz a requisição dos dados de vidrarias do back-end (Node.js, rota /api/vidrarias).
 * 2. Renderiza os cards, agrupando os itens pelo campo 'tipo'.
 * 3. Implementa a lógica de filtro de busca na página.
 * * ATENÇÃO: Requer que o servidor Node.js esteja rodando na porta 3000.
 */

// A URL base do seu Back-End
const BACKEND_URL = 'http://localhost:3000/api'; 

document.addEventListener('DOMContentLoaded', () => {
    const searchArea = document.getElementById('search-area');
    const itemsListContainer = document.querySelector('.items-list-container');
    const endpoint = '/vidrarias';
    const tipoItem = 'vidrarias';

    // Função para buscar os dados do servidor e iniciar a renderização
    const iniciarControle = async (url, tipoItem) => {
        // Mensagem de carregamento
        itemsListContainer.innerHTML = `<p>Carregando ${tipoItem}...</p>`;

        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                // Captura erros de status HTTP (404, 500, etc.)
                throw new Error(`Erro de rede (${response.status}) ao buscar ${tipoItem}.`);
            }
            
            const data = await response.json();

            if (data.success && data.itens) {
                if (data.itens.length === 0) {
                    itemsListContainer.innerHTML = '<p class="info-message">Nenhuma vidraria encontrada no banco de dados.</p>';
                } else {
                    renderizarCards(data.itens);
                }
            } else {
                // Mensagem detalhada se a comunicação foi ok, mas os dados vieram incorretos
                itemsListContainer.innerHTML = `<p class="error-message">
                    Erro ao carregar ${tipoItem}. O servidor retornou: "${data.message || 'Dados do servidor inválidos.'}"
                </p>`;
            }
        } catch (error) {
            console.error('Erro na comunicação com o back-end:', error);
            // Mensagem de erro aprimorada para ajudar no diagnóstico de conexão
            itemsListContainer.innerHTML = `<p class="error-message">
                **ERRO DE CONEXÃO!** Não foi possível conectar ao servidor para buscar ${tipoItem}.<br> 
                Verifique se o **servidor back-end (Node.js/server.js)** está **rodando** (porta 3000).<br>
                Detalhe: ${error.message}
            </p>`;
        }
    };
    
    // Função para renderizar os cards dinamicamente
    const renderizarCards = (itens) => {
        itemsListContainer.innerHTML = ''; 

        // 1. Agrupa os itens pelo campo 'tipo' para criar os cards por categoria
        const itensAgrupados = itens.reduce((acc, item) => {
            const tipo = item.tipo || 'Outros'; 
            if (!acc[tipo]) {
                acc[tipo] = [];
            }
            acc[tipo].push(item);
            return acc;
        }, {});

        // 2. Itera sobre os grupos para criar o HTML dos cards
        for (const tipo in itensAgrupados) {
            const itensDoTipo = itensAgrupados[tipo];
            
            const cardHTML = document.createElement('div');
            cardHTML.classList.add('item-card');

            // Título do card (Tipo do Item)
            let innerHTML = `<div class="table-title"><h3>${tipo}</h3></div>`;

            // Linhas de itens dentro do card
            itensDoTipo.forEach(item => {
                const observacao = item.observacoes || 'Sem observação';
                const quantidadeTexto = item.quantidade !== undefined ? `${item.quantidade} unidades` : 'Qtd. Indefinida';
                const nomeCompleto = `${item.nome} ${item.tipo ? `(${item.tipo})` : ''} (${item.quantidade} un)`;
                
                // Adicionamos o atributo data-search para que o filtro funcione corretamente
                innerHTML += `
                    <div class="item-row" data-search="${nomeCompleto.toLowerCase()}">
                        <p class="item-name">${item.nome}</p>
                        <div class="item-details">
                            <p class="item-qty">${quantidadeTexto}</p>
                            <i class="fas fa-comment-dots item-action view-obs" title="Ver Observação" data-obs="${observacao}"></i>
                            <i class="fas fa-pencil-alt item-action edit-qty" title="Editar Quantidade"></i>
                        </div>
                    </div>
                `;
            });

            cardHTML.innerHTML = innerHTML;
            itemsListContainer.appendChild(cardHTML);
        }
        
        // Adiciona evento de clique para ver as observações
        document.querySelectorAll('.view-obs').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const obs = e.currentTarget.dataset.obs;
                alert('Observação: ' + obs);
            });
        });
    };

    // Lógica de filtro de busca na página (client-side)
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
                        linha.style.display = 'flex'; 
                        cardVisivel = true;
                    } else {
                        linha.style.display = 'none'; 
                    }
                });

                // O card principal só é visível se contiver alguma linha visível
                card.style.display = cardVisivel ? 'block' : 'none';
            });
        });
    }

    // Inicia o carregamento dos dados quando a página estiver pronta
    iniciarControle(`${BACKEND_URL}${endpoint}`, tipoItem);
});