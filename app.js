const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');

const {
  readProductos,
  addProducto,
  updateProducto,
  deleteProducto
} = require('./utils/fileUtils');

const app = express();
const PORT = 3000;

// handlebars instance
const hbsInstance = hbs.create();

// hbs configuration
app.engine('handlebars', hbsInstance.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// static files
app.use(express.static('public'));

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));

// ruta para mostrar todos los productos
// unica vista donde se listan los productos
// se crean, editan y eliminan productos desde un modal
app.get('/', (req, res) => {
  const productos = readProductos();
  res.render('home', { 
    title: 'Home Page',
    productos
  });
});

// ruta backend para crear producto
app.post('/productos', (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  if (!nombre || !descripcion || !precio) {
    return res.redirect('/');
  }
  // Generar id simple
  const id = Date.now().toString();
  try {
    addProducto({ id, nombre, descripcion, precio: Number(precio) });
  } catch (err) { 
    // Si el id existe, ignorar
  }
  res.redirect('/');
});

// ruta backend para editar producto
app.post('/productos/:id/edit', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;
  if (!nombre || !descripcion || !precio) {
    return res.redirect('/');
  }
  updateProducto(id, { nombre, descripcion, precio: Number(precio) });
  res.redirect('/');
});

// ruta backend para eliminar producto
app.post('/productos/:id/delete', (req, res) => {
  const { id } = req.params;
  deleteProducto(id);
  res.redirect('/');
});

// middleware 404
app.use((req, res, next) => {
  res.status(404).render('404', { title: '404 - Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});