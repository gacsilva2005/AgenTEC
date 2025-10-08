document.addEventListener("DOMContentLoaded", function() {
    // Variável para armazenar a data selecionada
    let selectedDate = null;
    const confirmBtn = document.getElementById('confirmDateBtn');
    
    // Configura o calendário
    const myCalendar = jsCalendar.new("#calendar", new Date(), {
        // CHAVE: Define o idioma como Português (pt).
        language: "pt", 
        // Habilita a navegação com setas no cabeçalho
        navigator: true, 
        zeroFill: true,
        monthFormat: "month",
        // 0 = Domingo (para corresponder à sua estrutura S, M, T...)
        firstDayOfWeek: 0, 
        showOtherMonths: false,
        // Garante que apenas 1 mês seja exibido
        count: 1 
    });

    // Evento ao clicar em uma data
    myCalendar.onDateClick(function(event, date) {
        // Formata a data para YYYY-MM-DD
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        selectedDate = `${yyyy}-${mm}-${dd}`;
        
        // Habilita o botão e atualiza o texto com a data formatada
        confirmBtn.disabled = false;
        confirmBtn.textContent = `Confirmar ${dd}/${mm}/${yyyy}`;
    });

    // Evento ao clicar no botão de confirmação
    confirmBtn.addEventListener('click', function() {
        if (selectedDate) {
            window.location.href = `reserva_horario.html?data=${selectedDate}`;
        }
    });
});