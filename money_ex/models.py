from django.db import models


class CurrencyConversion(models.Model):
    amount = models.DecimalField(max_digits=20, decimal_places=2)
    from_currency = models.CharField(max_length=3)
    to_currency = models.CharField(max_length=3)
    conversion_rate = models.DecimalField(max_digits=20, decimal_places=6)
    converted_amount = models.DecimalField(max_digits=20, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)
    date = models.DateField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
        
    def __str__(self):
        return f"{self.amount} {self.from_currency} to {self.to_currency} at {self.timestamp}"