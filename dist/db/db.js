"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: 'packages',
    host: 'localhost',
    database: 'packages',
    password: 'Jwe1989!',
    port: 5432,
});
exports.default = pool;
