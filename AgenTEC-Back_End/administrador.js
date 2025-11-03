// administrador.js
class Administrador {
    #id;
    #db;

    constructor(id, db) {
        this.#id = id;
        this.#db = db;
    }

    async cadastrarUsuario(nome, email, senha, funcao) {
        try {
            let tabela, colunas;

            switch (funcao.toLowerCase()) {
                case 'administrador':
                    tabela = 'administrador';
                    colunas = ['nome_administrador', 'email_administrador', 'senha_administrador'];
                    break;
                case 'professor':
                    tabela = 'professor';
                    colunas = ['nome_professor', 'email_professor', 'senha_professor'];
                    break;
                case 'tecnico':
                    tabela = 'tecnico';
                    colunas = ['nome_tecnico', 'email_tecnico', 'senha_tecnico'];
                    break;
                default:
                    return { success: false, message: 'Função inválida' };
            }

            // Verifica se o e-mail já existe
            const verificarQuery = `SELECT * FROM ${tabela} WHERE ${colunas[1]} = ? LIMIT 1`;
            const rows = await this.#db.query(verificarQuery, [email]);
            if (rows.length > 0) {
                return { success: false, message: 'E-mail já cadastrado' };
            }

            // Inserir novo usuário sem hash
            const insertQuery = `INSERT INTO ${tabela} (${colunas.join(', ')}) VALUES (?, ?, ?)`;
            const result = await this.#db.query(insertQuery, [nome, email, senha]);

            return { success: true, usuarioId: result.insertId, message: 'Usuário cadastrado com sucesso' };
        } catch (err) {
            console.error('Erro ao cadastrar usuário:', err);
            return { success: false, message: 'Erro ao cadastrar usuário' };
        }
    }

    async autenticarUsuario(email, senha) { 
        try {
            const query = 'SELECT * FROM administrador WHERE email_administrador = ? LIMIT 1';
            const rows = await this.#db.query(query, [email]);

            if (!rows || rows.length === 0) {
                return { success: false, message: 'Usuário não encontrado' };
            }

            const user = rows[0];

            if (user.senha_administrador !== senha) {
                return { success: false, message: 'Senha incorreta' };
            }

            const usuario = {
                id: user.id_administrador,
                nome: user.nome_administrador,
                email: user.email_administrador
            };

            return { success: true, usuario };
        } catch (err) {
            console.error('Erro ao autenticar administrador:', err);
            return { success: false, message: 'Erro ao autenticar' };
        }
    }

    adicionarItemLista() {}
    removerItemLista() {}
    alterarItemLista() {}
    consultarHistorico() {}

    getId() {
        return this.#id;
    }
}

module.exports = Administrador;
