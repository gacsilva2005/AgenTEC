class Administrador {
    //Variável Privado
    #id;

    //Método construtor da classe
    constructor(id) {
        this.#id = id;
    }

    //Métodos
    cadastrarUsuario() {}
    adicionarItemLista() {}
    removerItemLista() {}
    alterarItemLista() {}
    autenticarUsuario() {}
    consultarHistorico() {}

    //Exemplo dnv do get id privado
    getId() {
        return this.#id;
    }
}