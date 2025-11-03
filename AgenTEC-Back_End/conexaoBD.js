// Database.js
import mysql from "mysql2/promise";

class Database {
    #pool;

    constructor(config) {
        this.#pool = mysql.createPool(config);
    }

    async query(sql, params) {
        try {
            const [result] = await this.#pool.execute(sql, params);
            return result;
        } catch (err) {
            console.error('Erro no DB:', err);
            throw err;
        }
    }

    getPool() {
        return this.#pool;
    }
}

export default Database;
