const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const verify = require('./verifyToken')

const connection = require('../database');

const buscarGrupo  = () => {

    return new Promise((resolve, reject) =>{
        connection.query('SELECT * FROM t007_grupos',(err, rows) => {
            if(err) reject(err)
            resolve(rows)
        });
    });
};

const getbyId = (id) => {
    return new Promise((resolve, reject) =>{
        connection.query('SELECT * FROM t007_grupos where id_grupo = ?',
        [id], 
        (err, rows) => {
            if(err) reject(err)
            resolve(rows[0])
        });
    });
};


router.get('/', async (req, res)=>{

    const datos = await buscarGrupo()

    if(!datos)
    {
        return res.json({
            Auth: false,
            done: "no hay ningun grupo registrado",
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
    const grupo = await getbyId(id)
    
    if(!grupo)
    {
        return(
            res.json({
            Auth: false,
            done: 'El grupo no existe'
            
        }))
    }

    res.json({
        Auth: true,
        datos: grupo, 
        done: "Grupo Encontrado"
    });  
});


router.post('/agregar', verify, async(req, res) =>{

    const {ESTADO, CUPO_ESTUDIANTES, SEMESTRE, TOTAL_ESTUDIANTES, } = req.body;

    const nuevoGrupo = {
    
        ESTADO,
        CUPO_ESTUDIANTES,
        SEMESTRE,
        TOTAL_ESTUDIANTES,

    };
    console.log(nuevoGrupo)
    connection.query('INSERT INTO t007_grupos set ?', [nuevoGrupo]);
    res.json({
        Auth: true,
        done: 'El Grupo fue agregado correctamente',
        token: true
    });
    
});


router.get('/delete/:id', verify,  async( req, res)=>{

    const { id } = req.params;
    const respuesta = new Promise((resolve, reject) => {
        connection.query('delete from t007_grupos where id_grupo = ?', 
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
            done: 'No se pudo Eliminar el grupo'
        });
    }
    else
    {
        return res.json({
            Auth: true,
            token: true,
            done: 'El grupo se elimino correctamente'
        })
    }

});

router.post('/update/:id', verify, async (req, res)=>{
    const { id } = req.params;

    const {estado, cupo_estudiantes, semestre, total_estudiantes, } = req.body;

    const actualizarGrupo = {
    
        estado,
        cupo_estudiantes,
        semestre,
        total_estudiantes,

    };


    const respuesta = new Promise((resolve, reject) => {
        connection.query('update t007_grupos set ? where id_grupo = ?', 
        [actualizarGrupo, id],
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