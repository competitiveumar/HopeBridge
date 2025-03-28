import os
import shutil
from pathlib import Path

# Get the base directory
base_dir = Path(__file__).resolve().parent.parent

# Source directories (frontend build)
frontend_static_dir = base_dir / 'frontend' / 'build' / 'static'
frontend_build_dir = base_dir / 'frontend' / 'build'

# Destination directories (backend static)
backend_static_dir = base_dir / 'backend' / 'static'

# Create the destination directories if they don't exist
os.makedirs(backend_static_dir / 'js', exist_ok=True)
os.makedirs(backend_static_dir / 'css', exist_ok=True)
os.makedirs(backend_static_dir / 'media', exist_ok=True)
os.makedirs(backend_static_dir / 'images', exist_ok=True)

# Copy favicon
favicon_source = frontend_build_dir / 'logo.png'
favicon_dest = backend_static_dir / 'favicon.ico'
if favicon_source.exists():
    shutil.copy2(favicon_source, favicon_dest)
    print(f"Copied favicon from {favicon_source} to {favicon_dest}")

# Copy JS files
js_source_dir = frontend_static_dir / 'js'
js_dest_dir = backend_static_dir / 'js'
if js_source_dir.exists():
    for file in os.listdir(js_source_dir):
        if file.startswith('main.') and file.endswith('.js') and not file.endswith('.LICENSE.txt'):
            shutil.copy2(js_source_dir / file, js_dest_dir / file)
            print(f"Copied JS file: {file}")
        elif file.endswith('.LICENSE.txt'):
            shutil.copy2(js_source_dir / file, js_dest_dir / file)
            print(f"Copied license file: {file}")
        elif file.startswith('453.') and not file.endswith('.LICENSE.txt'):
            shutil.copy2(js_source_dir / file, js_dest_dir / file)
            print(f"Copied chunk JS file: {file}")

# Copy CSS files
css_source_dir = frontend_static_dir / 'css'
css_dest_dir = backend_static_dir / 'css'
if css_source_dir.exists():
    for file in os.listdir(css_source_dir):
        if file.startswith('main.'):
            shutil.copy2(css_source_dir / file, css_dest_dir / file)
            print(f"Copied CSS file: {file}")

# Disable post-processing that requires source maps
os.environ['DISABLE_COLLECTSTATIC_MINIFY'] = 'True'

# Run collectstatic
print("\nRunning collectstatic to update static files...")
os.chdir(base_dir / 'backend')
os.system('python manage.py collectstatic --noinput')

print("\nStatic files have been copied and collected successfully!") 