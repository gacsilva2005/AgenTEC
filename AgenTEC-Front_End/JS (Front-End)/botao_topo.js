// Quando o usuário rolar a página, exibir o botão
window.addEventListener("scroll", function () {
    const btn = document.querySelector(".back-to-top");

    if (window.scrollY > 100) {
        btn.style.display = "flex";
    } else {
        btn.style.display = "none";
    }
});

// Ação do clique para voltar ao topo
document.querySelector(".back-to-top").addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
