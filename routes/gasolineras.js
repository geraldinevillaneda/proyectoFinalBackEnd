const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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


router.get('/:id', async( req, res)=>{
    const { id } = req.params;
    await connection.query('select * from gasolineras where id = ?', [id], (error, rows, fields)=>{
        if(!error){
            res.json(rows);
        }else{
            console.log(error);
        }
    });
});

router.post('/agregar', (req, res) =>{
    const { id, nombre_estacion, direccion_estacion, telefono_estacion,
            latitud_estacion, longitud_estacion } = req.body;
    nuevaEstacion = [
        id,
        nombre_estacion,
        direccion_estacion,
        telefono_estacion,
        latitud_estacion,
        longitud_estacion
    ];
    connection.query('insert into gasolineras set ?', [nuevaEstacion]);
    res.json('received');
});

router.get('/delete/:id', async( req, res)=>{
    const { id } = req.params;
    await connection.query('delete from gasolineras where id = ?', [id]);
    res.json('estacion deleted');

});

router.post('/update/:id', async (req, res)=>{
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
    await connection.query('update gasolineras set ? where id = ?', [actualizarE, id]);
    res.json({Status: 'Estacion updated'});

});




module.exports = router; 