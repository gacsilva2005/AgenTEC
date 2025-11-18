document.addEventListener('DOMContentLoaded', () => {
    const searchArea = document.getElementById('search-area');
    const itemsListContainer = document.querySelector('.items-list-container');
    const tipoItem = 'vidrarias';

    // Função para buscar os dados do arquivo JSON local
    const iniciarControle = async () => {
        // Mensagem de carregamento
        itemsListContainer.innerHTML = `<p>Carregando ${tipoItem}...</p>`;

        try {
            const response = await fetch('../../../AgenTEC-DataBase-(JSON)/vidrarias.json');
            
            if (!response.ok) {
                throw new Error(`Erro de rede (${response.status}) ao buscar ${tipoItem}.`);
            }
            
            const data = await response.json();
            
            // DEBUG: Ver a estrutura real dos dados
            console.log('Dados recebidos:', data);
            
            // Múltiplas formas de extrair os itens
            let itens = [];
            
            if (Array.isArray(data)) {
                // Se a resposta é diretamente um array
                itens = data;
                console.log('Encontrado array direto com', itens.length, 'itens');
            } else if (data.success && data.itens) {
                // Estrutura: {success: true, itens: [...]}
                itens = data.itens;
                console.log('Encontrado estrutura {success, itens}');
            } else if (data.itens) {
                // Estrutura: {itens: [...]}
                itens = data.itens;
                console.log('Encontrado estrutura {itens}');
            } else if (data.items) {
                // Estrutura: {items: [...]}
                itens = data.items;
                console.log('Encontrado estrutura {items}');
            } else if (data.vidrarias) {
                // Estrutura: {vidrarias: [...]}
                itens = data.vidrarias;
                console.log('Encontrado estrutura {vidrarias}');
            } else if (data.data) {
                // Estrutura: {data: [...]}
                itens = data.data;
                console.log('Encontrado estrutura {data}');
            } else {
                // Se for um objeto, tenta extrair valores
                console.log('Estrutura não reconhecida, tentando extrair valores...');
                itens = Object.values(data);
            }

            console.log('Itens extraídos:', itens);

            if (!itens || itens.length === 0) {
                itemsListContainer.innerHTML = '<p class="info-message">Nenhuma vidraria encontrada no banco de dados.</p>';
            } else {
                renderizarCards(itens);
            }
            
        } catch (error) {
            console.error('Erro ao carregar vidrarias:', error);
            itemsListContainer.innerHTML = `<p class="error-message">
                **ERRO!** Não foi possível carregar as ${tipoItem}.<br> 
                Verifique se o arquivo JSON existe no caminho especificado.<br>
                Detalhe: ${error.message}
            </p>`;
        }
    };
    
    // Função para renderizar os cards dinamicamente
    const renderizarCards = (itens) => {
        itemsListContainer.innerHTML = ''; 

        // Verifica se itens é um array válido
        if (!Array.isArray(itens)) {
            console.error('Itens não é um array:', itens);
            itemsListContainer.innerHTML = '<p class="error-message">Erro: Dados em formato inválido.</p>';
            return;
        }

        // 1. Agrupa os itens pelo campo 'tipo' para criar os cards por categoria
        const itensAgrupados = itens.reduce((acc, item) => {
            // Verifica se o item tem as propriedades mínimas necessárias
            if (!item || typeof item !== 'object') {
                console.warn('Item inválido ignorado:', item);
                return acc;
            }
            
            const tipo = item.tipo || item.categoria || 'Outros'; 
            if (!acc[tipo]) {
                acc[tipo] = [];
            }
            acc[tipo].push(item);
            return acc;
        }, {});

        console.log('Itens agrupados:', itensAgrupados);

        // 2. Itera sobre os grupos para criar o HTML dos cards
        for (const tipo in itensAgrupados) {
            const itensDoTipo = itensAgrupados[tipo];
            
            const cardHTML = document.createElement('div');
            cardHTML.classList.add('item-card');

            // Título do card (Tipo do Item)
            let innerHTML = `<div class="table-title"><h3>${tipo}</h3></div>`;

            // Linhas de itens dentro do card
            itensDoTipo.forEach(item => {
                const nome = item.nome || item.Nome || 'Nome não definido';
                const observacao = item.observacoes || item.observacao || item.Observacao || 'Sem observação';
                const quantidade = item.quantidade !== undefined ? item.quantidade : 
                                 item.quantidad !== undefined ? item.quantidad : 'Indefinida';
                const quantidadeTexto = quantidade !== 'Indefinida' ? `${quantidade} unidades` : 'Qtd. Indefinida';
                const nomeCompleto = `${nome} ${tipo ? `(${tipo})` : ''} ${quantidade}`.toLowerCase();
                
                innerHTML += `
                    <div class="item-row" data-search="${nomeCompleto}">
                        <p class="item-name">${nome}</p>
                        <div class="item-details">
                            <p class="item-qty">${quantidadeTexto}</p>
                            <i class="fas fa-comment-dots item-action view-obs" title="Ver Observação" data-obs="${observacao.replace(/"/g, '&quot;')}"></i>
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

        console.log('Renderização concluída!');
    };

    // Lógica de filtro de busca na página (client-side)
    if (searchArea && itemsListContainer) {
        searchArea.addEventListener('input', () => {
            const termoBuscado = searchArea.value.toLowerCase();
            const todosOsCards = itemsListContainer.querySelectorAll('.item-card');

            todosOsCards.forEach(card => {
                let cardVisivel = false;
                const linhas = card.querySelectorAll('.item-row');
                
                linhas.forEach(linha => {
                    const textoLinha = linha.dataset.search; 
                    if (textoLinha && textoLinha.includes(termoBuscado)) {
                        linha.style.display = 'flex'; 
                        cardVisivel = true;
                    } else {
                        linha.style.display = 'none'; 
                    }
                });

                card.style.display = cardVisivel ? 'block' : 'none';
            });
        });
    }

    // Inicia o carregamento dos dados quando a página estiver pronta
    iniciarControle();
});