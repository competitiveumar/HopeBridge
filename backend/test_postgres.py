import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get environment variables
db_name = os.environ.get('DB_NAME', 'hopebridge')
db_user = os.environ.get('DB_USER', 'postgres')
db_password = os.environ.get('DB_PASSWORD', '')
db_host = os.environ.get('DB_HOST', 'localhost')
db_port = os.environ.get('DB_PORT', '5432')

print(f"Attempting to connect to PostgreSQL database:")
print(f"  Database: {db_name}")
print(f"  User: {db_user}")
print(f"  Host: {db_host}")
print(f"  Port: {db_port}")
print("  Password: [hidden]")

try:
    # Connect to the PostgreSQL database
    connection = psycopg2.connect(
        dbname=db_name,
        user=db_user,
        password=db_password,
        host=db_host,
        port=db_port
    )
    
    # Create a cursor
    cursor = connection.cursor()
    
    # Execute a test query
    cursor.execute("SELECT version();")
    
    # Fetch the result
    version = cursor.fetchone()
    
    print("\nConnection successful!")
    print(f"PostgreSQL version: {version[0]}")
    
    # Close the cursor and connection
    cursor.close()
    connection.close()
    
except Exception as e:
    print(f"\nError connecting to PostgreSQL: {e}")
    print("\nPlease check your PostgreSQL installation and credentials.")
    print("Make sure the PostgreSQL server is running and the credentials in .env are correct.") 