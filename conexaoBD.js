// 1. Importa o driver mysql2
const mysql = require('mysql2');

// 2. Configuração da Conexão
const connection = mysql.createConnection({
    host: '192.168.56.1',
    user: 'root',
    password: 'imtdb',
    database: 'sakila',
    port: 3306
});

// 3. Tenta Conectar e Executar Consulta
connection.connect(err => {
    if (err) {
        // Se der erro, mostra qual
        console.error('*** ERRO ao conectar ao banco de dados ***');
        console.error(err.message);
        return;
    }

    console.log('Conexão SQL estabelecida com sucesso!');

    // Consulta de Exemplo: Selecionar todos os registros de uma tabela,
    // Vou deixar esse exemplo aqui por enquanto
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


        connection.end();
    });
});