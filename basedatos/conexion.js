// Importamos mongoose para conectarnos mediante submetodos a la base de datos

const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
// Creamos metodo para conectarnos a la base de datos

const conexion = async()=>{

    try{

        await mongoose.connect("mongodb://127.0.0.1:27017/mi_blog");
        console.log("Conectado correctamente a la base de datos mi_blog");

    } catch (error){
        console.log(error);
        throw new Error ("No se ha podido conectar a la base de datos");

    }

}

// Exportamos el modulo 
module.exports = {
    conexion
}