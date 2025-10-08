const mysql = require('mysql2');

// 2. Configuração da Conexão
// ATENÇÃO: Substitua pelos seus dados (Host, User, Password, Database)
const connection = mysql.createConnection({
  host: '192.168.56.1', // Ex: '192.168.1.10' ou 'localhost'
  user: 'root',             // Seu nome de usuário do MySQL
  password: 'imtdb',   // Sua senha
  database: 'agenTEC'    // O banco de dados específico
});

// 3. Tenta Conectar e Executar Consulta
connection.connect(err => {
  if (err) {
    // Se der erro, mostra qual foi e encerra
    console.error('Erro ao conectar');
    console.error(err.message);
    return;
  }
  console.log('Conexão SQL estabelecida com sucesso!');

  // Consulta de Exemplo: Selecionar todos os registros de uma tabela
  const query = 'SELECT * FROM sua_tabela LIMIT 5'; 
  
  console.log(`Executando consulta: ${query}`);

  connection.query(query, (error, results) => {
    if (error) {
        console.error('*** ERRO na consulta SQL ***');
        throw error;
    }

    // Exibe os resultados
    console.log('\n--- Resultados ---');
    console.log(results);
    console.log('------------------\n');
    
    // Mostra quantos resultados foram encontrados
    if (results.length > 0) {
        console.log(`Consulta retornou ${results.length} registros.`);
    } else {
        console.log('A consulta não retornou registros.');
    }

    // Fecha a conexão após o uso
    connection.end();
  });
});