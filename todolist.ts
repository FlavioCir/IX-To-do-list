var titolo: HTMLInputElement;
var contenuto: HTMLInputElement;
var addBtn: HTMLElement;
var elencoHTML: HTMLElement;
var errore: HTMLElement;
var erroreElenco: HTMLElement;
var elenco = [];
var sovrascrivi: string;

window.addEventListener('DOMContentLoaded', init);

function init() {
	titolo = document.getElementById('titolo') as HTMLInputElement;
	contenuto = document.getElementById('contenuto') as HTMLInputElement;
	addBtn = document.getElementById('scrivi')!;
	elencoHTML = document.getElementById('elenco')!;
	errore = document.getElementById('errore')!;
	erroreElenco = document.getElementById('erroreElenco')!;
	printData();
	eventHandler();
}

function eventHandler() {
	addBtn.addEventListener('click', function () {
		if (sovrascrivi) {
			overwrite(sovrascrivi);
		} else {
			controlla();
		}
	});
}

function printData() {
	fetch('http://localhost:3000/elenco')
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			elenco = data;
			if (elenco.length > 0) {
				errore.innerHTML = '';
				elencoHTML.innerHTML = '';
				elenco.map(function (element: { id: number; titolo: string; contenuto: string; }) {
                    let colonna1 = `<td><input class="form-check-input fs-5" type="checkbox" value="" aria-label="Checkbox for following text input"></td>`;
					let colonna2 = `<td><button type="button" class="btn me-2 btn-outline-danger" onClick="elimina(${element.id})"><i class="bi bi-trash3-fill"></i></button></td>`;
					let colonna3 = `<td><button type="button" class="btn btn-outline-success ms-1 me-2" onClick="modifica(${element.id})"><i class="bi bi-pencil-fill"></i></button></td>`;
					let colonna4 = `<td>${element.titolo}</td>`;
					let colonna5 = `<td>${element.contenuto}</td>`;
					elencoHTML.innerHTML += `<tr>${colonna1}${colonna2}${colonna3}${colonna4}${colonna5}</tr>`;
				});
			} else {
				erroreElenco.innerHTML = 'Nessun elemento presente in elenco';
			}
		});
}

async function elimina(i: string) {
	const richiesta = window.confirm('Sei sicuro di voler cancellare? Questa azione è irreversibile!');
	if (richiesta) {
		return fetch('http://localhost:3000/elenco/' + i, {
			method: 'DELETE'
		});
	}
}

function controlla() {
	if (titolo.value != '' && contenuto.value != '') {
		var data: any = {
			titolo: titolo.value,
			contenuto: contenuto.value
		};
		addData(data);
	} else {
		errore.innerHTML = 'Compilare correttamente i campi!';
		return;
	}
}

async function addData(data: { titolo: string; contentuo: string }) {
	let response = await fetch('http://localhost:3000/elenco', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify(data),
	});
	clearForm();
}

function clearForm() {
	titolo.value = '';
	contenuto.value = '';
}

//------------------------------------------------------------

function modifica(i: string) {
	fetch('http://localhost:3000/elenco/' + i)
	.then((response) => {
		return response.json();
	})
	.then((data) => {
		titolo.value = data.titolo;
		contenuto.value = data.contenuto;
	});
	
	return sovrascrivi = i;
}

function overwrite(i: string) {
	if (titolo.value && contenuto.value) {
	fetch('http://localhost:3000/elenco/' + i, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			"titolo": titolo.value,
			"contenuto": contenuto.value
		}),
	});
	clearForm();
	} else {
		errore.innerHTML = 'Compilare correttamente i campi!';
		return;
	}
}

