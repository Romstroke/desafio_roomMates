//modulo crearRoomie
const {crearRoomie} = require('./roommates.js');
//manejo errores
// const {manejoErrores} = require('./manejoErrores/manejoErrores.js');

const express = require("express");
const app = express();
// //Axios
const axios = require('axios');
// módulo File System 
const fs = require('fs');
//uuid genera un id unico de 36 caracteres
const { v4: uuidv4 } = require('uuid');

// Middleware para analizar application/json
app.use(express.json());

// LEVANTANDO EL SERVIDOR
app.listen(3000, () => {
    console.log(`Servidor activo en el puerto 3000`);
});

//RUTAS

//GET html
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// /roommate POST  
app.post('/roommate', async (req, res) => {
    // ruta POST /roommate en el servidor que ejecute una función asíncrona importada de un archivo externo al del servidor 
    try {
        await crearRoomie();
        res.json({roommate});
    } catch (error) {
        const mensaje = "Error al obtener datos de la API";
        // manejoErrores(res,error,mensaje);
        console.error("Error al obtener datos de la API:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// /roomate get Devolver todos los roommates almacenados. 
app.get('/roommates', (req, res) => {
    try {
        const roommatesData = JSON.parse(fs.readFileSync("./data/roommates.json", "utf8"));
        console.log(roommatesData)
        // Enviar los datos como respuesta
        res.status(200).json(roommatesData);
    } catch (error) {
        const mensaje = "Error al leer el archivo roommates.json";
        // manejoErrores(res,error,mensaje);
        console.error("Error al leer el archivo roomates.json:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//post de los gastos Registrar nuevos gastos. 
app.post('/gasto', (req, res) => {
    try {
        // Obtener los datos del cuerpo de la solicitud
        const { roommate, descripcion, monto } = req.body;
        console.log('reqbody', req.body)
        console.log(roommate, descripcion, monto)


        // Leer los datos existentes del archivo gastos.json
        let gastosData = JSON.parse(fs.readFileSync("./data/gastos.json", "utf8"));

        // Crear un nuevo objeto de gasto
        const nuevoGasto = {
            id: uuidv4().slice(30),
            roommate,
            descripcion,
            monto,
            fecha: ""
        };

        // Agregar el nuevo gasto al array de gastos en los datos existentes
        gastosData.gastos.push(nuevoGasto);

        // Escribir los datos actualizados en el archivo gastos.json
        fs.writeFileSync("./data/gastos.json", JSON.stringify(gastosData, null, 2));

        // Enviar una respuesta de éxito
        res.status(201).json({ message: "Gasto agregado correctamente", nuevoGasto });
    } catch (error) {
        const mensaje = "Error al agregar un gasto";
        // manejoErrores(res,error,mensaje);
        console.error("Error al agregar un gasto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


// ● /gastos GET: Devuelve el historial con todos los gastos registrados.
app.get('/gastos', (req, res) => {
    try {
        // Leer los datos del archivo gastos.json
        const gastosData = JSON.parse(fs.readFileSync("./data/gastos.json", "utf8"));
        console.log(gastosData)
        // Enviar los datos como respuesta
        res.status(200).json(gastosData);
    } catch (error) {
        const mensaje = "Error al leer el archivo gastos.json";
        // manejoErrores(res,error,mensaje);
        console.error("Error al leer el archivo gastos.json:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// ● /gasto PUT: Edita los datos de un gasto.
app.put('/gasto', (req, res) => {
    try {
        // Obtener el ID del gasto a actualizar desde los parámetros de la URL
        const gastoId = req.query.id;

        // Obtener los datos actualizados del cuerpo de la solicitud
        const { roommate, descripcion, monto } = req.body;

        // Leer los datos existentes del archivo gastos.json
        let gastosData = JSON.parse(fs.readFileSync("./data/gastos.json", "utf8"));

        // Buscar el índice del gasto a actualizar en el array de gastos
        const index = gastosData.gastos.findIndex(gasto => gasto.id === gastoId);

        // Verificar si el gasto existe
        if (index === -1) {
            return res.status(404).json({ error: "Gasto no encontrado" });
        }

        // Actualizar los datos del gasto
        gastosData.gastos[index] = {
            id: gastoId,
            roommate: roommate,
            descripcion,
            monto
        };

        // Escribir los datos actualizados en el archivo gastos.json
        fs.writeFileSync("./data/gastos.json", JSON.stringify(gastosData, null, 2));

        // Enviar una respuesta de éxito
        res.status(200).json({ message: "Gasto actualizado correctamente", gastoActualizado: gastosData.gastos[index] });
    } catch (error) {
        const mensaje = "Error al actualizar un gasto";
        // manejoErrores(res,error,mensaje);
        console.error("Error al actualizar un gasto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// ● /gasto DELETE: Elimina un gasto del historial.
app.delete('/gasto', (req, res) => {
    try {
        // Obtener el ID del gasto a eliminar desde los parámetros de la URL
        const gastoId = req.query.id;

        // Leer los datos existentes del archivo gastos.json
        let gastosData = JSON.parse(fs.readFileSync("./data/gastos.json", "utf8"));

        // Filtrar los gastos para eliminar el gasto con el ID proporcionado
        gastosData.gastos = gastosData.gastos.filter(gasto => gasto.id !== gastoId);

        // Escribir los datos actualizados en el archivo gastos.json
        fs.writeFileSync("./data/gastos.json", JSON.stringify(gastosData, null, 2));

        // Enviar una respuesta de éxito
        res.status(200).json({ message: "Gasto eliminado correctamente" });
    } catch (error) {
        const mensaje = "Error al eliminar un gasto";
        // manejoErrores(res,error,mensaje);
        console.error("Error al eliminar un gasto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta genérica
app.get('*', async (req, res) => {
    try {
        res.status(200).redirect('/');
    } catch (error) {
        const mensaje = "Servidor caído, intente más tarde por favor. Disculpe las molestias. </3";
        // manejoErrores(res,error,mensaje);
        res.status(500).send('Ocurrió un error');
    }
});
