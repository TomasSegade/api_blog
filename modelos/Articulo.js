//-----Definimos el esquema que va a tener nuestro modelo, que datos y de que tipo, si son requeridos o no, etc

//-----Importamos el modulo schema y model de mongoose

const { Schema, model } = require("mongoose");

// Creamos la clase Articulo

const ArticuloSchema = Schema({
    titulo: {
        type: String,
        required:true
    },
    contenido: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    imagen: {
        type: String,
        default: "default.png"
    }
});

//-----Exportamos la clase y le ponemos nombre, en este caso "Articulo"

module.exports = model("Articulo",ArticuloSchema,"articulos");