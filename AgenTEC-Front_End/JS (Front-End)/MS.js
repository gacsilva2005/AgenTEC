document.addEventListener('DOMContentLoaded', function () {
    console.log('=== MS.JS CARREGADO ===');

    // Elementos do modal
    const modal = document.getElementById('modalConfirmacao');
    const closeBtn = document.querySelector('.close');
    const btnCancelar = document.getElementById('btnCancelarAgendamento');
    const btnConfirmar = document.getElementById('btnConfirmarAgendamento');
    const btnAbrirModal = document.getElementById('btnAbrirModal');

    console.log('Elementos encontrados:', {
        modal: !!modal,
        closeBtn: !!closeBtn,
        btnCancelar: !!btnCancelar,
        btnConfirmar: !!btnConfirmar,
        btnAbrirModal: !!btnAbrirModal
    });

    // Função para mostrar popup personalizado
    function showCustomPopup(message, isSuccess = false) {
        console.log(`Popup: ${message}`);

        // Remove popup existente se houver
        const existingPopup = document.getElementById('customPopup');
        if (existingPopup) existingPopup.remove();

        // Remove estilos antigos se existirem
        const oldStyles = document.getElementById('customPopupStyles');
        if (oldStyles) oldStyles.remove();

        // Cria o elemento do popup COM ESTILOS ISOLADOS
        const popupElement = document.createElement('div');
        popupElement.id = 'customPopup';

        // Estilos inline para evitar conflitos
        popupElement.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: Arial, sans-serif;
    `;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    `;

        const content = document.createElement('div');
        content.style.cssText = `
        position: relative;
        background: white;
        padding: 0;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: 90%;
        animation: customPopupFadeIn 0.3s ease-out;
        z-index: 10000;
    `;

        // Cria estilos específicos apenas para este popup
        const styles = document.createElement('style');
        styles.id = 'customPopupStyles';
        styles.textContent = `
        :root{
            --primary-red: #970000;
            --primary-color: #243E63; 
            --hoverCian-color: #005C6D;
        }

        @keyframes customPopupFadeIn {
            from { 
                opacity: 0; 
                transform: translateY(-20px) scale(0.95); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
            }
        }
        @keyframes customPopupFadeOut {
            from { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
            }
            to { 
                opacity: 0; 
                transform: translateY(-20px) scale(0.95); 
            }
        }
        .custom-popup-header {
            background: ${isSuccess ? '#4CAF50' : 'var(--primary-red)'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px 8px 0 0;
            margin: 0;
        }
        .custom-popup-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: bold;
            color: white;
        }
        .custom-popup-body {
            padding: 20px;
            color: #333;
            line-height: 1.5;
            font-size: 14px;
        }
        .custom-popup-footer {
            padding: 15px 20px;
            text-align: right;
            border-top: 1px solid #eee;
        }
        .custom-popup-button {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 8px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        }
        .custom-popup-button:hover {
            background: var(--hoverCian-color);
        }
    `;

        // Estrutura do popup
        content.innerHTML = `
        <div class="custom-popup-header">
            <h3>${isSuccess ? 'Sucesso' : 'Atenção'}</h3>
        </div>
        <div class="custom-popup-body">
            <p>${message}</p>
        </div>
        <div class="custom-popup-footer">
            <button id="popupOkButton" class="custom-popup-button">OK</button>
        </div>
    `;

        // Monta a estrutura
        popupElement.appendChild(overlay);
        popupElement.appendChild(content);
        document.head.appendChild(styles);
        document.body.appendChild(popupElement);

        // Adiciona evento para fechar o popup
        const okButton = document.getElementById('popupOkButton');

        const closePopup = function () {
            content.style.animation = 'customPopupFadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (popupElement.parentNode) {
                    popupElement.remove();
                }
                if (styles.parentNode) {
                    styles.remove();
                }
            }, 300);
        };

        if (okButton) {
            okButton.addEventListener('click', closePopup);
        }

        overlay.addEventListener('click', closePopup);

        // Fecha com ESC key
        const handleEscKey = function (e) {
            if (e.key === 'Escape') {
                closePopup();
                document.removeEventListener('keydown', handleEscKey);
            }
        };
        document.addEventListener('keydown', handleEscKey);

        // Remove o event listener quando o popup é fechado
        popupElement._closePopup = closePopup;
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

    // BUSCAR DADOS DO AGENDAMENTO DO SERVIDOR (não do localStorage)
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
                // AGORA USA O POPUP PERSONALIZADO EM VEZ DA MENSAGEM DE ERRO
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
            // Não precisa mais mostrar mensagem aqui, pois o popup já foi mostrado em carregarDadosAgendamento()
            console.error('❌ Falha ao carregar dados do servidor para o modal');
        }
    }

    // Função para fechar o modal
    function fecharModal() {
        console.log('🔒 Fechando modal');
        modal.style.display = 'none';
    }

    // Função para confirmar o agendamento
    async function confirmarAgendamento() {
        try {
            if (!window.agendamentoAtual) {
                throw new Error('Dados do agendamento não disponíveis');
            }

            showMessage('Confirmando agendamento...', true);

            const agendamentoData = window.agendamentoAtual;

            // Dados para enviar ao servidor
            const dadosConfirmacao = {
                data_agendamento: agendamentoData.data_agendamento,
                horario_inicio: agendamentoData.horario_inicio,
                horario_fim: agendamentoData.horario_fim,
                laboratorio: agendamentoData.id_laboratorio,
                professor_id: agendamentoData.id_professor || 1, // Fallback se não existir
                materia: agendamentoData.observacoes
            };

            console.log('📤 Enviando para confirmação:', dadosConfirmacao);

            // Envia para o servidor com tratamento de erro melhorado
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

            // Mensagens mais amigáveis para erros comuns
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

    console.log('🎉 Configuração do modal completa!');

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
});