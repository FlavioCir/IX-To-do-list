"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var titolo;
var contenuto;
var addBtn;
var elencoHTML;
var errore;
var erroreElenco;
var elenco = [];
var sovrascrivi;
window.addEventListener('DOMContentLoaded', init);
function init() {
    titolo = document.getElementById('titolo');
    contenuto = document.getElementById('contenuto');
    addBtn = document.getElementById('scrivi');
    elencoHTML = document.getElementById('elenco');
    errore = document.getElementById('errore');
    erroreElenco = document.getElementById('erroreElenco');
    printData();
    eventHandler();
}
function eventHandler() {
    addBtn.addEventListener('click', function () {
        if (sovrascrivi) {
            overwrite(sovrascrivi);
        }
        else {
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
            elenco.map(function (element) {
                let colonna1 = `<td><input class="form-check-input fs-5" type="checkbox" value="" aria-label="Checkbox for following text input"></td>`;
                let colonna2 = `<td><button type="button" class="btn me-2 btn-outline-danger" onClick="elimina(${element.id})"><i class="bi bi-trash3-fill"></i></button></td>`;
                let colonna3 = `<td><button type="button" class="btn btn-outline-success ms-1 me-2" onClick="modifica(${element.id})"><i class="bi bi-pencil-fill"></i></button></td>`;
                let colonna4 = `<td>${element.titolo}</td>`;
                let colonna5 = `<td>${element.contenuto}</td>`;
                elencoHTML.innerHTML += `<tr>${colonna1}${colonna2}${colonna3}${colonna4}${colonna5}</tr>`;
            });
        }
        else {
            erroreElenco.innerHTML = 'Nessun elemento presente in elenco';
        }
    });
}
function elimina(i) {
    return __awaiter(this, void 0, void 0, function* () {
        const richiesta = window.confirm('Sei sicuro di voler cancellare? Questa azione è irreversibile!');
        if (richiesta) {
            return fetch('http://localhost:3000/elenco/' + i, {
                method: 'DELETE'
            });
        }
    });
}
function controlla() {
    if (titolo.value != '' && contenuto.value != '') {
        var data = {
            titolo: titolo.value,
            contenuto: contenuto.value
        };
        addData(data);
    }
    else {
        errore.innerHTML = 'Compilare correttamente i campi!';
        return;
    }
}
function addData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch('http://localhost:3000/elenco', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(data),
        });
        clearForm();
    });
}
function clearForm() {
    titolo.value = '';
    contenuto.value = '';
}
//------------------------------------------------------------
function modifica(i) {
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
function overwrite(i) {
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
    }
    else {
        errore.innerHTML = 'Compilare correttamente i campi!';
        return;
    }
}
