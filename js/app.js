//#region Variables y selectores
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");
//#endregion

//#region Clases
//#region Clase Presupuesto
class Presupuesto {
	/**
	 * Variables con modificadores de acceso privado
	 */
	#_presupuesto;
	#_restante;
	#_gastos;

	// Constructor
	constructor(presupueto) {
		this.#_presupuesto = Number(presupueto);
		this.#_restante = Number(presupueto);
		this.#_gastos = [];
	}

	//#region Getters and Setters
	//#region Getters
	get getPresupuesto() {
		return this.#_presupuesto;
	}
	get getRestante() {
		return this.#_restante;
	}
	get getGastos() {
		return this.#_gastos;
	}
	//#endregion

	//#region Setters
	set setPresupuesto(nuevoValor) {
		this.#_presupuesto = nuevoValor;
	}
	set setRestante(nuevoValor) {
		this.#_restante = nuevoValor;
	}
	//#endregion
	//#endregion

	//#region Métodos
	// Nuevo gasto
	nuevoGasto(gasto) {
		// Manera Video
		// this.#_gastos = [...this.#_gastos, gasto];

		// Manera propia
		this.#_gastos.push(gasto);
		console.log(this.#_gastos);
		this.#calcularRestante();
	}

	// elimina Gasto seleccionado
	eliminarGasto(id) {
		this.#_gastos = this.#_gastos.filter((gasto) => gasto.id !== id);
		this.#calcularRestante();
	}

	// Calcula el presupuesto restante
	#calcularRestante() {
		const gastado = this.#_gastos.reduce(
			(total, gasto) => total + gasto.cantidad,
			0
		);
		this.#_restante = this.#_presupuesto - gastado;
	}
	//#endregion
}
//#endregion

//#region Clase UserInterfase
class UI {
	// Inserta los valores iniciales
	insertarPresupuesto({ getPresupuesto, getRestante }) {
		// Destructurando
		// const { getPresupuesto, getRestante } = presupuestoObj;
		document.querySelector("#total").textContent = getPresupuesto;
		document.querySelector("#restante").textContent = getRestante;
	}

	// Muestra mensaje de tipo error o añadido
	mostrarMensaje(mensaje = "Campos Requeridos", tipo = "error") {
		// Crea elemento
		const div = document.createElement("div");
		div.textContent = mensaje;
		div.classList.add("text-center", "alert");

		// Verifica tipo
		if (tipo === "error") div.classList.add("alert-danger");
		else div.classList.add("alert-success");

		// Inserta el elemento
		document.querySelector(".primario").insertBefore(div, formulario);

		// Remueve el elemento
		setTimeout(() => {
			div.remove();
		}, 1500);
	}

	// Agrega Lista Gastos
	mostrarListaGastos({ getGastos }) {
		// Elimina lista anterios si existe
		this.#clearListaGastos();

		// Iterando gastos
		getGastos.forEach((gasto) => {
			// Destructurando obj
			const { cantidad, nombre, id } = gasto;

			// Creando un li para cada gasto
			const li = document.createElement("li");
			li.className =
				"list-group-item d-flex justify-content-between align-items-center";

			// li.setAttribute('data-id', id)
			li.dataset.id = id; //lo mismo que arriba pero más reciente

			// Agregando el html del gasto (formateando)
			li.innerHTML = `<span class='nombreGasto'>${nombre}</span> <span class='p-2 badge badge-primary bagde-pill'>$${cantidad}</span>`;

			// Boton para borrar gasto
			const btnBorrar = document.createElement("button");
			btnBorrar.className = "btn btn-danger borrar-gasto";
			btnBorrar.innerHTML = "Borrar";
			btnBorrar.onclick = () => {
				eliminarGasto(id);
			};

			// Agregando boton a la lista li
			li.appendChild(btnBorrar);

			// Agregando al html
			gastoListado.appendChild(li);
		});
	}

