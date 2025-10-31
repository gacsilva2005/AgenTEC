class Professor {
    //Variável Privado
    #id;

    //Método construtor da classe
    constructor(id) {
        this.#id = id;
    }

    //Métodos
    criarKit() {}
    agendarSala() {}
    autenticarUsuario() {}
    
    //Métodos getter e setter
    getItemAvulso() {}
    getKit() {}
    getVidraria() {}
    getReagente() {}
    setKit() {}
    setItemAvulso() {}

    //Exemplo dnv do get id privado
    getId() {
        return this.#id;
    }
}