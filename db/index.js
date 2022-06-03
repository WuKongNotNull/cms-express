// 创建连接数据库的对象
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'rootroot',
    database : 'db_cms'
});


module.exports = connection