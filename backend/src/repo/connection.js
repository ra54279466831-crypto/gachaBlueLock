import mysql from 'mysql2/promise.js'
import 'dotenv/config'

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
})

export { con };