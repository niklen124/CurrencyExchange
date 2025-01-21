// Fetch DOM elements
const currencyOneInput = document.getElementById("comboInput1"); 
const currencyTwoInput = document.getElementById("comboInput2"); 
const amountInput = document.getElementById("amountOne");  
const swapButton = document.getElementById("swap"); 
const convertButton = document.getElementById("convert");
const theResult = document.getElementById("result");
const theHiddenResult = document.getElementById("hidenResult");
const theRate = document.getElementById("rate");
const theHiddenRate = document.getElementById("hiddenRate");
const theConversText = document.getElementById("initialConversText");
const theReversConversText = document.getElementById("reversConversText");
const theRateTable = document.getElementById("rateTable");
const theRevRateTable = document.getElementById("reversRateTable");
const theSwapTable = document.getElementById("swapTable")
const theRevSwapTable = document.getElementById("swapRevTable")

// Swap currencies and text
swapButton.addEventListener("click", function() {
    [currencyOneInput.value, currencyTwoInput.value] = [currencyTwoInput.value, currencyOneInput.value];
    [theResult.innerText, theHiddenResult.innerText] = [theHiddenResult.innerText, theResult.innerText];
    [theRate.innerText, theHiddenRate.innerText] = [theHiddenRate.innerText, theRate.innerText];
    const temp = theSwapTable.innerHTML
    theSwapTable.innerHTML = theRevSwapTable.innerHTML;
    theRevSwapTable.innerHTML = temp;
});

// Convert currency
convertButton.addEventListener('click', function() {
    const amount = parseFloat(amountInput.value);
    const currencyOne = currencyOneInput.value;
    const currencyTwo = currencyTwoInput.value;

    if (isNaN(amount) || !currencyOne || !currencyTwo) {
        alert("Veuillez entrer un montant valide et sélectionner les devises.");
        return;
    }
    calculate(currencyOne, currencyTwo, amount);
});

// Fetch conversion rates and display results
function calculate(currencyOne, currencyTwo, amount) {
    const apiUrl = `https://api.exchangerate-api.com/v4/latest/${currencyOne}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then((data) => {
            const rate = data.rates[currencyTwo];
            const RevRate = (1 / rate).toFixed(2)
            if (rate) {
                const convertedAmount = (amount * rate).toFixed(2);
                theResult.innerText = `${amount} ${currencyOne} = ${convertedAmount} ${currencyTwo}`;
                theHiddenResult.innerText = `${convertedAmount} ${currencyTwo} = ${amount} ${currencyOne}`;
                theRate.innerText = `1 ${currencyOne} = ${rate} ${currencyTwo}`;
                theHiddenRate.innerText = `1 ${currencyTwo} = ${RevRate} ${currencyOne}`;
                theConversText.innerHTML = `<h3>Convertir <strong>${currencyOne}</strong> en <strong>${currencyTwo}</strong></h3>`;
                theReversConversText.innerHTML = `<h3>Convertir <strong>${currencyTwo}</strong> en <strong>${currencyOne}</strong></h3>`;
                
                createTable(currencyOne, currencyTwo, rate);
                createReversTable(currencyOne, currencyTwo, RevRate);
            } else {
                alert("Le taux de change pour ces devises n'est pas disponible.");
            }
        })
        .catch(error => {
            alert("Erreur lors de la récupération du taux de change.");
            console.error(error);
        });
}


// Create conversion table
function createTable(currencyOne, currencyTwo, rate) {
    theRateTable.innerHTML = '';
    const values = [1, 5, 10, 25, 50, 100, 500, 1000, 5000, 10000];
    const table = document.createElement("table");
    const tableHead = document.createElement("thead");
    const tableRow = document.createElement("tr");

    const headers = [currencyOne, currencyTwo];
    headers.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header;
        tableRow.appendChild(th);
    });

    tableHead.appendChild(tableRow);
    table.appendChild(tableHead);
    const tableBody = document.createElement("tbody");

    values.forEach((value) => {
        const row = document.createElement("tr");
        const cell1 = document.createElement("td");
        cell1.textContent = `${value} ${currencyOne}`;
        row.appendChild(cell1);
        
        const cell2 = document.createElement("td");
        cell2.textContent = (value * rate).toFixed(2);
        row.appendChild(cell2);
        
        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    theRateTable.appendChild(table);
}

function createReversTable(currencyOne, currencyTwo, RevRate){
    theRevRateTable.innerHTML = '';
    const values = [1, 5, 10, 25, 50, 100, 500, 1000, 5000, 10000];
    const Revtable = document.createElement("table");
    const RevtableHead = document.createElement("thead");
    const RevtableRow = document.createElement("tr");

    const Revheaders = [currencyTwo, currencyOne];
    Revheaders.forEach((Revheader) => {
        const Revth = document.createElement("th");
        Revth.textContent = Revheader;
        RevtableRow.appendChild(Revth);
    });

    RevtableHead.appendChild(RevtableRow);
    Revtable.appendChild(RevtableHead);
    const RevtableBody = document.createElement("tbody");

    values.forEach((Revvalue) => {
        const Revrow = document.createElement("tr");
        const Revcell1 = document.createElement("td");
        Revcell1.textContent = `${Revvalue} ${currencyTwo}`;
        Revrow.appendChild(Revcell1);
        
        const Revcell2 = document.createElement("td");
        Revcell2.textContent = (Revvalue * RevRate).toFixed(2);
        Revrow.appendChild(Revcell2);
        
        RevtableBody.appendChild(Revrow);
    });

    Revtable.appendChild(RevtableBody);
    theRevRateTable.appendChild(Revtable);
}