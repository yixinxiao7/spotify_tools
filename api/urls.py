from django.urls import path
from . import views

urlpatterns = [
    # path('api/', None )  # TODO
    path('api/authorize', views.Authorization().as_view() )
]
