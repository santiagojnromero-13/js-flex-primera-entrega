
const productos = [
  { id: 1, nombre: "Camionero Algarrobo Black", precio: 7500 },
  { id: 2, nombre: "Camionero Algarrobo Claro", precio: 7500 },
  { id: 3, nombre: "Imperial Algarrobo Negro", precio: 16800 },
  { id: 4, nombre: "Camionero Base Cuero Crudo", precio: 12500 },
  { id: 5, nombre: "Bombilla Pico de Loro Mini", precio: 3000 }
];

// ✅ Mostrar lista inicial al cargar
(function mostrarListaInicial() {
  let texto = "📦 Lista inicial de productos disponibles:\n\n";
  productos.forEach(p => {
    console.log(`ID: ${p.id} | ${p.nombre} - $${p.precio}`);
    texto += `ID: ${p.id} | ${p.nombre} - $${p.precio}\n`;
  });
  alert(texto);
})();


let carrito = []; 
const IVA = 0.21;


function toNumberOrNull(valor) {
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}


function listarProductos() {
  let texto = "📦 Lista de productos disponibles:\n\n";
  productos.forEach(p => {
    console.log(`ID: ${p.id} | ${p.nombre} - $${p.precio}`);
    texto += `ID: ${p.id} | ${p.nombre} - $${p.precio}\n`;
  });
  alert(texto);
}

function buscarProductoPorId(idProducto) {
  return productos.find(p => p.id === idProducto) || null;
}

function agregarAlCarrito(idProducto, cantidad) {
  const producto = buscarProductoPorId(idProducto);
  if (!producto) return { ok: false, mensaje: "No existe un producto con ese ID." };
  if (cantidad <= 0) return { ok: false, mensaje: "La cantidad debe ser mayor a 0." };

  const item = carrito.find(i => i.id === idProducto);
  if (item) {
    item.cantidad += cantidad;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precioUnitario: producto.precio,
      cantidad
    });
  }
  return { ok: true, mensaje: `Se agregaron ${cantidad} "${producto.nombre}" al carrito.` };
}

function quitarDelCarrito(idProducto) {
  const indice = carrito.findIndex(i => i.id === idProducto);
  if (indice === -1) return { ok: false, mensaje: "Ese producto no está en el carrito." };
  const eliminado = carrito.splice(indice, 1)[0];
  return { ok: true, mensaje: `Se quitó "${eliminado.nombre}" del carrito.` };
}

function calcularSubtotal(carritoActual) {
  return carritoActual.reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0);
}

function aplicarDescuento(total, cupon) {
  if (!cupon) return { totalConDescuento: total, mensaje: "Sin cupón aplicado." };

  const code = cupon.trim().toUpperCase();

  switch (code) {
    case "MATE10": {
      const descuento = total * 0.10;
      return { totalConDescuento: Math.max(0, total - descuento), mensaje: "Cupón MATE10 (10% off) aplicado." };
    }
    case "BOMBILLA": {
      const descuento = 500;
      return { totalConDescuento: Math.max(0, total - descuento), mensaje: "Cupón BOMBILLA ($500 off) aplicado." };
    }
    default:
      return { totalConDescuento: total, mensaje: "Cupón inválido o no reconocido." };
  }
}

function verCarrito() {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }
  let texto = "🛒 Carrito actual:\n\n";
  carrito.forEach(item => {
    console.log(`ID:${item.id} | ${item.nombre} x${item.cantidad} - $${item.precioUnitario} c/u`);
    texto += `ID:${item.id} | ${item.nombre} x${item.cantidad} - $${item.precioUnitario} c/u\n`;
  });
  const subtotal = calcularSubtotal(carrito);
  console.log(`Subtotal: $${subtotal}`);
  texto += `\nSubtotal: $${subtotal}`;
  alert(texto);
}

function finalizarCompra() {
  if (carrito.length === 0) {
    alert("No tenés productos en el carrito.");
    return;
  }
  const subtotal = calcularSubtotal(carrito);
  const totalConIva = subtotal * (1 + IVA);

  const quiereCupon = confirm("¿Tenés un cupón de descuento? (Aceptar = Sí / Cancelar = No)");
  let totalFinal = totalConIva;
  let infoCupon = "Sin cupón aplicado.";

  if (quiereCupon) {
    const cuponIngresado = prompt("Ingresá tu cupón (ej: MATE10 o BOMBILLA):");
    const resultado = aplicarDescuento(totalConIva, cuponIngresado);
    totalFinal = resultado.totalConDescuento;
    infoCupon = resultado.mensaje;
  }

  const resumen = `
Resumen de compra:
- Subtotal: $${subtotal}
- IVA (${(IVA * 100).toFixed(0)}%): $${(subtotal * IVA).toFixed(2)}
- ${infoCupon}
- TOTAL: $${totalFinal.toFixed(2)}
  `;
  alert(resumen);
  console.log(resumen);

  const confirmar = confirm("¿Confirmás la compra?");
  if (confirmar) {
    alert("¡Gracias por tu compra! 🎉");
    carrito = [];
  } else {
    alert("La compra fue cancelada.");
  }
}

function mostrarMenuYObtenerOpcion() {
  const menu = `
=== Tienda de Mates ===
1) Listar productos
2) Agregar al carrito
3) Quitar del carrito
4) Ver carrito
5) Finalizar compra
Escribí el número de opción, o "salir" para terminar.
  `;
  const entrada = prompt(menu);
  return entrada ? entrada.trim().toLowerCase() : "salir";
}


let opcion = "";
alert("Bienvenido/a a la Tienda de Mates (abrí la consola con F12 o Ctrl+Shift+J).");

while (opcion !== "salir") {
  opcion = mostrarMenuYObtenerOpcion();

  switch (opcion) {
    case "1":
    case "listar":
      listarProductos();
      break;

    case "2":
    case "agregar": {
      const id = toNumberOrNull(prompt("Ingresá el ID del producto a agregar:"));
      const cantidad = toNumberOrNull(prompt("Ingresá la cantidad:"));
      if (id === null || cantidad === null) {
        alert("Debés ingresar números válidos.");
      } else {
        const r = agregarAlCarrito(id, cantidad);
        alert(r.mensaje);
      }
      break;
    }

    case "3":
    case "quitar": {
      const id = toNumberOrNull(prompt("Ingresá el ID del producto a quitar del carrito:"));
      if (id === null) {
        alert("Debés ingresar un número válido.");
      } else {
        const r = quitarDelCarrito(id);
        alert(r.mensaje);
      }
      break;
    }

    case "4":
    case "carrito":
      verCarrito();
      break;

    case "5":
    case "finalizar":
      finalizarCompra();
      break;

    case "salir":
      alert("¡Hasta luego!");
      break;

    default:
      alert('Opción no válida. Elegí 1, 2, 3, 4, 5 o escribí "salir".');
  }
}
