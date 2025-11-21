// controle_reagentes.js (Versão Corrigida para replicar o design de expansão de vidrarias)

const BACKEND_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    const searchArea = document.getElementById('search-area');
    const accordionContainer = document.getElementById('reagent-accordion');

    // Funções de Accordion (MANTIDAS)
    const setupAccordion = () => {
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const isActive = header.classList.contains('active');

                header.classList.toggle('active');

                if (isActive) {
                    content.style.display = 'none'; 
                } else {
                    content.style.display = 'block'; 
                }
            });
        });
    };
    
    // Função para atualizar o total do item
    const updateItemTotal = (itemNome, novaQuantidade, unidade) => {
        console.log(`Recalculando total para: ${itemNome}. Nova Quantidade: ${novaQuantidade}`);
        
        const linhasDeItem = document.querySelectorAll('.item-row');
        linhasDeItem.forEach(row => {
            const dataItemName = row.dataset.itemName;
            
            if (dataItemName === itemNome) {
                const qtyElement = row.querySelector('.item-total');
                const unidadeTexto = unidade || row.dataset.itemUnit || 'unidades';
                
                if (qtyElement) {
                    qtyElement.textContent = `Total: ${novaQuantidade} ${unidadeTexto}`;
                    
                    // Atualiza os data-attributes da linha
                    row.dataset.itemQty = novaQuantidade;
                    const novoSearch = `${itemNome} ${novaQuantidade} ${unidadeTexto}`.toLowerCase();
                    row.dataset.search = novoSearch;
                }
                
                // ATUALIZA O CONTEÚDO EXPANDIDO (para refletir o novo cálculo)
                const itemNomeFormatted = itemNome.replace(/[^a-zA-Z0-9]/g, '_');
                const detailsContainer = document.getElementById(`details-${itemNomeFormatted}`);
                if (detailsContainer) {
                    // Recalcula mg
                    const miligramas = (unidadeTexto.toLowerCase() === 'g') ? (novaQuantidade * 1000) : novaQuantidade;
                    
                    // Atualiza a quantidade em gramas na sub-linha
                    const qtyGramasSpan = detailsContainer.querySelector('.variation-qty');
                    if (qtyGramasSpan) {
                         qtyGramasSpan.textContent = `${novaQuantidade} ${unidadeTexto}`;
                    }
                    // Atualiza o valor de miligramas na descrição
                    const descSpan = detailsContainer.querySelector('.variation-desc');
                    if (descSpan) {
                        // ❌ CORREÇÃO JS 1: Removendo o negrito (**) da string no recalculo
                        descSpan.innerHTML = `Conversão (g &rarr; mg): ${miligramas.toFixed(2)} mg`;
                    }
                    // Atualiza o data-attribute do botão
                    const editButton = detailsContainer.querySelector('.btn-edit');
                    if (editButton) {
                        editButton.dataset.itemQty = novaQuantidade;
                    }
                }
            }
        });
    };
    
    // Função para editar quantidade de um item
    const editarQuantidade = (itemNome, unidade, quantidadeAtual) => {
        const novaQuantidadeStr = prompt(
            `Editar quantidade para:\n${itemNome}\n\nUnidade: ${unidade}\nQuantidade atual: ${quantidadeAtual}`,
            quantidadeAtual
        );

        if (novaQuantidadeStr !== null) {
            const novaQuantidade = parseFloat(novaQuantidadeStr);
            if (!isNaN(novaQuantidade) && novaQuantidade >= 0) {
                alert(`Quantidade de ${itemNome} atualizada para: ${novaQuantidade} ${unidade}\n\n(Esta funcionalidade será integrada com o backend)`);
                updateItemTotal(itemNome, novaQuantidade, unidade);
            } else {
                alert('Por favor, insira um número válido (0 ou maior).');
            }
        }
    };
    
    // 1. Função para buscar os dados (MANTIDA)
    const fetchReagentes = async () => {
        accordionContainer.innerHTML = '<p style="text-align:center; font-size:1.6rem; color:#666;">Carregando reagentes...</p>';
        
        try {
            const response = await fetch('../../../AgenTEC-DataBase-(JSON)/reagentes.json');
            // ... (código fallback) ...
             if (!response.ok) {
                const fallbackResponse = await fetch('reagentes.json');
                if (!fallbackResponse.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                const data = await fallbackResponse.json();
                renderizarCards(data);
                return;
            }

            const data = await response.json();
            const reagentes = Array.isArray(data) ? data : data.reagentes || data.items || data.itens || [];

            if (reagentes.length === 0) {
                accordionContainer.innerHTML = '<p class="error-message">Nenhum reagente encontrado ou estrutura de dados inválida.</p>';
                return;
            }

            renderizarCards(reagentes);

        } catch (error) {
            console.error('Erro ao carregar reagentes:', error);
            accordionContainer.innerHTML = '<p class="error-message" style="text-align:center; color:var(--primary-red);">Erro ao carregar os dados dos reagentes. Verifique o console para detalhes.</p>';
        }
    };

    // 2. Função para renderizar os cards COMO ACCORDION
    const renderizarCards = (reagentes) => {
        const itemsListContainer = document.getElementById('reagent-accordion') || document.querySelector('.items-list-container');
        itemsListContainer.innerHTML = '';

        // Agrupa os itens pelo campo 'tipo' (MANTIDO)
        const reagentesAgrupados = reagentes.reduce((acc, item) => {
            const tipo = item.tipo || 'Outros';
            if (!acc[tipo]) {
                acc[tipo] = [];
            }
            acc[tipo].push(item);
            return acc;
        }, {});

        // Gera o HTML para cada grupo (Accordion Group)
        for (const tipo in reagentesAgrupados) {
            const itensDoTipo = reagentesAgrupados[tipo];

            const groupHTML = document.createElement('div');
            groupHTML.classList.add('accordion-group');
            groupHTML.dataset.group = tipo.toLowerCase(); 

            const headerHTML = document.createElement('div');
            headerHTML.classList.add('accordion-header');
            // MUDANÇA: O cabeçalho agora só tem o texto e o ícone. O estilo de cor será definido no CSS.
            headerHTML.innerHTML = `
                <span>${tipo} (${itensDoTipo.length} itens)</span>
                <i class="fas fa-chevron-right accordion-icon"></i>
            `;
            groupHTML.appendChild(headerHTML);

            const contentHTML = document.createElement('div');
            contentHTML.classList.add('accordion-content');
            contentHTML.style.display = 'none'; 

            // 4. ADICIONA OS ITENS COM SUB-BLOCO DE DETALHES/CONVERSÃO
            itensDoTipo.forEach(item => {
                const unidadeTexto = item.unidade || 'unidades'; 
                const quantidade = item.quantidade || 0;
                const itemNomeFormatted = item.nome.replace(/[^a-zA-Z0-9]/g, '_'); 
                
                const unidadeComQtd = `${quantidade} ${unidadeTexto}`;
                const textoBuscaCompleto = `${item.nome} ${unidadeComQtd} ${unidadeTexto.toLowerCase() === 'g' ? 'miligramas' : ''}`.toLowerCase();
                
                // Conversão para miligramas
                const miligramas = (unidadeTexto.toLowerCase() === 'g') ? (quantidade * 1000) : quantidade;
                
                // --- INÍCIO DA ESTRUTURA ANINHADA DO ITEM (item-card-inner) ---
                const itemInnerCard = document.createElement('div');
                itemInnerCard.classList.add('item-card-inner');

                // 4a. Linha Principal (MANTIDA)
                let itemRowHTML = `
                    <div class="item-row main-item" 
                        data-search="${textoBuscaCompleto}"
                        data-item-name="${item.nome}"
                        data-item-qty="${quantidade}"
                        data-item-unit="${unidadeTexto}">
                        <div class="item-info">
                            <p class="item-name">${item.nome}</p>
                            <p class="item-total">Total: ${unidadeComQtd}</p>
                        </div>
                        <div class="item-actions">
                            <i class="fas fa-chevron-down item-action toggle-details" 
                                title="Ver Conversão"
                                data-item="${itemNomeFormatted}">
                            </i>
                        </div>
                    </div>
                `;
                
                // 4b. Container Colapsável (Sub-lista/Detalhes)
                const detailsContainer = `
                    <div class="variations-container reagent-details-container" 
                         id="details-${itemNomeFormatted}" 
                         style="display: none;">
                        <div class="variation-row">
                            <div class="variation-info" style="flex-direction: column; align-items: flex-start;">
                                <span class="variation-desc">
                                    ${miligramas.toFixed(2)} mg
                                </span>
                            </div>
                            <span class="variation-qty">${unidadeComQtd}</span>
                            <div class="variation-actions">
                                <button class="btn-edit edit-qty" 
                                        data-item-name="${item.nome}"
                                        data-item-qty="${quantidade}"
                                        data-item-unit="${unidadeTexto}">
                                    <i class="fas fa-pencil-alt"></i> Editar
                                </button>
                            </div>
                        </div>
                    </div>
                `;

                itemInnerCard.innerHTML = itemRowHTML + detailsContainer;
                contentHTML.appendChild(itemInnerCard);
            });

            groupHTML.appendChild(contentHTML);
            itemsListContainer.appendChild(groupHTML);
        }

        // ... (Mantenha o restante das funções de interatividade) ...
        setupAccordion();
        
        // Evento de EXPANDIR/COLAPSAR
        document.querySelectorAll('.toggle-details').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const itemNomeFormatted = e.target.dataset.item; 
                const containerId = `details-${itemNomeFormatted}`;
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
        
        // Evento de clique para edição
        itemsListContainer.querySelectorAll('.btn-edit.edit-qty').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemName = e.currentTarget.dataset.itemName;
                const itemQty = e.currentTarget.dataset.itemQty;
                const itemUnit = e.currentTarget.dataset.itemUnit;
                
                editarQuantidade(itemName, itemUnit, parseFloat(itemQty));
            });
        });
    };

    // 3. Lógica de filtro de busca na página (AJUSTADA)
    if (searchArea && accordionContainer) {
        searchArea.addEventListener('input', () => {
            const termoBuscado = searchArea.value.toLowerCase().trim();
            const todosOsGrupos = accordionContainer.querySelectorAll('.accordion-group');

            todosOsGrupos.forEach(group => {
                let grupoVisivel = false;
                const content = group.querySelector('.accordion-content');
                const header = group.querySelector('.accordion-header');
                
                const innerCards = group.querySelectorAll('.item-card-inner');

                // Lógica de retorno ao estado FECHADO quando a busca está vazia
                if (termoBuscado === '') {
                    innerCards.forEach(innerCard => {
                        innerCard.style.display = 'block';
                        innerCard.querySelector('.toggle-details').classList.remove('fa-chevron-up');
                        innerCard.querySelector('.toggle-details').classList.add('fa-chevron-down');
                        innerCard.querySelector('.reagent-details-container').style.display = 'none';
                    });
                    group.style.display = 'block'; 
                    content.style.display = 'none'; 
                    header.classList.remove('active'); 
                    return;
                }

                // Lógica de busca: 
                innerCards.forEach(innerCard => {
                    let innerCardVisivel = false;
                    const mainItemRow = innerCard.querySelector('.main-item');
                    const detailsContainer = innerCard.querySelector('.reagent-details-container');
                    const toggleIcon = innerCard.querySelector('.toggle-details');
                    
                    const itemText = mainItemRow.dataset.search; 

                    if (itemText && itemText.includes(termoBuscado)) {
                        innerCardVisivel = true;
                        
                        // Expande o bloco se o termo de busca for encontrado
                        detailsContainer.style.display = 'block'; 
                        toggleIcon.classList.remove('fa-chevron-down');
                        toggleIcon.classList.add('fa-chevron-up');
                    } else {
                        detailsContainer.style.display = 'none';
                        toggleIcon.classList.remove('fa-chevron-up');
                        toggleIcon.classList.add('fa-chevron-down');
                    }
                    
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
                    content.style.display = 'block'; 
                    header.classList.add('active'); 
                } else {
                    group.style.display = 'none';
                }
            });
        });
    }

    // Inicia o carregamento dos dados
    fetchReagentes();
});