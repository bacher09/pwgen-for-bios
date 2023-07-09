import { gtag } from "./googleAnalytics";
import { keygen, KeygenResult, solvers } from "./keygen";

let form = document.getElementById("form_id") as HTMLFormElement;
let serialInput = document.getElementById("serial_id") as HTMLInputElement;
let tryThis = document.getElementById("try_this") as HTMLElement;
let dellNote = document.getElementById("dell_note") as HTMLElement;
let answerElement = document.getElementById("answer") as HTMLDivElement;

function renderResult(results: KeygenResult[]): void {
    let table = document.createElement("table");
    table.classList.add("answer_table");
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
        table.appendChild(trElem);
    });
    answerElement.appendChild(table);
}

function trackResult(serial: string): KeygenResult[] {
    let result = keygen(serial);
    if (GOOGLE_ANALYTICS_TAG) {
        let eventParams: {[key: string]: boolean} = {};
        solvers.forEach((solver) => {
            eventParams[solver.biosName] = false;
        });

        result.forEach(([solver, _, time]) => {
            eventParams[solver.biosName] = true;

            // send calculation timing report
            gtag("event", "timing_complete", {
                "name": "bios_keygen",
                "value": Math.round(time),
                "event_category": solver.biosName
            });
        });

        // send event about calculation
        gtag("event", "bios_keygen", eventParams);
    }
    return result;
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
