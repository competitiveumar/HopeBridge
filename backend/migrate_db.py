import os
import sys
import django
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def run_migrations():
    """Run Django migrations for the PostgreSQL database."""
    try:
        # Setup Django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hopebridge.settings')
        django.setup()
        
        # Import Django management commands
        from django.core.management import call_command
        
        print("Running database migrations...")
        
        # Run makemigrations first to create any missing migration files
        print("Running makemigrations...")
        call_command('makemigrations')
        
        # Then run migrate to apply the migrations
        print("Running migrate...")
        call_command('migrate')
        
        print("Database migrations completed successfully!")
        return True
    except Exception as e:
        print(f"Error running migrations: {e}")
        return False

if __name__ == "__main__":
    success = run_migrations()
    
    if success:
        print("Database setup completed successfully!")
        sys.exit(0)
    else:
        print("Database setup failed. Please check the error messages.")
        sys.exit(1) 