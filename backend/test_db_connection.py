import os
import sys
import django
import psycopg2
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def test_direct_connection():
    """Test direct connection to PostgreSQL using psycopg2."""
    try:
        conn = psycopg2.connect(
            dbname=os.environ.get('DB_NAME', 'hopebridge'),
            user=os.environ.get('DB_USER', 'postgres'),
            password=os.environ.get('DB_PASSWORD', ''),
            host=os.environ.get('DB_HOST', 'localhost'),
            port=os.environ.get('DB_PORT', '5432')
        )
        print("Direct PostgreSQL connection successful!")
        
        # Create a cursor
        cur = conn.cursor()
        
        # Execute a test query
        cur.execute("SELECT version();")
        
        # Get the result
        version = cur.fetchone()
        print(f"PostgreSQL version: {version[0]}")
        
        # Close the cursor and connection
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Error connecting to PostgreSQL directly: {e}")
        return False

def test_django_connection():
    """Test connection through Django ORM."""
    try:
        # Setup Django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hopebridge.settings')
        django.setup()
        
        # Import is here to avoid import errors before django.setup()
        from django.db import connections
        
        # Get a cursor from the default database connection
        with connections['default'].cursor() as cursor:
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"Django PostgreSQL connection successful!")
            print(f"PostgreSQL version via Django: {version[0]}")
        return True
    except Exception as e:
        print(f"Error connecting to PostgreSQL through Django: {e}")
        return False

if __name__ == "__main__":
    print("Testing PostgreSQL connections...")
    
    direct_success = test_direct_connection()
    
    print("\n" + "-"*50 + "\n")
    
    django_success = test_django_connection()
    
    print("\n" + "-"*50 + "\n")
    
    if direct_success and django_success:
        print("All connection tests passed successfully!")
        sys.exit(0)
    else:
        print("Some connection tests failed. Please check the configuration.")
        sys.exit(1) 