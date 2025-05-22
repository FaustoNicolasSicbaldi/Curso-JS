let cuotaSeleccionada = false;
let cuotasAplicadas = null;

const mostrarFormularioProducto = () => {
 document.getElementById('formularioProducto').classList.remove('hidden');
};

const ocultarFormularioProducto = () => {
 document.getElementById('formularioProducto').classList.add('hidden');
};

const mostrarFormularioSeleccionProducto = () => {
 document.getElementById('formularioSeleccionProducto').classList.remove('hidden');
};

const ocultarFormularioSeleccionProducto = () => {
 document.getElementById('formularioSeleccionProducto').classList.add('hidden');
};

const mostrarFormularioCantidad = () => {
 document.getElementById('formularioCantidad').classList.remove('hidden');
};

const ocultarFormularioCantidad = () => {
 document.getElementById('formularioCantidad').classList.add('hidden');
};

const mostrarFormularioCuotas = () => {
 document.getElementById('formularioCuotas').classList.remove('hidden');
};

const ocultarFormularioCuotas = () => {
 document.getElementById('formularioCuotas').classList.add('hidden');
};

const mostrarSeguirComprando = () => {
 document.getElementById('seguirComprando').classList.remove('hidden');
};

const ocultarSeguirComprando = () => {
 document.getElementById('seguirComprando').classList.add('hidden');
};

const cargarProductosEnDesplegable = (tipoProducto) => {
 const productos = JSON.parse(localStorage.getItem('productos'));
 const productosFiltrados = productos.filter(producto => {
 if (tipoProducto === "1" && producto.numero <= 2) return true;
 if (tipoProducto === "2" && producto.numero >= 3 && producto.numero <= 4) return true;
 if (tipoProducto === "3" && producto.numero >= 5 && producto.numero <= 8) return true;
 if (tipoProducto === "4" && producto.numero >= 9) return true;
 return false;
 });
 const productoSelect = document.getElementById('producto');
 productoSelect.innerHTML = '';
 productosFiltrados.forEach(producto => {
 const option = document.createElement('option');
 option.value = producto.numero;
 option.text = `${producto.nombre} - $${producto.precio}`;
 productoSelect.appendChild(option);
 });
};

const comprarProducto = () => {
 let precioFinal = 0;
 let seguirComprando = true;
 let carrito = [];
 const productos = JSON.parse(localStorage.getItem('productos'));
 const agregarProductoAlCarrito = (productoNumero, cantidad) => {
 const producto = productos.find(p => p.numero === parseInt(productoNumero));
 precioFinal += producto.precio * cantidad;
 carrito.push({ ...producto, cantidad });
 localStorage.setItem('carrito', JSON.stringify(carrito));
 mostrarCarrito();
 mostrarContenidoCarrito();
 };
 document.getElementById('seleccionarTipoProducto').addEventListener('click', () => {
 const tipoProducto = document.getElementById('tipoProducto').value;
 ocultarFormularioProducto();
 cargarProductosEnDesplegable(tipoProducto);
 mostrarFormularioSeleccionProducto();
 });
 document.getElementById('seleccionarProducto').addEventListener('click', () => {
 const productoNumero = document.getElementById('producto').value;
 ocultarFormularioSeleccionProducto();
 mostrarFormularioCantidad();
 document.getElementById('agregarProducto').addEventListener('click', () => {
 const cantidad = parseInt(document.getElementById('cantidadProducto').value);
 agregarProductoAlCarrito(productoNumero, cantidad);
 ocultarFormularioCantidad();
 mostrarSeguirComprando();
 mostrarContenidoCarrito();
 });
 });
 document.getElementById('continuarComprando').addEventListener('click', () => {
 ocultarSeguirComprando();
 mostrarFormularioProducto();
 mostrarContenidoCarrito();
 });
 document.getElementById('finalizarCompra').addEventListener('click', () => {
 ocultarSeguirComprando();
 finalizarCompra(precioFinal, carrito);
 });
 mostrarFormularioProducto();
};

const mostrarCarrito = () => {
 const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
 const carritoDiv = document.getElementById('carrito');
 carritoDiv.innerHTML = '';
 carrito.forEach(item => {
 const itemElem = document.createElement('div');
 itemElem.innerHTML = `${item.nombre} - $${item.precio} x ${item.cantidad}`;
 carritoDiv.appendChild(itemElem);
 });
};

const mostrarContenidoCarrito = () => {
 const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
 const resultadoDiv = document.getElementById('resultado');
 let contenido = '<h3>Contenido del Carrito</h3>';
 carrito.forEach(item => {
 contenido += `<p>${item.nombre} - $${item.precio} x ${item.cantidad} = $${item.precio * item.cantidad}</p>`;
 });
 const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
 contenido += `<p><strong>Subtotal: $${subtotal}</strong></p>`;
 resultadoDiv.innerHTML = contenido;
};

