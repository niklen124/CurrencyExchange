import requests
from .models import CurrencyConversion

def import_from_api():
    url = 'https://api.exchangerate-api.com/v4/latest/USD'  # Devise de base par défaut : USD
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        base_currency = data['base']
        date = data['date']
        
        # Optionnel : Supprimer les données existantes pour éviter les doublons
        CurrencyConversion.objects.filter(date=date).delete()
        
        for code, rate in data['rates'].items():
            CurrencyConversion.objects.create(
                name=f"{base_currency}/{code}",
                code=code,
                date=date,
                rate=rate
            )
    else:
        print(f"Erreur lors de la requête : {response.status_code}")
