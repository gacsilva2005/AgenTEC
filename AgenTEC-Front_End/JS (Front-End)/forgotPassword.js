document.addEventListener("DOMContentLoaded", () => {
  const formSection = document.getElementById("formSection");
  const logoSection = document.querySelector(".logo-section");
  const DURATION = 400; // deve bater com o CSS (0.4s)

  // Templates HTML
  const loginHTML = `
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

  const recoveryHTML = `
    <a href="#" class="back-login home-link"><span class="material-symbols-outlined">home</span> Voltar</a>
    <h2>Recuperar Senha</h2>
    <form id="recoverForm">
      <div class="input-group">
        <input type="email" id="recuperaEmail" class="recuperarEmail" required placeholder="">
        <label for="recuperaEmail">Digite seu Email</label>
      </div>
      <button type="submit" class="btn-login">Enviar Código</button>
    </form>
  `;

  // Funções para esconder/mostrar logos (usa style direto para evitar problemas com classes)
  function hideLogos() {
    if (!logoSection) return;
    logoSection.style.transition = `opacity ${DURATION}ms ease, transform ${DURATION}ms ease`;
    logoSection.style.opacity = "0";
    logoSection.style.transform = "translateX(-20px)";
    logoSection.style.pointerEvents = "none";
  }

  function showLogos() {
    if (!logoSection) return;
    // delay para esperar a animacao de entrada terminar
    setTimeout(() => {
      logoSection.style.opacity = "1";
      logoSection.style.transform = "translateX(0)";
      logoSection.style.pointerEvents = "auto";
    }, DURATION / 2); // meio do tempo para ficar mais natural (ajusta se quiser)
  }

  // Força troca de conteúdo com animação (robusto)
  function replaceWith(html) {
    // Primeiro, esconde as logos
    hideLogos();

    // Remove slide-in caso exista e dispara slide-out
    formSection.classList.remove("slide-in");
    // forçar que slide-in seja removido antes de adicionar outro
    // eslint-disable-next-line no-unused-expressions
    formSection.offsetWidth;
    formSection.classList.add("slide-out");

    // após DURATION, trocamos conteúdo
    setTimeout(() => {
      formSection.innerHTML = html;

      // garante que slide-out foi removido e força reflow usando rAF
      formSection.classList.remove("slide-out");

      // forçar reflow de forma robusta antes de adicionar slide-in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          formSection.classList.add("slide-in");
        });
      });

      // mostra as logos após a entrada iniciar
      showLogos();
    }, DURATION);
  }

  // Delegação: eventos de clique (funciona mesmo após innerHTML trocado)
  formSection.addEventListener("click", (e) => {
    const forgot = e.target.closest(".forgot-password");
    const back = e.target.closest(".back-login");

    if (forgot) {
      e.preventDefault();
      replaceWith(recoveryHTML);
      return;
    }

    if (back) {
      e.preventDefault();
      replaceWith(loginHTML);
      return;
    }
  });

  // Delegação: submit do formulário de recuperação
  formSection.addEventListener("submit", (e) => {
    const target = e.target;
    if (target && target.id === "recoverForm") {
      e.preventDefault();
      const btn = target.querySelector(".btn-login");
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Enviando...";
      }
      // Simula envio e volta ao login
      setTimeout(() => {
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Enviar Código";
        }
        alert("Se o e-mail existir, um código foi enviado.");
        replaceWith(loginHTML);
      }, 1000);
    }
  });

  // Garante que o estado inicial esteja consistente
  if (!formSection.classList.contains("slide-in")) {
    formSection.classList.add("slide-in");
  }
});
