document.addEventListener("DOMContentLoaded", function() {
    let selectedDate = null;
    const confirmBtn = document.getElementById('confirmDateBtn');  
    const myCalendar = jsCalendar.new("#calendar", new Date(), {
        language: "pt", 
        navigator: true, 
        zeroFill: true,
        monthFormat: "month",
        firstDayOfWeek: 0, 
        showOtherMonths: false,
        count: 1 
    });

    myCalendar.onDateClick(function(event, date) {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        selectedDate = `${yyyy}-${mm}-${dd}`;
        
        // Habilita o botão e atualiza o texto com a data formatada
        confirmBtn.disabled = false;
        confirmBtn.textContent = `Confirmar ${dd}/${mm}/${yyyy}`;
    });

    confirmBtn.addEventListener('click', function() {
        if (selectedDate) {
            window.location.href = `reserva_horario.html?data=${selectedDate}`;
        }
    });
});