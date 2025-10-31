//Importa o driver mysql2
const mysql = require('mysql2');

//Configuração da Conexão
const connection = mysql.createConnection({
    host: '192.168.56.1',
    user: 'root',
    password: 'imtdb',
    database: 'mydb',
    port: 3306
});

//Tenta Conectar e Executar Consulta
connection.connect(err => {
    if (err) {
        //Se der erro, mostra qual
        console.error('*** ERRO ao conectar ao banco de dados ***');
        console.error(err.message);
        return;
    }

    const query = 'SELECT * FROM professor WHERE idProfessor = 1;'

    console.log(`Executando consulta: ${query}`);

    connection.query(query, (error, results) => {
        if (error) {
            console.error('*** ERRO na consulta SQL ***');
            throw error;
        }

        //Se o resultado da consulta for maior que 0, ele adiciona em uma array
        if (results.length > 0) {
            const registroConsultado = results[0];

            //Devolução da tupla por completo na consulta
            console.log('\nRegistro Completo Encontrado:');
            console.log(registroConsultado); 
            
            //Pegando a coluna nome da tupla puxada e mostrando no terminal
            const nome = registroConsultado.nome;
            console.log(`\nVALOR ESPECÍFICO (Nome): **${nome}**`);
            
            //Pegando a coluna idProfessor da tupla puxada e mostrando no terminal
            const idProfessor = registroConsultado.idProfessor;
            console.log(`ID encontrado: ${idProfessor}`);
            
        } else {
            console.log('Nenhum registro encontrado para o ID consultado.');
        }

        console.log('Conexão SQL estabelecida com sucesso!');

        connection.end();
    });
});