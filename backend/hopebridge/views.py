import os
import re
from django.shortcuts import render
from django.conf import settings

def index(request, *args, **kwargs):
    """
    View function to serve the React app with the correct static file paths
    """
    # Find the main JS file
    js_file = None
    css_file = None
    
    # Path to static directory
    static_dir = settings.STATIC_ROOT
    
    # Look for JS files
    js_dir = os.path.join(static_dir, 'js')
    if os.path.exists(js_dir):
        for file in os.listdir(js_dir):
            if file.startswith('main.') and file.endswith('.js') and not file.endswith('.map') and not file.endswith('.LICENSE.txt'):
                js_file = f'js/{file}'
                break
    
    # Look for CSS files
    css_dir = os.path.join(static_dir, 'css')
    if os.path.exists(css_dir):
        for file in os.listdir(css_dir):
            if file.startswith('main.') and file.endswith('.css') and not file.endswith('.map'):
                css_file = f'css/{file}'
                break
    
    context = {
        'js_file': js_file,
        'css_file': css_file,
    }
    
    return render(request, 'index.html', context) 