const mysql = require('mysql');

//se cambia la conexión a la bd del proyecto
const connection = mysql.createConnection({
    host: 'by8yakvkx9nmjyeloqob-mysql.services.clever-cloud.com',
    user: 'uxj2iuqzixitan91',
    password: 'DkuLJyEmXLJK33wxXmpa',
    database: 'by8yakvkx9nmjyeloqob'
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
