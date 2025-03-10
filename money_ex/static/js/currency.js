document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const resultDiv = document.getElementById('conversionResult');
    const swapButton = document.getElementById('swap');

    // Fonction pour échanger les devises
    function swapCurrencies() {
        const input1 = document.getElementById('comboInput1');
        const input2 = document.getElementById('comboInput2');
        const temp = input1.value;
        input1.value = input2.value;
        input2.value = temp;
    }

    // Gestionnaire pour le bouton d'échange
    if (swapButton) {
        swapButton.addEventListener('click', swapCurrencies);
    }

    // Gestionnaire de soumission du formulaire
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

            // Afficher un indicateur de chargement
            resultDiv.innerHTML = `
                <div class="alert alert-info" role="alert">
                    <div class="spinner-border spinner-border-sm" role="status">
                        <span class="visually-hidden">Chargement...</span>
                    </div>
                    Conversion en cours...
                </div>`;

            fetch(form.action, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    resultDiv.innerHTML = `
                        <div class="alert alert-danger" role="alert">
                            ${data.error}
                        </div>`;
                } else {
                    resultDiv.innerHTML = `
                        <div class="alert alert-success" role="alert">
                            Montant converti : ${parseFloat(data.converted_amount).toFixed(2)}<br>
                            Taux de change : ${parseFloat(data.rate).toFixed(4)}
                        </div>`;
                    
                    if (data.graph) {
                        const graphContainer = document.getElementById('graphContainer');
                        if (graphContainer) {
                            graphContainer.innerHTML = data.graph;
                        }
                    }
                }
            })
            .catch(error => {
                resultDiv.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        Une erreur s'est produite lors de la conversion.
                    </div>`;
                console.error('Erreur:', error);
            });
        });
    }
});
