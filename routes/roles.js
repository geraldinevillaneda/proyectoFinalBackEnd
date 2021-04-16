const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const verify = require('./verifyToken')

const connection = require('../database');



const buscarRoles = () => {

    return new Promise((resolve, reject) =>{
        connection.query('SELECT * FROM t003_roles',(err, rows) => {
            if(err) reject(err)
            resolve(rows)
        });
    });
};

const getbyId = (id) => {
    return new Promise((resolve, reject) =>{
        connection.query('SELECT * FROM t003_roles where id_rol = ?',
        [id], 
        (err, rows) => {
            if(err) reject(err)
            resolve(rows[0])
        });
    });
};


router.get('/', async (req, res)=>{

    const datos = await buscarRoles()

    if(!datos)
    {
        return res.json({
            Auth: false,
            done: "no hay ningun Rol regstrado",
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
    const rol = await getbyId(id)
    
    if(!rol)
    {
        return(
            res.json({
            Auth: false,
            done: 'El Rol no existe'
            
        }))
    }

    res.json({
        Auth: true,
        datos: rol, 
        done: "Rol Encontrado"
    });  
});


router.post('/agregar', verify, async(req, res) =>{

    console.log(req.body)

    const {NOMBRE_ROL, TIPO_ROL} = req.body;

    const nuevoRol = {
    
        NOMBRE_ROL,
        TIPO_ROL,

    };

    /* console.log(nuevaSede) */
    connection.query('INSERT INTO t003_roles set ?', [nuevoRol]);
    res.json({
        Auth: true,
        done: 'el Rol fue agregado correctamente',
        token: true
    });
    
});


router.get('/delete/:id', verify,  async( req, res)=>{

    const { id } = req.params;
    const respuesta = new Promise((resolve, reject) => {
        connection.query('delete from t003_roles where id_rol = ?', 
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
            done: 'No se pudo Eliminar el Rol'
        });
    }
    else
    {
        return res.json({
            Auth: true,
            token: true,
            done: 'el Rol se elimino correctamente'
        })
    }

});

router.post('/update/:id', verify, async (req, res)=>{
    const { id } = req.params;
    /* console.log(req.body) */

    const {nombre_rol, tipo_rol } = req.body;

    const actualizarRol = {
    
        nombre_rol,
        tipo_rol
    };

    const respuesta = new Promise((resolve, reject) => {
        connection.query('update t003_roles set ? where id_rol = ?', 
        [actualizarRol, id],
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