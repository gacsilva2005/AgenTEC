// administrador.js
class Administrador {
    #id;
    #db;

    constructor(id, db) {
        this.#id = id; // ID do administrador logado
        this.#db = db; // instância da conexão com o banco
    }

    // Cadastrar usuário
    async cadastrarUsuario(nome, email, senha, funcao) {
        try {
            let tabela, colunas, valores;

            switch (funcao.toLowerCase()) {
                case 'administrador':
                    tabela = 'administrador';
                    colunas = ['nome_administrador', 'email_administrador', 'senha_administrador'];
                    valores = [nome, email, senha];
                    break;
                case 'professor':
                    tabela = 'professor';
                    colunas = ['nome_professor', 'email_professor', 'senha_professor', 'administrador_id_administrador'];
                    // Garante que o administrador logado exista
                    if (!this.#id) return { success: false, message: 'Administrador não logado' };
                    valores = [nome, email, senha, this.#id];
                    break;
                case 'tecnico':
                    tabela = 'tecnico';
                    colunas = ['nome_tecnico', 'email_tecnico', 'senha_tecnico', 'administrador_id_administrador'];
                    if (!this.#id) return { success: false, message: 'Administrador não logado' };
                    valores = [nome, email, senha, this.#id];
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

            // Inserir novo usuário
            const insertQuery = `INSERT INTO ${tabela} (${colunas.join(', ')}) VALUES (${colunas.map(() => '?').join(', ')})`;
            const result = await this.#db.query(insertQuery, valores);

            return { success: true, usuarioId: result.insertId, message: 'Usuário cadastrado com sucesso' };
        } catch (err) {
            console.error('Erro ao cadastrar usuário:', err);
            return { success: false, message: 'Erro ao cadastrar usuário' };
        }
    }

    // Autenticar administrador
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

            // Atualiza o ID do administrador logado
            this.#id = user.id_administrador;

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

    // Retorna ID do administrador logado
    getId() {
        return this.#id;
    }
}

export default Administrador;
