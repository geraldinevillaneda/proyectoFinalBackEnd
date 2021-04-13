const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const verify = require('./verifyToken')

const connection = require('../database');

const buscrarGasolinera  = () => {

    return new Promise((resolve, reject) =>{
        connection.query('SELECT * FROM gasolineras',(err, rows) => {
            if(err) reject(err)
            resolve(rows)
        });
    });
};


router.get('/', async (req, res)=>{

    const datos = await buscrarGasolinera()

    if(!datos)
    {
        return res.json({
            Auth: false,
            done: "no hay ninguna gasolinera registrada",
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
    console.log(id)
    const station = await getbyId(id)
    
    if(!station)
    {
        return(
            res.json({
            Auth: false,
            done: 'La gasolinera no existe'
            
        }))
    }

    res.json({
        Auth: true,
        datos: station,
        done: "Gasolinera Encontrada"
    });  
});


router.post('/agregar', verify, async(req, res) =>{

    const station = await getbyId(req.body.id);

    if(station)
    {
        res.json({
            Auth: false,
            done: 'La gasolinera con este codigo ya existe'
        })
    }
    else
    {
        const { id, nombre_estacion, direccion_estacion, telefono_estacion,
            latitud_estacion, longitud_estacion } = req.body;
        const nuevaEstacion = {
        id,
        nombre_estacion,
        direccion_estacion,
        telefono_estacion,
        latitud_estacion,
        longitud_estacion
        };
        console.log(nuevaEstacion)
    connection.query('INSERT INTO gasolineras set ?', [nuevaEstacion]);
    res.json({
        Auth: true,
        done: 'La estación fue agregada correctamente',
        token: true
    });
    }
});

const getbyId = (id) => {
    return new Promise((resolve, reject) =>{
        connection.query('SELECT * FROM gasolineras where id = ?',
        [id], 
        (err, rows) => {
            if(err) reject(err)
            resolve(rows[0])
        });
    });
};



router.get('/delete/:id', verify,  async( req, res)=>{

    const { id } = req.params;
    const respuesta = new Promise((resolve, reject) => {
        connection.query('delete from gasolineras where id = ?', 
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
            done: 'No se pudo Eliminar la estacion'
        });
    }
    else
    {
        return res.json({
            Auth: true,
            token: true,
            done: 'La estacion se elimino correctamente'
        })
    }

});

router.post('/update/:id', verify, async (req, res)=>{
    const { id } = req.params;
    const { nombre_estacion, direccion_estacion, telefono_estacion,
            latitud_estacion, longitud_estacion } = req.body;
    const actualizarE = {
        nombre_estacion,
        direccion_estacion,
        telefono_estacion,
        latitud_estacion,
        longitud_estacion
    }


    const respuesta = new Promise((resolve, reject) => {
        connection.query('update gasolineras set ? where id = ?', 
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




module.exports = router; 