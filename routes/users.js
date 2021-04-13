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


router.get('/', verify ,(req, res)=>{
    connection.query('SELECT * FROM usuarios', (error, rows, fields)=>{
        if(!error){
            res.json(rows);
        }else{
            console.log(error);
        }
    });
});

router.post('/agregar', async (req, res) =>{

    const user = await getbyId(req.body.id);

    if(user)
    {
        res.json({
            Auth: false,
            done: 'El usuario con estas credenciales ya existe'
        })
    }
    else
    {
        const { id, nombre_usuario, tipo_documento, sexo_usuario, nacionalidad_usuario, telefono_usuario,
            direccion_usuario, clave_usuario } = req.body;
        const nuevoUsuario = {
            id,
            nombre_usuario,
            tipo_documento,
            sexo_usuario,
            nacionalidad_usuario,
            telefono_usuario,
            direccion_usuario,
            clave_usuario
        };
        nuevoUsuario.clave_usuario = bcrypt.hashSync(nuevoUsuario.clave_usuario, 10);
        console.log(nuevoUsuario);
        connection.query('insert into usuarios set ?', [nuevoUsuario]);
        res.json({
            Auth: true,
            succesfull: crearToken(nuevoUsuario),
            nombre_usuario: nuevoUsuario.nombre_usuario,
            id: nuevoUsuario.id,
            done: 'El usuarios fue agregado correctamente'
        });
    }
});


router.get('/delete/:id', verify, async( req, res)=>{
    const { id } = req.params;
    const respuesta = new Promise((resolve, reject) => {
        connection.query('delete from usuarios where id = ?', 
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
    const { nombre_usuario, tipo_documento, sexo_usuario, nacionalidad_usuario, telefono_usuario,
            direccion_usuario} = req.body;
    const actualizarE = {
        nombre_usuario,
        tipo_documento,
        sexo_usuario,
        nacionalidad_usuario,
        telefono_usuario,
        direccion_usuario
    };

    const respuesta = new Promise((resolve, reject) => {
        connection.query('update usuarios set ? where id = ?', 
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

const getbyId = (id) => {
    return new Promise((resolve, reject) =>{
        connection.query('SELECT * FROM usuarios where id = ?',
        [id], 
        (err, rows) => {
            if(err) reject(err)
            resolve(rows[0])
        });
    });
};

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

const getbyUser = (usuario) => {
    return new Promise((resolve, reject) =>{
        connection.query('SELECT * FROM usuarios where nombre_usuario = ?',
        [usuario], 
        (err, rows) => {
            if(err) reject(err)
            resolve(rows[0])
        });
    });
};


router.post('/login', async(req, res) => {

    console.log(req.body);
    const user = await getbyUser(req.body.nombre_usuario);
    if(user === undefined)
    {
        res.json({
            Auth: false,
            error: 'Error, User or Password empty'
        });
    }
    else
    {
        const equals = bcrypt.compareSync(req.body.clave_usuario, user.clave_usuario);
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
                nombre_usuario: user.nombre_usuario,
                id: user.id,
                done: 'Login correct'
            })
        }
    }
});


module.exports = router;