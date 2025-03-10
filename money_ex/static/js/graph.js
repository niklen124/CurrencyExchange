const swapButton = document.getElementById("swap"); 
const currencyOneInput = document.getElementById("fromCurrency"); 
const currencyTwoInput = document.getElementById("toCurrency"); 
const graphRate = document.getElementById('exchangeRateChart');
const textGraph = document.getElementById('textRateGraph');
const swapTextGraph = document.getElementById('swapTextRateGraph');

const apiUrl = 'https://api.frankfurter.app/latest';
let exchangeRates = {};
let historicalData = [];
let chart;

swapButton.addEventListener("click", function() {
    [currencyOneInput.value, currencyTwoInput.value] = [currencyTwoInput.value, currencyOneInput.value];
    const temp = textGraph.innerText;
    textGraph.innerText = swapTextGraph.innerText;
    swapTextGraph.innerText = temp;
    updateChart();
});

async function fetchExchangeRates() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.rates) {
            exchangeRates = data.rates;
        } else {
            alert('Erreur lors de la récupération des taux de change.');
        }
    } catch (error) {
        alert('Erreur de connexion à l\'API.');
    }
}

async function fetchHistoricalData() {
    const fromCurrency = currencyOneInput.value;
    const toCurrency = currencyTwoInput.value;
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0];

    try {
        const response = await fetch(`https://api.frankfurter.app/${startDate}..${endDate}?from=${fromCurrency}&to=${toCurrency}`);
        const data = await response.json();
        if (data.rates) {
            historicalData = Object.entries(data.rates).map(([date, rates]) => ({
                date,
                rate: rates[toCurrency]   
            }));
            textGraph.innerText = `Graphiques de change Xe : ${fromCurrency} vers ${toCurrency} `;
            swapTextGraph.innerText = `Graphiques de change Xe : ${toCurrency} vers ${fromCurrency} `;
            updateChart();
        } else {
            alert('Erreur lors de la récupération des données historiques.');
        }
    } catch (error) {
        alert('Erreur de connexion à l\'API.');
    }
}

function updateChart() {
    const ctx = graphRate.getContext('2d');
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: historicalData.map(data => data.date),
            datasets: [{
                label: `Taux de change (${currencyTwoInput.value})`,
                data: historicalData.map(data => data.rate),
                borderColor: '#007bff',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

currencyOneInput.addEventListener('change', () => {
    fetchExchangeRates();
    fetchHistoricalData();
});

currencyTwoInput.addEventListener('change', () => {
    fetchHistoricalData();
});

fetchExchangeRates();
fetchHistoricalData();