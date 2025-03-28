import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import yargs from "yargs";
import * as fs from "fs";
import { hideBin } from "yargs/helpers";

// Inputs y outputs de las preguntas
const datosProd = readline.createInterface({ input, output });

// Una función pregunta:
function ask(question) {
    return new Promise((resolve) => {
        datosProd.question(question, (answer) => {
            resolve(answer);
        });
    });
}

// Las preguntas se agrupan en una función asíncrona
async function asyncAsk() {
    try {
        const nombreProd = await ask("Ingrese el nombre del producto:\n");
        const precioProd = await ask("Ingrese el precio del producto:\n");
        const cantProd = await ask("Ingrese la cantidad de producto a comprar:\n");
        datosProd.close();
        return [nombreProd, precioProd, cantProd];
    } catch (err) {
        console.log("Ocurrió un error");
        datosProd.close();
        throw err;
    }
}

const datos = await asyncAsk();
const [nombreProd, precioProd, cantProd] = datos;

// Lectura de nombre con yargs
const { nombre } = yargs(hideBin(process.argv))
  .option("nombre", {
    alias: "n",
    type: "string",
    describe: "Nombre del archivo JSON",
    demandOption: true,
  })
  .help()
  .parse();

const rutaArchivo = `${nombre}.json`;

// Verificación de escritura
if (fs.existsSync(rutaArchivo)) {
    const productos = JSON.parse(fs.readFileSync(rutaArchivo, "utf-8"));
    
    // Asegurarse que sea un array
    const listaProd = Array.isArray(productos) ? productos : [productos];
    
    listaProd.push({ nombre: nombreProd, precio: precioProd, cantidad: cantProd });
    fs.writeFileSync(rutaArchivo, JSON.stringify(listaProd, null, 2));
} else {
    fs.writeFileSync(rutaArchivo, JSON.stringify([{ nombre: nombreProd, precio: precioProd, cantidad: cantProd }], null, 2));
}

if (fs.existsSync(rutaArchivo)) {
    const productosCargados = fs.readFileSync(rutaArchivo, "utf-8");
    console.log(`Los productos cargados son:\n${productosCargados}`);
}
