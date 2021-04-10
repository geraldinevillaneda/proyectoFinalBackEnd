const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'bs9cvxn9ebmjktpf3edb-mysql.services.clever-cloud.com',
    user: 'u6msqrbhy3a34zez',
    password: 'XNpk2F14OzuQioYg3MJ6',
    database: 'bs9cvxn9ebmjktpf3edb'
});

connection.connect((error)=>{
    if(error){
        console.log(error);
        return;
    }else{
        console.log('DB is connected');
    }
});


module.exports = connection;
