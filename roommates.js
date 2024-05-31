// función asíncrona importada de un archivo externo al del servidor (la función debe ser un módulo), para obtener la data de un nuevo usuario y la acumule en un JSON (roommates.json)

//Axios
const axios = require('axios');
// módulo File System 
const fs = require('fs');
//uuid genera un id unico de 36 caracteres
const { v4: uuidv4 } = require('uuid');

//////////////////////////////////////////////////////////////////
//calcular debe recibe total

let monto;
let cuota;
// let finanza;
// let recibeMonto;
// let debeMonto;

async function calculo() {
    const { gastos } = JSON.parse(fs.readFileSync("./data/gastos.json", "utf8"));
    let roommatesData = JSON.parse(fs.readFileSync("./data/roommates.json", "utf8"));
    // console.log('monto', gastosData.gastos[0].monto) //el unico gasto que hay
    let totalMontos = gastos.reduce((total, gasto) => total + gasto.monto, 0);
    //para identificar comprador
    // monto = totalMontos;
    cuota = totalMontos / roommatesData.roommates.length;

    roommatesData.roommates.forEach(r => {
        let recibeMonto = 0;
        let debeMonto = 0;
        gastos.forEach(gasto => {
            if (gasto.roommate === r.nombre) {
                console.log('cuot',cuota)
                console.log(roommatesData.roommates.length)
                recibeMonto = cuota * (roommatesData.roommates.length - 1);
                // debeMonto = cuota;
            } else {
                debeMonto = cuota;
            }
        });

        r.debe = Math.floor(debeMonto);
        r.recibe = Math.floor(recibeMonto);
        r.total = recibeMonto - debeMonto;

        console.log(`Finanza para ${r.nombre}:`, { debe: r.debe, recibe: r.recibe, total: r.total });
    });
    // return roommatesData.roommates;
    fs.writeFileSync("./data/roommates.json", JSON.stringify(roommatesData, null, 2));

}

// let finanza;
// calculo().then(result => {
//     finanza = result;
//     console.log('Roommates data outside the function:', finanza[0]);
//     // Ahora puedes usar la variable `roommates` como desees
// });
// console.log(roommates)
// console.log('total montos', monto)
// console.log('pa cada uno', recibeMonto, debeMonto);

//////////////////////////////////////////////////////////////////

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

        calculo();
        
        console.log('Roommate creado:', roommate);

        // Leer el archivo roomates.json
        let roommatesData = JSON.parse(fs.readFileSync("./data/roommates.json", "utf8"));

        // Agregar el nuevo compañero de cuarto al array
        roommatesData.roommates.push(roommate);

        // Escribir de nuevo todo en el archivo roomates.json
        fs.writeFileSync("./data/roommates.json", JSON.stringify(roommatesData, null, 2)); //ese null 2 hace que se mantenga el formato¿¿¿??

}

module.exports = {crearRoomie};