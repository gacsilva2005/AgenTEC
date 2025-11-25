// kitprofessor.js
document.addEventListener('DOMContentLoaded', function () {
    console.log('🔧 Iniciando kitprofessor.js...');

    // Variáveis globais
    let reagentesKit = [];
    let vidrariasKits = []; // Mudei o nome para ficar claro que é do array de kits

    // Carregar dados quando a página carregar
    carregarDadosKit();

    // Função principal para carregar todos os dados
    async function carregarDadosKit() {
        console.log('🔄 Carregando dados do kit...');
        await carregarReagentesKit();
        await carregarVidrariasKits(); // Mudei para carregarVidrariasKits
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

    // Função para carregar vidrarias do array de KITS (CORRIGIDA)
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

    // Função para exibir vidrarias na lista (CORRIGIDA)
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
                await carregarReagentesKit(); // Recarrega a lista
            } else {
                throw new Error(data.message || 'Erro ao remover reagente');
            }

        } catch (error) {
            console.error('❌ Erro ao remover reagente do kit:', error);
            mostrarMensagem('Erro ao remover reagente do kit', 'error');
        }
    };

    // Função para remover vidraria do KIT (CORRIGIDA)
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
                await carregarVidrariasKits(); // Recarrega a lista
            } else {
                throw new Error(data.message || 'Erro ao remover vidraria');
            }

        } catch (error) {
            console.error('❌ Erro ao remover vidraria do kit:', error);
            mostrarMensagem('Erro ao remover vidraria do kit', 'error');
        }
    };

    // Função para limpar todo o kit (CORRIGIDA)
    window.limparKitCompleto = async function () {
        if (!confirm('Tem certeza que deseja limpar TODO o kit? Esta ação não pode ser desfeita.')) {
            return;
        }

        try {
            console.log('🧹 Limpando kit completo...');

            // Limpar reagentes do kit
            const responseReagentes = await fetch('http://localhost:3000/api/reagentes-kits/limpar', {
                method: 'DELETE'
            });

            // Limpar vidrarias do KIT
            const responseVidrarias = await fetch('http://localhost:3000/api/vidrarias-kits/limpar', {
                method: 'DELETE'
            });

            if (!responseReagentes.ok || !responseVidrarias.ok) {
                throw new Error('Erro ao limpar algum dos arrays');
            }

            console.log('✅ Kit limpo com sucesso');
            mostrarMensagem('Kit limpo com sucesso!', 'success');

            // Recarregar dados
            await carregarDadosKit();

        } catch (error) {
            console.error('❌ Erro ao limpar kit:', error);
            mostrarMensagem('Erro ao limpar kit', 'error');
        }
    };

    // Função para mostrar mensagens de notificação
    function mostrarMensagem(mensagem, tipo = 'info') {
        // Remove notificações anteriores
        const notificacoesAntigas = document.querySelectorAll('.custom-notification');
        notificacoesAntigas.forEach(notif => notif.remove());

        // Cria nova notificação
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

        // Remove após 3 segundos
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

    // Chamar após um breve delay para garantir que o DOM esteja pronto
    setTimeout(adicionarBotoesAdicionais, 100);

    // Adicionar evento aos botões existentes
    document.addEventListener('click', function (e) {
        // Botão "Montar Kits com Materiais Escolhidos"
        if (e.target.id === 'btnAbrirModal' || e.target.closest('#btnAbrirModal')) {
            e.preventDefault();
            mostrarResumoKit();
        }

        // Botão "Agendar Agora"
        const btnAgendar = document.querySelector('.action-buttons .btn-global:last-child');
        if (btnAgendar && (e.target === btnAgendar || e.target.closest('.btn-global:last-child'))) {
            e.preventDefault();
            agendarComKit();
        }
    });

    // Função para mostrar resumo do kit (ATUALIZADA)
    function mostrarResumoKit() {
        const totalReagentes = reagentesKit.length;
        const totalVidrarias = vidrariasKits.length; // Usando vidrariasKits

        if (totalReagentes === 0 && totalVidrarias === 0) {
            alert('❌ Nenhum material selecionado para montar o kit!');
            return;
        }

        let mensagem = `📋 Resumo do Kit:\n\n`;
        mensagem += `🧪 Reagentes: ${totalReagentes} item(s)\n`;
        mensagem += `🔬 Vidrarias: ${totalVidrarias} item(s)\n\n`;
        mensagem += `Deseja prosseguir com a montagem deste kit?`;

        if (confirm(mensagem)) {
            mostrarMensagem('Kit montado com sucesso!', 'success');
            // Aqui você pode adicionar a lógica para salvar o kit
        }
    }

    // Função para agendar com o kit (ATUALIZADA)
    async function agendarComKit() {
        const totalReagentes = reagentesKit.length;
        const totalVidrarias = vidrariasKits.length; // Usando vidrariasKits

        if (totalReagentes === 0 && totalVidrarias === 0) {
            alert('❌ Adicione materiais ao kit antes de agendar!');
            return;
        }

        console.log('📅 Iniciando agendamento com kit...');
        mostrarMensagem('Redirecionando para agendamento...', 'info');

        // Aqui você pode redirecionar para a página de agendamento
        // ou abrir um modal de agendamento
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