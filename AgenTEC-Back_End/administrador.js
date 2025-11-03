class Administrador {
    #id;
    #db;

    constructor(id, db) {
        this.#id = id;
        this.#db = db;
    }

    cadastrarUsuario() {}
    adicionarItemLista() {}
    removerItemLista() {}
    alterarItemLista() {}
    consultarHistorico() {}

    async autenticarUsuario(email, senha) { 
        try {
            const query = 'SELECT * FROM administrador WHERE email_administrador = ? LIMIT 1';
            const rows = await this.#db.query(query, [email]);

            const user = rows[0];
            if (!user) {
                return { success: false, message: 'Usuário não encontrado' };
            }

            if (user.senha_administrador !== senha) {
                return { success: false, message: 'Senha incorreta' };
            }

            const usuario = {
                id: user.id_administrador,
                nome: user.nome_administrador,
                email: user.email_administrador
            };

            return { success: true, usuario: usuario };
        } catch (err) {
            console.error('Erro ao autenticar administrador:', err);
            return { success: false, message: 'Erro ao autenticar' };
        }
    }

    getId() {
        return this.#id;
    }
}

module.exports = Administrador;
