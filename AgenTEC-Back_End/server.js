const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Database = require('./conexaoBD');
const Administrador = require('./administrador');
const Professor = require('./professor');

class Server {
    #app;
    #db;
    #admin;
    #prof;

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

        this.#configRoutes();
        this.#startServer(port);
    }

    #configRoutes() {
        this.#app.post('/login', async (req, res) => {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({
                    success: false,
                    message: 'Email e senha são obrigatórios'
                });
            }

            let tipo = '';
            if (email.endsWith('@adm.com')) {
                tipo = 'administrador';
            } else if (email.endsWith('@prof.com')) {
                tipo = 'professor';
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Domínio de e-mail inválido. Use @adm.com ou @prof.com'
                });
            }

            let result;
            if (tipo === 'administrador') {
                result = await this.#admin.autenticarUsuario(email, senha);
            } else {
                result = await this.#prof.autenticarUsuario(email, senha);
            }

            if (!result.success) {
                // Se falhar, retorna o erro e NÃO tenta acessar result.usuario
                return res.status(401).json(result);
            }

            // SE CHEGAR AQUI, O LOGIN FOI BEM-SUCEDIDO.
            // O objeto 'result' DEVE conter 'result.usuario'.

            // Padroniza para o que o login.js espera
            const usuario = result.usuario; // Linha 70
            usuario.tipo = tipo; // Linha 71 - Agora 'usuario' é um objeto válido!

            return res.json({
                success: true,
                usuario
            });
        });
    }

    #startServer(port) {
        this.#app.listen(port, () =>
            console.log(`Servidor rodando na porta ${port}`)
        );
    }
}

new Server(3000);