	// Borra lista de gastos
	#clearListaGastos() {
		while (gastoListado.firstChild) {
			gastoListado.firstChild.remove();
		}
	}

	// Actualiza el restante
	actulizarRestante({ getRestante }) {
		document.querySelector("#restante").textContent = getRestante;
	}

	// Comprueba el presupuesto
	comprobarPresupuesto({ getPresupuesto, getRestante }) {
		// Selecciona el div a actualizar
		const divRestante = document.querySelector(".restante");

		// Comprobar 75%
		if (getPresupuesto / 4 > getRestante) {
			divRestante.classList.remove("alert-success", "alert-warning");
			divRestante.classList.add("alert-danger");
		} else if (getPresupuesto / 2 > getRestante) {
			divRestante.classList.remove("alert-success");
			divRestante.classList.add("alert-warning");
		} else {
			divRestante.classList.remove("alert-danger", "alert-warning");
			divRestante.classList.add("alert-success");
		}

		// Si el total es <= 0
		if (getRestante <= 0) {
			ui.mostrarMensaje("El presupuesto se ha agotado");
			formulario.querySelector("button[type='submit']").disabled = true;
		} else formulario.querySelector("button[type='submit']").disabled = false;
	}
}
//#endregion
//#endregion

//Instanciando
const ui = new UI();
let presupuesto; // Más adelante sera instancia de la clase Presupuesto

//#region Eventos
(() => {
	document.addEventListener("DOMContentLoaded", preguntarPresupuesto);

	// Listen Formulario Submit
	formulario.addEventListener("submit", listenSubmit);
})(); //Funcion Autoejecutable
//#endregion

//#region Funciones
// Pregunta el presupuesto al inicio
function preguntarPresupuesto() {
	const presupuestoInicial = Number(prompt("Cuál es tu presupuesto ?"));

	// Validando Entrada
	if (
		presupuestoInicial === null ||
		isNaN(presupuestoInicial) ||
		presupuestoInicial <= 0 ||
		presupuestoInicial == ""
	)
		window.location.reload();

	presupuesto = new Presupuesto(presupuestoInicial);
	ui.insertarPresupuesto(presupuesto);
}

// Obtiene valor del campo Gasto
function saveGasto() {
	// Obteniedo dato ingresado
	const nombreGasto = document.querySelector("#gasto").value;

	// Validando entrada
	if (nombreGasto !== "") return nombreGasto;
	else {
		ui.mostrarMensaje("Nombre Gasto Requerido");
		return "";
	}
}

// Obtiene valor del campo Cantidad
function saveCantidad() {
	// Obteniedo dato ingresado
	const cantidad = document.querySelector("#cantidad").value;

	// Validando entrada
	if (Number(cantidad) > 0) return Number(cantidad);
	else if (cantidad === "") ui.mostrarMensaje("Cantidad Requerida");
	else if (Number(cantidad) <= 0) ui.mostrarMensaje("Cantidad no Válida");
	return 0;
}

// Listen Submit
function listenSubmit(e) {
	e.preventDefault();
	nombre = saveGasto();
	cantidad = saveCantidad();

	// Verificando entrada de datos
	if (nombre !== "" && cantidad !== 0) {
		const datosFormulario = { nombre, cantidad, id: Date.now() };
		// localStorage.setItem(datosFormulario.id, JSON.stringify(datosFormulario));
		formulario.reset();
		formulario.querySelector("#gasto").focus();
		presupuesto.nuevoGasto(datosFormulario);
		ui.mostrarListaGastos(presupuesto);
		ui.actulizarRestante(presupuesto);
		ui.comprobarPresupuesto(presupuesto);
		ui.mostrarMensaje("Agregado Correctamente", "ok");
	}
}

// Elimina gasto seleccionado
function eliminarGasto(id) {
	// Elimina el gasto en el obj presupuesto
	presupuesto.eliminarGasto(id);

	// Se recarga la interfaz
	ui.mostrarListaGastos(presupuesto);
	ui.actulizarRestante(presupuesto);
	ui.comprobarPresupuesto(presupuesto);
}
//#endregion
