const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const verify = require('./verifyToken')

const connection = require('../database');

const buscarCurso  = () => {

    return new Promise((resolve, reject) =>{
        connection.query('SELECT * FROM t006_cursos',(err, rows) => {
            if(err) reject(err)
            resolve(rows)
        });
    });
};

const getbyId = (id) => {
    return new Promise((resolve, reject) =>{
        connection.query('SELECT * FROM t006_cursos where id_curso = ?',
        [id], 
        (err, rows) => {
            if(err) reject(err)
            resolve(rows[0])
        });
    });
};


router.get('/', async (req, res)=>{

    const datos = await buscarCurso()

    if(!datos)
    {
        return res.json({
            Auth: false,
            done: "no hay ningun curso registrado",
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
    const curso = await getbyId(id)
    
    if(!curso)
    {
        return(
            res.json({
            Auth: false,
            done: 'El Curso no existe'
            
        }))
    }

    res.json({
        Auth: true,
        datos: curso, 
        done: "Curso Encontrado"
    });  
});


router.post('/agregar', verify, async(req, res) =>{

    const {ESTADO, CODIGO_CURSO, NOMBRE_CURSO, DESCRIPCION_CURSO, CREDITOS_CURSO, CATEGORIA_CURSO,
     } = req.body;

    const nuevoCurso = {
    
        ESTADO,
        CODIGO_CURSO,
        NOMBRE_CURSO,
        DESCRIPCION_CURSO,
        CREDITOS_CURSO,
        CATEGORIA_CURSO,

    };
    console.log(nuevoCurso)
    connection.query('INSERT INTO t006_cursos set ?', [nuevoCurso]);
    res.json({
        Auth: true,
        done: 'El Curso fue agregado correctamente',
        token: true
    });
    
});


router.get('/delete/:id', verify,  async( req, res)=>{

    const { id } = req.params;
    const respuesta = new Promise((resolve, reject) => {
        connection.query('delete from t006_cursos where id_curso = ?', 
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
            done: 'No se pudo Eliminar el Curso'
        });
    }
    else
    {
        return res.json({
            Auth: true,
            token: true,
            done: 'El curso se elimino correctamente'
        })
    }

});

router.post('/update/:id', verify, async (req, res)=>{
    const { id } = req.params;
    console.log(req.body)

    const {estado, codigo_curso, nombre_curso, descripcion_curso, creditos_curso, categoria_curso,
    } = req.body;

    const actualizarCurso = {
    
        estado,
        codigo_curso,
        nombre_curso,
        descripcion_curso,
        creditos_curso,
        categoria_curso,

    };

    console.log(actualizarCurso)

    const respuesta = new Promise((resolve, reject) => {
        connection.query('update t006_cursos set ? where id_curso = ?', 
        [actualizarCurso, id],
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