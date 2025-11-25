document.addEventListener('DOMContentLoaded', function () {
    console.log('=== MS.JS CARREGADO ===');

    // Elementos do modal
    const modal = document.getElementById('modalConfirmacao');
    const closeBtn = document.querySelector('.close');
    const btnCancelar = document.getElementById('btnCancelarAgendamento');
    const btnConfirmar = document.getElementById('btnConfirmarAgendamento');
    const btnAbrirModal = document.getElementById('btnAbrirModal');

    let ultimaQuantidadeReagentes = 0;
    let ultimaQuantidadeVidrarias = 0;

    console.log('Elementos encontrados:', {
        modal: !!modal,
        closeBtn: !!closeBtn,
        btnCancelar: !!btnCancelar,
        btnConfirmar: !!btnConfirmar,
        btnAbrirModal: !!btnAbrirModal
    });

    // Função para mostrar popup com informações importantes do agendamento
    function showCustomPopup(message, isSuccess = false) {
        console.log(`Popup: ${message}`);

        // Remove popup existente
        const existingPopup = document.getElementById('customPopup');
        if (existingPopup) existingPopup.remove();

        // Cria popup simplificado
        const popupElement = document.createElement('div');
        popupElement.id = 'customPopup';
        popupElement.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        padding: 20px;
        box-sizing: border-box;
    `;

        const popupContent = `
        <div style="
            background: white;
            border-radius: 8px;
            max-width: 400px;
            width: 100%;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        ">
            <div style="
                background: ${isSuccess ? '#4CAF50' : '#970000'};
                color: white;
                padding: 15px 20px;
            ">
                <h3 style="margin: 0; font-size: 18px; color: white;">${isSuccess ? 'Sucesso' : 'Atenção'}</h3>
            </div>
            <div style="padding: 20px;">
                <p style="margin: 0; line-height: 1.5;">${message}</p>
            </div>
            <div style="
                padding: 15px 20px;
                text-align: right;
                border-top: 1px solid #eee;
            ">
                <button id="popupOkBtn" style="
                    background: #243E63;
                    color: white;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                ">OK</button>
            </div>
        </div>
    `;

        popupElement.innerHTML = popupContent;
        document.body.appendChild(popupElement);

        // Evento para fechar
        document.getElementById('popupOkBtn').onclick = function () {
            document.body.removeChild(popupElement);
        };

        // Fechar clicando fora
        popupElement.onclick = function (e) {
            if (e.target === popupElement) {
                document.body.removeChild(popupElement);
            }
        };
    }

    // Função para mostrar notificações (mantida para outros casos)
    function showMessage(message, isSuccess = false) {
        console.log(`Notificação: ${message}`);

        const existingMessage = document.getElementById('notificationMessage');
        if (existingMessage) existingMessage.remove();

        const messageElement = document.createElement('div');
        messageElement.id = 'notificationMessage';
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            background-color: ${isSuccess ? '#4CAF50' : '#f44336'};
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;

        document.body.appendChild(messageElement);

        setTimeout(() => messageElement.style.opacity = '1', 10);
        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                if (messageElement.parentNode) messageElement.remove();
            }, 300);
        }, isSuccess ? 3000 : 5000);
    }

    // Função para mostrar notificação (nova função para reagentes)
    function showNotification(message, isSuccess = true) {
        console.log(`Notificação: ${message}`);

        const existingMessage = document.getElementById('customNotification');
        if (existingMessage) existingMessage.remove();

        const messageElement = document.createElement('div');
        messageElement.id = 'customNotification';
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            background-color: ${isSuccess ? '#4CAF50' : '#f44336'};
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;

        document.body.appendChild(messageElement);

        setTimeout(() => messageElement.style.opacity = '1', 10);
        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                if (messageElement.parentNode) messageElement.remove();
            }, 300);
        }, 3000);
    }

    // Função para formatar data
    function formatarData(dataStr) {
        if (!dataStr) return 'Data não informada';
        const [ano, mes, dia] = dataStr.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    // Função para calcular horário fim
    function calcularHorarioFim(horarioInicio) {
        if (!horarioInicio) return 'Horário não informado';
        const [horas, minutos] = horarioInicio.split(':').map(Number);
        let novaHora = horas + 1;
        return `${novaHora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
    }

    async function carregarReagentesSelecionados() {
        try {
            console.log('🔍 Buscando reagentes selecionados do servidor...');

            const response = await fetch('http://localhost:3000/api/reagentes-selecionados');

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const result = await response.json();
            console.log('📥 Resposta do servidor:', result);

            if (result.success) {
                console.log(`✅ ${result.reagentes.length} reagentes encontrados`);
                exibirReagentes(result.reagentes);
                return result.reagentes;
            } else {
                console.warn('⚠️ Nenhum reagente encontrado no servidor');
                exibirReagentes([]);
                return [];
            }

        } catch (error) {
            console.error('❌ Erro ao carregar reagentes:', error);
            exibirReagentes([]);
            return [];
        }
    }

    function exibirReagentes(reagentes) {
        const listaReagentes = document.getElementById('reagentes-lista');

        if (!listaReagentes) {
            console.error('❌ Elemento #reagentes-lista não encontrado');
            return;
        }

        // Limpa a lista
        listaReagentes.innerHTML = '';

        if (!reagentes || reagentes.length === 0) {
            listaReagentes.innerHTML = `
                <div class="item-row empty-message">
                    <p>Nenhum reagente selecionado</p>
                </div>
            `;
            return;
        }

        // Adiciona cada reagente à lista
        reagentes.forEach((reagente, index) => {
            const itemRow = document.createElement('div');
            itemRow.className = 'item-row';
            itemRow.innerHTML = `
                <div class="item-info">
                    <p class="item-name">${reagente.nome}</p>
                    <p class="item-details">${reagente.tipo} • ${reagente.quantidade_escolhida} ${reagente.unidade}</p>
                </div>
                <div class="item-actions">
                    <button class="btn-remover" data-id="${reagente.id}" title="Remover reagente">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            listaReagentes.appendChild(itemRow);
        });

        // Adiciona event listeners aos botões de remover
        adicionarEventListenersRemover();
    }

    // Função para carregar vidrarias selecionadas
    async function carregarVidrariasSelecionadas() {
        try {
            console.log('🔍 Buscando vidrarias selecionadas do servidor...');

            const response = await fetch('http://localhost:3000/api/vidrarias-selecionadas');

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const result = await response.json();
            console.log('📥 Resposta do servidor (vidrarias):', result);

            if (result.success) {
                console.log(`✅ ${result.vidrarias.length} vidrarias encontradas`);
                exibirVidrarias(result.vidrarias);
                return result.vidrarias;
            } else {
                console.warn('⚠️ Nenhuma vidraria encontrada no servidor');
                exibirVidrarias([]);
                return [];
            }

        } catch (error) {
            console.error('❌ Erro ao carregar vidrarias:', error);
            exibirVidrarias([]);
            return [];
        }
    }

    // Função para exibir vidrarias na lista
    function exibirVidrarias(vidrarias) {
        const listaVidrarias = document.getElementById('vidrarias-lista');

        if (!listaVidrarias) {
            console.error('❌ Elemento #vidrarias-lista não encontrado');
            return;
        }

        // Limpa a lista
        listaVidrarias.innerHTML = '';

        if (!vidrarias || vidrarias.length === 0) {
            listaVidrarias.innerHTML = `
            <div class="item-row empty-message">
                <p>Nenhuma vidraria selecionada</p>
            </div>
        `;
            return;
        }

        // Adiciona cada vidraria à lista
        vidrarias.forEach((vidraria, index) => {
            const itemRow = document.createElement('div');
            itemRow.className = 'item-row';
            itemRow.innerHTML = `
            <div class="item-info">
                <p class="item-name">${vidraria.nome}</p>
                <p class="item-details">${vidraria.capacidade} ${vidraria.unidade}</p>
            </div>
            <div class="item-actions">
                <button class="btn-remover" data-id="${vidraria.id}" title="Remover vidraria">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
            listaVidrarias.appendChild(itemRow);
        });

        // Adiciona event listeners aos botões de remover
        adicionarEventListenersRemoverVidrarias();
    }

    // Função para adicionar event listeners de remoção para vidrarias
    function adicionarEventListenersRemoverVidrarias() {
        const botoesRemover = document.querySelectorAll('#vidrarias-lista .btn-remover');

        botoesRemover.forEach(botao => {
            botao.addEventListener('click', function () {
                const idVidraria = this.getAttribute('data-id');
                removerVidraria(idVidraria);
            });
        });
    }

    // Função para remover vidraria
    async function removerVidraria(id) {
        if (!confirm('Tem certeza que deseja remover esta vidraria?')) {
            return;
        }

        try {
            console.log(`🗑️ Removendo vidraria ID: ${id}`);

            const response = await fetch(`http://localhost:3000/api/vidrarias-selecionadas/remover/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                showNotification('Vidraria removida com sucesso!', true);
                console.log('✅ Vidraria removida:', result.vidrariaRemovida);

                // Recarrega a lista
                await carregarVidrariasSelecionadas();
            } else {
                throw new Error(result.message || 'Erro ao remover vidraria');
            }

        } catch (error) {
            console.error('❌ Erro ao remover vidraria:', error);
            showNotification('Erro ao remover vidraria. Tente novamente.', false);
        }
    }

    // Na ação da página de materiais selecionados, adicione:
    console.log('🔄 Carregando vidrarias selecionadas...');
    carregarVidrariasSelecionadas();

    function adicionarEventListenersRemover() {
        const botoesRemover = document.querySelectorAll('.btn-remover');

        botoesRemover.forEach(botao => {
            botao.addEventListener('click', function () {
                const idReagente = this.getAttribute('data-id');
                removerReagente(idReagente);
            });
        });
    }

    // Função para remover reagente
    async function removerReagente(id) {
        if (!confirm('Tem certeza que deseja remover este reagente?')) {
            return;
        }

        try {
            console.log(`🗑️ Removendo reagente ID: ${id}`);

            const response = await fetch(`http://localhost:3000/api/reagentes-selecionados/remover/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                showNotification('Reagente removido com sucesso!', true);
                console.log('✅ Reagente removido:', result.reagenteRemovido);

                // Recarrega a lista
                await carregarReagentesSelecionados();
            } else {
                throw new Error(result.message || 'Erro ao remover reagente');
            }

        } catch (error) {
            console.error('❌ Erro ao remover reagente:', error);
            showNotification('Erro ao remover reagente. Tente novamente.', false);
        }
    }

    // BUSCAR DADOS DO AGENDAMENTO DO SERVIDOR
    async function buscarAgendamentoServidor() {
        try {
            console.log('🌐 Buscando agendamento do servidor...');

            const response = await fetch('http://localhost:3000/api/agendamentos-temporarios');
            const result = await response.json();

            console.log('Resposta do servidor:', result);

            if (result.success && result.agendamentos && result.agendamentos.length > 0) {
                // Pega o agendamento mais recente
                const agendamentoMaisRecente = result.agendamentos[result.agendamentos.length - 1];
                console.log('✅ Agendamento encontrado no servidor:', agendamentoMaisRecente);
                return agendamentoMaisRecente;
            } else {
                console.warn('⚠️ Nenhum agendamento encontrado no servidor');
                return null;
            }
        } catch (error) {
            console.error('❌ Erro ao buscar agendamento do servidor:', error);
            return null;
        }
    }

    // Buscar informações do laboratório
    async function buscarLaboratorio(idLaboratorio) {
        try {
            console.log(`🔍 Buscando laboratório ID: ${idLaboratorio}`);

            const laboratoriosFallback = {
                1: { id_laboratorio: 1, nome: "Laboratório de Informática 1", capacidade: 30, localizacao: "Bloco A" },
                2: { id_laboratorio: 2, nome: "Laboratório de Informática 2", capacidade: 25, localizacao: "Bloco A" },
                3: { id_laboratorio: 3, nome: "Laboratório de Química", capacidade: 20, localizacao: "Bloco B" },
                4: { id_laboratorio: 4, nome: "Laboratório de Física", capacidade: 15, localizacao: "Bloco C" },
                5: { id_laboratorio: 5, nome: "Laboratório de Biologia", capacidade: 18, localizacao: "Bloco D" }
            };

            // Tenta buscar da API
            try {
                const response = await fetch('http://localhost:3000/api/laboratorios');
                if (response.ok) {
                    const result = await response.json();

                    if (result.success && result.laboratorios) {
                        const idBuscado = Number(idLaboratorio);
                        const laboratorio = result.laboratorios.find(lab =>
                            Number(lab.id_laboratorio) === idBuscado
                        );

                        if (laboratorio) {
                            console.log('✅ Laboratório encontrado na API:', laboratorio);
                            return laboratorio;
                        }
                    }
                }
            } catch (apiError) {
                console.warn('⚠️ API não disponível, usando fallback');
            }

            // Fallback
            if (laboratoriosFallback[idLaboratorio]) {
                return laboratoriosFallback[idLaboratorio];
            }

            return {
                id_laboratorio: idLaboratorio,
                nome: `Laboratório ${idLaboratorio}`,
                capacidade: 20,
                localizacao: "Bloco Principal"
            };

        } catch (error) {
            console.error('❌ Erro ao buscar laboratório:', error);
            return {
                id_laboratorio: idLaboratorio,
                nome: `Laboratório ${idLaboratorio}`,
                capacidade: 20,
                localizacao: "Localização não disponível"
            };
        }
    }

    // =========================================================================
    // FUNÇÕES PARA BANCO DE DADOS
    // =========================================================================

    // Função para salvar materiais no banco
    async function salvarMateriaisNoBanco(professor_id, agendamento_id = null) {
        try {
            console.log('💾 Iniciando processo de salvamento no banco...');

            // Busca os materiais da memória do servidor
            let reagentesData = [];
            let vidrariasData = [];

            try {
                const reagentesResponse = await fetch('http://localhost:3000/api/reagentes-selecionados');
                if (reagentesResponse.ok) {
                    const reagentesResult = await reagentesResponse.json();
                    reagentesData = reagentesResult.success ? reagentesResult.reagentes : [];
                }
            } catch (error) {
                console.error('❌ Erro ao buscar reagentes:', error);
            }

            try {
                const vidrariasResponse = await fetch('http://localhost:3000/api/vidrarias-selecionadas');
                if (vidrariasResponse.ok) {
                    const vidrariasResult = await vidrariasResponse.json();
                    vidrariasData = vidrariasResult.success ? vidrariasResult.vidrarias : [];
                }
            } catch (error) {
                console.error('❌ Erro ao buscar vidrarias:', error);
            }

            const dados = {
                professor_id: professor_id,
                agendamento_id: agendamento_id,
                reagentes: reagentesData,
                vidrarias: vidrariasData
            };

            console.log('💾 Enviando materiais para o banco:', {
                professor_id: professor_id,
                agendamento_id: agendamento_id,
                total_reagentes: reagentesData.length,
                total_vidrarias: vidrariasData.length
            });

            // Salva no banco
            const response = await fetch('http://localhost:3000/api/materiais-selecionados/salvar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados)
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                console.log('✅ Materiais salvos no banco:', result.materiaisSalvos);

                // Limpa os arrays em memória APENAS se salvou com sucesso
                try {
                    await fetch('http://localhost:3000/api/reagentes-selecionados/limpar', { method: 'DELETE' });
                    await fetch('http://localhost:3000/api/vidrarias-selecionadas/limpar', { method: 'DELETE' });
                    console.log('🧹 Arrays de memória limpos');
                } catch (cleanError) {
                    console.warn('⚠️ Erro ao limpar arrays de memória:', cleanError);
                }

                return true;
            } else {
                throw new Error(result.message || 'Erro ao salvar materiais no banco');
            }

        } catch (error) {
            console.error('❌ Erro ao salvar materiais no banco:', error);
            showNotification('Erro ao salvar materiais no banco. Tente novamente.', false);
            return false;
        }
    }

    // Função para carregar materiais do banco
    async function carregarMateriaisDoBanco(professor_id) {
        try {
            console.log(`🔍 Buscando materiais do banco para professor: ${professor_id}`);

            const response = await fetch(`http://localhost:3000/api/materiais-selecionados/${professor_id}`);
            const result = await response.json();

            if (result.success) {
                console.log(`✅ ${result.materiais.length} materiais carregados do banco`);
                return result;
            } else {
                console.warn('⚠️ Nenhum material encontrado no banco');
                return { reagentes: [], vidrarias: [] };
            }

        } catch (error) {
            console.error('❌ Erro ao carregar materiais do banco:', error);
            return { reagentes: [], vidrarias: [] };
        }
    }

    // Função para confirmar o agendamento E SALVAR NO BANCO
    async function confirmarAgendamento() {
        try {
            if (!window.agendamentoAtual) {
                throw new Error('Dados do agendamento não disponíveis');
            }

            showMessage('Confirmando agendamento...', true);

            const agendamentoData = window.agendamentoAtual;

            // OBTER O ID DO PROFESSOR LOGADO DO LOCALSTORAGE
            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
            let professor_id;

            if (usuarioLogado && usuarioLogado.id) {
                professor_id = usuarioLogado.id;
                console.log('👨‍🏫 Usando ID do professor logado:', professor_id);
            } else {
                // Fallback - usar ID 1 ou buscar de outra forma
                professor_id = 1;
                console.warn('⚠️ Usando ID fallback do professor:', professor_id);
            }

            // Dados para enviar ao servidor
            const dadosConfirmacao = {
                data_agendamento: agendamentoData.data_agendamento,
                horario_inicio: agendamentoData.horario_inicio,
                horario_fim: agendamentoData.horario_fim,
                laboratorio: agendamentoData.id_laboratorio,
                professor_id: professor_id, // USAR O ID CORRETO AQUI
                materia: agendamentoData.observacoes
            };

            console.log('📤 Enviando para confirmação:', dadosConfirmacao);

            // 1. Primeiro confirma o agendamento
            const response = await fetch('http://localhost:3000/api/agendamentos/confirmar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosConfirmacao)
            });

            // ... resto do código permanece igual ...
        } catch (error) {
            console.error('❌ Erro ao confirmar agendamento:', error);
            showMessage(`Erro ao confirmar: ${error.message}`, false);
        }
    }

    // Carregar dados do agendamento (DO SERVIDOR)
    async function carregarDadosAgendamento() {
        try {
            console.log('📋 Carregando dados do agendamento do servidor...');

            const agendamentoData = await buscarAgendamentoServidor();
            console.log('📦 Dados do servidor:', agendamentoData);

            if (agendamentoData && agendamentoData.id_laboratorio) {
                console.log('✅ Dados válidos encontrados no servidor');

                // Busca informações do laboratório
                const laboratorioInfo = await buscarLaboratorio(agendamentoData.id_laboratorio);
                console.log('🏫 Informações do laboratório:', laboratorioInfo);

                // Preenche os dados no modal
                const dataElement = document.getElementById('modal-data-agendamento');
                const horarioElement = document.getElementById('modal-horario-agendamento');
                const laboratorioElement = document.getElementById('modal-laboratorio-agendamento');
                const materiaElement = document.getElementById('modal-materia-agendamento');

                if (dataElement) dataElement.textContent = formatarData(agendamentoData.data_agendamento);
                if (horarioElement) horarioElement.textContent =
                    (agendamentoData.horario_inicio || 'Horário não informado') + ' - ' +
                    (agendamentoData.horario_fim || calcularHorarioFim(agendamentoData.horario_inicio));
                if (laboratorioElement) laboratorioElement.textContent = laboratorioInfo.nome;
                if (materiaElement) materiaElement.textContent = agendamentoData.observacoes || 'Aula prática';

                // Armazena os dados para uso posterior
                window.agendamentoAtual = {
                    ...agendamentoData,
                    laboratorioInfo: laboratorioInfo
                };

                console.log('🎉 Dados carregados com sucesso do servidor');
                return true;
            } else {
                console.warn('⚠️ Dados de agendamento incompletos ou não encontrados no servidor');
                showCustomPopup('Ainda não foi realizado um agendamento, por gentileza, retorne e escolha uma data', false);
                return false;
            }
        } catch (error) {
            console.error('❌ Erro ao carregar dados do agendamento:', error);
            // Para erros de rede, ainda usa a mensagem padrão
            showMessage('Erro ao carregar dados do agendamento do servidor.', false);
            return false;
        }
    }

    // Função para abrir o modal
    async function abrirModal() {
        console.log('🎯 Tentando abrir modal...');

        showMessage('Carregando dados do agendamento...', true);

        const dadosCarregados = await carregarDadosAgendamento();
        console.log('Dados carregados do servidor:', dadosCarregados);

        if (dadosCarregados) {
            console.log('🔄 Abrindo modal...');
            modal.style.display = 'block';
            showMessage('Dados carregados com sucesso!', true);
            console.log('✅ Modal aberto com dados reais do servidor');
        } else {
            console.error('❌ Falha ao carregar dados do servidor para o modal');
        }
    }

    // Função para fechar o modal
    function fecharModal() {
        console.log('🔒 Fechando modal');
        modal.style.display = 'none';
    }

    // Função para confirmar o agendamento E SALVAR MATERIAIS
    async function confirmarAgendamento() {
        try {
            if (!window.agendamentoAtual) {
                throw new Error('Dados do agendamento não disponíveis');
            }

            showMessage('Confirmando agendamento...', true);

            const agendamentoData = window.agendamentoAtual;

            // OBTER O ID DO PROFESSOR LOGADO DO LOCALSTORAGE
            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
            let professor_id;

            if (usuarioLogado && usuarioLogado.id) {
                professor_id = usuarioLogado.id;
                console.log('👨‍🏫 Usando ID do professor logado:', professor_id);
            } else {
                professor_id = 1;
                console.warn('⚠️ Usando ID fallback do professor:', professor_id);
            }

            // Dados para enviar ao servidor
            const dadosConfirmacao = {
                data_agendamento: agendamentoData.data_agendamento,
                horario_inicio: agendamentoData.horario_inicio,
                horario_fim: agendamentoData.horario_fim,
                laboratorio: agendamentoData.id_laboratorio,
                professor_id: professor_id,
                materia: agendamentoData.observacoes
            };

            console.log('📤 Enviando para confirmação:', dadosConfirmacao);

            // 1. Primeiro confirma o agendamento
            const response = await fetch('http://localhost:3000/api/agendamentos/confirmar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosConfirmacao)
            });

            console.log('📥 Resposta do servidor - Status:', response.status);

            // Verifica se a resposta é JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await response.text();
                console.error('❌ Servidor retornou HTML em vez de JSON:', textResponse.substring(0, 200));
                throw new Error(`Servidor retornou erro: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('📥 Resposta JSON do servidor:', result);

            if (response.ok && result.success) {
                showMessage('Agendamento confirmado com sucesso!', true);

                // ✅✅✅ CORREÇÃO: SALVAR OS MATERIAIS NO BANCO APÓS CONFIRMAR O AGENDAMENTO
                const agendamentoId = result.agendamentoId;
                console.log('💾 Salvando materiais para o agendamento ID:', agendamentoId);

                const materiaisSalvos = await salvarMateriaisNoBanco(professor_id, agendamentoId);

                if (materiaisSalvos) {
                    showMessage('Materiais salvos com sucesso!', true);
                } else {
                    showMessage('Agendamento confirmado, mas houve erro ao salvar materiais', false);
                }

                // Limpa qualquer dado temporário
                localStorage.removeItem('agendamentoData');
                delete window.agendamentoAtual;

                fecharModal();

                // Redireciona após confirmação
                setTimeout(() => {
                    window.location.href = 'professor.html';
                }, 2000);
            } else {
                throw new Error(result.message || `Erro ${response.status}: ${response.statusText}`);
            }

        } catch (error) {
            console.error('❌ Erro ao confirmar agendamento:', error);

            let mensagemErro = `Erro ao confirmar: ${error.message}`;

            if (error.message.includes('Failed to fetch')) {
                mensagemErro = 'Erro de conexão: Não foi possível conectar ao servidor. Verifique se o servidor está rodando.';
            } else if (error.message.includes('404')) {
                mensagemErro = 'Erro: Rota não encontrada no servidor. A rota de confirmação não existe.';
            } else if (error.message.includes('500')) {
                mensagemErro = 'Erro interno do servidor. Tente novamente mais tarde.';
            }

            showMessage(mensagemErro, false);
        }
    }

    // EVENT LISTENERS
    console.log('🔗 Configurando event listeners...');

    if (btnAbrirModal) {
        btnAbrirModal.addEventListener('click', function (e) {
            console.log('🖱️ Botão "Abrir Modal" clicado');
            e.preventDefault();
            abrirModal();
        });
        console.log('✅ Listener para btnAbrirModal configurado');
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', fecharModal);
        console.log('✅ Listener para closeBtn configurado');
    }

    if (btnCancelar) {
        btnCancelar.addEventListener('click', fecharModal);
        console.log('✅ Listener para btnCancelar configurado');
    }

    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', confirmarAgendamento);
        console.log('✅ Listener para btnConfirmar configurado');
    }

    // Fechar modal clicando fora
    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            fecharModal();
        }
    });

    // =========================================================================
    // INICIALIZAÇÃO - CARREGAR REAGENTES QUANDO A PÁGINA ABRIR
    // =========================================================================

    console.log('🎉 Configuração do modal completa!');

    // CARREGA OS REAGENTES SELECIONADOS DO SERVIDOR
    console.log('🔄 Carregando reagentes selecionados...');
    carregarReagentesSelecionados();

    // Logout functionality
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function () {
            if (confirm('Tem certeza que deseja sair?')) {
                localStorage.removeItem('usuarioLogado');
                window.location.href = '../login.html';
            }
        });
    }
    console.log('🎉 Configuração do modal completa!');

    // CARREGA OS REAGENTES E VIDRARIAS SELECIONADOS DA MEMÓRIA DO SERVIDOR
    console.log('🔄 Carregando reagentes selecionados...');
    carregarReagentesSelecionados();

    console.log('🔄 Carregando vidrarias selecionadas...');
    carregarVidrariasSelecionadas();


    async function atualizarMateriaisAutomaticamente() {
        try {
            const [respReagentes, respVidrarias] = await Promise.all([
                fetch('http://localhost:3000/api/reagentes-selecionados'),
                fetch('http://localhost:3000/api/vidrarias-selecionadas')
            ]);

            if (!respReagentes.ok || !respVidrarias.ok) return;

            const dadosReagentes = await respReagentes.json();
            const dadosVidrarias = await respVidrarias.json();

            const totalReagentes = dadosReagentes.reagentes?.length || 0;
            const totalVidrarias = dadosVidrarias.vidrarias?.length || 0;

            // Só atualiza se mudou
            if (totalReagentes !== ultimaQuantidadeReagentes || totalVidrarias !== ultimaQuantidadeVidrarias) {
                console.log('Atualização detectada! Recarregando listas...');
                await carregarReagentesSelecionados();
                await carregarVidrariasSelecionadas();

                ultimaQuantidadeReagentes = totalReagentes;
                ultimaQuantidadeVidrarias = totalVidrarias;
            }

        } catch (error) {
            // Silencia erros de rede (não trava o intervalo)
            console.warn('Erro no polling automático:', error.message);
        }
    }

    // Inicia o polling a cada 2 segundos
    setInterval(atualizarMateriaisAutomaticamente, 2000);

    // Executa uma vez imediatamente
    atualizarMateriaisAutomaticamente();
});