const aplicarDescuento = (subtotal) => {
 const descuentoAplicado = subtotal >= 2000000 ? 10 : 0;
 return { 
 totalConDescuento: subtotal * (1 - descuentoAplicado / 100), 
 descuentoAplicado 
 };
};

const calcularInteres = (subtotal, cuotas) => {
 const porcentajeInteres = cuotas === 1 ? 0 :
 cuotas === 2 ? 5 :
 cuotas === 3 ? 10 :
 cuotas === 4 ? 12.5 :
 cuotas === 5 ? 15 : 20;
 return { 
 totalConInteres: Math.round(subtotal * (1 + porcentajeInteres / 100)), 
 porcentajeInteres 
 };
};

const finalizarCompra = (subtotal, carrito) => {
 const { totalConDescuento, descuentoAplicado } = aplicarDescuento(subtotal);
 if (cuotasAplicadas === null && !cuotaSeleccionada) {
 mostrarFormularioCuotas();
 document.getElementById('aplicarCuotas').addEventListener('click', () => {
 cuotasAplicadas = parseInt(document.getElementById('cuotas').value);
 const mensajeError = document.getElementById('mensajeError');
 if (cuotasAplicadas > 6) {
 if (!mensajeError) {
 const nuevoMensajeError = document.createElement('p');
 nuevoMensajeError.id = 'mensajeError';
 nuevoMensajeError.innerText = "El máximo de cuotas permitido es 6.";
 nuevoMensajeError.style.color = "red";
 document.getElementById('formularioCuotas').appendChild(nuevoMensajeError);
 }
 cuotasAplicadas = null;
 return;
 } else if (mensajeError) {
 mensajeError.remove();
 }
 cuotaSeleccionada = true;
 ocultarFormularioCuotas();
 const { totalConInteres, porcentajeInteres } = calcularInteres(totalConDescuento, cuotasAplicadas);
 let mensajeFinal = `Subtotal sin descuento: $${subtotal}`;
 if (descuentoAplicado > 0) {
 mensajeFinal += `\nDescuento aplicado: ${descuentoAplicado}%\nTotal con descuento: $${totalConDescuento}`;
 }
 mensajeFinal += `\nInterés aplicado: ${porcentajeInteres}%\nTotal con interés: $${totalConInteres}\nCuotas: ${cuotasAplicadas}\nImporte de cada cuota: $${(totalConInteres / cuotasAplicadas).toFixed(2)}`;
 document.getElementById('resultado').innerText = mensajeFinal;
 });
 }
 const resultadoDiv = document.getElementById('resultado');
 resultadoDiv.innerHTML = `Total a pagar: $${totalConInteres} en ${cuotasAplicadas} cuotas. Importe de cada cuota: $${(totalConInteres / cuotasAplicadas).toFixed(2)}`;
};

document.addEventListener('DOMContentLoaded', () => {
 const productos = JSON.parse(localStorage.getItem('productos'));
 const productosProcesadores = productos.filter(producto => producto.numero <= 2);
 const productosFuentes = productos.filter(producto => producto.numero >= 3 && producto.numero <= 4);
 const productosMemorias = productos.filter(producto => producto.numero >= 5 && producto.numero <= 8);
 const productosGabinetes = productos.filter(producto => producto.numero >= 9);
 const productosDivProcesadores = document.getElementById('productosProcesadores');
 productosProcesadores.forEach(producto => {
 const productoElem = document.createElement('div');
 productoElem.innerHTML = `${producto.nombre} - $${producto.precio}`;
 productosDivProcesadores.appendChild(productoElem);
 });
 const productosDivFuentes = document.getElementById('productosFuentes');
 productosFuentes.forEach(producto => {
 const productoElem = document.createElement('div');
 productoElem.innerHTML = `${producto.nombre} - $${producto.precio}`;
 productosDivFuentes.appendChild(productoElem);
 });
 const productosDivMemorias = document.getElementById('productosMemorias');
 productosMemorias.forEach(producto => {
 const productoElem = document.createElement('div');
 productoElem.innerHTML = `${producto.nombre} - $${producto.precio}`;
 productosDivMemorias.appendChild(productoElem);
 });
 const productosDivGabinetes = document.getElementById('productosGabinetes');
 productosGabinetes.forEach(producto => {
 const productoElem = document.createElement('div');
 productoElem.innerHTML = `${producto.nombre} - $${producto.precio}`;
 productosDivGabinetes.appendChild(productoElem);
 });
});

document.getElementById('seleccionarTipoProducto').addEventListener('click', comprarProducto);

