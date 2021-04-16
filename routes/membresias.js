const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const verify = require('./verifyToken')

const connection = require('../database');



const buscarMembresias = () => {

    return new Promise((resolve, reject) =>{
        connection.query('SELECT * FROM t004_membresias',(err, rows) => {
            if(err) reject(err)
            resolve(rows)
        });
    });
};

const getMem = (id) => {
    return new Promise((resolve, reject) =>{
        connection.query('SELECT * from t004_membresias where id_membresia = ?',
        [id], 
        (err, rows) => {
            if(err) reject(err)
            resolve(rows[0])
            console.log(rows[0]);
        });
    });
};

const getbyId = (id) => {
    return new Promise((resolve, reject) =>{
        connection.query('SELECT * from t004_memxt005_usr where id_usuario = ? and estado = 1',
        [id], 
        (err, rows) => {
            if(err) reject(err)
            resolve(rows[0])
            console.log(rows[0]);
        });
    });
};

router.get('/', async (req, res)=>{

    const datos = await buscarMembresias()

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
    const membresia = await getMem(id)
    
    if(!membresia){
        return(
            res.json({
            Auth: false,
            done: 'La membresia no existe'
            
        }))
    }

    res.json({
        Auth: true,
        datos: membresia, 
        done: "membresia Encontrada"
    });  
});

router.get('/usr/:id', verify,   async( req, res, next)=>{
    const { id } = req.params;
    const membresia = await getbyId(id)
    
    if(!membresia){
        return(
            res.json({
            Auth: false,
            done: 'La membresia no existe'
            
        }))
    }

    res.json({
        Auth: true,
        datos: membresia, 
        done: "membresia Encontrada"
    });  
});

router.post('/agregar', verify, async(req, res) =>{

    const {ID_MEMBRESIA, ESTADO, NOMBRE_MEMBRESIA, DURACION, PRECIO} = req.body;

    const nuevaMembresia = {
    
        ID_MEMBRESIA,
        ESTADO,
        NOMBRE_MEMBRESIA,
        DURACION,
        PRECIO,

    };
    console.log(nuevaMembresia)
    connection.query('INSERT INTO t004_membresias set ?', [nuevaMembresia]);
    res.json({
        Auth: true,
        done: 'La Membresia fue agregada correctamente',
        token: true
    });
    
});

router.get('/delete/:id', verify,  async( req, res)=>{

    const { id } = req.params;
    const respuesta = new Promise((resolve, reject) => {
        connection.query('delete from t004_membresias where id_membresia = ?', 
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
            done: 'No se pudo Eliminar la Membresia'
        });
    }
    else
    {
        return res.json({
            Auth: true,
            token: true,
            done: 'La Membresia se elimino correctamente'
        })
    }

});

router.post('/update/:id', verify, async (req, res)=>{
    const { id } = req.params;
    console.log(req.body);

    const {estado, nombre_membresia, duracion, precio, } = req.body;

    const actualizarMembresia = {
    
        estado,
        nombre_membresia,
        duracion,
        precio,

    };


    const respuesta = new Promise((resolve, reject) => {
        connection.query('update t004_membresias set ? where id_membresia = ?', 
        [actualizarMembresia, id],
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

router.post('/asignar', verify, async(req, res) =>{

    const {id_relacion, estado, id_membresia, id_usuario, fecha_compra, fecha_activacion, t001_usuarios_id_usuario, t004_membresias_id_membresia} = req.body;

    const nuevaAsignacion = {
    
        id_relacion,
        estado,
        id_membresia,
        id_usuario,
        fecha_compra,
        fecha_activacion,
        t001_usuarios_id_usuario,
        t004_membresias_id_membresia,

    };
    console.log(nuevaAsignacion)
    connection.query('INSERT INTO t004_memxt005_usr set ?', [nuevaAsignacion]);
    res.json({
        Auth: true,
        done: 'Membresia asignada correctamente',
        token: true
    });
    
});

module.exports = router;