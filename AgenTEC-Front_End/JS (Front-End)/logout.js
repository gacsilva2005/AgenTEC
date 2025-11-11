const logoutButton = document.getElementById('btn-logout');

            // 2. Adiciona um "ouvinte" de clique no botão
            if (logoutButton) {
                logoutButton.addEventListener('click', function () {
                    logout(); // Chama a nossa função de logout
                });
            }

            /**
             * Função de Logout
             * Limpa a sessão/memória de login e redireciona para a tela inicial.
             */
            function logout() {
                console.log("Deslogando usuário...");

                // 3. Limpa a memória de login
                // ASSUMIMOS que você salva o usuário em localStorage com a chave 'loggedInUserType'
                // Se o nome da sua chave for outro (ex: 'usuario_logado'), troque abaixo.
                localStorage.removeItem('loggedInUserType');

                // Se você usar sessionStorage, descomente a linha abaixo:
                // sessionStorage.clear(); 

                // 4. Redireciona o usuário para a tela inicial (index.html)
                window.location.href = '../login.html';
            }
