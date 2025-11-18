document.addEventListener('DOMContentLoaded', () => {
    const searchArea = document.getElementById('search-area');
    const itemsListContainer = document.querySelector('.items-list-container');

    // Função principal para carregar vidrarias
    const fetchVidrarias = async () => {
        try {
            console.log('🔍 Iniciando busca de vidrarias...');
            itemsListContainer.innerHTML = '<p>Carregando vidrarias...</p>';

            const response = await fetch('http://localhost:3000/api/vidrarias');
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log('📦 Resposta da API:', data);

            if (data.success && data.itens && Array.isArray(data.itens)) {
                console.log(`✅ ${data.itens.length} tipos de vidrarias carregados`);
                renderizarCards(data.itens);
            } else {
                throw new Error('Estrutura de dados inválida do servidor');
            }
        } catch (error) {
            console.error('❌ Erro ao carregar vidrarias:', error);
            itemsListContainer.innerHTML = `
                <div class="error-message">
                    <h3>Erro ao carregar vidrarias</h3>
                    <p>${error.message}</p>
                    <p>Verifique se o servidor está rodando na porta 3000.</p>
                </div>
            `;
        }
    };

    // Função para renderizar os cards agrupados por tipo
    const renderizarCards = (vidrarias) => {
        itemsListContainer.innerHTML = '';

        if (!vidrarias || vidrarias.length === 0) {
            itemsListContainer.innerHTML = '<p class="info-message">Nenhuma vidraria encontrada no banco de dados.</p>';
            return;
        }

        console.log('🎨 Renderizando cards...');

        // Agrupa as vidrarias pelo campo 'tipo'
        const vidrariasAgrupadas = vidrarias.reduce((acc, item) => {
            const tipo = item.tipo || 'Outros';
            if (!acc[tipo]) {
                acc[tipo] = [];
            }
            acc[tipo].push(item);
            return acc;
        }, {});

        console.log('📂 Grupos criados:', Object.keys(vidrariasAgrupadas));

        // Cria um card para cada tipo
        for (const [tipo, itensDoTipo] of Object.entries(vidrariasAgrupadas)) {
            const cardHTML = document.createElement('div');
            cardHTML.classList.add('item-card');

            // Cabeçalho do card com o tipo
            let innerHTML = `
                <div class="table-title">
                    <h3>${tipo}</h3>
                    <span class="item-count">${itensDoTipo.length} itens</span>
                </div>
            `;

            // Adiciona cada item do tipo com suas variações
            itensDoTipo.forEach(item => {
                const textoBusca = `${item.nome} ${tipo}`.toLowerCase();
                
                innerHTML += `
                    <div class="item-row main-item" data-search="${textoBusca}">
                        <div class="item-info">
                            <p class="item-name">${item.nome}</p>
                            <p class="item-total">Total: ${item.quantidadeTotal} unidades</p>
                        </div>
                        <div class="item-actions">
                            <i class="fas fa-chevron-down item-action toggle-variations" 
                               title="Ver Variações"
                               data-item="${item.nome}">
                            </i>
                        </div>
                    </div>
                    <div class="variations-container" id="variations-${item.nome.replace(/\s+/g, '-')}" style="display: none;">
                        ${renderizarVariacoes(item.variacoes, item.nome)}
                    </div>
                `;
            });

            cardHTML.innerHTML = innerHTML;
            itemsListContainer.appendChild(cardHTML);
        }

        // Adiciona eventos para mostrar/ocultar variações
        document.querySelectorAll('.toggle-variations').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const itemNome = e.target.dataset.item;
                const containerId = `variations-${itemNome.replace(/\s+/g, '-')}`;
                const container = document.getElementById(containerId);
                const icon = e.target;
                
                if (container.style.display === 'none') {
                    container.style.display = 'block';
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                } else {
                    container.style.display = 'none';
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            });
        });

        // Adiciona eventos para editar quantidades
        document.querySelectorAll('.edit-variation').forEach(button => {
            button.addEventListener('click', (e) => {
                const variacaoData = e.target.dataset.variacao;
                const [itemNome, descricao, quantidadeAtual] = variacaoData.split('|');
                editarQuantidade(itemNome, descricao, parseInt(quantidadeAtual));
            });
        });

        console.log('✅ Renderização concluída!');
    };

    // Função para renderizar as variações de um item
    const renderizarVariacoes = (variacoes, itemNome) => {
        return variacoes.map(variacao => `
            <div class="variation-row">
                <div class="variation-info">
                    <span class="variation-desc">${variacao.descricao}</span>
                    <span class="variation-qty">${variacao.quantidade} un.</span>
                </div>
                <div class="variation-actions">
                    <button class="btn-edit edit-variation" 
                            data-variacao="${itemNome}|${variacao.descricao}|${variacao.quantidade}">
                        <i class="fas fa-pencil-alt"></i> Editar
                    </button>
                </div>
            </div>
        `).join('');
    };

    // Função para editar quantidade de uma variação
    const editarQuantidade = (itemNome, descricao, quantidadeAtual) => {
        const novaQuantidade = prompt(
            `Editar quantidade para:\n${itemNome} - ${descricao}\n\nQuantidade atual: ${quantidadeAtual}`,
            quantidadeAtual
        );

        if (novaQuantidade !== null && !isNaN(novaQuantidade) && novaQuantidade >= 0) {
            // Aqui você faria a requisição para o backend para atualizar a quantidade
            // Por enquanto, vamos apenas mostrar um alerta
            alert(`Quantidade de ${itemNome} - ${descricao} atualizada para: ${novaQuantidade}\n\n(Esta funcionalidade será integrada com o backend)`);
            
            // Atualizar a interface visualmente
            const buttons = document.querySelectorAll('.edit-variation');
            buttons.forEach(button => {
                if (button.dataset.variacao === `${itemNome}|${descricao}|${quantidadeAtual}`) {
                    button.dataset.variacao = `${itemNome}|${descricao}|${novaQuantidade}`;
                    // Atualizar o texto da quantidade na interface
                    const variationRow = button.closest('.variation-row');
                    const qtySpan = variationRow.querySelector('.variation-qty');
                    qtySpan.textContent = `${novaQuantidade} un.`;
                    
                    // Atualizar o total do item
                    updateItemTotal(itemNome);
                }
            });
        } else if (novaQuantidade !== null) {
            alert('Por favor, insira um número válido (0 ou maior).');
        }
    };

    // Função para atualizar o total do item
    const updateItemTotal = (itemNome) => {
        // Esta função seria chamada após editar as variações
        // Para simplificar, vamos recarregar a página
        console.log(`Total de ${itemNome} precisa ser recalculado`);
    };

    // Sistema de busca/filtro
    const setupSearch = () => {
        if (!searchArea || !itemsListContainer) return;

        searchArea.addEventListener('input', () => {
            const termo = searchArea.value.toLowerCase().trim();
            const cards = itemsListContainer.querySelectorAll('.item-card');

            let cardsVisiveis = 0;

            cards.forEach(card => {
                let cardTemResultado = false;
                const linhas = card.querySelectorAll('.item-row, .variation-row');

                linhas.forEach(linha => {
                    const textoBusca = linha.dataset.search;
                    if (textoBusca && textoBusca.includes(termo)) {
                        linha.style.display = 'flex';
                        // Mostra as variações se estiver buscando por uma variação específica
                        if (linha.classList.contains('variation-row')) {
                            const mainItem = linha.closest('.variations-container').previousElementSibling;
                            mainItem.style.display = 'flex';
                            cardTemResultado = true;
                        } else {
                            cardTemResultado = true;
                        }
                    } else {
                        linha.style.display = 'none';
                    }
                });

                if (cardTemResultado) {
                    card.style.display = 'block';
                    cardsVisiveis++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (termo && cardsVisiveis === 0) {
                itemsListContainer.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <h3>Nenhuma vidraria encontrada</h3>
                        <p>Não encontramos resultados para "<strong>${termo}</strong>"</p>
                    </div>
                `;
            }
        });
    };

    // Inicializa tudo
    setupSearch();
    fetchVidrarias();
});