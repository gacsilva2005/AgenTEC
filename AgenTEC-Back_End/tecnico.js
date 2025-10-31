class Tecnico {
    //Variável Privado
    #id;

    //Construtor da classe
    constructor(id) {
        this.#id = id;
    }

    //Métodos
    atualizarEstoque() {}
    registrarFalta() {}
    registrarQuebra() {}
    autenticarUsuario() {}
    visualizarKits() {}
    consultarAgendamentos() {}

    //Exemplo dnv do get id privado
    getId() {
        return this.#id;
    }
}