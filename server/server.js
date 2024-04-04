const express = require("express");
const app = express();
const cors = require("cors");
const Jimp = require("jimp");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { createProxyMiddleware } = require('http-proxy-middleware');

// Ruta de la imagen que deseas cargar
let imagePath = "";
let outputImagePath = "";

const PORT = 8080;

/* STATIC */
app.use(express.static("public"));

app.use(express.json());

/* MIDDLEWARES */

// Configura el proxy para redirigir las solicitudes al servidor externo
/* app.use('/api', createProxyMiddleware({
  target: 'http://localhost:8080',
  changeOrigin: true,
  pathRewrite: {
    '^/api': ''
  },
  // Add this option to forward cookies and headers
  cookieDomainRewrite: {
    'localhost': 'your-domain.com'
  },
  // Add this option to forward POST requests
  secure: false,
  followRedirects: true,
  logLevel: 'debug'
})); */
// Middleware para habilitar CORS

app.use(cors());

/* app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Permitir acceso desde cualquier origen
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Métodos permitidos
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Encabezados permitidos
  res.header('Access-Control-Allow-Credentials', 'true'); // Permitir credenciales
  next();
}); */


app.get("/mostrarImg", (req, res) => {

  let ruta = req.query.ruta
  if (ruta) {
     res.sendFile(ruta, { root: __dirname }); 
     console.log("muestra ruta", ruta);

  } else {
    res.status(404).send("No se encontró la imagen");
  }
});

app.post("/guardarImg",async (req, res) => {
  try {
    console.log("Entro la peticion");
    const url = req.body;
    imagePath = url;

    // Cargar la imagen usando Jimp
    Jimp.read(imagePath, (err, image) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ status: "error", error: err });
      } else {
        // Redimensionar la imagen a un nuevo tamaño

        image.grayscale();

        const newWidth = 350; // Anchura deseada
        const newHeight =  Jimp.AUTO; // Altura automática (proporcional)
        image.resize(newWidth, newHeight);

        // Guardar la imagen redimensionada
        outputImagePath = `public/images/imagen_${uuidv4()}.jpg`;

        image.write(outputImagePath, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ status: "error", error: err });
          } else {
            console.log("Imagen redimensionada y guardada correctamente.");
            return res.json({ status: "ok", ruta: outputImagePath });
          }
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error });
  }
});

app.get("*", (req, res) => {
  res.send("<h1> Esta Página no exíste <h1>");
});
/* ESCUCHAR EL SERVIDOR*/
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});