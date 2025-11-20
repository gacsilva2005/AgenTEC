const BACKEND_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    const searchArea = document.getElementById('search-area');
    const accordionContainer = document.getElementById('reagent-accordion');

    // Funções de Accordion
    const setupAccordion = () => {
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const isActive = header.classList.contains('active');

                // Alterna a classe 'active'
                header.classList.toggle('active');

                // Lógica de expandir/colapsar
                if (isActive) {
                    content.style.display = 'none'; // Colapsa
                } else {
                    content.style.display = 'block'; // Expande
                }
            });
        });
    };
    
    // 1. Função para buscar os dados (AGORA PUXANDO DO ARQUIVO JSON)
    const fetchReagentes = async () => {
        // Exibe mensagem de carregamento enquanto espera a requisição
        accordionContainer.innerHTML = '<p style="text-align:center; font-size:1.6rem; color:#666;">Carregando reagentes...</p>';
        
        try {
            // Usa o caminho relativo do seu arquivo original
            const response = await fetch('../../../AgenTEC-DataBase-(JSON)/reagentes.json');

            if (!response.ok) {
                // Se o JSON local falhar, tentamos buscar diretamente da raiz (para compatibilidade)
                const fallbackResponse = await fetch('reagentes.json');
                if (!fallbackResponse.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                const data = await fallbackResponse.json();
                renderizarCards(data);
                return;
            }

            const data = await response.json();
            
            // Verifica a estrutura e renderiza
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

        // Agrupa os itens pelo campo 'tipo'
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

            // 1. Cria o contêiner do grupo (o novo card)
            const groupHTML = document.createElement('div');
            groupHTML.classList.add('accordion-group');
            groupHTML.dataset.group = tipo.toLowerCase(); 

            // 2. Cria o cabeçalho clicável
            const headerHTML = document.createElement('div');
            headerHTML.classList.add('accordion-header');
            headerHTML.innerHTML = `
                <span>${tipo}</span>
                <i class="fas fa-chevron-right accordion-icon"></i>
            `;
            groupHTML.appendChild(headerHTML);

            // 3. Cria o corpo colapsável
            const contentHTML = document.createElement('div');
            contentHTML.classList.add('accordion-content');
            // MODIFICAÇÃO CHAVE: Força o estilo inline para garantir que comece fechado
            contentHTML.style.display = 'none'; 

            // 4. Adiciona os itens (suas linhas originais) dentro do corpo
            itensDoTipo.forEach(item => {
                const observacao = item.observacoes || 'Sem observação';
                const unidadeTexto = item.unidade ? `${item.quantidade} ${item.unidade}` : `${item.quantidade} unidades`;
                const nomeCompleto = `${item.nome} (${unidadeTexto})`;

                const itemRowHTML = document.createElement('div');
                itemRowHTML.classList.add('item-row');
                itemRowHTML.dataset.search = nomeCompleto.toLowerCase();
                itemRowHTML.innerHTML = `
                    <p class="item-name">${nomeCompleto}</p>
                    <div class="item-details">
                        <p class="item-qty">${unidadeTexto}</p>
                        <i class="fas fa-comment-dots item-action view-obs" title="Ver Observação" data-obs="${observacao}"></i>
                        <i class="fas fa-pencil-alt item-action edit-qty" title="Editar Quantidade"></i>
                    </div>
                `;
                contentHTML.appendChild(itemRowHTML);
            });
            
            groupHTML.appendChild(contentHTML);
            itemsListContainer.appendChild(groupHTML);
        }

        // 5. Adiciona interatividade
        setupAccordion();

        // Adiciona evento de clique para a observação (MANTIDO)
        document.querySelectorAll('.view-obs').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const obs = e.currentTarget.dataset.obs;
                alert('Observação: ' + obs);
            });
        });
        
        // Adiciona evento de clique para edição de quantidade (MANTIDO)
        document.querySelectorAll('.edit-qty').forEach(icon => {
            icon.addEventListener('click', (e) => {
                alert('Funcionalidade de Edição de Quantidade (A implementar).');
            });
        });
    };

    // 3. Lógica de filtro de busca na página (MANTIDA E CORRIGIDA para estado inicial)
    if (searchArea && accordionContainer) {
        searchArea.addEventListener('input', () => {
            const termoBuscado = searchArea.value.toLowerCase().trim();
            const todosOsGrupos = accordionContainer.querySelectorAll('.accordion-group');

            todosOsGrupos.forEach(group => {
                let grupoVisivel = false;
                const content = group.querySelector('.accordion-content');
                const header = group.querySelector('.accordion-header');
                const linhas = group.querySelectorAll('.item-row'); 

                // Lógica de retorno ao estado FECHADO quando a busca está vazia
                if (termoBuscado === '') {
                    linhas.forEach(linha => {
                        linha.style.display = 'flex'; 
                    });
                    group.style.display = 'block'; 
                    content.style.display = 'none'; // Volta a ficar colapsado
                    header.classList.remove('active'); // Remove a seta girada
                    return;
                }

                // Lógica de busca: Verifica se alguma linha corresponde
                linhas.forEach(linha => {
                    const textoLinha = linha.dataset.search;
                    if (textoLinha && textoLinha.includes(termoBuscado)) {
                        linha.style.display = 'flex'; 
                        grupoVisivel = true;
                    } else {
                        linha.style.display = 'none'; 
                    }
                });

                // Se houver resultados, exibe o grupo E EXPANDEM
                if (grupoVisivel) {
                    group.style.display = 'block';
                    content.style.display = 'block'; // Abre automaticamente para mostrar os resultados
                    header.classList.add('active'); 
                } else {
                    group.style.display = 'none'; // Oculta o grupo sem resultados
                }
            });
        });
    }

    // Inicia o carregamento dos dados
    fetchReagentes();
});