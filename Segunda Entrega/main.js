const productos = [
    { numero: 1, nombre: "Amd Ryzen 7 5700G", precio: 195000 },
    { numero: 2, nombre: "Intel Core i9 13900K", precio: 1175000 },
    { numero: 3, nombre: "Fuente de alimentación Red Dragon 600Watts reales 80 Bronze Plus", precio: 88000 },
    { numero: 4, nombre: "Fuente de alimentación Sentey 850Watts reales Gold", precio: 120000 },
    { numero: 5, nombre: "Memoria Ram Hiksemi 8GB 3200MHz DDR4", precio: 16300 },
    { numero: 6, nombre: "Memoria Ram Hiksemi Armor White 16GB 3200MHz DDR4", precio: 34700 },
    { numero: 7, nombre: "Memoria Ram Kingston 8GB 5600MHz DDR5", precio: 42200 },
    { numero: 8, nombre: "Memoria Ram Hiksemi Armor 16GB 6000MHz DDR5", precio: 61000 },
    { numero: 9, nombre: "Gabinete V100 Vector TG FRGB Mesh Black Raidmax", precio: 88000 },
    { numero: 10, nombre: "Gabinete CM-W930 Fan X3 ARGB TG Full Tower White Solarmax", precio: 90000 }
];

const validarEntrada = (mensaje, validacion) => {
    let entrada;
    do {
        entrada = prompt(mensaje);
        if (!validacion(entrada)) {
            alert("Entrada inválida. Por favor, inténtelo de nuevo.");
        }
    } while (!validacion(entrada));
    return entrada;
};

const comprarProducto = () => {
    let precioFinal = 0;
    let seguirComprando = true;
    let carrito = [];

    const validarProducto = (producto) => productos.some(p => p.numero === parseInt(producto));
    const validarCantidad = (cantidad) => !isNaN(cantidad) && cantidad > 0;

    while (seguirComprando) {
        const tipoProducto = validarEntrada(
            "Seleccione el tipo de producto:\n" +
            "1. Procesadores\n" +
            "2. Fuentes de alimentación\n" +
            "3. Memoria RAM\n" +
            "4. Gabinetes",
            (tipo) => ["1", "2", "3", "4"].includes(tipo)
        );

        let productoNumero;
        let volver = false;

        while (!volver) {
            if (tipoProducto === "1") {
                productoNumero = validarEntrada(
                    "Seleccione el número del producto que desea:\n" +
                    "1. Amd Ryzen 7 5700G - $195,000\n" +
                    "2. Intel Core i9 13900K - $1,175,000\n" +
                    "3. Volver",
                    (numero) => ["1", "2", "3"].includes(numero)
                );
            } else if (tipoProducto === "2") {
                productoNumero = validarEntrada(
                    "Seleccione el número del producto que desea:\n" +
                    "1. Fuente de alimentación Red Dragon 600Watts reales 80 Bronze Plus - $88,000\n" +
                    "2. Fuente de alimentación Sentey 850Watts reales Gold - $120,000\n" +
                    "3. Volver",
                    (numero) => ["1", "2", "3"].includes(numero)
                );
            } else if (tipoProducto === "3") {
                const tipoMemoria = validarEntrada(
                    "Seleccione el tipo de memoria RAM:\n" +
                    "1. DDR4\n" +
                    "2. DDR5\n" +
                    "3. Volver",
                    (tipo) => ["1", "2", "3"].includes(tipo)
                );

                if (tipoMemoria === "1") {
                    productoNumero = validarEntrada(
                        "Seleccione el número del producto que desea:\n" +
                        "1. Memoria Ram Hiksemi 8GB 3200MHz DDR4 - $16,300\n" +
                        "2. Memoria Ram Hiksemi Armor White 16GB 3200MHz DDR4 - $34,700\n" +
                        "3. Volver",
                        (numero) => ["1", "2", "3"].includes(numero)
                    );
                } else if (tipoMemoria === "2") {
                    productoNumero = validarEntrada(
                        "Seleccione el número del producto que desea:\n" +
                        "1. Memoria Ram Kingston 8GB 5600MHz DDR5 - $42,200\n" +
                        "2. Memoria Ram Hiksemi Armor 16GB 6000MHz DDR5 - $61,000\n" +
                        "3. Volver",
                        (numero) => ["1", "2", "3"].includes(numero)
                    );
                } else {
                    volver = true;
                    continue;
                }
            } else {
                productoNumero = validarEntrada(
                    "Seleccione el número del producto que desea:\n" +
                    "1. Gabinete V100 Vector TG FRGB Mesh Black Raidmax - $88,000\n" +
                    "2. Gabinete CM-W930 Fan X3 ARGB TG Full Tower White Solarmax - $90,000\n" +
                    "3. Volver",
                    (numero) => ["1", "2", "3"].includes(numero)
                );
            }

            if (productoNumero === "3") {
                volver = true;
                continue;
            }

            const cantidad = parseInt(validarEntrada("¿Cuántos desea?", validarCantidad));
            const producto = productos.find(p => p.numero === parseInt(productoNumero));

            precioFinal += producto.precio * cantidad;
            carrito.push({ ...producto, cantidad });
            seguirComprando = confirm("¿Desea seguir comprando?");
            if (!seguirComprando) {
                return { precioFinal, carrito };
            }
            volver = true;
        }
    }

    return { precioFinal, carrito };
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

const finalizarCompra = () => {
    let { precioFinal: subtotal, carrito } = comprarProducto();
    let seguirAgregando = true;
    let cuotasAplicadas = null;

    while (seguirAgregando) {
        const { totalConDescuento, descuentoAplicado } = aplicarDescuento(subtotal);

        if (cuotasAplicadas === null) {
            const validarCuotas = (cuotas) => [1, 2, 3, 4, 5, 6].includes(parseInt(cuotas));
            cuotasAplicadas = parseInt(validarEntrada("Ingrese la cantidad de cuotas (1 a 6):", validarCuotas));
        }

        const { totalConInteres, porcentajeInteres } = calcularInteres(totalConDescuento, cuotasAplicadas);

        let mensajeFinal = `Subtotal sin descuento: $${subtotal}`;

        if (descuentoAplicado > 0) {
            mensajeFinal += `\nSubtotal con descuento (${descuentoAplicado}% aplicado): $${totalConDescuento}`;
        }

        mensajeFinal += `\nCantidad de cuotas seleccionadas: ${cuotasAplicadas} cuotas`;

        if (cuotasAplicadas > 1) {
            mensajeFinal += `\nPorcentaje de interés aplicado: ${porcentajeInteres}%`;
        }

        mensajeFinal += `\nTotal a pagar: $${totalConInteres}`;

        const cantidadTotalArticulos = carrito.reduce((acc, item) => acc + item.cantidad, 0);

        mensajeFinal += `\n\nCantidad total de artículos comprados: ${cantidadTotalArticulos}`;

        alert(mensajeFinal);

        seguirAgregando = confirm("¿Desea agregar más artículos?");
        if (seguirAgregando) {
            const { precioFinal: nuevoSubtotal, carrito: nuevoCarrito } = comprarProducto();
            subtotal += nuevoSubtotal;
            carrito = carrito.concat(nuevoCarrito);
        } else {
            alert("¡Gracias por su compra! ¡Hasta luego!");
        }
    }
};

finalizarCompra();
