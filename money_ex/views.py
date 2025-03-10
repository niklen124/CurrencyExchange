import requests
from django.shortcuts import get_object_or_404, redirect, render
from .models import CurrencyConversion
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User

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

def graphiques(request):
    graph_api_url = 'https://api.frankfurter.app/currencies'
    try: 
        responce = requests.get(graph_api_url)
        currencies = responce.json() if responce.status_code == 200 else {}
    except Exception as e:
        currencies = {}
    return render(request, 'graph.html', {'currencies': currencies})

def historique(request):
    conversions = CurrencyConversion.objects.all()
    return render(request, 'historique.html', {'conversions': conversions})

def supprimer_conversion(request, conversion_id):
    conversion = get_object_or_404(CurrencyConversion, id=conversion_id)  # Correction du modèle
    conversion.delete()
    messages.success(request, "Conversion supprimée avec succès.")
    return redirect('historique')

def user_login(request):
    if request.method =='POST':
        username=request.POST.get('username')
        password=request.POST.get('pasword')
        user = authenticate(request, username=username, password=password)
        if user is not None:
                    login(request, user)
                    messages.success(request,"connexion réussie !")
                    return redirect('index')
        else:
                messages.error(request, "Nom d'utilisateur ou mot de passe incorrect")
                return render(request, 'login.html')
    return render(request, 'login.html')

def user_logout(request):
    logout(request)
    return redirect('login')

def signup(request):
    # creation d'un dictionnaire error
    errors= {}
    if request.method == 'POST':
        username=request.POST.get('username')
        password1=request.POST.get('pasword')
        password2=request.POST.get('pasword2')
    # validation simple des mots de passe
        if password1 != password2:
            errors['passwords']="Les mots de passe ne correspondent pas."
        if len(password1) < 8:
            errors['pasword_length']="Les mots de passe doit comporter plus de 8 caractères."
        if User.objects.filter(username=username).exists():
            errors['username']="Ce nom d'utilisateur existe déjà."
        # créer l'utilisateur si toutes les validations sont acceptées
        if not errors:
            user= User.objects.create(username=username, password=make_password(password1))
            user.save()
            # Plus qu' a connecter l'utilisateur 
            login(request, user)
            return redirect('index')
        else:
             return render(request, 'signup.html',{ 'errors':errors })
             
    return render(request, 'signup.html')