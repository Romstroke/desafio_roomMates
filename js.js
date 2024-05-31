//////////////////////////////////////////////////////////////////
//calcular debe recibe total

let monto;
let cuota;
// let finanza;
// let recibeMonto;
// let debeMonto;

async function calculo() {
    const { gastos } = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
    let roommatesData = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
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

        r.debe = debeMonto;
        r.recibe = recibeMonto;
        r.total = recibeMonto - debeMonto;

        console.log(`Finanza para ${r.nombre}:`, { debe: r.debe, recibe: r.recibe, total: r.total });
    });
    // return roommatesData.roommates;
    // fs.writeFileSync("roomates.json", JSON.stringify(roommatesData, null, 2));

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