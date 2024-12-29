const currencyOneInput = document.getElementById("comboInput1"); 
const currencyTwoInput = document.getElementById("comboInput2"); 
const amountInput = document.getElementById("amountOne");  
const swapButton = document.getElementById("swap"); 
const convertButton = document.getElementById("convert");
const theResult = document.getElementById("result");
const theRate = document.getElementById("rate");

swapButton.addEventListener("click", function() {
    const temp = currencyOneInput.value;
    currencyOneInput.value = currencyTwoInput.value;
    currencyTwoInput.value = temp;
});

convertButton.addEventListener('click', function() {
    const amount =parseFloat(amountInput.value)
    const currencyOne = currencyOneInput.value;
    const currencyTwo = currencyTwoInput.value;

    if (isNaN (amount) || !currencyOne || !currencyTwo) {
        alert("Veuillez entrer un montant valide et sélectionner les devises.");
        return;
    }
    caluc(currencyOne, currencyTwo, amount)
});

function caluc(currencyOne, currencyTwo, amount){
    const apiUrl = `https://api.exchangerate-api.com/v4/latest/${currencyOne}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then((data) => {
            const rate = data.rates[currencyTwo];
            if (rate){
                const convertedAmount = (amount * rate).toFixed(2);
                theResult.innerText = `${amount} ${currencyOne} = ${convertedAmount} ${currencyTwo}`;
                theRate.innerText = `1 ${currencyOne} = ${rate} ${currencyTwo}`;
                //alert(`Conversion: ${amount} ${currencyOne} = ${convertedAmount} ${currencyTwo}`);
                } else {
                    alert("Le taux de change pour ces devises n'est pas disponible.");
            }
        })
        .catch(error => {
            alert("Erreur lors de la récupération du taux de change.");
            console.error(error);
        });
}

