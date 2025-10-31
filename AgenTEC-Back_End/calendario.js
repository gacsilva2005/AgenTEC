document.addEventListener('DOMContentLoaded', function () {
    //Elementos do DOM
    const monthYearE1 = document.getElementById('month-year');
    const daysE1 = document.getElementById('days');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const todayBtn = document.getElementById('today-btn');
    const eventDateE1 = document.getElementById('event-date');
    const eventListE1 = document.getElementById('event-list');

    //Variáveis de Estado
    let currentDate = new Date();
    let selectedDate = null;
    const events = window.events || {}; // Carrega eventos de uma variável global

    function renderCalendar() {
        //Cálculos de Datas
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const prevLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

        const firstDayIndex = firstDay.getDay(); // 0 (Dom) a 6 (Sab)
        const totalDaysInMonth = lastDay.getDate();

        //Alinha a semana começando na Segunda-feira
        const daysFromPreviousMonth = (firstDayIndex + 6) % 7;

        //Limita o calendário a no máximo 5 linhas
        const MAX_CELLS = 35;
        const totalCellsOccupied = daysFromPreviousMonth + totalDaysInMonth;
        let nextDays = 0;

        if (totalCellsOccupied < MAX_CELLS) {
            nextDays = MAX_CELLS - totalCellsOccupied;
        }

        //Exibe Mês e Ano
        const months = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto",
            "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        monthYearE1.innerHTML = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

        let days = "";

        //Renderiza dias do Mês Anterior
        for (let x = daysFromPreviousMonth; x > 0; x--) {
            const prevDate = prevLastDay.getDate() - x + 1;
            const dateKey = `${prevLastDay.getFullYear()}-${prevLastDay.getMonth() + 1}-${prevDate}`;
            const hasEvent = events[dateKey] !== undefined;

            days += `<div class="day other-month${hasEvent ? ' has-events' : ''}">${prevDate}</div>`;
        }

        //Renderiza dias do Mês Atual e Limita o loop para respeitar o limite de 35 células pra não aparecer mais de uma semana
        const maxCurrentDay = Math.min(totalDaysInMonth, MAX_CELLS - daysFromPreviousMonth);

        for (let i = 1; i <= maxCurrentDay; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${i}`;
            const hasEvent = events[dateKey] !== undefined;

            let dayClass = 'day';

            //Marca o dia de hoje
            if (
                date.getDate() === new Date().getDate() &&
                date.getMonth() === new Date().getMonth() &&
                date.getFullYear() === new Date().getFullYear()
            ) {
                dayClass += ' today';
            }

            //Marca o dia selecionado
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

        //Renderiza dias do Próximo Mês
        for (let j = 1; j <= nextDays; j++) {
            const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 2}-${j}`;
            const hasEvent = events[dateKey] !== undefined;

            days += `<div class="day other-month${hasEvent ? ' has-events' : ''}">${j}</div>`;
        }

        daysE1.innerHTML = days;

        //Adiciona Event Listeners dos Dias Válidos
        document.querySelectorAll('.day:not(.other-month)').forEach(day => {
            day.addEventListener('click', () => {
                const dateStr = day.getAttribute('data-date');
                const [year, month, dayNum] = dateStr.split('-').map(Number);
                selectedDate = new Date(year, month - 1, dayNum);
                renderCalendar(); //Atualiza a seleção no calendário
                showEvents(dateStr); //Exibe eventos do dia
            });
        });
    }


    //Exibe a lista de eventos para a data selecionada
    function showEvents(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);

        const months = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        const dayNames = [
            "Domingo", "Segunda-feira", "Terça-feira",
            "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"
        ];

        const dayName = dayNames[dateObj.getDay()];

        eventDateE1.textContent = `${dayName}, ${months[dateObj.getMonth()]} ${day}, ${year}`;
        eventListE1.innerHTML = ''; //Limpa eventos anteriores

        //Renderiza a lista de Eventos
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
        } else {
            eventListE1.innerHTML = '<div class="no-events">No events scheduled for this day</div>';
        }
    }

    //Navegação e Botões
    // Mês Anterior
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
        eventDateE1.textContent = 'Selecione uma data';
        eventListE1.innerHTML = '<div class="no-events">Selecione uma data com eventos para visualizá-los aqui</div>';
    });

    //Próximo Mês
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
        eventDateE1.textContent = 'Selecione uma data';
        eventListE1.innerHTML = '<div class="no-events">Selecione uma data com eventos para visualizá-los aqui</div>';
    });

    //Botão "Hoje"
    todayBtn.addEventListener('click', () => {
        currentDate = new Date();
        selectedDate = new Date();
        renderCalendar();

        const today = new Date();
        const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        showEvents(dateStr); // Exibe eventos de hoje
    });

    //Inicializa o calendário
    renderCalendar();

});