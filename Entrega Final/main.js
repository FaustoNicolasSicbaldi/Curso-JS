 window.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));

  if (!usuario) {
    document.body.innerHTML = `
      <div class="container mt-5">
        <h2 class="text-center mb-4">FaTo Informática</h2>
        <div class="row justify-content-center">
          <div class="col-md-6 card p-4 shadow-sm">
            <h4 class="mb-3">Crear cuenta</h4>
            <div class="row">
              <div class="col-md-6 mb-2">
                <input type="text" id="nombreRegistro" class="form-control" placeholder="Nombre">
              </div>
              <div class="col-md-6 mb-2">
                <input type="text" id="apellidoRegistro" class="form-control" placeholder="Apellido">
              </div>
            </div>
            <input type="text" id="localidadRegistro" class="form-control mb-2" placeholder="Localidad">
            <div class="row">
              <div class="col-md-8 mb-2">
                <input type="text" id="calleRegistro" class="form-control" placeholder="Calle">
              </div>
              <div class="col-md-4 mb-2">
                <input type="text" id="alturaRegistro" class="form-control" placeholder="Altura">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-2">
                <input type="text" id="pisoRegistro" class="form-control" placeholder="Piso (opcional)">
              </div>
              <div class="col-md-6 mb-2">
                <input type="text" id="dptoRegistro" class="form-control" placeholder="Departamento (opcional)">
              </div>
            </div>
            <input type="email" id="emailRegistro" class="form-control mb-2" placeholder="Email">
            <input type="password" id="claveRegistro" class="form-control mb-3" placeholder="Contraseña">
            <button id="btnRegistrarse" class="btn btn-success w-100 mb-3">Registrarse</button>
            <hr>
            <h4 class="mb-3">¿Ya tenés cuenta?</h4>
            <input type="email" id="emailLogin" class="form-control mb-2" placeholder="Email">
            <input type="password" id="claveLogin" class="form-control mb-3" placeholder="Contraseña">
            <button id="btnIngresar" class="btn btn-outline-primary w-100">Ingresar</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btnRegistrarse').addEventListener('click', registrarUsuario);
    document.getElementById('btnIngresar').addEventListener('click', loguearUsuario);

    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const validarTexto = (id) => {
      const input = document.getElementById(id);
      input.addEventListener('input', () => {
        if (!soloLetras.test(input.value.trim())) {
          input.classList.add('is-invalid');
        } else {
          input.classList.remove('is-invalid');
        }
      });
    };

    validarTexto('nombreRegistro');
    validarTexto('apellidoRegistro');
    validarTexto('localidadRegistro');
    return;
  }

  const cerrarSesionBtn = document.createElement('button');
  cerrarSesionBtn.textContent = 'Cerrar sesión';
  cerrarSesionBtn.className = 'btn btn-outline-secondary btn-sm float-end';
  cerrarSesionBtn.addEventListener('click', () => {
    localStorage.removeItem('usuarioLogueado');
    location.reload();
  });
  document.body.prepend(cerrarSesionBtn);

  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  if (carrito.length > 0) {
    const formPago = document.getElementById('formularioPago');
    if (formPago) formPago.classList.remove('hidden');
  }

  const resultado = document.getElementById('resultado');
  const btnsCarrito = document.createElement('div');
  btnsCarrito.className = 'mb-3';

  const btnVaciar = document.createElement('button');
  btnVaciar.className = 'btn btn-danger me-2';
  btnVaciar.textContent = 'Vaciar Carrito';
  btnVaciar.addEventListener('click', vaciarCarrito);

  btnsCarrito.appendChild(btnVaciar);
  resultado.before(btnsCarrito);

  mostrarContenidoCarrito();

  fetch('productos.json')
    .then(res => res.json())
    .then(productos => {
      localStorage.setItem('productos', JSON.stringify(productos));
      const contenedor = document.getElementById('productos');
      contenedor.innerHTML = '';
      productos.forEach(prod => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-3';

        const card = document.createElement('div');
        card.className = 'card shadow-sm';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        cardBody.innerHTML = `
          <h5 class="card-title">${prod.nombre}</h5>
          <p class="card-text">${prod.familia}</p>
          <p class="card-text fw-bold">$${prod.precio}</p>
          <input id="cantidad-${prod.numero}" type="number" value="1" min="1" class="form-control mb-2" />
        `;

        const boton = document.createElement('button');
        boton.className = 'btn btn-primary w-100';
        boton.textContent = 'Agregar al carrito';
        boton.addEventListener('click', () => {
          window.agregarProductoDesdeLista(prod.numero);
        });

        cardBody.appendChild(boton);
        card.appendChild(cardBody);
        col.appendChild(card);
        contenedor.appendChild(col);
      });
    });
});

function vaciarCarrito() {
  localStorage.removeItem('carrito');
  mostrarContenidoCarrito();
  const formPago = document.getElementById('formularioPago');
  if (formPago) formPago.classList.add('hidden');
}

function mostrarContenidoCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const resultado = document.getElementById('resultado');
  if (!resultado) return;

  if (carrito.length === 0) {
    resultado.innerHTML = '<p class="text-muted">El carrito está vacío.</p>';
    return;
  }

  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));

  let subtotal = 0;
  let productosHtml = '<h4>Resumen del Carrito</h4><ul class="list-group mb-3">';
  carrito.forEach(item => {
    const total = item.precio * item.cantidad;
    subtotal += total;
    productosHtml += `<li class="list-group-item d-flex justify-content-between align-items-center">
      ${item.nombre}
      <span class="badge bg-primary rounded-pill">$${total}</span>
    </li>`;
  });
  productosHtml += '</ul>';

  let cantidadesHtml = '<h5 class="mt-3">Cantidades por producto</h5><ul class="list-group">';
  carrito.forEach(item => {
    cantidadesHtml += `<li class="list-group-item d-flex justify-content-between">
      ${item.nombre}
      <span class="text-muted">Cantidad: ${item.cantidad}</span>
    </li>`;
  });
  cantidadesHtml += '</ul>';

  resultado.innerHTML = productosHtml + cantidadesHtml + `<h5 class="mt-3">Subtotal: $${subtotal.toFixed(2)}</h5>`;
}

window.registrarUsuario = function () {
  const nombre = document.getElementById('nombreRegistro').value.trim();
  const apellido = document.getElementById('apellidoRegistro').value.trim();
  const localidad = document.getElementById('localidadRegistro').value.trim();
  const calle = document.getElementById('calleRegistro').value.trim();
  const altura = document.getElementById('alturaRegistro').value.trim();
  const direccion = `${calle} ${altura}`;
  const piso = document.getElementById('pisoRegistro').value.trim();
  const dpto = document.getElementById('dptoRegistro').value.trim();
  const email = document.getElementById('emailRegistro').value.trim();
  const clave = document.getElementById('claveRegistro').value;

  if (!nombre || !apellido || !email || !clave || !localidad || !calle || !altura) {
    Swal.fire('Campos incompletos', 'Por favor, completá todos los campos obligatorios.', 'warning');
    return;
  }

  const usuario = {
    nombre,
    apellido,
    email,
    clave,
    localidad,
    direccion,
    piso,
    dpto
  };

  localStorage.setItem('usuarioRegistrado', JSON.stringify(usuario));
  localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
  Swal.fire('Registro exitoso', 'Redirigiendo al simulador...', 'success').then(() => {
    location.reload();
  });
};

window.loguearUsuario = function () {
  const email = document.getElementById('emailLogin').value;
  const clave = document.getElementById('claveLogin').value;
  const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioRegistrado'));

  if (!usuarioGuardado || usuarioGuardado.email !== email || usuarioGuardado.clave !== clave) {
    return Swal.fire('Error de inicio de sesión', 'Email o contraseña incorrectos.', 'error');
  }

  localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioGuardado));
  location.reload();
};

window.agregarProductoDesdeLista = function (numeroProducto) {
  const productos = JSON.parse(localStorage.getItem('productos')) || [];
  const producto = productos.find(p => p.numero === numeroProducto);
  if (!producto) return;

  const cantidadInput = document.getElementById(`cantidad-${numeroProducto}`);
  const cantidad = parseInt(cantidadInput?.value) || 1;

  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const itemExistente = carrito.find(item => item.numero === numeroProducto);
  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carrito.push({ ...producto, cantidad });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarContenidoCarrito();

  const formPago = document.getElementById('formularioPago');
  if (formPago) formPago.classList.remove('hidden');
};
