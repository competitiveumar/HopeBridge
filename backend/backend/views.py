from django.shortcuts import render

def index(request, *args, **kwargs):
    """
    View function to serve the React app
    """
    return render(request, 'index.html') 