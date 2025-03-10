from django import forms
from django.contrib.auth.forms import UserCreationForm 

class loginFormulaire(UserCreationForm):
    username=forms.CharField(
        label="Username", 
        widget=forms.TextInput(attrs={'class':'form-control'})
                             )
    password=forms.CharField(
        label="Password",
        widget=forms.PasswordInput(attrs={'class':'form-control', 'autocomplete' : 'new-password'})
                             )
    
    class Meta(UserCreationForm.Meta):
        fields = UserCreationForm._meta.fields + ("username", "password")