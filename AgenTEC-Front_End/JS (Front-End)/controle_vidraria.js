document.addEventListener('DOMContentLoaded', () => {
    const searchArea = document.getElementById('search-area');
    // USANDO O ID DO HTML
    const itemsListContainer = document.getElementById('vidrarias-accordion'); 

    // Funções de Accordion
    const setupAccordion = () => {
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const content = e.currentTarget.nextElementSibling;
                const isActive = e.currentTarget.classList.contains('active');

                e.currentTarget.classList.toggle('active');

                if (isActive) {
                    content.style.display = 'none'; // Colapsa
                } else {
                    content.style.display = 'block'; // Expande
                }
            });
        });
    };
    
    // Função para renderizar as variações de um item (MANTIDA)
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
    
    // Função para editar quantidade de uma variação (MANTIDA)
    const editarQuantidade = (itemNome, descricao, quantidadeAtual) => {
        const novaQuantidade = prompt(
            `Editar quantidade para:\n${itemNome} - ${descricao}\n\nQuantidade atual: ${quantidadeAtual}`,
            quantidadeAtual
        );

        if (novaQuantidade !== null && !isNaN(novaQuantidade) && novaQuantidade >= 0) {
            // Ação simulada de backend
            alert(`Quantidade de ${itemNome} - ${descricao} atualizada para: ${novaQuantidade}\n\n(Esta funcionalidade será integrada com o backend)`);
            
            // Atualizar a interface visualmente (MANTIDO)
            const buttons = document.querySelectorAll('.edit-variation');
            buttons.forEach(button => {
                if (button.dataset.variacao === `${itemNome}|${descricao}|${quantidadeAtual}`) {
                    button.dataset.variacao = `${itemNome}|${descricao}|${novaQuantidade}`;
                    const variationRow = button.closest('.variation-row');
                    const qtySpan = variationRow.querySelector('.variation-qty');
                    qtySpan.textContent = `${novaQuantidade} un.`;
                    
                    updateItemTotal(itemNome);
                }
            });
        } else if (novaQuantidade !== null) {
            alert('Por favor, insira um número válido (0 ou maior).');
        }
    };
    
    // Função para atualizar o total do item (MANTIDA)
    const updateItemTotal = (itemNome) => {
        console.log(`Total de ${itemNome} precisa ser recalculado`);
        // Aqui você faria a lógica de recálculo
    };

    // Função principal para carregar vidrarias
    const fetchVidrarias = async () => {
        try {
            console.log('🔍 Iniciando busca de vidrarias...');
            // MOSTRANDO A MENSAGEM DE CARREGAMENTO NO INÍCIO
            itemsListContainer.innerHTML = '<p style="text-align:center; font-size:1.6rem; color:#666;">Carregando vidrarias...</p>';

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

    // Função para renderizar os cards agrupados por tipo (AGORA COMO ACCORDION)
    const renderizarCards = (vidrarias) => {
        itemsListContainer.innerHTML = '';

        if (!vidrarias || vidrarias.length === 0) {
            itemsListContainer.innerHTML = '<p class="info-message">Nenhuma vidraria encontrada no banco de dados.</p>';
            return;
        }

        console.log('🎨 Renderizando cards como Accordion de Tipos...');

        // Agrupa as vidrarias pelo campo 'tipo'
        const vidrariasAgrupadas = vidrarias.reduce((acc, item) => {
            const tipo = item.tipo || 'Outros';
            if (!acc[tipo]) {
                acc[tipo] = [];
            }
            acc[tipo].push(item);
            return acc;
        }, {});

        // Cria um Accordion Group para cada TIPO
        for (const [tipo, itensDoTipo] of Object.entries(vidrariasAgrupadas)) {
            
            const accordionGroup = document.createElement('div');
            accordionGroup.classList.add('accordion-group-vidraria');
            accordionGroup.dataset.group = tipo.toLowerCase();

            // 1. CABEÇALHO DO ACCORDION (O TIPO DE VIDRARIA)
            const headerHTML = document.createElement('div');
            headerHTML.classList.add('accordion-header');
            headerHTML.innerHTML = `
                <span>${tipo} (${itensDoTipo.length} itens)</span>
                <i class="fas fa-chevron-right accordion-icon"></i>
            `;
            accordionGroup.appendChild(headerHTML);
            
            // 2. CORPO DO ACCORDION (Contém todos os ITENS/VARIEDADES desse tipo)
            const contentHTML = document.createElement('div');
            contentHTML.classList.add('accordion-content');
            contentHTML.style.display = 'none'; // FORÇA O ESTADO INICIAL FECHADO

            // Adiciona cada item do tipo com suas variações dentro do corpo do Accordion
            itensDoTipo.forEach(item => {
                // Remove espaços e parênteses do nome para o ID/data-item (evita problemas)
                const itemNomeFormatted = item.nome.replace(/[^a-zA-Z0-9]/g, '_'); 
                const textoBusca = `${item.nome} ${tipo}`.toLowerCase();
                
                // Item principal (agora é a linha dentro do corpo do Accordion)
                let itemInnerHtml = `
                    <div class="item-card-inner">
                        <div class="item-row main-item" data-search="${textoBusca}">
                            <div class="item-info">
                                <p class="item-name">${item.nome}</p>
                                <p class="item-total">Total: ${item.quantidadeTotal} unidades</p>
                            </div>
                            <div class="item-actions">
                                <i class="fas fa-chevron-down item-action toggle-variations" 
                                title="Ver Variações"
                                data-item="${itemNomeFormatted}">
                                </i>
                            </div>
                        </div>
                        <div class="variations-container" id="variations-${itemNomeFormatted}" style="display: none;">
                            ${renderizarVariacoes(item.variacoes, item.nome)}
                        </div>
                    </div>
                `;
                
                contentHTML.innerHTML += itemInnerHtml; // Usa += para adicionar o HTML
            });

            accordionGroup.appendChild(contentHTML);
            itemsListContainer.appendChild(accordionGroup);
        }

        // Adiciona eventos de Accordion de TIPO
        setupAccordion();

        // Adiciona eventos para mostrar/ocultar Variações (AGORA USANDO O itemNomeFormatted)
        document.querySelectorAll('.toggle-variations').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const itemNomeFormatted = e.target.dataset.item; 
                const containerId = `variations-${itemNomeFormatted}`;
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

        // Adiciona eventos para editar quantidades (MANTIDO)
        document.querySelectorAll('.edit-variation').forEach(button => {
            button.addEventListener('click', (e) => {
                const variacaoData = e.target.dataset.variacao;
                const [itemNome, descricao, quantidadeAtual] = variacaoData.split('|');
                editarQuantidade(itemNome, descricao, parseInt(quantidadeAtual));
            });
        });

        console.log('✅ Renderização concluída!');
    };


    // Sistema de busca/filtro (ADAPTADO PARA O NOVO ACCORDION)
    const setupSearch = () => {
        if (!searchArea || !itemsListContainer) return;

        searchArea.addEventListener('input', () => {
            const termo = searchArea.value.toLowerCase().trim();
            const todosOsGrupos = itemsListContainer.querySelectorAll('.accordion-group-vidraria');

            // Se a busca estiver vazia, volta ao estado fechado
            if (termo === '') {
                todosOsGrupos.forEach(group => {
                    const content = group.querySelector('.accordion-content');
                    const header = group.querySelector('.accordion-header');
                    
                    group.style.display = 'block';
                    content.style.display = 'none';
                    header.classList.remove('active');
                });
                return;
            }

            // Lógica de busca e abertura do Accordion
            todosOsGrupos.forEach(group => {
                let grupoVisivel = false;
                const content = group.querySelector('.accordion-content');
                const header = group.querySelector('.accordion-header');
                
                // Oculta/mostra os itens individuais (item-card-inner) e suas variações
                const innerCards = group.querySelectorAll('.item-card-inner');
                
                innerCards.forEach(innerCard => {
                    let innerCardVisivel = false;
                    const mainItemRow = innerCard.querySelector('.main-item');
                    const variationsContainer = innerCard.querySelector('.variations-container');
                    const variationRows = innerCard.querySelectorAll('.variation-row');
                    
                    // 1. Verifica a linha principal
                    const mainItemText = mainItemRow.dataset.search;
                    if (mainItemText && mainItemText.includes(termo)) {
                        mainItemRow.style.display = 'flex';
                        variationsContainer.style.display = 'none'; // Não abre as variações automaticamente
                        innerCardVisivel = true;
                    } else {
                        mainItemRow.style.display = 'none';
                    }

                    // 2. Verifica as linhas de variação
                    variationRows.forEach(vRow => {
                        const vRowDesc = vRow.querySelector('.variation-desc').textContent.toLowerCase();
                        if (vRowDesc.includes(termo)) {
                            vRow.style.display = 'flex';
                            innerCardVisivel = true;
                            // Se encontrar uma variação, exibe a linha principal e abre o variations-container
                            mainItemRow.style.display = 'flex';
                            variationsContainer.style.display = 'block';
                        } else {
                            vRow.style.display = 'none';
                        }
                    });

                    // Exibe ou oculta o innerCard e atualiza o status do grupo
                    if (innerCardVisivel) {
                        innerCard.style.display = 'block';
                        grupoVisivel = true;
                    } else {
                        innerCard.style.display = 'none';
                    }
                });


                // 3. Controla a exibição e estado do Accordion (Grupo)
                if (grupoVisivel) {
                    group.style.display = 'block';
                    content.style.display = 'block'; // Abre o Accordion do Tipo
                    header.classList.add('active'); 
                } else {
                    group.style.display = 'none';
                }
            });
            
            console.log(`🔎 Busca por termo: "${termo}" concluída.`);
        });
    };
    
    // Inicializa tudo
    setupSearch();
    fetchVidrarias();
});