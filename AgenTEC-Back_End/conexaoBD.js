// Database.js
const mysql = require('mysql2/promise');

class Database {
    #pool;

    constructor(config) {
        this.#pool = mysql.createPool(config);
    }

    async query(sql, params) {
        try {
            const [rows] = await this.#pool.execute(sql, params);
            return rows;
        } catch (err) {
            console.error('Erro no DB:', err);
            throw err;
        }
    }

    getPool() {
        return this.#pool;
    }
}

module.exports = Database;
