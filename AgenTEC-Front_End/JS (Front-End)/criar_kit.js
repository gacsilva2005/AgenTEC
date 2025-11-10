document.addEventListener('DOMContentLoaded', function () {
    const kitItems = document.querySelectorAll('.kit-item');
    const mainView = document.querySelector('.kit-main-view');
    const historyBtn = document.getElementById('history-btn');
    // ID ATUALIZADO: back-to-professor-float
    const backButton = document.getElementById('back-to-professor-float'); 

    mainView.innerHTML = '<p class="placeholder">Aguardando seleção de kit...</p>';

    // Adicionar evento de clique para o botão Voltar (flutuante)
    backButton.addEventListener('click', function() {
        window.location.href = 'professor.html'; // Redireciona para professor.html
    });
    
    // Seleção e ações básicas
    kitItems.forEach((item, index) => {
        const kitButton = item.querySelector('.kit-btn');
        const renameButton = item.querySelector('.renomear');
        const deleteButton = item.querySelector('.deletar');
        const accessButton = item.querySelector('.acessar');

        kitButton.addEventListener('click', function () {
            kitItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });

        accessButton.addEventListener('click', function (event) {
            event.stopPropagation();
            const nomeKit = kitButton.textContent.trim();
            mainView.innerHTML = `<p> Exibindo informações de <strong>${nomeKit}</strong></p>`;
            showMessage(`Kit "${nomeKit}" acessado.`, true);
        });

        deleteButton.addEventListener('click', function (event) {
            event.stopPropagation();
            openPopupConfirm({
                message: "Deseja realmente limpar os dados do kit?",
                onConfirm: () => {
                    const kitNum = index + 1;
                    kitButton.textContent = `Kit ${kitNum}`;
                    mainView.innerHTML = '<p class="placeholder">Aguardando seleção de kit...</p>';
                    showMessage("Kit redefinido com sucesso!", true);
                },
                onCancel: () => {
                    showMessage("Ação cancelada.", false);
                }
            });
        });

        renameButton.addEventListener('click', function (event) {
            event.stopPropagation();
            openPopupRename({
                currentName: kitButton.textContent,
                onConfirm: (novoNome) => {
                    if (novoNome && novoNome.trim() !== "") {
                        kitButton.textContent = novoNome.trim();
                        showMessage("Kit renomeado com sucesso!", true);
                    } else {
                        showMessage("Nome inválido. Nenhuma alteração feita.", false);
                    }
                }
            });
        });
    });

    // === Botão de Histórico ===
    historyBtn.addEventListener('click', () => {
        openHistoryPopup();
    });

    // Funções de Pop-ups reutilizáveis
    function openPopupConfirm({ message, onConfirm, onCancel }) {
        const overlay = document.createElement('div');
        overlay.classList.add('popup-overlay');
        overlay.innerHTML = `
            <div class="popup">
                <h3>${message}</h3>
                <button id="confirmar">Confirmar</button>
                <button id="cancelar">Cancelar</button>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.style.display = 'flex';

        overlay.querySelector('#confirmar').addEventListener('click', () => {
            overlay.remove();
            onConfirm();
        });

        overlay.querySelector('#cancelar').addEventListener('click', () => {
            overlay.remove();
            onCancel();
        });
    }

    function openPopupRename({ currentName, onConfirm }) {
        const overlay = document.createElement('div');
        overlay.classList.add('popup-overlay');
        overlay.innerHTML = `
            <div class="popup">
                <h3>Renomear Kit</h3>
                <input type="text" id="novoNome" value="${currentName}">
                <div>
                    <button id="confirmar">Confirmar</button>
                    <button id="cancelar">Cancelar</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.style.display = 'flex';
        const input = overlay.querySelector('#novoNome');
        input.focus();

        overlay.querySelector('#confirmar').addEventListener('click', () => {
            const novoNome = input.value;
            overlay.remove();
            onConfirm(novoNome);
        });

        overlay.querySelector('#cancelar').addEventListener('click', () => {
            overlay.remove();
            showMessage("Ação cancelada.", false);
        });
    }

    function openHistoryPopup() {
        const overlay = document.createElement('div');
        overlay.classList.add('popup-overlay');
        overlay.innerHTML = `
            <div class="popup large">
                <h3>Último pedido</h3>
                <div class="materials-list">
                    <ul>
                        <li>Cabo Vinicius Tipo A</li>
                        <li>Placa do Uno</li>
                        <li>Cabo Vinicius Tipo B</li>
                        <li>Cabo Vinicius Tipo C</li>
                        <li>Cabo Vinicius Tipo D</li>
                        <li>Cabo Vinicius Tipo gay</li>
                        <li>Cabo Vinicius Tipo gay</li>
                        <li>Cabo Vinicius Tipo gay</li>
                        <li>Cabo Vinicius Tipo gay</li>
                        <li>Cabo Vinicius Tipo gay</li>
                        <li>Cabo Vinicius Tipo gay</li>
                    
                    </ul>
                </div>
                <div> 
                    <button id="salvarComo">Salvar como</button>
                    <button id="voltar">Voltar</button> 
                </div>
            </div>
        `;

        overlay.querySelector('#voltar').addEventListener('click', () => overlay.remove());
        document.body.appendChild(overlay);
        overlay.style.display = 'flex';
        overlay.querySelector('#salvarComo').addEventListener('click', () => {
        overlay.remove();

            openSalvarComoPopup();
        });
    }

    function openSalvarComoPopup() {
        const overlay = document.createElement('div');
        overlay.classList.add('popup-overlay');
        overlay.innerHTML = `
            <div class="popup">
                <h3>Salvar conteúdo em:</h3>
                <div id="kitOptions">
                    ${Array.from({ length: 6 }, (_, i) => `<button class="kitOption">Kit ${i + 1}</button>`).join('')}
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.style.display = 'flex';

        overlay.querySelectorAll('.kitOption').forEach(btn => {
            btn.addEventListener('click', () => {
                const nomeKit = btn.textContent;
                overlay.remove();
                openPopupConfirm({
                    message: `Deseja substituir o conteúdo de ${nomeKit}?`,
                    onConfirm: () => {
                        overlay.remove();
                        openPopupRename({
                            currentName: nomeKit,
                            onConfirm: (novoNome) => {
                                showMessage(`Conteúdo salvo em "${novoNome}"!`, true);
                            }
                        });
                    },
                    onCancel: () => {
                        showMessage("Ação cancelada.", false);
                    }
                });
            });
        });
    }

    // Mensagem flutuante
    function showMessage(text, success) {
        const msg = document.createElement('div');
        msg.classList.add('popup-message');
        msg.textContent = text;
        msg.style.backgroundColor = success ? '#d4edda' : '#f8d7da';
        msg.style.color = success ? '#155724' : '#721c24';
        document.body.appendChild(msg);
        msg.style.display = 'block';
        setTimeout(() => {
            msg.remove();
        }, 2500);
    }
});


window.addEventListener('DOMContentLoaded', () => { 
    const params = new URLSearchParams(window.location.search);
    if (params.get('reserva') === 'sucesso') {
        // Se 'notification' for um ID válido no seu HTML, descomente o bloco abaixo.
        /*
        const notification = document.getElementById('notification');
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000); 
        */
    }
});