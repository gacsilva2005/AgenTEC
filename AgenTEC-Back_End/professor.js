class Professor {
    //Variável Privado
    #id;
    #db;

    //Método construtor da classe
    constructor(id, db) {
        this.#id = id;
        this.#db = db;
    }

    //Métodos
    criarKit() {}
    agendarSala() {}
    
    async autenticarUsuario(email, senha) { 
        try {
            const query = 'SELECT * FROM professor WHERE email_professor = ? LIMIT 1';
            const rows = await this.#db.query(query, [email]);

            const user = rows[0];
            if (!user) return { success: false, message: 'Usuário não encontrado' };

            if (user.senha_professor !== senha)
                return { success: false, message: 'Senha incorreta' };

            const usuario = {
                id: user.id_professor,
                nome: user.nome_professor,
                email: user.email_professor
            };

            return { success: true, usuario };
        } catch (err) {
            console.error(err);
            return { success: false, message: 'Erro ao autenticar' };
        }
    }
    
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

export default Professor;