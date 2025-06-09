const carritoDiv = document.getElementById('carrito');
const mensajesDiv = document.createElement('div');
mensajesDiv.id = 'mensajes';
mensajesDiv.className = 'mt-3';
carritoDiv.appendChild(mensajesDiv);

function validarCampoInput(input, regex, mensajeError, maxLength = null) {
  input.addEventListener('input', () => {
    if (maxLength && input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);
    }
    if (!regex.test(input.value)) {
      input.classList.add('is-invalid');
    } else {
      input.classList.remove('is-invalid');
    }
  });
}

validarCampoInput(document.getElementById('nombreTitular'), /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, 'Solo letras');
validarCampoInput(document.getElementById('numeroTarjeta'), /^\d*$/, 'Solo números', 16);
validarCampoInput(document.getElementById('cvv'), /^\d*$/, 'Solo números', 3);

document.querySelector('#btnConfirmarPago')?.addEventListener('click', procesarPago);

function mostrarMensaje(texto, tipo) {
  mensajesDiv.innerHTML = `<div class="alert alert-${tipo}" role="alert">${texto}</div>`;
}

function procesarPago() {
  const nombreCompleto = document.getElementById('nombreTitular').value.trim();
  const numero = document.getElementById('numeroTarjeta').value.trim();
  const vencimiento = document.getElementById('vencimiento').value.trim();
  const cvv = document.getElementById('cvv').value.trim();
  const tipo = document.getElementById('tipoTarjeta').value;
  const cuotas = parseInt(document.getElementById('cuotasPago')?.value || 1);
  const metodoEntrega = document.getElementById('metodoEntrega').value;
  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado')) || {};

  let costoEnvio = 0;
  let direccionEnvio = '';

  if (metodoEntrega === 'envio') {
    costoEnvio = obtenerCostoEnvio(cuotas);
    direccionEnvio = `${usuario.direccion}, ${usuario.localidad}`;
    if (usuario.piso) direccionEnvio += `, Piso ${usuario.piso}`;
    if (usuario.dpto) direccionEnvio += `, Dpto ${usuario.dpto}`;
  }

  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const soloNumeros = /^\d+$/;
  const formatoVencimiento = /^(0[1-9]|1[0-2])\/(\d{2})$/;

  if (!nombreCompleto || !numero || !vencimiento || !cvv || !tipo) {
    mostrarMensaje('Por favor completá todos los campos de la tarjeta.', 'warning');
    return;
  }

  if (!soloLetras.test(nombreCompleto)) {
    mostrarMensaje('El nombre y apellido solo deben contener letras.', 'warning');
    return;
  }

  if (!soloNumeros.test(numero) || numero.length !== 16) {
    mostrarMensaje('El número de tarjeta debe contener exactamente 16 dígitos numéricos.', 'warning');
    return;
  }

  if (!soloNumeros.test(cvv) || cvv.length !== 3) {
    mostrarMensaje('El código de seguridad debe contener exactamente 3 números.', 'warning');
    return;
  }

  if (!formatoVencimiento.test(vencimiento)) {
    mostrarMensaje('El vencimiento debe tener el formato MM/AA.', 'warning');
    return;
  }

  const [mesStr, anioStr] = vencimiento.split('/');
  const mes = parseInt(mesStr);
  const anio = parseInt('20' + anioStr);
  const ahora = new Date();
  const mesActual = ahora.getMonth() + 1;
  const anioActual = ahora.getFullYear();

  if (anio < anioActual || (anio === anioActual && mes < mesActual)) {
    mostrarMensaje('La tarjeta está vencida.', 'warning');
    return;
  }

  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  if (carrito.length === 0) {
    mostrarMensaje('Agregá productos antes de pagar.', 'info');
    return;
  }

  const recargo = obtenerRecargoPorCuotas(cuotas);
  const totalBase = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const totalConEnvio = totalBase + costoEnvio;
  const totalFinal = totalConEnvio * (1 + recargo);

  const resumen = `
    <strong>Método de Entrega:</strong> ${metodoEntrega === 'envio' ? 'Envío a domicilio' : 'Retiro en tienda'}<br>
    ${metodoEntrega === 'envio' ? `<strong>Dirección:</strong> ${direccionEnvio}<br>` : ''}
    ${metodoEntrega === 'envio' ? `<strong>Valor del Envío:</strong> $${costoEnvio.toFixed(2)}<br>` : ''}
    <strong>Cuotas:</strong> ${cuotas} cuota(s) (${(recargo * 100).toFixed(0)}% ${recargo < 0 ? 'descuento' : 'recargo'})<br>
    <strong>Valor Final:</strong> $${totalFinal.toFixed(2)}<br>
    <strong>Valor por cuota:</strong> $${(totalFinal / cuotas).toFixed(2)}
  `;

  const confirmacionDiv = document.createElement('div');
  confirmacionDiv.className = 'alert alert-info';
  confirmacionDiv.innerHTML = `<p><strong>Confirmar Pago</strong></p><p>${resumen}</p><button class="btn btn-success btn-sm">Confirmar</button> <button class="btn btn-secondary btn-sm">Cancelar</button>`;
  mensajesDiv.innerHTML = '';
  mensajesDiv.appendChild(confirmacionDiv);

  confirmacionDiv.querySelector('.btn-success').addEventListener('click', () => {
    const historial = JSON.parse(localStorage.getItem('historialPedidos')) || [];
    historial.push({
      fecha: new Date().toLocaleString(),
      carrito,
      metodoEntrega,
      costoEnvio,
      cuotas,
      recargo,
      totalFinal
    });
    localStorage.setItem('historialPedidos', JSON.stringify(historial));
    localStorage.removeItem('carrito');
    mostrarMensaje('Gracias por tu compra. ¡Pago realizado con éxito!', 'success');
    mostrarBotonesExportacion();
    setTimeout(() => location.reload(), 3000);
  });

  confirmacionDiv.querySelector('.btn-secondary').addEventListener('click', () => {
    mensajesDiv.innerHTML = '';
  });
}

