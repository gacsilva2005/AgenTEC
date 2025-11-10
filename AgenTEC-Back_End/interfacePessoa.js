class Pessoa {
    //Variáveis protect
    #nome;
    #email;
    #id;

    //Construtor da classe
    constructor(nome, email, id) {
        this.#nome = nome;
        this.#email = email;
        this.#id = id;
    }

    //Métodos getter e setter
    setNome(nome) {
        this.#nome = nome;
    }

    setId(id) {
        this.#id = id;
    }

    setEmail(email) {
        this.#email = email;
    }

    getNome() {
        return this.#nome;
    }

    getId() {
        return this.#id;
    }

    getEmail() {
        return this.#email;
    }
}