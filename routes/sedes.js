const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const verify = require('./verifyToken')

const connection = require('../database');

const buscrarSede  = () => {

    return new Promise((resolve, reject) =>{
        connection.query('SELECT * FROM t005_sedes',(err, rows) => {
            if(err) reject(err)
            resolve(rows)
        });
    });
};

const getbyId = (id) => {
    return new Promise((resolve, reject) =>{
        connection.query('SELECT * FROM t005_sedes where id_sede = ?',
        [id], 
        (err, rows) => {
            if(err) reject(err)
            resolve(rows[0])
        });
    });
};


router.get('/', async (req, res)=>{

    const datos = await buscrarSede()

    if(!datos)
    {
        return res.json({
            Auth: false,
            done: "no hay ninguna sede registrada",
            data: {}
        })
    }
    
    res.json({
        Auth: true,
        data: datos
    })
    
});


router.get('/:id', verify,   async( req, res, next)=>{
    const { id } = req.params;
    const sede = await getbyId(id)
    
    if(!sede)
    {
        return(
            res.json({
            Auth: false,
            done: 'La Sede no existe'
            
        }))
    }

    res.json({
        Auth: true,
        datos: sede, 
        done: "Sede Encontrada"
    });  
});


router.post('/agregar', verify, async(req, res) =>{

    const {ESTADO, NOMBRE_SEDE, LATITUD, LONGITUD, ID_CIUDAD, ID_USUARIO,
        t001_usuarios_id_usuario, } = req.body;

    const nuevaSede = {
    
        ESTADO,
        NOMBRE_SEDE,
        LATITUD,
        LONGITUD,
        ID_CIUDAD,
        ID_USUARIO,
        t001_usuarios_id_usuario,

    };
    console.log(nuevaSede)
    connection.query('INSERT INTO t005_sedes set ?', [nuevaSede]);
    res.json({
        Auth: true,
        done: 'La Sede fue agregada correctamente',
        token: true
    });
    
});


router.get('/delete/:id', verify,  async( req, res)=>{

    const { id } = req.params;
    const respuesta = new Promise((resolve, reject) => {
        connection.query('delete from t005_sedes where id_sede = ?', 
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
            done: 'No se pudo Eliminar la Sede'
        });
    }
    else
    {
        return res.json({
            Auth: true,
            token: true,
            done: 'La Sede se elimino correctamente'
        })
    }

});

router.post('/update/:id', verify, async (req, res)=>{
    const { id } = req.params;

    const {ESTADO, NOMBRE_SEDE, LATITUD, LONGITUD, ID_CIUDAD, ID_USUARIO,
        t001_usuarios_id_usuario, } = req.body;

    const actualizarSede = {
    
        ESTADO,
        NOMBRE_SEDE,
        LATITUD,
        LONGITUD,
        ID_CIUDAD,
        ID_USUARIO,
        t001_usuarios_id_usuario,

    };


    const respuesta = new Promise((resolve, reject) => {
        connection.query('update t005_sedes set ? where id_sede = ?', 
        [actualizarSede, id],
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




module.exports = router; 