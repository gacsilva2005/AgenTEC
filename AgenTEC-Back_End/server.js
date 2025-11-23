import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Database from "./conexaoBD.js";
import Administrador from "./administrador.js";
import Professor from "./professor.js";
import Tecnico from "./tecnico.js";
import Sistema from "./sistema.js";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    // Inicializa as classes com null (ID será definido no login)
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

  #calcularHorarioFim(horarioInicio) {
    const [horas, minutos] = horarioInicio.split(':').map(Number);
    const data = new Date();
    data.setHours(horas, minutos, 0, 0);
    data.setHours(data.getHours() + 1); // Adiciona 1 hora

    // Formata o resultado para HH:MM
    const novaHora = String(data.getHours()).padStart(2, '0');
    const novoMinuto = String(data.getMinutes()).padStart(2, '0');
    return `${novaHora}:${novoMinuto}`;
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
      try {
        if (tipo === 'administrador') result = await this.#admin.autenticarUsuario(email, senha);
        else if (tipo === 'professor') result = await this.#prof.autenticarUsuario(email, senha);
        else result = await this.#tec.autenticarUsuario(email, senha);

        if (!result.success) return res.status(401).json(result);

        // Atualiza a instância com o ID do usuário logado
        if (tipo === 'administrador') {
          this.#admin = new Administrador(result.usuario.id, this.#db);
        } else if (tipo === 'professor') {
          this.#prof = new Professor(result.usuario.id, this.#db);
        } else if (tipo === 'tecnico') {
          this.#tec = new Tecnico(result.usuario.id, this.#db);
        }

        const usuario = result.usuario;
        usuario.tipo = tipo;
        return res.json({ success: true, usuario });
      } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ success: false, message: 'Erro interno no servidor' });
      }
    });

    // -----------------------------
    // VERIFICAR AGENDAMENTOS POR DATA
    // -----------------------------
    this.#app.get('/api/agendamentos/:data', async (req, res) => {
      try {
        const { data } = req.params;

        // Validação da data
        if (!data || typeof data !== 'string') {
          return res.status(400).json({
            success: false,
            message: 'Data é obrigatória'
          });
        }

        // Tenta converter para formato de data válido
        const dataFormatada = new Date(data);
        if (isNaN(dataFormatada.getTime())) {
          return res.status(400).json({
            success: false,
            message: 'Data inválida'
          });
        }

        // Formata a data para YYYY-MM-DD
        const dataSQL = dataFormatada.toISOString().split('T')[0];
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas a data

        // VALIDAÇÃO: Verifica se a data é anterior à data atual
        if (dataFormatada < hoje) {
          return res.json({
            success: true,
            totalAgendamentos: 0,
            podeAgendar: false,
            message: 'Não é possível agendar para datas passadas.'
          });
        }

        console.log(`Verificando agendamentos para: ${dataSQL}`);

        const query = 'SELECT COUNT(*) as total_agendamentos FROM agendamentos WHERE data_agendamento = ?';
        const result = await this.#db.query(query, [dataSQL]);

        const totalAgendamentos = result[0]?.total_agendamentos || 0;
        const podeAgendar = totalAgendamentos < 3;

        return res.json({
          success: true,
          totalAgendamentos,
          podeAgendar,
          message: podeAgendar
            ? `Há ${3 - totalAgendamentos} vaga(s) disponível(is) para ${dataSQL}.`
            : `Data ${dataSQL} lotada! Máximo de 3 agendamentos por dia atingido.`
        });
      } catch (err) {
        console.error('Erro ao verificar agendamentos:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro interno do servidor ao verificar disponibilidade'
        });
      }
    });

    // -----------------------------
    // CRIAR AGENDAMENTO
    // -----------------------------
    this.#app.post('/api/agendamentos', async (req, res) => {
      try {
        const { data_agendamento, horario_inicio, horario_fim, laboratorio, professor_id, materia } = req.body;

        if (!data_agendamento || !horario_inicio || !laboratorio || !professor_id || !materia) {
          return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });
        }

        // VALIDAÇÃO: Verifica se a data não é passada
        const dataAgendamento = new Date(data_agendamento);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas a data

        if (dataAgendamento < hoje) {
          return res.status(400).json({
            success: false,
            message: 'Não é possível agendar para datas passadas.'
          });
        }

        // VALIDAÇÃO: Se for hoje, verifica se o horário não é passado
        if (dataAgendamento.getTime() === hoje.getTime()) {
          const agora = new Date();
          const [horas, minutos] = horario_inicio.split(':').map(Number);
          const horarioAgendamento = new Date();
          horarioAgendamento.setHours(horas, minutos, 0, 0);

          if (horarioAgendamento < agora) {
            return res.status(400).json({
              success: false,
              message: 'Não é possível agendar para horários passados no dia de hoje.'
            });
          }
        }

        // Se horario_fim não foi fornecido, calcula como 1 hora depois do início
        const horarioFim = horario_fim || this.#calcularHorarioFim(horario_inicio);

        // Primeiro verifica se ainda há vagas
        const countQuery = 'SELECT COUNT(*) as total FROM agendamentos WHERE data_agendamento = ?';
        const countResult = await this.#db.query(countQuery, [data_agendamento]);

        if (countResult[0].total >= 3) {
          return res.status(400).json({ success: false, message: 'Data lotada! Máximo de 3 agendamentos por dia.' });
        }

        // Verifica se já existe agendamento no mesmo horário e laboratório
        const duplicateQuery = `
          SELECT COUNT(*) as total 
          FROM agendamentos 
          WHERE data_agendamento = ? 
          AND id_laboratorio = ? 
          AND (
            (horario_inicio <= ? AND horario_fim > ?) OR
            (horario_inicio < ? AND horario_fim >= ?) OR
            (horario_inicio >= ? AND horario_fim <= ?)
          )
        `;
        const duplicateResult = await this.#db.query(duplicateQuery, [
          data_agendamento, laboratorio,
          horario_inicio, horario_inicio,
          horarioFim, horarioFim,
          horario_inicio, horarioFim
        ]);

        if (duplicateResult[0].total > 0) {
          return res.status(400).json({ success: false, message: 'Já existe um agendamento para este horário e laboratório.' });
        }

        const insertQuery = `
          INSERT INTO agendamentos 
          (data_agendamento, horario_inicio, horario_fim, id_laboratorio, id_professor, observacoes, status) 
          VALUES (?, ?, ?, ?, ?, ?, 'pendente')
        `;
        const insertResult = await this.#db.query(insertQuery, [
          data_agendamento,
          horario_inicio,
          horarioFim,
          laboratorio,
          professor_id,
          materia
        ]);

        return res.json({
          success: true,
          message: 'Agendamento realizado com sucesso!',
          agendamentoId: insertResult.insertId
        });
      } catch (err) {
        console.error('Erro ao criar agendamento:', err);
        return res.status(500).json({ success: false, message: 'Erro ao criar agendamento' });
      }
    });

    // -----------------------------
    // OBTER HORÁRIOS DISPONÍVEIS POR DATA
    // -----------------------------
    this.#app.get('/api/horarios-disponiveis/:data', async (req, res) => {
      try {
        const { data } = req.params;

        // Validação da data
        if (!data || typeof data !== 'string') {
          return res.status(400).json({
            success: false,
            message: 'Data é obrigatória'
          });
        }

        // Tenta converter para formato de data válido
        const dataFormatada = new Date(data);
        if (isNaN(dataFormatada.getTime())) {
          return res.status(400).json({
            success: false,
            message: 'Data inválida'
          });
        }

        // Formata a data para YYYY-MM-DD
        const dataSQL = dataFormatada.toISOString().split('T')[0];

        // Define todos os horários possíveis (manhã e tarde)
        const todosHorarios = [
          // Manhã
          { horario: '07:00', periodo: 'manha', aula: '1º aula' },
          { horario: '08:00', periodo: 'manha', aula: '2º aula' },
          { horario: '09:00', periodo: 'manha', aula: '3º aula' },
          { horario: '10:00', periodo: 'manha', aula: '4º aula' },
          { horario: '11:00', periodo: 'manha', aula: '5º aula' },
          { horario: '12:00', periodo: 'manha', aula: '6º aula' },
          // Tarde
          { horario: '13:00', periodo: 'tarde', aula: '1º aula' },
          { horario: '14:00', periodo: 'tarde', aula: '2º aula' },
          { horario: '15:00', periodo: 'tarde', aula: '3º aula' },
          { horario: '16:00', periodo: 'tarde', aula: '4º aula' },
          { horario: '17:00', periodo: 'tarde', aula: '5º aula' },
          { horario: '18:00', periodo: 'tarde', aula: '6º aula' }
        ];

        // Busca agendamentos existentes para esta data
        const agendamentosQuery = `
      SELECT horario_inicio, horario_fim, id_laboratorio 
      FROM agendamentos 
      WHERE data_agendamento = ? AND status != 'cancelado'
    `;
        const agendamentos = await this.#db.query(agendamentosQuery, [dataSQL]);

        // Filtra horários disponíveis
        const horariosDisponiveis = todosHorarios.filter(horario => {
          // Verifica se este horário está conflitando com algum agendamento existente
          const conflito = agendamentos.some(agendamento => {
            const agendamentoInicio = agendamento.horario_inicio;
            const agendamentoFim = agendamento.horario_fim;
            const horarioAtual = horario.horario;

            // Verifica se há sobreposição de horários
            return (horarioAtual >= agendamentoInicio && horarioAtual < agendamentoFim) ||
              (agendamentoInicio <= horarioAtual && agendamentoFim > horarioAtual);
          });

          return !conflito;
        });

        // Agrupa por período
        const horariosManha = horariosDisponiveis.filter(h => h.periodo === 'manha');
        const horariosTarde = horariosDisponiveis.filter(h => h.periodo === 'tarde');

        return res.json({
          success: true,
          horariosDisponiveis,
          horariosManha,
          horariosTarde,
          totalDisponiveis: horariosDisponiveis.length,
          message: `Encontrados ${horariosDisponiveis.length} horários disponíveis para ${dataSQL}`
        });
      } catch (err) {
        console.error('Erro ao obter horários disponíveis:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro interno do servidor ao buscar horários disponíveis'
        });
      }
    });

    // -----------------------------
    // LISTAR LABORATÓRIOS
    // -----------------------------
    this.#app.get('/api/laboratorios', async (req, res) => {
      try {
        console.log('📋 Buscando laboratórios no banco de dados...');

        const query = `
            SELECT 
                id_laboratorio, 
                nome, 
                capacidade, 
                localizacao
            FROM laboratorios 
            ORDER BY nome
        `;

        const laboratorios = await this.#db.query(query);

        console.log(`✅ Encontrados ${laboratorios.length} laboratórios`);

        res.json({
          success: true,
          laboratorios,
          total: laboratorios.length
        });

      } catch (err) {
        console.error('❌ Erro ao listar laboratórios:', err);
        res.status(500).json({
          success: false,
          message: 'Erro ao listar laboratórios: ' + err.message
        });
      }
    });

    // -----------------------------
    // CADASTRAR USUÁRIO
    // -----------------------------
    this.#app.post('/api/cadastrar-usuario', async (req, res) => {
      try {
        const { nome, email, senha, funcao } = req.body;
        if (!nome || !email || !senha || !funcao) {
          return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });
        }

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

    // -----------------------------
    // ROTA DE TESTE DO BANCO - PARA DEBUG
    // -----------------------------
    this.#app.get('/teste-banco', async (req, res) => {
      try {
        // Testa todas as tabelas importantes
        const tables = await this.#db.query('SHOW TABLES');
        const administradores = await this.#db.query('SELECT * FROM administrador LIMIT 5');
        const professores = await this.#db.query('SELECT * FROM professor LIMIT 5');
        const tecnicos = await this.#db.query('SELECT * FROM tecnico LIMIT 5');
        const agendamentos = await this.#db.query('SELECT * FROM agendamentos LIMIT 5');
        const laboratorios = await this.#db.query('SELECT * FROM laboratorios LIMIT 5');

        res.json({
          success: true,
          message: 'Conexão OK',
          tables: tables,
          administradores: administradores,
          professores: professores,
          tecnicos: tecnicos,
          agendamentos: agendamentos,
          laboratorios: laboratorios
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Erro no banco',
          error: error.message
        });
      }
    });

    // -----------------------------
    // LISTAR LABORATÓRIOS
    // -----------------------------
    this.#app.get('/api/laboratorios', async (req, res) => {
      try {
        const laboratorios = await this.#db.query('SELECT * FROM laboratorios');
        res.json({ success: true, laboratorios });
      } catch (err) {
        console.error('Erro ao listar laboratórios:', err);
        res.status(500).json({ success: false, message: 'Erro ao listar laboratórios' });
      }
    });

    // -----------------------------
    // LISTAR AGENDAMENTOS DO PROFESSOR
    // -----------------------------
    this.#app.get('/api/meus-agendamentos/:professor_id', async (req, res) => {
      try {
        const { professor_id } = req.params;

        const query = `
          SELECT a.*, l.nome as nome_laboratorio 
          FROM agendamentos a 
          JOIN laboratorios l ON a.id_laboratorio = l.id_laboratorio 
          WHERE a.id_professor = ? 
          ORDER BY a.data_agendamento DESC, a.horario_inicio DESC
        `;
        const agendamentos = await this.#db.query(query, [professor_id]);

        res.json({ success: true, agendamentos });
      } catch (err) {
        console.error('Erro ao listar agendamentos:', err);
        res.status(500).json({ success: false, message: 'Erro ao listar agendamentos' });
      }
    });

    // -----------------------------
    // LISTAR VIDRARIAS (Do arquivo JSON)
    // -----------------------------
    this.#app.get('/api/vidrarias', async (req, res) => {
      try {
        // Caminho absoluto - ajuste conforme sua estrutura de pastas
        const pathJson = path.join(__dirname, '..', 'AgenTEC-DataBase-(JSON)', 'vidrarias.json');

        console.log('📁 Tentando ler arquivo:', pathJson);

        // Verifica se o arquivo existe
        if (!fs.existsSync(pathJson)) {
          console.error('❌ Arquivo não encontrado:', pathJson);

          // Lista o diretório para debug
          const dirPath = path.join(__dirname, 'AgenTEC-DataBase-(JSON)');
          console.log('📂 Conteúdo do diretório:', fs.existsSync(dirPath) ? fs.readdirSync(dirPath) : 'Diretório não existe');

          return res.status(404).json({
            success: false,
            message: 'Arquivo vidrarias.json não encontrado'
          });
        }

        const data = fs.readFileSync(pathJson, 'utf8');
        console.log('✅ Arquivo lido com sucesso');

        const vidrarias = JSON.parse(data);
        const vidrariasAgrupadas = processarVidrarias(vidrarias);

        res.json({
          success: true,
          itens: vidrariasAgrupadas,
          total: vidrariasAgrupadas.length
        });

      } catch (err) {
        console.error('❌ Erro ao carregar vidrarias:', err);
        res.status(500).json({
          success: false,
          message: 'Erro ao carregar lista de vidrarias: ' + err.message
        });
      }
    });

    // Função para processar e agrupar as vidrarias
    function processarVidrarias(vidrarias) {
      const agrupadas = {};

      vidrarias.forEach(item => {
        const nome = item.nome;

        if (!agrupadas[nome]) {
          agrupadas[nome] = {
            nome: nome,
            variacoes: [],
            quantidadeTotal: 0
          };
        }

        // Cria a descrição da capacidade
        let descricao = '';
        if (item.capacidade && item.unidade) {
          descricao = `${item.capacidade} ${item.unidade}`;
        } else if (item.capacidade) {
          descricao = `${item.capacidade}`;
        } else {
          descricao = 'Padrão';
        }

        // Verifica se já existe esta variação
        const variacaoExistente = agrupadas[nome].variacoes.find(v => v.descricao === descricao);

        if (variacaoExistente) {
          variacaoExistente.quantidade += 1;
        } else {
          agrupadas[nome].variacoes.push({
            descricao: descricao,
            capacidade: item.capacidade,
            unidade: item.unidade,
            quantidade: 1,
            ids: [item.id]
          });
        }

        agrupadas[nome].quantidadeTotal += 1;
      });


      return Object.values(agrupadas).map(item => ({
        ...item,
        tipo: categorizarVidraria(item.nome)
      }));
    }

    // Função para categorizar as vidrarias por tipo
    function categorizarVidraria(nome) {
      const categorias = {
        'Balão': ['Balão', 'Balão volumétrico', 'Balão de fundo'],
        'Béquer': ['Béquer'],
        'Proveta': ['Proveta'],
        'Pipeta': ['Pipeta'],
        'Funil': ['Funil'],
        'Tubo': ['Tubo', 'Tubo de ensaio', 'Tubo de cultura'],
        'Erlenmeyer': ['Erlenmeyer', 'Elenmeyer'],
        'Termômetro': ['Termômetro'],
        'Cadinho': ['Cadinho'],
        'Placa': ['Placa', 'Placa de Petri'],
        'Papel': ['Papel de filtro'],
        'Outros': ['Outros']
      };

      for (const [categoria, palavras] of Object.entries(categorias)) {
        if (palavras.some(palavra => nome.toLowerCase().includes(palavra.toLowerCase()))) {
          return categoria;
        }
      }

      return 'Outros';
    }
    // Inicia o servidor
  }

  #startServer(port) {
    this.#app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  }
}

// Inicia o servidor
new Server(3000);