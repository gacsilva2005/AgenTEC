// Server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Database = require('./conexaoBD');
const Administrador = require('./administrador');

class Server {
    #app;
    #db;
    #admin;

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

        this.#configRoutes();
        this.#startServer(port);
    }

    #configRoutes() {
        this.#app.post('/login', async (req, res) => {
            const { email, senha } = req.body;
            if (!email || !senha)
                return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });

            const result = await this.#admin.autenticarUsuario(email, senha);

            if (!result.success) return res.status(401).json(result);

            return res.json(result);
        });
    }

    #startServer(port) {
        this.#app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
    }
}

// Instancia o servidor
new Server(3000);
