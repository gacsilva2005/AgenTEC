const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Database = require('./conexaoBD');
const Administrador = require('./administrador');
const Professor = require('./professor');
const Tecnico = require('./tecnico');

class Server {
    #app;
    #db;
    #admin;
    #prof;
    #tec;

    constructor(port = 3000) {
        this.#app = express();
        this.#app.use(cors());
        this.#app.use(bodyParser.json());
        this.#app.use(bodyParser.urlencoded({ extended: true }));

        this.#db = new Database({
            host: 'localhost',
            user: 'root',
            password: 'imtdb',
            database: 'laboratorio_agendamentos',
            port: 3306
        });

        this.#admin = new Administrador(null, this.#db);
        this.#prof = new Professor(null, this.#db);
        this.#tec = new Tecnico(null, this.#db);

        this.#configRoutes();
        this.#startServer(port);
    }

    #configRoutes() {
        // LOGIN
        this.#app.post('/login', async (req, res) => {
            const { email, senha } = req.body;
            if (!email || !senha) {
                return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });
            }

            let tipo = '';
            if (email.endsWith('@adm.com')) tipo = 'administrador';
            else if (email.endsWith('@prof.com')) tipo = 'professor';
            else if (email.endsWith('@tec.com')) tipo = 'tecnico';
            else return res.status(400).json({ success: false, message: 'Domínio de e-mail inválido. Use @adm.com, @prof.com ou @tec.com' });

            let result;
            if (tipo === 'administrador') result = await this.#admin.autenticarUsuario(email, senha);
            else if (tipo === 'professor') result = await this.#prof.autenticarUsuario(email, senha);
            else result = await this.#tec.autenticarUsuario(email, senha);

            if (!result.success) return res.status(401).json(result);

            const usuario = result.usuario;
            usuario.tipo = tipo;
            return res.json({ success: true, usuario });
        });

        // CADASTRAR USUÁRIO
        this.#app.post('/api/cadastrar-usuario', async (req, res) => {
            try {
                const { nome, email, senha, funcao } = req.body;
        
                if (!nome || !email || !senha || !funcao) {
                    return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });
                }
        
                // Apenas administradores podem cadastrar
                const resultado = await this.#admin.cadastrarUsuario(nome, email, senha, funcao);
        
                return res.json(resultado);
            } catch (err) {
                console.error('Erro na rota de cadastro:', err);
                return res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário' });
            }
        });
    }

    #startServer(port) {
        this.#app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
    }
}

new Server(3000);