function obtenerCostoEnvio(cuotas) {
  return cuotas > 1 ? 10000 : 0;
}

function obtenerRecargoPorCuotas(cuotas) {
  if (cuotas === 1) return -0.10;
  if (cuotas <= 6) return 0.15;
  if (cuotas <= 10) return 0.20;
  return 0.30;
}

function mostrarBotonesExportacion() {
  const botonExportar = document.createElement('button');
  botonExportar.textContent = 'Exportar Factura a CSV';
  botonExportar.className = 'btn btn-outline-primary mt-3';
  botonExportar.addEventListener('click', exportarCSV);

  const botonPDF = document.createElement('button');
  botonPDF.textContent = 'Exportar Factura a PDF';
  botonPDF.className = 'btn btn-outline-danger mt-3 ms-2';
  botonPDF.addEventListener('click', exportarPDF);

  carritoDiv.appendChild(botonExportar);
  carritoDiv.appendChild(botonPDF);
}

function exportarCSV() {
  const historial = JSON.parse(localStorage.getItem('historialPedidos')) || [];
  if (historial.length === 0) {
    mostrarMensaje('No hay historial para exportar.', 'warning');
    return;
  }

  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado')) || {};
  let csv = `Datos de Facturación:\n`;
  csv += `Nombre: ${usuario.nombre} ${usuario.apellido}\n`;
  csv += `Dirección: ${usuario.direccion}, ${usuario.localidad}`;
  if (usuario.piso) csv += `, Piso ${usuario.piso}`;
  if (usuario.dpto) csv += `, Dpto ${usuario.dpto}`;
  csv += `\n\n`;

  historial.forEach(pedido => {
    const total = pedido.carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    csv += `Fecha: ${pedido.fecha}\n`;
    csv += `Método de Entrega: ${pedido.metodoEntrega || 'Desconocido'}\n`;
    if (pedido.metodoEntrega === 'envio') {
      csv += `Costo de Envío: $${pedido.costoEnvio || 0}\n`;
    }
    csv += `Cuotas: ${pedido.cuotas || 1} (${(pedido.recargo * 100).toFixed(0)}% ${pedido.recargo < 0 ? 'descuento' : 'recargo'})\n`;
    csv += `Total Final: $${pedido.totalFinal?.toFixed(2) || total.toFixed(2)}\n`;
    csv += `\nProductos:\n`;
    csv += `Producto,Cantidad,Precio Unitario,Total\n`;
    pedido.carrito.forEach(item => {
      csv += `"${item.nombre}",${item.cantidad},${item.precio},${item.precio * item.cantidad}\n`;
    });
    csv += `\n----------------------------------------\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'factura_compras.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportarPDF() {
  const historial = JSON.parse(localStorage.getItem('historialPedidos')) || [];
  if (historial.length === 0) {
    mostrarMensaje('No hay historial para exportar.', 'warning');
    return;
  }

  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado')) || {};
  const ventana = window.open('', '_blank');
  ventana.document.write('<html><head><title>Factura de Compra</title></head><body>');
  ventana.document.write('<h2>Datos de Facturación</h2>');
  ventana.document.write(`<p><strong>Nombre:</strong> ${usuario.nombre} ${usuario.apellido}</p>`);
  ventana.document.write(`<p><strong>Dirección:</strong> ${usuario.direccion}, ${usuario.localidad}`);
  if (usuario.piso) ventana.document.write(`, Piso ${usuario.piso}`);
  if (usuario.dpto) ventana.document.write(`, Dpto ${usuario.dpto}`);
  ventana.document.write('</p><hr>');

  historial.reverse().forEach(pedido => {
    const total = pedido.carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    ventana.document.write(`<h4>Fecha: ${pedido.fecha}</h4>`);
    ventana.document.write(`<p><strong>Método de Entrega:</strong> ${pedido.metodoEntrega || 'Desconocido'}</p>`);
    if (pedido.metodoEntrega === 'envio') {
      ventana.document.write(`<p><strong>Costo de Envío:</strong> $${pedido.costoEnvio || 0}</p>`);
    }
    ventana.document.write(`<p><strong>Cuotas:</strong> ${pedido.cuotas || 1} (${(pedido.recargo * 100).toFixed(0)}% ${pedido.recargo < 0 ? 'descuento' : 'recargo'})</p>`);
    ventana.document.write(`<p><strong>Total Final:</strong> $${pedido.totalFinal?.toFixed(2) || total.toFixed(2)}</p>`);
    ventana.document.write('<ul>');
    pedido.carrito.forEach(item => {
      ventana.document.write(`<li>${item.nombre} x ${item.cantidad} - $${item.precio * item.cantidad}</li>`);
    });
    ventana.document.write('</ul><hr>');
  });

  ventana.document.write('</body></html>');
  ventana.document.close();
  ventana.print();
}
