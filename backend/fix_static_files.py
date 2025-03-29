import os
import shutil
from pathlib import Path

# Set up paths
base_dir = Path(__file__).resolve().parent.parent
frontend_build_dir = base_dir / 'frontend' / 'build'
backend_static_dir = base_dir / 'backend' / 'static'
backend_templates_dir = base_dir / 'backend' / 'templates'

# Create necessary directories
os.makedirs(backend_static_dir, exist_ok=True)

# 1. Update the index.html template to use the correct paths
print("Updating index.html template...")
index_html = backend_templates_dir / 'index.html'
with open(index_html, 'w') as f:
    f.write('''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <meta name="theme-color" content="#000000"/>
    <meta name="description" content="HopeBridge - Connecting donors with those in need"/>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
    <link rel="icon" href="/static/favicon.ico"/>
    <title>HopeBridge - Making a Difference Together</title>
    <script defer="defer" src="/static/js/main.16330297.js"></script>
    <link href="/static/css/main.7be4561d.css" rel="stylesheet">
</head>
<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
</body>
</html>''')
print("Template updated.")

# 2. Copy static files directly (skip collectstatic)
print("Copying static files...")

# Copy the entire static directory
if frontend_build_dir.exists() and (frontend_build_dir / 'static').exists():
    # Create destination directories
    os.makedirs(backend_static_dir / 'js', exist_ok=True)
    os.makedirs(backend_static_dir / 'css', exist_ok=True)
    
    # Copy JS files
    src_js = frontend_build_dir / 'static' / 'js'
    dst_js = backend_static_dir / 'js'
    for item in src_js.glob('*'):
        if item.name.startswith('main.') and item.name.endswith('.js'):
            shutil.copy2(item, dst_js / item.name)
            print(f"Copied {item.name} to {dst_js}")
    
    # Copy CSS files
    src_css = frontend_build_dir / 'static' / 'css'
    dst_css = backend_static_dir / 'css'
    for item in src_css.glob('*'):
        if item.name.startswith('main.') and item.name.endswith('.css'):
            shutil.copy2(item, dst_css / item.name)
            print(f"Copied {item.name} to {dst_css}")
    
    # Copy favicon
    favicon_src = frontend_build_dir / 'logo.png'
    favicon_dst = backend_static_dir / 'favicon.ico'
    if favicon_src.exists():
        shutil.copy2(favicon_src, favicon_dst)
        print(f"Copied favicon to {favicon_dst}")

print("\nStatic files setup complete. Try running the server now.") 