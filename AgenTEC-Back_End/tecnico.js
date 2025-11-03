class Tecnico {
    //Variável Privado
    #id;
    #db;

    //Construtor da classe
    constructor(id, db) {
        this.#id = id;
        this.#db = db;
    }

    //Métodos
    atualizarEstoque() {}
    registrarFalta() {}
    registrarQuebra() {}

    async autenticarUsuario(email, senha) { 
        try {
            const query = 'SELECT * FROM tecnico WHERE email_tecnico = ? LIMIT 1';
            const rows = await this.#db.query(query, [email]);

            const user = rows[0];
            if (!user) {
                return { success: false, message: 'Usuário não encontrado' };
            }

            if (user.senha_tecnico !== senha) {
                return { success: false, message: 'Senha incorreta' };
            }

            const usuario = {
                id: user.id_tecnico,
                nome: user.nome_tecnico,
                email: user.email_tecnico
            };

            return { success: true, usuario: usuario };
        } catch (err) {
            console.error('Erro ao autenticar tecnico:', err);
            return { success: false, message: 'Erro ao autenticar' };
        }
    }

    visualizarKits() {}
    consultarAgendamentos() {}

    //Exemplo dnv do get id privado
    getId() {
        return this.#id;
    }
}

module.exports = Tecnico;