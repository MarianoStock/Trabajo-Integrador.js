/*
A continuacion podemos encontrar el código de un supermercado que vende productos.
El código contiene
    - una clase Producto que representa un producto que vende el super
    - una clase Carrito que representa el carrito de compras de un cliente
    - una clase ProductoEnCarrito que representa un producto que se agrego al carrito
    - una función findProductBySku que simula una base de datos y busca un producto por su sku
El código tiene errores y varias cosas para mejorar / agregar
​
Ejercicios
1) Arreglar errores existentes en el código
    a) Al ejecutar agregarProducto 2 veces con los mismos valores debería agregar 1 solo producto con la suma de las cantidades.    
    b) Al ejecutar agregarProducto debería actualizar la lista de categorías solamente si la categoría no estaba en la lista.
    c) Si intento agregar un producto que no existe debería mostrar un mensaje de error.
​
2) Agregar la función eliminarProducto a la clase Carrito
    a) La función eliminarProducto recibe un sku y una cantidad (debe devolver una promesa)
    b) Si la cantidad es menor a la cantidad de ese producto en el carrito, se debe restar esa cantidad al producto
    c) Si la cantidad es mayor o igual a la cantidad de ese producto en el carrito, se debe eliminar el producto del carrito
    d) Si el producto no existe en el carrito, se debe mostrar un mensaje de error
    e) La función debe retornar una promesa
​
3) Utilizar la función eliminarProducto utilizando .then() y .catch()
​
*/


// Cada producto que vende el super es creado con esta clase
class Producto {
    sku; // Identificador único del producto
    nombre; // Su nombre
    categoria; // Categoría a la que pertenece este producto
    precio; // Su precio
    stock; // Cantidad disponible en stock
  
    constructor(sku, nombre, precio, categoria, stock) {
      this.sku = sku;
      this.nombre = nombre;
      this.categoria = categoria;
      this.precio = precio;
  
      // Si no me definen stock, pongo 10 por default
      if (stock) {
        this.stock = stock;
      } else {
        this.stock = 10;
      }
    }
  }
  
  // Cada producto que se agrega al carrito es creado con esta clase
  class ProductoEnCarrito {
    sku; // Identificador único del producto
    nombre; // Su nombre
    cantidad; // Cantidad de este producto en el carrito
  
    constructor(sku, nombre, cantidad) {
      this.sku = sku;
      this.nombre = nombre;
      this.cantidad = cantidad;
    }
  }
  
  // Creo todos los productos que vende mi super
  const queso = new Producto("KS944RUR", "Queso", 10, "lacteos", 4);
  const gaseosa = new Producto("FN312PPE", "Gaseosa", 5, "bebidas");
  const cerveza = new Producto("PV332MJ", "Cerveza", 20, "bebidas");
  const arroz = new Producto("XX92LKI", "Arroz", 7, "alimentos", 20);
  const fideos = new Producto("UI999TY", "Fideos", 5, "alimentos");
  const lavandina = new Producto("RT324GD", "Lavandina", 9, "limpieza");
  const shampoo = new Producto("OL883YE", "Shampoo", 3, "higiene", 50);
  const jabon = new Producto("WE328NJ", "Jabon", 4, "higiene", 3);
  
  // Genero un listado de productos. Simulando base de datos
  const productosDelSuper = [
    queso,
    gaseosa,
    cerveza,
    arroz,
    fideos,
    lavandina,
    shampoo,
    jabon,
  ];
  
  // Cada cliente que venga a mi super va a crear un carrito
  class Carrito {
    productos; // Lista de productos agregados
    categorias; // Lista de las diferentes categorías de los productos en el carrito
    precioTotal; // Lo que voy a pagar al finalizar mi compra
  
    // Al crear un carrito, empieza vacío
    constructor() {
      this.precioTotal = 0;
      this.productos = [];
      this.categorias = [];
    }
  
    /**
     * función que agrega @{cantidad} de productos con @{sku} al carrito
     */
  
    async agregarProducto(sku, cantidad) {
      console.log(`Agregando ${cantidad} ${sku}`);
  
      let producto;
      try {
        producto = await findProductBySku(sku);
      } catch (error) {
        console.error("Este producto NO existe"); // Arroja un mensaje de error al no encontrar un sku coincidente
        return;
      }
  
      console.log("Producto encontrado", producto);
  
      // Verificar si el producto ya existe en el carrito
      const productoExistente = this.productos.find((p) => p.sku === sku);
  
      // En el caso de existir en el carrito, solo suma la cantidad
      if (productoExistente) {
        console.log(`El producto ${sku} ya está en el carrito.`);
        productoExistente.cantidad += cantidad;
        this.precioTotal += producto.precio * cantidad;
        return;
      }
  
      // Verifica que la categoría no exista al agregar el producto nuevo, en caso de hacerlo, la elimina.
      if (this.categorias.includes(producto.categoria)) {
        const categoriaIndex = this.categorias.indexOf(producto.categoria);
        this.categorias.splice(categoriaIndex, 1);
      }
  
      const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad);
      this.productos.push(nuevoProducto);
      this.precioTotal += producto.precio * cantidad;
      this.categorias.push(producto.categoria);
    }
    
    async eliminarProducto(sku, cantidad) {
        console.log(`Eliminando ${cantidad} ${sku}`);
        
        findProductBySku(sku)
          .then((producto) => {
            const productoExistente = this.productos.find((p) => p.sku === sku);
      
            //cuando la cantidad existente en el carrito es mayor que la cantidad a desconstar, entonces..
            if (productoExistente) {
              if (productoExistente.cantidad > cantidad) {
                productoExistente.cantidad -= cantidad;
                this.precioTotal -= producto.precio * cantidad;
              } else { // de no ser asi, va a eliminar el producto y categoria
                const index = this.productos.indexOf(productoExistente);
                this.productos.splice(index, 1);
                this.precioTotal -= producto.precio * productoExistente.cantidad;
                if (!this.productos.find((p) => p.categoria === producto.categoria)) {
                  const categoriaIndex = this.categorias.indexOf(producto.categoria);
                  this.categorias.splice(categoriaIndex, 1);
                }
              }
            } else {
              console.log(`El producto ${sku} no está en el carrito.`);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
      
    
      
  }       

  // Función que busca un producto por su sku en "la base de datos"
  function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundProduct = productosDelSuper.find(
          (producto) => producto.sku === sku
        );
        if (foundProduct) {
          resolve(foundProduct);
        } else {
          reject(`El producto ${sku} no existe`);
        }
      }, 1500);
    });
  }




  const carrito = new Carrito();

  carrito.agregarProducto("WE328NJ", 5);
  carrito.agregarProducto("OL883YE", 5);
  console.log(carrito);
setTimeout(()=> {carrito.eliminarProducto("WE328NJ", 2), console.log(carrito)}, 1700);
  