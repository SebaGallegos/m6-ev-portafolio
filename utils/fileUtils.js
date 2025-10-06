const fs = require('fs');
const path = require('path');

// lee los productos desde productos.json y los devuelve como un array de objetos
const readProductos = () => {
  const filePath = path.join(__dirname, '..', 'productos.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// guarda (sobrescribe) el array de productos en productos.json
const saveProductos = (newData) => {
  const filePath = path.join(__dirname, '..', 'productos.json');
  fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
}

// añade un nuevo producto al array y lo guarda en productos.json
const addProducto = (nuevoProducto) => {
  const productos = readProductos();
  // verificar si el id ya existe
  // el metodo .some devuelve true solo si hay al menos un elemento que cumple la condición
  const existeProducto = productos.some(producto => producto.id === nuevoProducto.id);
  if (existeProducto) throw new Error('Producto ya existe');
  const nuevosProductos = [...productos, nuevoProducto];
  saveProductos(nuevosProductos);
  return {
    message: 'Producto añadido exitosamente',
    producto: nuevoProducto
  };
}

// actualiza un producto existente por id y guarda el array actualizado en productos.json
const updateProducto = (id, productoActualizado) => {
  const productos = readProductos();
  const productoIndex = productos.findIndex(producto => producto.id === id);
  if (productoIndex === -1) return null;
  // mantener el id original y actualizar el resto de campos
  productos[productoIndex] = { ...productos[productoIndex], ...productoActualizado, id };
  saveProductos(productos);
  return { message: 'Producto actualizado exitosamente', producto: productos[productoIndex] };
}

// elimina un producto por id y guarda el array actualizado en productos.json
const deleteProducto = (id) => {
  const productos = readProductos();
  // se encarga de encontrar primero el índice del producto a eliminar
  const productoIndex = productos.findIndex(producto => producto.id === id);
  if (productoIndex === -1) return null;

  // se reconstruye el array de productos sin el producto a eliminar
  const otrosProductos = productos.filter(producto => producto.id !== id);
  saveProductos(otrosProductos);
  return { message: 'Producto eliminado exitosamente' };
}

module.exports = {
  readProductos,
  addProducto,
  updateProducto,
  deleteProducto
};