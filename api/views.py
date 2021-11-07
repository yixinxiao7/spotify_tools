from django.shortcuts import render, redirect
# from .models import *
# from .serializers import *
from rest_framework import generics, views

import urllib.parse as urlparse
from urllib.parse import urlencode

class Authorization(views.APIView):
    ''' Spotify Authorization Code Flow '''

    def get(self, request):
        url = 'https://desolate-meadow-07623.herokuapp.com/https://accounts.spotify.com/authorize'
        params={'client_id': 'f302afa9ce974067be62558b9cbcca0f',
                'response_type': 'code',
                'redirect_uri': 'https://127.0.0.1:8000'}
        url_parts = list(urlparse.urlparse(url))
        query = dict(urlparse.parse_qsl(url_parts[4]))
        query.update(params)
        url_parts[4] = urlencode(query)

        url = urlparse.urlunparse(url_parts) + '/'
        print(url)
        return redirect(url)