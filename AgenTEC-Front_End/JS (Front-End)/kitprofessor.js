// kitprofessor.js
document.addEventListener('DOMContentLoaded', function () {
    console.log('🔧 Iniciando kitprofessor.js...');

    // Variáveis globais
    let reagentesKit = [];
    let vidrariasKits = [];

    // Criar o modal dinamicamente
    criarModalKit();

    // Carregar dados quando a página carregar
    carregarDadosKit();

    // Função para criar o modal do kit
    function criarModalKit() {
        // Remove modal existente se houver
        const modalExistente = document.getElementById('modalKit');
        if (modalExistente) {
            modalExistente.remove();
        }

        const modalHTML = `
            <div id="modalKit" class="modal-kit" style="display: none;">
                <div class="modal-kit-content">
                    <div class="modal-kit-header">
                        <h2>🧪 Resumo do Kit</h2>
                        <span class="close-modal-kit">&times;</span>
                    </div>
                    <div class="modal-kit-body">
                        <div class="kit-stats">
                            <div class="stat-item">
                                <span class="stat-number" id="totalReagentesModal">0</span>
                                <span class="stat-label">Reagentes</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number" id="totalVidrariasModal">0</span>
                                <span class="stat-label">Vidrarias</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number" id="totalItensModal">0</span>
                                <span class="stat-label">Total de Itens</span>
                            </div>
                        </div>
                        
                        <div class="kit-details">
                            <div class="details-section">
                                <h3>🧪 Reagentes no Kit</h3>
                                <div id="reagentesModalList" class="items-list">
                                    <p class="empty-message">Nenhum reagente selecionado</p>
                                </div>
                            </div>
                            
                            <div class="details-section">
                                <h3>🔬 Vidrarias no Kit</h3>
                                <div id="vidrariasModalList" class="items-list">
                                    <p class="empty-message">Nenhuma vidraria selecionada</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-kit-footer">
                        <button class="btn-kit btn-secondary" id="btnFecharModalKit">Fechar</button>
                        <button class="btn-kit btn-primary" id="btnConfirmarKit">Confirmar Montagem do Kit</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Adicionar estilos do modal
        const styles = `
            <style>
                .modal-kit {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease;
                }

                .modal-kit-content {
                    background: white;
                    border-radius: 15px;
                    width: 90%;
                    max-width: 800px;
                    max-height: 90vh;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    animation: slideUp 0.3s ease;
                }

                .modal-kit-header {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    padding: 20px 25px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .modal-kit-header h2 {
                    margin: 0;
                    font-size: 1.5rem;
                }

                .close-modal-kit {
                    font-size: 28px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: color 0.3s;
                }

                .close-modal-kit:hover {
                    color: #ffeb3b;
                }

                .modal-kit-body {
                    padding: 25px;
                    max-height: 60vh;
                    overflow-y: auto;
                }

                .kit-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                    margin-bottom: 25px;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 10px;
                }

                .stat-item {
                    text-align: center;
                    padding: 15px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }

                .stat-number {
                    display: block;
                    font-size: 2rem;
                    font-weight: bold;
                    color: #667eea;
                    margin-bottom: 5px;
                }

                .stat-label {
                    font-size: 0.9rem;
                    color: #6c757d;
                    font-weight: 500;
                }

                .kit-details {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 25px;
                }

                .details-section h3 {
                    margin: 0 0 15px 0;
                    color: #2c3e50;
                    font-size: 1.2rem;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #e9ecef;
                }

                .items-list {
                    min-height: 100px;
                    max-height: 200px;
                    overflow-y: auto;
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                    padding: 15px;
                }

                .item-modal {
                    padding: 10px;
                    margin-bottom: 8px;
                    background: #f8f9fa;
                    border-radius: 5px;
                    border-left: 4px solid #667eea;
                }

                .item-modal:last-child {
                    margin-bottom: 0;
                }

                .item-name-modal {
                    font-weight: 600;
                    color: #2c3e50;
                    display: block;
                }

                .item-details-modal {
                    font-size: 0.85rem;
                    color: #6c757d;
                }

                .modal-kit-footer {
                    padding: 20px 25px;
                    background: #f8f9fa;
                    display: flex;
                    justify-content: flex-end;
                    gap: 15px;
                    border-top: 1px solid #e9ecef;
                }

                .btn-kit {
                    padding: 12px 25px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }

                .btn-primary {
                    background: #667eea;
                    color: white;
                }

                .btn-primary:hover {
                    background: #5a6fd8;
                    transform: translateY(-2px);
                }

                .btn-secondary {
                    background: #6c757d;
                    color: white;
                }

                .btn-secondary:hover {
                    background: #5a6268;
                }

                .empty-message {
                    text-align: center;
                    color: #6c757d;
                    font-style: italic;
                    margin: 20px 0;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(50px) scale(0.9);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                /* Responsividade */
                @media (max-width: 768px) {
                    .modal-kit-content {
                        width: 95%;
                        margin: 20px;
                    }

                    .kit-details {
                        grid-template-columns: 1fr;
                    }

                    .kit-stats {
                        grid-template-columns: 1fr;
                    }

                    .modal-kit-footer {
                        flex-direction: column;
                    }

                    .btn-kit {
                        width: 100%;
                    }
                }
            </style>
        `;

        // Adicionar estilos apenas se não existirem
        if (!document.getElementById('modal-kit-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'modal-kit-styles';
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);
        }

        // Adicionar event listeners para o modal
        const modal = document.getElementById('modalKit');
        const closeBtn = document.querySelector('.close-modal-kit');
        const btnFechar = document.getElementById('btnFecharModalKit');
        const btnConfirmar = document.getElementById('btnConfirmarKit');

        // Fechar modal
        const fecharModal = () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        };

        if (closeBtn) closeBtn.addEventListener('click', fecharModal);
        if (btnFechar) btnFechar.addEventListener('click', fecharModal);

        // Fechar modal clicando fora
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    fecharModal();
                }
            });
        }

        // Confirmar kit
        if (btnConfirmar) {
            btnConfirmar.addEventListener('click', () => {
                mostrarMensagem('Kit montado com sucesso!', 'success');
                fecharModal();
            });
        }

        // Adicionar animação de saída
        const styleAnimations = `
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;

        if (!document.getElementById('modal-kit-animations')) {
            const animationStyle = document.createElement('style');
            animationStyle.id = 'modal-kit-animations';
            animationStyle.textContent = styleAnimations;
            document.head.appendChild(animationStyle);
        }
    }

    // Função para abrir o modal do kit
    function abrirModalKit() {
        console.log('📦 Abrindo modal do kit...');

        const modal = document.getElementById('modalKit');
        if (!modal) {
            console.error('Modal não encontrado');
            return;
        }

        // Atualizar estatísticas
        document.getElementById('totalReagentesModal').textContent = reagentesKit.length;
        document.getElementById('totalVidrariasModal').textContent = vidrariasKits.length;
        document.getElementById('totalItensModal').textContent = reagentesKit.length + vidrariasKits.length;

        // Atualizar lista de reagentes
        const reagentesList = document.getElementById('reagentesModalList');
        if (reagentesKit.length === 0) {
            reagentesList.innerHTML = '<p class="empty-message">Nenhum reagente selecionado</p>';
        } else {
            reagentesList.innerHTML = reagentesKit.map(reagente => `
                <div class="item-modal">
                    <span class="item-name-modal">${reagente.nome}</span>
                    <span class="item-details-modal">
                        ${reagente.quantidade_escolhida}${reagente.unidade} • ${reagente.tipo}
                    </span>
                </div>
            `).join('');
        }

        // Atualizar lista de vidrarias
        const vidrariasList = document.getElementById('vidrariasModalList');
        if (vidrariasKits.length === 0) {
            vidrariasList.innerHTML = '<p class="empty-message">Nenhuma vidraria selecionada</p>';
        } else {
            vidrariasList.innerHTML = vidrariasKits.map(vidraria => `
                <div class="item-modal">
                    <span class="item-name-modal">${vidraria.nome}</span>
                    <span class="item-details-modal">
                        ${vidraria.capacidade || '1'}${vidraria.unidade || 'un'}
                    </span>
                </div>
            `).join('');
        }

        // Mostrar modal
        modal.style.display = 'flex';
    }

    // Função principal para carregar todos os dados
    async function carregarDadosKit() {
        console.log('🔄 Carregando dados do kit...');
        await carregarReagentesKit();
        await carregarVidrariasKits();
    }

    // Função para carregar reagentes do array de kits
    async function carregarReagentesKit() {
        console.log('🧪 Carregando reagentes do kit...');

        try {
            const response = await fetch('http://localhost:3000/api/reagentes-kits');

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                reagentesKit = data.reagentes || [];
                console.log(`✅ ${reagentesKit.length} reagentes carregados do kit`);
                exibirReagentes();
            } else {
                throw new Error(data.message || 'Erro ao carregar reagentes do kit');
            }

        } catch (error) {
            console.error('❌ Erro ao carregar reagentes do kit:', error);
            mostrarMensagem('Erro ao carregar reagentes do kit', 'error');
        }
    }

    // Função para carregar vidrarias do array de KITS
    async function carregarVidrariasKits() {
        console.log('🔬 Carregando vidrarias do KIT...');

        try {
            const response = await fetch('http://localhost:3000/api/vidrarias-kits');

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                vidrariasKits = data.vidrarias || [];
                console.log(`✅ ${vidrariasKits.length} vidrarias carregadas do KIT`);
                exibirVidrarias();
            } else {
                throw new Error(data.message || 'Erro ao carregar vidrarias do kit');
            }

        } catch (error) {
            console.error('❌ Erro ao carregar vidrarias do kit:', error);
            mostrarMensagem('Erro ao carregar vidrarias do kit', 'error');
        }
    }

    // Função para exibir reagentes na lista
    function exibirReagentes() {
        const container = document.getElementById('reagentes-lista');

        if (!container) {
            console.error('❌ Container de reagentes não encontrado');
            return;
        }

        if (reagentesKit.length === 0) {
            container.innerHTML = `
                <div class="item-row empty-message">
                    <p>Nenhum reagente selecionado para o kit</p>
                </div>
            `;
            return;
        }

        container.innerHTML = reagentesKit.map(reagente => `
            <div class="item-row" data-id="${reagente.id}">
                <div class="item-info">
                    <span class="item-name">${reagente.nome}</span>
                    <span class="item-details">
                        ${reagente.tipo} • 
                        ${reagente.quantidade_escolhida}${reagente.unidade} 
                        (Disponível: ${reagente.quantidade_disponivel}${reagente.unidade})
                    </span>
                </div>
                <div class="item-actions">
                    <button class="btn-remove" onclick="removerReagenteKit('${reagente.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Função para exibir vidrarias na lista
    function exibirVidrarias() {
        const container = document.getElementById('vidrarias-lista');

        if (!container) {
            console.error('❌ Container de vidrarias não encontrado');
            return;
        }

        if (vidrariasKits.length === 0) {
            container.innerHTML = `
                <div class="item-row empty-message">
                    <p>Nenhuma vidraria selecionada para o kit</p>
                </div>
            `;
            return;
        }

        container.innerHTML = vidrariasKits.map(vidraria => `
            <div class="item-row" data-id="${vidraria.id}">
                <div class="item-info">
                    <span class="item-name">${vidraria.nome}</span>
                    <span class="item-details">
                        ${vidraria.tipo || 'Vidraria'} • 
                        ${vidraria.capacidade || '1'}${vidraria.unidade || 'un'}
                    </span>
                </div>
                <div class="item-actions">
                    <button class="btn-remove" onclick="removerVidrariaKit('${vidraria.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Função para remover reagente do kit
    window.removerReagenteKit = async function (id) {
        console.log(`🗑️ Removendo reagente do kit: ${id}`);

        if (!confirm('Tem certeza que deseja remover este reagente do kit?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/reagentes-kits/remover/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                console.log('✅ Reagente removido do kit com sucesso');
                mostrarMensagem('Reagente removido do kit!', 'success');
                await carregarReagentesKit();
            } else {
                throw new Error(data.message || 'Erro ao remover reagente');
            }

        } catch (error) {
            console.error('❌ Erro ao remover reagente do kit:', error);
            mostrarMensagem('Erro ao remover reagente do kit', 'error');
        }
    };

    // Função para remover vidraria do KIT
    window.removerVidrariaKit = async function (id) {
        console.log(`🗑️ Removendo vidraria do KIT: ${id}`);

        if (!confirm('Tem certeza que deseja remover esta vidraria do kit?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/vidrarias-kits/remover/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                console.log('✅ Vidraria removida do KIT com sucesso');
                mostrarMensagem('Vidraria removida do kit!', 'success');
                await carregarVidrariasKits();
            } else {
                throw new Error(data.message || 'Erro ao remover vidraria');
            }

        } catch (error) {
            console.error('❌ Erro ao remover vidraria do kit:', error);
            mostrarMensagem('Erro ao remover vidraria do kit', 'error');
        }
    };

    // Função para limpar todo o kit
    window.limparKitCompleto = async function () {
        if (!confirm('Tem certeza que deseja limpar TODO o kit? Esta ação não pode ser desfeita.')) {
            return;
        }

        try {
            console.log('🧹 Limpando kit completo...');

            const responseReagentes = await fetch('http://localhost:3000/api/reagentes-kits/limpar', {
                method: 'DELETE'
            });

            const responseVidrarias = await fetch('http://localhost:3000/api/vidrarias-kits/limpar', {
                method: 'DELETE'
            });

            if (!responseReagentes.ok || !responseVidrarias.ok) {
                throw new Error('Erro ao limpar algum dos arrays');
            }

            console.log('✅ Kit limpo com sucesso');
            mostrarMensagem('Kit limpo com sucesso!', 'success');
            await carregarDadosKit();

        } catch (error) {
            console.error('❌ Erro ao limpar kit:', error);
            mostrarMensagem('Erro ao limpar kit', 'error');
        }
    };

    // Função para mostrar mensagens de notificação
    function mostrarMensagem(mensagem, tipo = 'info') {
        const notificacoesAntigas = document.querySelectorAll('.custom-notification');
        notificacoesAntigas.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `custom-notification ${tipo}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${tipo === 'success' ? '#4CAF50' : tipo === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            animation: slideInRight 0.3s ease-out;
            font-family: 'Roboto', sans-serif;
        `;

        notification.textContent = mensagem;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                if (notification.parentNode) notification.remove();
            }, 300);
        }, 3000);
    }

    // Adicionar estilos de animação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .item-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid #eee;
            background: white;
            transition: background-color 0.2s;
        }
        
        .item-row:hover {
            background-color: #f8f9fa;
        }
        
        .item-info {
            flex: 1;
        }
        
        .item-name {
            font-weight: 600;
            color: #2c3e50;
            display: block;
            margin-bottom: 5px;
        }
        
        .item-details {
            color: #7f8c8d;
            font-size: 1.1rem;
        }
        
        .item-actions {
            margin-left: 15px;
        }
        
        .btn-remove {
            background: #e74c3c;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: background-color 0.2s;
        }
        
        .btn-remove:hover {
            background: #c0392b;
        }
        
        .empty-message {
            text-align: center;
            padding: 40px;
            color: #7f8c8d;
            font-style: italic;
        }
    `;
    document.head.appendChild(style);

    // Adicionar botão de limpar kit se não existir
    function adicionarBotoesAdicionais() {
        const actionButtons = document.querySelector('.action-buttons');
        if (actionButtons && !document.getElementById('btnLimparKit')) {
            const btnLimparKit = document.createElement('button');
            btnLimparKit.id = 'btnLimparKit';
            btnLimparKit.className = 'btn-global btn-danger';
            btnLimparKit.innerHTML = '<i class="fas fa-trash"></i> Limpar Kit Completo';
            btnLimparKit.onclick = limparKitCompleto;

            actionButtons.insertBefore(btnLimparKit, actionButtons.firstChild);
        }
    }

    // Configurar o botão "Montar Kits com Materiais Escolhidos"
    function configurarBotaoMontarKit() {
        // Tente encontrar o botão por ID, classe ou texto
        const btnMontarKit = document.getElementById('btnAbrirModal') ||
            document.querySelector('.btn-global') ||
            Array.from(document.querySelectorAll('button')).find(btn =>
                btn.textContent.includes('Montar Kits com Materiais Escolhidos'));

        if (btnMontarKit) {
            console.log('✅ Botão "Montar Kit" encontrado:', btnMontarKit);

            btnMontarKit.addEventListener('click', function (e) {
                e.preventDefault();
                console.log('🎯 Botão Montar Kit clicado!');
                abrirModalKit();
            });

        } else {
            console.warn('⚠️ Botão "Montar Kit" não encontrado. Tentando novamente em 1 segundo.');
            setTimeout(configurarBotaoMontarKit, 1000);
        }
    }

    // Chamar após um breve delay para garantir que o DOM esteja pronto
    setTimeout(() => {
        adicionarBotoesAdicionais();
        configurarBotaoMontarKit();
    }, 100);

    // Adicionar evento ao botão "Agendar Agora"
    document.addEventListener('click', function (e) {
        // Botão "Agendar Agora"
        const btnAgendar = document.querySelector('.action-buttons .btn-global:last-child');
        if (btnAgendar && (e.target === btnAgendar || e.target.closest('.btn-global:last-child'))) {
            e.preventDefault();
            agendarComKit();
        }
    });

    // Função para agendar com o kit
    async function agendarComKit() {
        const totalReagentes = reagentesKit.length;
        const totalVidrarias = vidrariasKits.length;

        if (totalReagentes === 0 && totalVidrarias === 0) {
            alert('❌ Adicione materiais ao kit antes de agendar!');
            return;
        }

        console.log('📅 Iniciando agendamento com kit...');
        mostrarMensagem('Redirecionando para agendamento...', 'info');

        setTimeout(() => {
            window.location.href = 'agendamento.html?comKit=true';
        }, 1000);
    }

    // Teste de conexão inicial
    async function testarConexao() {
        try {
            console.log('🔍 Testando conexão com o servidor...');
            const response = await fetch('http://localhost:3000/api/reagentes-kits');
            if (response.ok) {
                console.log('✅ Conexão com servidor estabelecida');
            } else {
                console.warn('⚠️ Servidor respondendo com erro:', response.status);
            }
        } catch (error) {
            console.error('❌ Não foi possível conectar ao servidor:', error);
            mostrarMensagem('Erro de conexão com o servidor', 'error');
        }
    }

    // Executar teste de conexão
    testarConexao();

    console.log('🎯 kitprofessor.js carregado com sucesso!');
});