import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Database from "./conexaoBD.js";
import Administrador from "./administrador.js";
import Professor from "./professor.js";
import Tecnico from "./tecnico.js";
import Sistema from "./sistema.js";

class Server {
  #app;
  #db;
  #admin;
  #prof;
  #tec;
  #contasGenericas;

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

    // Contas genéricas pré-definidas
    this.#contasGenericas = {
      'admin@adm.com': {
        senha: 'admin123',
        usuario: {
          id: -1,
          nome: 'Administrador Geral',
          email: 'admin@adm.com',
          tipo: 'administrador'
        }
      },
      'professor@prof.com': {
        senha: 'prof123',
        usuario: {
          id: -2,
          nome: 'Professor Demo',
          email: 'professor@prof.com',
          tipo: 'professor'
        }
      },
      'tecnico@tec.com': {
        senha: 'tec123',
        usuario: {
          id: -3,
          nome: 'Técnico Demo',
          email: 'tecnico@tec.com',
          tipo: 'tecnico'
        }
      }
    };

    this.#configRoutes();
    this.#startServer(port);
  }

  #configRoutes() {
    // -----------------------------
    // LOGIN
    // -----------------------------
    this.#app.post('/login', async (req, res) => {
      const { email, senha } = req.body;
      if (!email || !senha) return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });

      // Primeiro verifica nas contas genéricas
      if (this.#contasGenericas[email]) {
        if (this.#contasGenericas[email].senha === senha) {
          return res.json({ 
            success: true, 
            usuario: this.#contasGenericas[email].usuario 
          });
        } else {
          return res.status(401).json({ success: false, message: 'Senha incorreta' });
        }
      }

      // Se não for conta genérica, verifica no banco de dados
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

    // -----------------------------
    // CADASTRAR USUÁRIO
    // -----------------------------
    this.#app.post('/api/cadastrar-usuario', async (req, res) => {
      try {
        const { nome, email, senha, funcao } = req.body;
        if (!nome || !email || !senha || !funcao) return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });

        if (this.#contasGenericas[email]) {
          return res.status(400).json({ success: false, message: 'Este email é reservado para uso do sistema' });
        }

        const resultado = await this.#admin.cadastrarUsuario(nome, email, senha, funcao);
        return res.json(resultado);
      } catch (err) {
        console.error('Erro na rota de cadastro:', err);
        return res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário' });
      }
    });

    // -----------------------------
    // RECUPERAR SENHA
    // -----------------------------
    this.#app.post('/recuperar-senha', async (req, res) => {
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, message: "Email obrigatório" });

      // Bloqueia recuperação de senha para contas genéricas
      if (this.#contasGenericas[email]) {
        return res.status(400).json({ success: false, message: "Contas genéricas não permitem recuperação de senha" });
      }

      const sistema = new Sistema();
      try {
        await sistema.gerarEEnviarCodigo(email);
        return res.json({ success: true, message: "Código enviado com sucesso!" });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Erro ao enviar código" });
      }
    });
  }

  #startServer(port) {
    this.#app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
  }
}

// Inicia o servidor
new Server(3000);