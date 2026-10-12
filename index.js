// Capturo y proceso los comandos ingresados mediante process.argv[cite: 10].
// Utilizo destructuring para omitir las rutas de Node y capturar el método, la ruta y el resto de los argumentos
const [, , metodo, ruta, ...args] = process.argv;

// Uso métodos de strings y arrays para separar el recurso del identificador (ej: products/15)
const [recurso, id] = ruta ? ruta.split("/") : [];

// Configuro la URL apuntando a la API FakeStore
const BASE_URL = "https://fakestoreapi.com";

// Función asíncrona para implementar fetch e interactuar con la API
const hacerPeticion = async (url, opciones = {}) => {
  const respuesta = await fetch(url, opciones);

  if (!respuesta.ok) {
    throw new Error(`Error en la petición HTTP. Estado: ${respuesta.status}`);
  }

  return await respuesta.json();
};

try {
  // Consultar Todos los Productos o un Producto Específico
  if (metodo === "GET") {
    if (id) {
      // Petición GET para obtener y mostrar un producto correspondiente al productId indicado
      const data = await hacerPeticion(`${BASE_URL}/${recurso}/${id}`);
      console.log(data);
    } else {
      // Petición GET para devolver la lista completa de productos
      const data = await hacerPeticion(`${BASE_URL}/${recurso}`);
      console.log(data);
    }
  } 
  
  // Crear un Producto Nuevo
  else if (metodo === "POST") {
    // Uso destructuring para capturar los datos proporcionados
    const [title, price, category] = args;

    if (!title || !price || !category) {
      throw new Error(
        `Faltan datos, title, price y category ${recurso}`
      );
    }
    // Petición POST para agregar un nuevo producto y devolver el resultado
    const data = await hacerPeticion(`${BASE_URL}/${recurso}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Envío los datos formateados (price convertido a número)
      body: JSON.stringify({ title, price: Number(price), category }),
    });
    console.log(data);
  } 
  
  // Eliminar un Producto
  else if (metodo === "DELETE") {
    if (!id) {
      throw new Error("Se requiere un ID válido para ejecutar DELETE.");
    }

    const data = await hacerPeticion(`${BASE_URL}/${recurso}/${id}`, { method: "DELETE" });
    console.log(data);
  } 
  
  // Manejo de métodos no soportados
  else {
    throw new Error(`Método no soportado o mal escrito: ${metodo}`);
  }
} catch (error) {
  // Salida del error 
  console.log(error.message);
}