document.addEventListener("DOMContentLoaded", function() {
    // Variável para armazenar a data selecionada
    let selectedDate = null;
    const confirmBtn = document.getElementById('confirmDateBtn');
    
    // Configura o calendário
    const myCalendar = jsCalendar.new("#calendar", new Date(), {
        language: "pt", // Importante para ter a formatação PT-BR
        navigator: true, // Habilita a navegação com setas no cabeçalho
        zeroFill: true,
        monthFormat: "month",
        firstDayOfWeek: 0, // 0 = Domingo (Sunday)
        showOtherMonths: false,
        count: 1 // Garante que apenas 1 mês seja exibido
    });

    // Evento ao clicar em uma data
    myCalendar.onDateClick(function(event, date) {
        // Formata a data para YYYY-MM-DD
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        selectedDate = `${yyyy}-${mm}-${dd}`;
        confirmBtn.disabled = false;
        confirmBtn.textContent = `Confirmar ${dd}/${mm}/${yyyy}`;
    });

    confirmBtn.addEventListener('click', function() {
        if (selectedDate) {
            window.location.href = `reserva_horario.html?data=${selectedDate}`;
        }
    });
});