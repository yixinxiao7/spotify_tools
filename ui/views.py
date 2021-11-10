from django.shortcuts import render


def index(request):
    return render(request, 'ui/index.html')

def with_ID(request, id):
    return render(request, 'ui/index.html')