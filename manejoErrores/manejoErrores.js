// Función para manejar errores
const manejoErrores = (res, error, mensaje) => {
    // let status = error.status;
    res.status(error.status).send(mensaje + ', ' + error.message);
};
module.exports = {manejoErrores};

