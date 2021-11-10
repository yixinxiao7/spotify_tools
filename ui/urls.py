from django.urls import path
from . import views


urlpatterns = [
    path('', views.index ),
    path('home', views.index),
    path('playlists', views.index),
    path('playlists/<slug:id>', views.with_ID)
]