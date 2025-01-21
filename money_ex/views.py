import requests
from django.shortcuts import render
from .models import CurrencyConversion

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
                conversion.save()
                return render(request, 'index.html', {'converted_amount': converted_amount, 'rate': rate})
            else:
                return render(request, 'index.html', {'error': 'Conversion rate not found'})
            
        except Exception as e:
            print(f"Error processing the form: {e}")
        
    return render(request, 'index.html')
def historique(request):
    conversions = CurrencyConversion.objects.all()
    return render(request, 'historique.html', {'conversions': conversions})