from django.urls import path
from . import views

urlpatterns = [
    path('',views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('signup/', views.signup, name='register'),
    path('home/', views.index, name='index'),
    path('historique/', views.historique, name='historique'),
    path('graph/', views.graphiques, name='currency_graph'),
    path("supprimer/<int:conversion_id>/", views.supprimer_conversion, name="supprimer_conversion"),
]