from django.urls import path
from . import views

urlpatterns = [
    path('login/',   views.loginn),
    path('logout/',  views.logoutt),       # ← new
    path('signup/',  views.signup),
    path('getUser/', views.get_Active_User),
]
