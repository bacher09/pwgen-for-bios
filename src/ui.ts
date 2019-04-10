import { keygen, KeygenResult } from "./keygen";

let form = document.getElementById("form_id") as HTMLFormElement;
let serialInput = document.getElementById("serial_id") as HTMLInputElement;
let tryThis = document.getElementById("try_this") as HTMLElement;
let dellNote = document.getElementById("dell_note") as HTMLElement;
let answerElement = document.getElementById("answer") as HTMLDivElement;

function renderResult(results: KeygenResult[]): void {
    let table = document.createElement("table");
    let themeMode = document.getElementsByName("theme_mode")[0].getAttribute("content");
    if ( themeMode === "light" ) {
        table.className = "table table-striped";
    } else if ( themeMode === "dark" ) {
        table.className = "table table-striped table-dark";
    }
    let tableHead = table.appendChild(document.createElement("thead"));
    let tableHeadTR = tableHead.appendChild(document.createElement("tr"));
    let tableHeadTHDevice = tableHeadTR.appendChild(document.createElement("th"));
    let tableHeadTHCode = tableHeadTR.appendChild(document.createElement("th"));
    tableHeadTHDevice.appendChild(document.createTextNode("Device"));
    tableHeadTHCode.appendChild(document.createTextNode("Hash Code/Serial"));

    let tableBody = table.appendChild(document.createElement("tbody"));
    results.forEach(([solver, passwords, _]) => {
        let trElem = document.createElement("tr");
        let tdNameElem = document.createElement("td");
        tdNameElem.appendChild(document.createTextNode(solver.description));
        trElem.appendChild(tdNameElem);
        let tdElem = document.createElement("td");
        passwords.forEach((pwd, index) => {
            if (index > 0) {
                tdElem.appendChild(document.createElement("br"));
            }
            tdElem.appendChild(document.createTextNode(pwd));
        });
        trElem.appendChild(tdElem);
        tableBody.appendChild(trElem);
    });
    answerElement.appendChild(table);
}

function trackResult(serial: string): KeygenResult[] {
    return keygen(serial);
}

form.addEventListener("submit", (event) => {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
    answerElement.innerHTML = ""; // remove old table
    let results = trackResult(serialInput.value);
    if (results.length > 0) {
        tryThis.style.display = "";
        dellNote.style.display = "";
        renderResult(results);
    } else {
        tryThis.style.display = "none";
        dellNote.style.display = "none";
    }
}, true);
