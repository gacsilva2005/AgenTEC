document.addEventListener('DOMContentLoaded', function () {
    // Elementos do DOM
    const monthYearE1 = document.getElementById('month-year');
    const daysE1 = document.getElementById('days');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const todayBtn = document.getElementById('today-btn');
    const eventDateE1 = document.getElementById('event-date');
    const eventListE1 = document.getElementById('event-list');
    const scheduleBtn = document.getElementById('schedule-btn');

    // Novos elementos para os painéis de horário e laboratório
    const eventTimePanel = document.getElementById('eventTime-panel');
    const eventListTime = document.getElementById('event-list-time');
    const eventLabPanel = document.getElementById('eventLab-panel');
    const eventListLab = document.getElementById('event-list-lab');
    const scheduleTimeBtn = document.getElementById('schedule-btn-time');
    const confirmBtn = document.querySelectorAll('.action-buttons-container .btn-primary')[1];

    // Variáveis de Estado
    let currentDate = new Date();
    let selectedDate = null;
    let selectedTime = null;
    let selectedLab = null;
    const events = window.events || {}; // Carrega eventos de uma variável global

    // Função para mostrar notificações
    function showMessage(message, isSuccess = false) {
        // Remove notificação anterior se existir
        const existingMessage = document.getElementById('notificationMessage');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Cria elemento de notificação
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
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            background-color: ${isSuccess ? '#4CAF50' : '#f44336'};
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;

        document.body.appendChild(messageElement);

        // Animação de entrada
        setTimeout(() => {
            messageElement.style.opacity = '1';
        }, 10);

        // Remove após 5 segundos (ou 3 segundos para sucesso)
        const duration = isSuccess ? 3000 : 5000;
        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 300);
        }, duration);
    }

    // Função para verificar agendamentos no backend
    async function verificarAgendamentos(dataStr) {
        try {
            const response = await fetch(`http://localhost:3000/api/agendamentos/${dataStr}`);
            const result = await response.json();

            if (response.ok && result.success) {
                return result;
            } else {
                throw new Error(result.message || 'Erro ao verificar agendamentos');
            }
        } catch (error) {
            console.error('Erro ao verificar agendamentos:', error);
            showMessage('Erro ao verificar disponibilidade da data', false);
            return null;
        }
    }

    // Nova função para buscar horários disponíveis
    async function buscarHorariosDisponiveis(dataStr) {
        try {
            const response = await fetch(`http://localhost:3000/api/horarios-disponiveis/${dataStr}`);
            const result = await response.json();

            if (response.ok && result.success) {
                return result;
            } else {
                throw new Error(result.message || 'Erro ao buscar horários disponíveis');
            }
        } catch (error) {
            console.error('Erro ao buscar horários disponíveis:', error);
            showMessage('Erro ao carregar horários disponíveis', false);
            return null;
        }
    }

    // Função para carregar laboratórios disponíveis
    async function carregarLaboratorios() {
        try {
            const response = await fetch('http://localhost:3000/api/laboratorios');
            const result = await response.json();

            if (response.ok && result.success) {
                return result.laboratorios;
            } else {
                throw new Error(result.message || 'Erro ao carregar laboratórios');
            }
        } catch (error) {
            console.error('Erro ao carregar laboratórios:', error);
            showMessage('Erro ao carregar laboratórios', false);
            return [];
        }
    }

    function verificarSelecaoCompleta() {
        const completa = selectedDate !== null && selectedTime !== null && selectedLab !== null;

        if (confirmBtn) {
            if (completa) {
                // Habilita o botão
                confirmBtn.disabled = false;
                confirmBtn.style.backgroundColor = '#27ae60';
                confirmBtn.style.cursor = 'pointer';
                confirmBtn.title = 'Clique para confirmar o agendamento';
            } else {
                // Desabilita o botão
                confirmBtn.disabled = true;
                confirmBtn.style.backgroundColor = '#bdc3c7';
                confirmBtn.style.cursor = 'not-allowed';

                // Tooltip explicativo
                if (!selectedDate) {
                    confirmBtn.title = 'Selecione uma data primeiro';
                } else if (!selectedTime) {
                    confirmBtn.title = 'Selecione um horário';
                } else {
                    confirmBtn.title = 'Selecione um laboratório';
                }
            }
        }
        return completa;
    }

    // Função para exibir horários disponíveis no painel de tempo
    function exibirHorariosDisponiveis(horariosData) {
        eventListTime.innerHTML = ''; // Limpa a lista anterior

        // Esconde o resumo se estiver visível
        const summaryElement = document.getElementById('selected-time-summary');
        if (summaryElement) {
            summaryElement.style.display = 'none';
        }

        if (!horariosData || horariosData.totalDisponiveis === 0) {
            eventListTime.innerHTML = '<div class="no-events">Nenhum horário disponível para esta data.</div>';
            return;
        }

        // Cria seção da manhã
        if (horariosData.horariosManha.length > 0) {
            const manhaSection = document.createElement('div');
            manhaSection.className = 'time-section';
            manhaSection.innerHTML = '<h4>Manhã</h4>';

            const manhaGrid = document.createElement('div');
            manhaGrid.className = 'time-grid';

            horariosData.horariosManha.forEach(horario => {
                const timeBtn = document.createElement('button');
                timeBtn.className = 'time-btn';
                timeBtn.innerHTML = `
                    <span class="aula-label">${horario.aula}</span>
                    <span class="horario">${horario.horario}</span>
                `;
                timeBtn.addEventListener('click', () => selecionarHorario(horario, timeBtn));
                manhaGrid.appendChild(timeBtn);
            });

            manhaSection.appendChild(manhaGrid);
            eventListTime.appendChild(manhaSection);
        }

        // Cria seção da tarde
        if (horariosData.horariosTarde.length > 0) {
            const tardeSection = document.createElement('div');
            tardeSection.className = 'time-section';
            tardeSection.innerHTML = '<h4>Tarde</h4>';

            const tardeGrid = document.createElement('div');
            tardeGrid.className = 'time-grid';

            horariosData.horariosTarde.forEach(horario => {
                const timeBtn = document.createElement('button');
                timeBtn.className = 'time-btn';
                timeBtn.innerHTML = `
                    <span class="aula-label">${horario.aula}</span>
                    <span class="horario">${horario.horario}</span>
                `;
                timeBtn.addEventListener('click', () => selecionarHorario(horario, timeBtn));
                tardeGrid.appendChild(timeBtn);
            });

            tardeSection.appendChild(tardeGrid);
            eventListTime.appendChild(tardeSection);
        }

        // Mostra o painel de tempo
        eventTimePanel.style.display = 'block';
        eventTimePanel.querySelector('.event-date').textContent = `Horários disponíveis - ${formatarData(selectedDate)}`;

        // Garante que a lista de horários esteja visível
        eventListTime.style.display = 'block';
    }

    // Função para selecionar um horário
    function selecionarHorario(horario, element) {
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        element.classList.add('selected');
        selectedTime = horario;

        mostrarResumoHorario(horario);
        showMessage(`Horário selecionado: ${horario.aula} - ${horario.horario}`, true);

        verificarSelecaoCompleta();
        exibirLaboratoriosDisponiveis();
    }

    // Função para mostrar o resumo do horário selecionado
    function mostrarResumoHorario(horario) {
        // Cria ou obtém o elemento de resumo
        let summaryElement = document.getElementById('selected-time-summary');
        if (!summaryElement) {
            summaryElement = document.createElement('div');
            summaryElement.id = 'selected-time-summary';
            summaryElement.className = 'selected-time-summary';
            eventTimePanel.insertBefore(summaryElement, eventListTime);
        }

        // Determina o período (Manhã ou Tarde)
        const periodo = horario.horario.includes('13:00') ||
            horario.horario.includes('14:00') ||
            horario.horario.includes('15:00') ||
            horario.horario.includes('16:00') ||
            horario.horario.includes('17:00') ? 'Tarde' : 'Manhã';

        // Atualiza o conteúdo do resumo
        summaryElement.innerHTML = `
            <div class="time-summary-content">
                <div class="period-badge ${periodo.toLowerCase()}">${periodo}</div>
                <div class="time-details">
                    <span class="selected-aula">${horario.aula}</span>
                    <span class="selected-horario">${horario.horario}</span>
                </div>
                <button class="change-time-btn" id="change-time-btn">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        `;

        // Adiciona event listener para o botão de alterar horário
        document.getElementById('change-time-btn').addEventListener('click', voltarSelecaoHorarios);

        // Esconde a lista de horários e mostra o resumo
        eventListTime.style.display = 'none';
        summaryElement.style.display = 'block';

        // Atualiza o header do painel
        document.querySelector('#eventTime-panel .event-date').textContent = 'Horário Selecionado';
    }

    // Função para voltar à seleção de horários
    function voltarSelecaoHorarios() {
        const summaryElement = document.getElementById('selected-time-summary');
        const eventListTime = document.getElementById('event-list-time');

        if (summaryElement) {
            summaryElement.style.display = 'none';
        }
        eventListTime.style.display = 'block';

        // Reseta a seleção de horário
        selectedTime = null;
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        selectedLab = null;
        document.querySelectorAll('.lab-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        eventLabPanel.style.display = 'none';
        verificarSelecaoCompleta();

        document.querySelector('#eventTime-panel .event-date').textContent = `Horários disponíveis - ${formatarData(selectedDate)}`;
    }

    // Função para exibir laboratórios disponíveis
    async function exibirLaboratoriosDisponiveis() {
        const laboratorios = await carregarLaboratorios();
        eventListLab.innerHTML = ''; // Limpa a lista anterior

        if (laboratorios.length === 0) {
            eventListLab.innerHTML = '<div class="no-events">Nenhum laboratório disponível.</div>';
            return;
        }

        laboratorios.forEach(lab => {
            const labBtn = document.createElement('button');
            labBtn.className = 'lab-btn';
            labBtn.innerHTML = `
                <span class="lab-name">${lab.nome}</span>
                <span class="lab-info">Capacidade: ${lab.capacidade} | ${lab.localizacao}</span>
            `;
            labBtn.addEventListener('click', () => selecionarLaboratorio(lab, labBtn));
            eventListLab.appendChild(labBtn);
        });

        // Mostra o painel de laboratório
        eventLabPanel.style.display = 'block';
        eventLabPanel.querySelector('.event-date').textContent = `Laboratório - ${formatarData(selectedDate)} ${selectedTime.horario}`;
    }

    // Função para selecionar laboratório
    function selecionarLaboratorio(lab, element) {
        document.querySelectorAll('.lab-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        element.classList.add('selected');
        selectedLab = lab;
        showMessage(`Laboratório selecionado: ${lab.nome}`, true);

        verificarSelecaoCompleta();
    }

    // Função para formatar data (para exibir no painel)
    function formatarData(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function renderCalendar() {
        // Cálculos de Datas
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const prevLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

        const firstDayIndex = firstDay.getDay(); // 0 (Dom) a 6 (Sab)
        const totalDaysInMonth = lastDay.getDate();

        // Alinha a semana começando na Segunda-feira
        const daysFromPreviousMonth = (firstDayIndex + 6) % 7;

        // Limita o calendário a no máximo 5 linhas
        const MAX_CELLS = 35;
        const totalCellsOccupied = daysFromPreviousMonth + totalDaysInMonth;
        let nextDays = 0;

        if (totalCellsOccupied < MAX_CELLS) {
            nextDays = MAX_CELLS - totalCellsOccupied;
        }

        // Exibe Mês e Ano
        const months = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto",
            "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        monthYearE1.innerHTML = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

        let days = "";

        // Renderiza dias do Mês Anterior
        for (let x = daysFromPreviousMonth; x > 0; x--) {
            const prevDate = prevLastDay.getDate() - x + 1;
            const dateKey = `${prevLastDay.getFullYear()}-${(prevLastDay.getMonth() + 1).toString().padStart(2, '0')}-${prevDate.toString().padStart(2, '0')}`;
            const hasEvent = events[dateKey] !== undefined;

            days += `<div class="day other-month${hasEvent ? ' has-events' : ''}">${prevDate}</div>`;
        }

        // Renderiza dias do Mês Atual e Limita o loop para respeitar o limite de 35 células pra não aparecer mais de uma semana
        const maxCurrentDay = Math.min(totalDaysInMonth, MAX_CELLS - daysFromPreviousMonth);

        for (let i = 1; i <= maxCurrentDay; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const dateKey = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
            const hasEvent = events[dateKey] !== undefined;

            let dayClass = 'day';

            // Marca o dia de hoje
            if (
                date.getDate() === new Date().getDate() &&
                date.getMonth() === new Date().getMonth() &&
                date.getFullYear() === new Date().getFullYear()
            ) {
                dayClass += ' today';
            }

            // Marca o dia selecionado
            if (
                selectedDate &&
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear()
            ) {
                dayClass += ' selected';
            }

            if (hasEvent)
                dayClass += ' has-events';

            days += `<div class="${dayClass}" data-date="${dateKey}">${i}</div>`;
        }

        // Renderiza dias do Próximo Mês
        for (let j = 1; j <= nextDays; j++) {
            const nextMonth = currentDate.getMonth() + 2;
            const nextYear = currentDate.getFullYear();
            const dateKey = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-${j.toString().padStart(2, '0')}`;
            const hasEvent = events[dateKey] !== undefined;

            days += `<div class="day other-month${hasEvent ? ' has-events' : ''}">${j}</div>`;
        }

        daysE1.innerHTML = days;

        // Adiciona Event Listeners dos Dias Válidos
        document.querySelectorAll('.day:not(.other-month)').forEach(day => {
            day.addEventListener('click', async () => {
                const dateStr = day.getAttribute('data-date');
                const [year, month, dayNum] = dateStr.split('-').map(Number);
                selectedDate = new Date(year, month - 1, dayNum);
                renderCalendar(); // Atualiza a seleção no calendário

                // Verifica agendamentos no backend
                const agendamentosInfo = await verificarAgendamentos(dateStr);
                showEvents(dateStr, agendamentosInfo);
            });
        });
    }

    // Exibe a lista de eventos para a data selecionada
    async function showEvents(dateStr, agendamentosInfo) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);

        const months = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        const dayNames = [
            "Domingo", "Segunda-feira", "Terça-feira",
            "Quarta-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"
        ];

        const dayName = dayNames[dateObj.getDay()];

        eventDateE1.textContent = `${dayName}, ${day} de ${months[dateObj.getMonth()]} de ${year}`;
        eventListE1.innerHTML = '';

        if (agendamentosInfo) {
            const statusDiv = document.createElement('div');
            statusDiv.className = `agendamento-status ${agendamentosInfo.podeAgendar ? 'disponivel' : 'lotado'}`;

            if (agendamentosInfo.podeAgendar) {
                statusDiv.innerHTML = `
                    <div class="status-indicator disponivel"></div>
                    <div class="status-text">
                        <strong>Disponível para agendamento</strong>
                        <p>${agendamentosInfo.message}</p>
                    </div>
                `;

                scheduleBtn.disabled = false;
                scheduleBtn.innerHTML = '<i class="fas fa-calendar-plus"></i> Agendar Aula';
                scheduleBtn.onclick = () => {
                    buscarHorariosDisponiveis(dateStr).then(horariosData => {
                        exibirHorariosDisponiveis(horariosData);
                    });
                };

                eventTimePanel.style.display = 'none';
                eventLabPanel.style.display = 'none';

            } else {
                statusDiv.innerHTML = `
                    <div class="status-indicator lotado"></div>
                    <div class="status-text">
                        <strong>Data Lotada</strong>
                        <p>${agendamentosInfo.message}</p>
                    </div>
                `;

                scheduleBtn.disabled = true;
                scheduleBtn.innerHTML = '<i class="fas fa-calendar-times"></i> Data Lotada';
                scheduleBtn.onclick = null;

                eventTimePanel.style.display = 'none';
                eventLabPanel.style.display = 'none';
            }

            eventListE1.appendChild(statusDiv);
        }

        if (events[dateStr]) {
            events[dateStr].forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.className = 'event-item';
                eventItem.innerHTML = `
                <div class="event-color"></div>
                <div class="event-time">${event.time}</div>
                <div class="event-text">${event.text}</div>
            `;
                eventListE1.appendChild(eventItem);
            });
        }

        // MODIFICAÇÃO: Resetar TODAS as seleções quando mudar a data
        selectedTime = null;
        selectedLab = null;

        // Resetar seleções visuais
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelectorAll('.lab-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Esconder painéis
        eventTimePanel.style.display = 'none';
        eventLabPanel.style.display = 'none';

        // Remover resumo se existir
        const summaryElement = document.getElementById('selected-time-summary');
        if (summaryElement) {
            summaryElement.remove();
        }

        // ATUALIZAR VERIFICAÇÃO
        verificarSelecaoCompleta();
    }

    // Navegação e Botões
    // Mês Anterior
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
        eventDateE1.textContent = 'Selecione uma data';
        eventListE1.innerHTML = '<div class="no-events">Selecione uma data para verificar a disponibilidade</div>';
        scheduleBtn.disabled = true;
        scheduleBtn.innerHTML = '<i class="fas fa-calendar-day"></i> Agendar';

        // RESETAR SELEÇÕES
        selectedDate = null;
        selectedTime = null;
        selectedLab = null;

        eventTimePanel.style.display = 'none';
        eventLabPanel.style.display = 'none';

        const summaryElement = document.getElementById('selected-time-summary');
        if (summaryElement) {
            summaryElement.remove();
        }

        verificarSelecaoCompleta();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
        eventDateE1.textContent = 'Selecione uma data';
        eventListE1.innerHTML = '<div class="no-events">Selecione uma data para verificar a disponibilidade</div>';
        scheduleBtn.disabled = true;
        scheduleBtn.innerHTML = '<i class="fas fa-calendar-day"></i> Agendar';

        // RESETAR SELEÇÕES
        selectedDate = null;
        selectedTime = null;
        selectedLab = null;

        eventTimePanel.style.display = 'none';
        eventLabPanel.style.display = 'none';

        const summaryElement = document.getElementById('selected-time-summary');
        if (summaryElement) {
            summaryElement.remove();
        }

        verificarSelecaoCompleta();
    });

    // Botão "Hoje"
    todayBtn.addEventListener('click', async () => {
        currentDate = new Date();
        selectedDate = new Date();
        renderCalendar();

        const today = new Date();
        const dateStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

        // Verifica agendamentos para hoje
        const agendamentosInfo = await verificarAgendamentos(dateStr);
        showEvents(dateStr, agendamentosInfo);

        // Remove o resumo se existir
        const summaryElement = document.getElementById('selected-time-summary');
        if (summaryElement) {
            summaryElement.remove();
        }
    });

    if (confirmBtn) {
    verificarSelecaoCompleta();

    confirmBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        if (!verificarSelecaoCompleta()) {
            showMessage('Por favor, selecione data, horário e laboratório antes de confirmar', false);
            return;
        }

        try {
            // Mostra mensagem de processamento
            showMessage('Processando agendamento...', true);

            // Tenta recuperar usuário de várias formas
            let professorId;
            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

            if (usuarioLogado) {
                professorId = usuarioLogado.id || usuarioLogado.id_professor || usuarioLogado.id_usuario;
            }

            // Se é conta genérica ou ID não encontrado, use um ID válido do banco
            if (!professorId || professorId < 0) {
                console.warn('ID do professor não encontrado ou é genérico, usando ID válido do banco');
                // Substitua pelo ID de um professor real do seu banco
                professorId = 1; // ou outro ID que exista na tabela professor
            }

            // Prepara os dados no formato que o backend espera
            const agendamentoData = {
                data_agendamento: selectedDate.toISOString().split('T')[0],
                horario_inicio: selectedTime.horario,
                laboratorio: selectedLab.id_laboratorio,
                professor_id: professorId,
                materia: `Aula - ${selectedTime.aula}`
            };

            console.log('Enviando agendamento:', agendamentoData);

            // Envia para o servidor
            const response = await fetch('http://localhost:3000/api/agendamentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(agendamentoData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                const agendamentoCompleto = {
                    ...agendamentoData,
                    horario: selectedTime,
                    laboratorioInfo: selectedLab,
                    agendamentoId: result.agendamentoId
                };

                localStorage.setItem('agendamentoData', JSON.stringify(agendamentoCompleto));
                localStorage.setItem('ultimoAgendamentoId', result.agendamentoId);

                showMessage('Agendamento confirmado com sucesso!', true);

                setTimeout(() => {
                    window.location.href = 'reagentes.html';
                }, 2000);
            } else {
                throw new Error(result.message || 'Erro ao confirmar agendamento');
            }

        } catch (error) {
            console.error('Erro ao agendar:', error);
            showMessage(`Erro ao confirmar agendamento: ${error.message}`, false);
        }
    });
}

    // Inicializa o calendário
    renderCalendar();
    scheduleBtn.disabled = true;
    eventTimePanel.style.display = 'none';
    eventLabPanel.style.display = 'none';

    verificarSelecaoCompleta();
});