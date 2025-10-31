document.addEventListener("DOMContentLoaded", () => {
  const formSection = document.getElementById("formSection");

  // =======================================================
  // Função para montar e adicionar lógica à tela de RECUPERAR SENHA
  // =======================================================
  function switchToForgotPassword() {
      formSection.classList.add("slide-out");

      setTimeout(() => {
          formSection.innerHTML = `
              <a href="#" class="back-login home-link"><span class="material-symbols-outlined">home</span> Voltar</a>
              <h2>Recuperar Senha</h2>
              <form>
                  <div class="input-group">
                      <input type="email" id="recuperaEmail" class="recuperarEmail" required placeholder="">
                      <label for="recuperaEmail">Digite seu Email</label>
                  </div>
                  <button type="submit" class="btn-login">Enviar Código</button>
              </form>
          `;

          formSection.classList.remove("slide-out");
          formSection.classList.add("slide-in");

          // ANEXA O EVENTO DO BOTÃO "VOLTAR" (da tela de Recuperação)
          const backLogin = document.querySelector(".back-login");
          backLogin.addEventListener("click", (e) => {
              e.preventDefault();
              switchToLogin(); // Chama a função que retorna à tela de Login
          });
      }, 400);
  }


  // =======================================================
  // Função para montar e adicionar lógica à tela de LOGIN
  // =======================================================
  function switchToLogin() {
      formSection.classList.add("slide-out");

      setTimeout(() => {
          formSection.innerHTML = `
              <a href="index.html" class="home-link">
                  <span class="material-symbols-outlined">home</span> Home
              </a>
              <h2>Login</h2>
              <form>
                  <div class="input-group">
                      <input type="email" id="email" required placeholder="">
                      <label for="email">Email</label>
                  </div>
                  <div class="input-group">
                      <i class="fas fa-lock"></i>
                      <input type="password" id="senha" required placeholder="">
                      <label for="senha">Senha</label>
                  </div>
                  <button type="submit" class="btn-login">Entrar</button>
              </form>
              <a href="#" class="forgot-password" id="forgotPassword">Esqueceu a senha?</a>
          `;

          formSection.classList.remove("slide-out");
          formSection.classList.add("slide-in");

          // ANEXA O EVENTO DO LINK "ESQUECEU A SENHA?" (da tela de Login)
          const forgotPasswordAgain = document.getElementById("forgotPassword");
          if (forgotPasswordAgain) {
              forgotPasswordAgain.addEventListener("click", (e) => {
                  e.preventDefault();
                  switchToForgotPassword(); // Chama a função que vai para a Recuperação
              });
          }
          
          // Aqui você pode reanexar o event listener de SUBMIT do formulário de Login, se necessário
          // const loginForm = formSection.querySelector('form');
          // loginForm.addEventListener('submit', handleLoginSubmit);

      }, 400);
  }
  
  // =======================================================
  // Inicialização: Anexa o evento inicial ao elemento que já está no DOM
  // =======================================================
  const forgotPasswordInitial = document.getElementById("forgotPassword");
  if (forgotPasswordInitial) {
      forgotPasswordInitial.addEventListener("click", (e) => {
          e.preventDefault();
          switchToForgotPassword();
      });
  }
});