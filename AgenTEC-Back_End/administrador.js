class Administrador {
    #id;
    #db;

    constructor(id, db) {
        this.#id = id;
        this.#db = db;
    }

    async autenticarUsuario(email, senha) { 
        try {
            const query = 'SELECT * FROM administrador WHERE email_administrador = ? LIMIT 1';
            const rows = await this.#db.query(query, [email]);

            const user = rows[0];
            if (!user) return { success: false, message: 'Usuário não encontrado' };

            if (user.senha_administrador !== senha)
                return { success: false, message: 'Senha incorreta' };

            return { success: true, user };
        } catch (err) {
            console.error(err);
            return { success: false, message: 'Erro ao autenticar' };
        }
    }

    getId() {
        return this.#id;
    }
}

module.exports = Administrador;
