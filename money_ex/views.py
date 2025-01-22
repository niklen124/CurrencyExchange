import requests
from django.shortcuts import render
from .models import CurrencyConversion
import plotly.express as px

def get_exchange_rate(from_currency, to_currency):
    try:
        api_url = f"https://api.exchangerate-api.com/v4/latest/{from_currency}"
        response = requests.get(api_url)
        data = response.json()
        rate = data['rates'].get(to_currency)
        return rate
    except Exception as e:
        print(f"Error fetching exchange rate: {e}")
        return None

def index(request):
    if request.method == 'POST':
        try:
            amount = float(request.POST['amount'])
            from_currency = request.POST['comboInput1']
            to_currency = request.POST['comboInput2']
            
            rate = get_exchange_rate(from_currency, to_currency)
            if rate:
                converted_amount = amount * rate
                
                conversion = CurrencyConversion.objects.create(
                    amount=amount,
                    from_currency=from_currency,
                    to_currency=to_currency,
                    conversion_rate=rate,
                    converted_amount=converted_amount
                )
                return render(request, 'index.html', {'converted_amount': converted_amount, 'rate': rate})
            else:
                return render(request, 'index.html', {'error': 'Taux de conversion non trouvé'})
            
        except Exception as e:
            print(f"Error processing the form: {str(e)}")
            return render(request, 'index.html', {'error': 'Erreur lors du traitement du formulaire'})
    
    return render(request, 'index.html')

def currency_graph(request):
    data = CurrencyConversion.objects.all().order_by('date')
    df = {
        'Date': [currency.date for currency in data],
        'conversion_rate': [currency.conversion_rate for currency in data],
        'to_currency': [currency.to_currency for currency in data]
    }
    
    fig = px.line(
        df, 
        x='Date', 
        y='conversion_rate', 
        color='to_currency', 
        title='Variation des Taux de Change dans le Temps'
    )
    chart = fig.to_html(full_html=False)
    return render(request, 'graph.html', {'chart': chart})

def historique(request):
    conversions = CurrencyConversion.objects.all()
    return render(request, 'historique.html', {'conversions': conversions})