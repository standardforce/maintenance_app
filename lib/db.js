import mysql from 'mysql2/promise';
const pool=mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    Port:process.env.DB_PORT,
    waitForConnections:true,
    connectionLimit:1,
    queueLimit :0,
})

export default pool;