const productos = [
    { numero: 1, nombre: "Amd Ryzen 7 5700G", precio: 195000, familia: "Procesadores" },
    { numero: 2, nombre: "Intel Core i9 13900K", precio: 1175000, familia: "Procesadores" },
    { numero: 3, nombre: "Fuente de alimentación Red Dragon 600Watts reales 80 Bronze Plus", precio: 88000, familia: "Fuentes de alimentación" },
    { numero: 4, nombre: "Fuente de alimentación Sentey 850Watts reales Gold", precio: 120000, familia: "Fuentes de alimentación" },
    { numero: 5, nombre: "Memoria Ram Hiksemi 8GB 3200MHz DDR4", precio: 16300, familia: "Memoria RAM" },
    { numero: 6, nombre: "Memoria Ram Hiksemi Armor White 16GB 3200MHz DDR4", precio: 34700, familia: "Memoria RAM" },
    { numero: 7, nombre: "Memoria Ram Kingston 8GB 5600MHz DDR5", precio: 42200, familia: "Memoria RAM" },
    { numero: 8, nombre: "Memoria Ram Hiksemi Armor 16GB 6000MHz DDR5", precio: 61000, familia: "Memoria RAM" },
    { numero: 9, nombre: "Gabinete V100 Vector TG FRGB Mesh Black Raidmax", precio: 88000, familia: "Gabinetes" },
    { numero: 10, nombre: "Gabinete CM-W930 Fan X3 ARGB TG Full Tower White Solarmax", precio: 90000, familia: "Gabinetes" }
];

// Guardar productos en localStorage
localStorage.setItem('productos', JSON.stringify(productos));

// Mostrar productos en el DOM agrupados por familia
const productosDiv = document.getElementById('productos');
const familias = {};

productos.forEach(producto => {
    if (!familias[producto.familia]) {
        familias[producto.familia] = [];
    }
    familias[producto.familia].push(producto);
});

for (const familia in familias) {
    const familiaElem = document.createElement('div');
    familiaElem.innerHTML = `<h2>${familia}</h2>`;
    familias[familia].forEach(producto => {
        const productoElem = document.createElement('div');
        productoElem.innerHTML = `${producto.nombre} - $${producto.precio}`;
        familiaElem.appendChild(productoElem);
    });
    productosDiv.appendChild(familiaElem);
}
