// Función para manejar errores
const manejoErrores = (res, error, mensaje) => {
    // let status = error.status;
    res.status(500).send(mensaje + ', ' + error.message);
};
module.exports = {manejoErrores};

