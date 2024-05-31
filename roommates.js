// función asíncrona importada de un archivo externo al del servidor (la función debe ser un módulo), para obtener la data de un nuevo usuario y la acumule en un JSON (roommates.json)

//Axios
const axios = require('axios');
// módulo File System 
const fs = require('fs');
//uuid genera un id unico de 36 caracteres
const { v4: uuidv4 } = require('uuid');

async function crearRoomie(){

        // Almacenar roommates nuevos ocupando random user. 
        const result = await axios.get("https://randomuser.me/api");
        const userData = result.data.results[0];
        const { name, email } = userData;

        const roommate = {
            id: uuidv4().slice(30),               //id generado con uuid
            nombre: `${name.first} ${name.last}`,
            email,
            debe: 0,
            recibe: 0,
            total: 0
        };

        console.log('Roommate creado:', roommate);

        // Leer el archivo roomates.json
        let roommatesData = JSON.parse(fs.readFileSync("roommates.json", "utf8"));

        // Agregar el nuevo compañero de cuarto al array
        roommatesData.roommates.push(roommate);

        // Escribir de nuevo todo en el archivo roomates.json
        fs.writeFileSync("roommates.json", JSON.stringify(roommatesData, null, 2)); //ese null 2 hace que se mantenga el formato¿¿¿??

     
}

module.exports = {crearRoomie};