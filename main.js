const comprarProducto = () => {
    let producto;
    let cantidad;
    let precioFinal = 0;
    let seguirComprando = true;

    do {
       
        do {
            producto = prompt("¿Qué familia de procesador desea? Amd Ryzen 7 5700G o Intel Core i9 13900K");
            if (producto !== "Amd Ryzen 7 5700G" && producto !== "Intel Core i9 13900K") {
                alert("Por favor, seleccione un producto válido.");
            }
        } while (producto !== "Amd Ryzen 7 5700G" && producto !== "Intel Core i9 13900K");

        
        do {
            cantidad = parseInt(prompt("¿Cuántos desea?"));
            if (isNaN(cantidad) || cantidad <= 0) {
                alert("Ingrese una cantidad válida (mayor a 0).");
            }
        } while (isNaN(cantidad) || cantidad <= 0);

        
        let precio = producto === "Amd Ryzen 7 5700G" ? 195000 : 1175000;

        precioFinal += precio * cantidad;
        seguirComprando = confirm("¿Desea seguir comprando?");
    } while (seguirComprando);

    return precioFinal;
};


const aplicarDescuento = (subtotal) => {
    let descuentoAplicado = subtotal >= 2000000 ? 10 : 0;
    return { 
        totalConDescuento: subtotal * (1 - descuentoAplicado / 100), 
        descuentoAplicado 
    };
};


const calcularInteres = (subtotal) => {
    let cuotas;
    let porcentajeInteres;

    do {
        cuotas = parseInt(prompt("Ingrese la cantidad de cuotas (1 a 6):"));
        if ([1, 2, 3, 4, 5, 6].includes(cuotas)) {
            porcentajeInteres = cuotas === 1 ? 0 :
                                cuotas === 2 ? 5 :
                                cuotas === 3 ? 10 :
                                cuotas === 4 ? 12.5 :
                                cuotas === 5 ? 15 : 20;
        } else {
            alert("Por favor, ingrese un número de cuotas válido (1 a 6).");
        }
    } while (![1, 2, 3, 4, 5, 6].includes(cuotas));

    return { 
        totalConInteres: Math.round(subtotal * (1 + porcentajeInteres / 100)), 
        cuotasAplicadas: cuotas, 
        porcentajeInteres 
    };
};


const subtotal = comprarProducto();
const { totalConDescuento, descuentoAplicado } = aplicarDescuento(subtotal);
const { totalConInteres, cuotasAplicadas, porcentajeInteres } = calcularInteres(totalConDescuento);


let mensajeFinal = `Subtotal sin descuento: $${subtotal}`;

if (descuentoAplicado > 0) {
    mensajeFinal += `\nSubtotal con descuento (${descuentoAplicado}% aplicado): $${totalConDescuento}`;
}

mensajeFinal += `\nCantidad de cuotas seleccionadas: ${cuotasAplicadas} cuotas`;


if (cuotasAplicadas > 1) {
    mensajeFinal += `\nPorcentaje de interés aplicado: ${porcentajeInteres}%`;
}

mensajeFinal += `\nTotal a pagar: $${totalConInteres}`;

alert(mensajeFinal);