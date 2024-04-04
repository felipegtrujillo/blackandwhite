
const leerInput = document.getElementById("input");
const form = document.getElementById("myForm")
const btnEnviar = document.getElementById("btn");
const btnCargar = document.getElementById("btn2");

btnEnviar.addEventListener("click", async function (event) {

  event.preventDefault();

  try {
    
    const imageUrl  = leerInput.value;

    if (!imageUrl) {
      throw new Error("Debes ingresar una URL de imagen válida");
    }

    const response = await fetch('http://localhost:8080/guardarImg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: imageUrl }),
    });

    const data = await response.json();

    if (data.status === "ok") {
      const rutaImg = data.ruta;

      const responseImg = await fetch(`http://localhost:8080/mostrarImg?ruta=${rutaImg}`);

      if (!responseImg.ok) {
        throw new Error("Error al obtener la imagen del servidor");
      }

      const blob = await responseImg.blob();

      const urlImagen = URL.createObjectURL(blob);

      const imagenContainer = document.getElementById("imagen-container");
      imagenContainer.innerHTML = '';
      const imagen = document.createElement('img');
      imagen.src = urlImagen;
      imagenContainer.appendChild(imagen);
      console.log("Imagen insertada correctamente");
      modal.style.display = "block";
 
    } else {
      console.log("No se pudo guardar la imagen");
    }
  } catch (error) {
    console.error("Hubo un error:", error);
    // Aquí puedes manejar el error de acuerdo a tus necesidades, como mostrar un mensaje al usuario
  }


});



