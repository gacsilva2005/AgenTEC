async function carregarAgendamentos() {
    const container = document.getElementById('agendamentos-container');
    const dataFiltro = document.getElementById('filtroData').value;
    const labFiltro = document.getElementById('filtroLaboratorio').value;
    const statusFiltro = document.getElementById('filtroStatus').value;

    container.innerHTML = '<div class="empty-state"><i class="fas fa-spinner fa-spin"></i><p>Carregando...</p></div>';

    try {
        // URL ABSOLUTA → FUNCIONA COM LIVE SERVER, FILE://, TUDO!
        let url = 'http://localhost:3000/api/agendamentos/completos';

        const params = new URLSearchParams();
        if (dataFiltro) params.append('data', dataFiltro);
        if (labFiltro) params.append('laboratorio', labFiltro);
        if (statusFiltro) params.append('status', statusFiltro);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const res = await fetch(url);
        
        // Debug: veja o que está retornando
        console.log("Resposta do servidor:", res.status, res.statusText);

        if (!res.ok) {
            throw new Error(`Erro HTTP ${res.status}`);
        }

        const data = await res.json();
        console.log("Dados recebidos:", data);

        if (!data.success || data.agendamentos.length === 0) {
            container.innerHTML = `<div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <p>Nenhum agendamento encontrado.</p>
            </div>`;
            return;
        }

        container.innerHTML = data.agendamentos.map(ag => `
            <div class="agendamento-card">
                <div class="card-header">
                    <h3>Agendamento #${ag.id_agendamento}</h3>
                    <span class="status-badge status-${ag.status}">${ag.status.toUpperCase()}</span>
                </div>
                <div class="card-body">
                    <div class="info-grid">
                        <div class="info-item">
                            <i class="fas fa-calendar-day"></i>
                            <div><span class="info-label">Data:</span> ${new Date(ag.data_agendamento).toLocaleDateString('pt-BR')}</div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <div><span class="info-label">Horário:</span> ${ag.horario_inicio.substring(0,5)} - ${ag.horario_fim?.substring(0,5) || '—'}</div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-flask"></i>
                            <div><span class="info-label">Laboratório:</span> ${ag.laboratorio_nome || 'Não informado'}</div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-chalkboard-teacher"></i>
                            <div><span class="info-label">Professor:</span> ${ag.professor_nome || 'Não informado'}</div>
                        </div>
                    </div>

                    ${ag.materiais && ag.materiais.length > 0 ? `
                    <div class="materiais-section">
                        <h4 class="materiais-title"><i class="fas fa-vial"></i> Materiais Solicitados</h4>
                        <div class="materiais-list">
                            ${ag.materiais.map(m => `
                                <div class="material-item ${m.tipo}">
                                    <span><strong>${m.nome}</strong></span>
                                    <span>${m.quantidade} ${m.unidade || ''}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>` : '<p style="color:#777; font-style:italic; margin-top:20px;">Nenhum material solicitado.</p>'}
                </div>
            </div>
        `).join('');

    } catch (err) {
        console.error("Erro ao carregar agendamentos:", err);
        container.innerHTML = `<div class="empty-state">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Erro ao carregar dados.</p>
            <small>${err.message}</small>
        </div>`;
    }
}

// Carrega automaticamente ao abrir a página
window.addEventListener('DOMContentLoaded', carregarAgendamentos);