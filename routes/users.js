const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const express = require('express');
const router = express.Router();

const connection = require('../database');
const texto = require('../config');
const verify = require('./verifyToken')

//Crear Token
const crearToken = (user) => {
    let payload = {
        userId: user.id,
        createdAt: moment().unix(),
        expiresAt: moment().add(1,'minute').unix()
    }
    return jwt.sign(payload, texto.secreto)
    //return jwt.encodes(payload, process.env,TOKEN_KEY);
}

const getbyIdentificacion = (identificacion) => {
    return new Promise((resolve, reject) =>{
        connection.query('SELECT * FROM t001_usuarios where NUMERO_DOCUMENTO = ?',
        [identificacion], 
        (err, rows) => {
            if(err) reject(err)
            resolve(rows[0])
        });
    });
};

const getbyId = (id) => {
    return new Promise((resolve, reject) =>{
        connection.query('SELECT * FROM t001_usuarios where ID_USUARIO = ?',
        [id], 
        (err, rows) => {
            if(err) reject(err)
            resolve(rows[0])
        });
    });
};


router.get('/' ,(req, res)=>{
    connection.query('SELECT * FROM t001_usuarios', (error, rows, fields)=>{
        if(!error){
            res.json(rows);
        }else{
            console.log(error);
        }
    });
});

router.post('/agregar', async (req, res) =>{

    const user = await getbyIdentificacion(req.body.NUMERO_DOCUMENTO);

    if(user)
    {
        res.json({
            Auth: false,
            done: 'El usuario con estas credenciales ya existe'
        })
    }
    else
    {
        const { ID_USUARIO, PRIMER_NOMBRE, SEGUNDO_NOMBRE, PRIMER_APELLIDO, SEGUNDO_APELLIDO, SEXO, TIPO_DOCUMENTO, 
            NUMERO_DOCUMENTO, CORREO_ELECTRONICO, CELUAR, ROL, PASSWORD, t003_roles_id_rol} = req.body;
        const nuevoUsuario = {
            ID_USUARIO,
            PRIMER_NOMBRE, 
            SEGUNDO_NOMBRE, 
            PRIMER_APELLIDO, 
            SEGUNDO_APELLIDO, 
            SEXO, 
            TIPO_DOCUMENTO,
            NUMERO_DOCUMENTO,
            CORREO_ELECTRONICO,
            CELUAR,
            ROL,
            PASSWORD,
            t003_roles_id_rol
        };
        nuevoUsuario.PASSWORD = bcrypt.hashSync(nuevoUsuario.PASSWORD, 10);
        connection.query('insert into t001_usuarios set ?', [nuevoUsuario]);
        const nuevo = await getbyIdentificacion(req.body.NUMERO_DOCUMENTO)
        res.json({
            Auth: true,
            succesfull: crearToken(nuevoUsuario),
            nombre_usuario: nuevoUsuario.PRIMER_NOMBRE,
            id: nuevo.id_usuario,
            done: 'El usuarios fue agregado correctamente'
        });
    }
});


router.get('/delete/:id', verify, async( req, res)=>{
    const { id } = req.params;
    console.log(id);
    const respuesta = new Promise((resolve, reject) => {
        connection.query('delete from t001_usuarios where id_usuario = ?', 
        [id],
        (err, rows) => {
            if(err) reject(err)
            resolve(rows[0])
        });
    });
    
    if(!respuesta)
    {
        return res.json({
            Auth: false,
            token: true,
            done: 'No se pudo Eliminar el Usuario'
        });
    }
    else
    {
        return res.json({
            Auth: true,
            token: true,
            done: 'El usuario se elimino correctamente'
        })
    }
});

router.post('/update/:id', verify, async(req, res)=>{
    const { id } = req.params;
    const { PRIMER_NOMBRE, SEGUNDO_NOMBRE, PRIMER_APELLIDO, SEGUNDO_APELLIDO, SEXO, TIPO_DOCUMENTO, 
         CORREO_ELECTRONICO, CELUAR} = req.body;
    const actualizarE = {
        PRIMER_NOMBRE, 
        SEGUNDO_NOMBRE, 
        PRIMER_APELLIDO, 
        SEGUNDO_APELLIDO, 
        SEXO, 
        TIPO_DOCUMENTO,
        CORREO_ELECTRONICO,
        CELUAR,
    };
    console.log(actualizarE)
    const respuesta = new Promise((resolve, reject) => {
        connection.query('update t001_usuarios set ? where id_usuario = ?', 
        [actualizarE, id],
        (err, rows) => {
            if(err) reject(err)
            resolve(rows[0])
        });
    });

    if(!respuesta)
    {
        return res.json({
            Auth: false,
            token: true,
            done: 'No se pudo actualizar los datos'
        });
    }
    else
    {
        return res.json({
            Auth: true,
            token: true,
            done: 'Los datos se actualizaron correctamente'
        })
    }
});

router.get('/:id', verify, async (req, res, next) => {
    const {id} = req.params;
    const user  = await getbyId(id, {clave_usuario: 0});
    
    if(!user){
        return res.json({
            Auth: false,
            token: true,
            done: 'El usuario no se encontro'
        });
    }

    res.json({
        Auth: true,
        datos: user,
        done: "Usuario Encontrado"
    });  

})

router.post('/login', async(req, res) => {

    console.log(req.body);
    const user = await getbyIdentificacion(req.body.numero_identificacion);
    if(user === undefined)
    {
        res.json({
            Auth: false,
            error: 'Error, User or Password empty'
        });
    }
    else
    {
        const equals = bcrypt.compareSync(req.body.clave_usuario, user.password);
        //const equals = (req.body.clave_usuario === user.clave_usuario);
        if(!equals)
        {
            res.json({
                Auth: false,
                error: 'Error, User or Password not found'
            });
        }
        else
        {
            res.json({
                Auth: true,
                succesfull: crearToken(user),
                nombre_usuario: user.primer_nombre,
                id: user.id_usuario,
                done: 'Login correct'
            })
        }
    }
});


module.exports = router;