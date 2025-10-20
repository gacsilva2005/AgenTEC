class Sistema {
    //Variáveis
    codigoRecuperacao; //Pública
    #usuarioLogado;    //Privada

    //Construtor da classe
    constructor() {
        this.codigoRecuperacao = 0;
        this.#usuarioLogado = 0;
    }

    //Métodos
    enviarEmail() {}
    gerarCodigoEmail() {}
    salvarCodigo() {}
    validarCodigo() {}
    removerCodigo() {}
    validarDados() {}
    verificarCodigo() {}
    gerarArmazenarCodigo() {} 
    novaSenha() {}
    
    // Getters e Setters de Recuperação
    getEmailRecuperacao() {

    }

    setEmailRecuperacao() {

    }

    setSala() {

    }

    getSala() {

    }

    //Exemplo pra eu lembrar depois de como usar o get e o set de variáveis privadas
    getUsuarioLogado() {
        return this.#usuarioLogado;
    }
    
    setUsuarioLogado(idUsuario) {
        this.#usuarioLogado = idUsuario;
    }
}