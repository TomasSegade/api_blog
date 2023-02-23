
const Articulo = require("../modelos/Articulo");
const { validarArticulo } = require("../helpers/validar");
const fs = require("fs");
const { error } = require("console");
const path = require("path");

const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "soy una accion de prueba en mi controlador de articulos"
    });
};

const curso = (req, res) => {

    console.log("Se ha ejecutado el endpoint probrando");

    return res.status(200).json([{
        curso: "Master en react",
        autor: "Victor Robles",
        url: "victorroblesweb.es/master-react"
    },
    {
        curso: "Master en react",
        autor: "Victor Robles",
        url: "victorroblesweb.es/master-react"

    },
    ]);

};

const crear = (req, res) => {

    // Recoger parametros por post a guardar
    let parametros = req.body;

    // Validar datos
    try {
        validarArticulo(parametros);
    }
    catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        });
    }
    // Crear objeto a guardar y asignar valores
    const articulo = new Articulo(parametros);

    // Guardar el articulo en la base de datos
    articulo.save((error, articuloGuardado) => {

        if (error || !articuloGuardado) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha guardado el articulo"
            });
        }

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "Articulo creado con exito"
        })

    });

};

const listar = (req, res) => {

    // Traigo los datos
    let consulta = Articulo.find({});

    // Filtro para ver los ultimos 3
    if (req.params.ultimos) {
        consulta.limit(3);
    }

    // Ordenar de forma descendente y ejecutar
    consulta.sort({ fecha: -1 })
        .exec((error, articulos) => {

            if (error || !articulos) {
                return res.status(400).json({
                    status: "error",
                    mensaje: "No se ha guardado el articulo"
                });
            }

            return res.status(200).send({
                status: "success",
                contador: articulos.length,
                articulos
            });

        });
};

const uno = (req, res) => {

    // Recoger id por url
    let id = req.params.id;

    // Buscar articulo
    Articulo.findById(id, (error, articulo) => {

        // Si no existe devuelvo error
        if (error || !articulo) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha guardado el articulo"
            });
        }

        // Si existe devuelvo resultado
        return res.status(200).json({
            status: "success",
            articulo
        });

    });

};

const borrar = (req, res) => {

    let articuloId = req.params.id;

    Articulo.findOneAndDelete({ _id: articuloId }, (error, articulo_borrado) => {

        if (error || !articulo_borrado) {

            res.status(500).json({
                status: "error",
                mensaje: "No se ha borrado el articulo"
            });

        };

        return res.status(200).json({
            status: "success",
            articulo_borrado,
            mensaje: "Articulo borrado"
        });

    });

};

const editar = (req, res) => {

    // Id del articulo a editar
    let articuloId = res.params.id;

    // Datos del body
    let parametros = req.body;

    // Validar datos
    try {
        validarArticulo(parametros);
    }
    catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        });
    }
    // Buscar y actualizar articulo
    Articulo.findOneAndUpdate({ _id: articuloId }, parametros, { new: true }, (error, articuloActualizado) => {

        if (error || !articuloActualizado) {
            return res.status(500).json({
                status: "error",
                mensaje: "error al actualizar"
            })
        }

        // Devolver respuesta
        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado
        })
    })



}

const subir = (req, res) => {

    // Configurar multer

    // Recoger el fichero de imagen subido
    if (!req.file && !res.files) {
        return res.status(400).json({
            status: "error",
            mensaje: "peticion invalida"
        });
    }

    // Nombre del archivo
    let archivo = req.file.originalname;

    // Extension del archivo
    let archivoSplit = archivo.split("\.");
    let extencion = archivoSplit[1];

    // Comprobar extencion correcta 
    if (extencion != "png" && extencion != "jpg"
        && extencion != "jpeg" || extencion != "gif") {

        // Borrar archivo y dar repuesta
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                mensaje: "Imagen invalida"
            });
        })
    }
    else {


        // Id del articulo a editar
        let articuloId = res.params.id;

        // Buscar y actualizar articulo
        Articulo.findOneAndUpdate({ _id: articuloId }, {imagen: req.file.filename}, { new: true }, (error, articuloActualizado) => {

            if (error || !articuloActualizado) {
                return res.status(500).json({
                    status: "error",
                    mensaje: "error al actualizar"
                })
            }

            // Devolver respuesta
            return res.status(200).json({
                status: "success",
                articulo: articuloActualizado,
                fichero: req.file
            })
        })


    }

}

const imagen = (res,req) => {

    let fichero = req.params.fichero;
    let ruta = "./imagenes/articulos"+fichero;

    fs.stat(ruta, (error, existe) => {
        if(existe){
            return res.sendFile(path.resolve(ruta));
        }
        else{
            return res.status(404).json({
                status: "error",
                mensaje: "la imagen no existe"
            })
        }
    })

}


const buscador = (req, res) => {

    // Sacar el string de busqueda
    let busqueda = req.params.busqueda;

    // Find OR

    Articulo.find({
        "$or": [
            {"titulo": {"$regex": busqueda, "$options": "i"}},
            {"contenido": {"$regex": busqueda, "$options": "i"}},
        
    ]})
    .sort({fecha: -1})
    .exec((error, articulosEncontrados) => {

            if(error || !articulosEncontrados || articulosEncontrados.length <= 0){
                return res.status(404).json({
                    status: "error",
                    mensaje: "no se han encontrado articulos"
                });
            }
            
            return res.status(200).json({
                status: "success",
                mensaje: "Articulo encontrado",
                articulos: articulosEncontrados
            })
    });

}
module.exports = {
    prueba,
    curso,
    crear,
    listar,
    uno,
    borrar,
    editar,
    validarArticulo,
    subir,
    imagen,
    buscador
}

