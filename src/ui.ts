import { keygen, KeygenResult } from "./keygen";

/// <reference types="dom" />

let form = document.getElementById("form_id") as HTMLFormElement;
let serialInput = document.getElementById("serial_id") as HTMLInputElement;
let tryThis = document.getElementById("try_this") as HTMLElement;
let dellNote = document.getElementById("dell_note") as HTMLElement;
let answerElement = document.getElementById("answer") as HTMLDivElement;

function renderResult(results: KeygenResult[]): void {
    let table = document.createElement("table");
    table.classList.add("answer_table");
    results.forEach(([solver, passwords]) => {
        let trElem = document.createElement("tr");
        let tdNameElem = document.createElement("td");
        tdNameElem.appendChild(document.createTextNode(solver.biosName));
        trElem.appendChild(tdNameElem);
        let tdElem = document.createElement("td");
        passwords.forEach((pwd, index) => {
            if (index > 0) {
                tdElem.appendChild(document.createElement("br"));
            }
            tdElem.appendChild(document.createTextNode(pwd));
        });
        trElem.appendChild(tdElem);
        table.appendChild(trElem);
    });
    answerElement.appendChild(table);
}

form.addEventListener("submit", (event) => {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
    answerElement.innerHTML = ""; // remove old table
    let results = keygen(serialInput.value);
    if (results.length > 0) {
        tryThis.style.display = "";
        dellNote.style.display = "";
        renderResult(results);
    } else {
        tryThis.style.display = "none";
        dellNote.style.display = "none";
    }
}, true);
