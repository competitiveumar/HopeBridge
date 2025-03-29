import os
import psycopg2
from django.core.management.base import BaseCommand, CommandError
from django.db import connections
from django.conf import settings

class Command(BaseCommand):
    help = 'Setup and test PostgreSQL database connection'

    def add_arguments(self, parser):
        parser.add_argument(
            '--create-db',
            action='store_true',
            help='Create the database if it doesn\'t exist',
        )

    def handle(self, *args, **options):
        try:
            # Get database settings
            db_settings = settings.DATABASES['default']
            db_name = db_settings['NAME']
            db_user = db_settings['USER']
            db_password = db_settings['PASSWORD']
            db_host = db_settings['HOST']
            db_port = db_settings['PORT']
            
            self.stdout.write(self.style.SUCCESS(f"Checking PostgreSQL database configuration:"))
            self.stdout.write(f"  Database: {db_name}")
            self.stdout.write(f"  User: {db_user}")
            self.stdout.write(f"  Host: {db_host}")
            self.stdout.write(f"  Port: {db_port}")
            
            # Test direct connection using psycopg2
            try:
                # First try connecting to the specified database
                conn = psycopg2.connect(
                    dbname=db_name,
                    user=db_user,
                    password=db_password,
                    host=db_host,
                    port=db_port
                )
                cursor = conn.cursor()
                cursor.execute("SELECT version();")
                version = cursor.fetchone()
                
                self.stdout.write(self.style.SUCCESS(f"\nPostgreSQL connection successful!"))
                self.stdout.write(f"PostgreSQL version: {version[0]}")
                
                cursor.close()
                conn.close()
                
            except psycopg2.OperationalError as e:
                if 'database "{}" does not exist'.format(db_name) in str(e) and options['create_db']:
                    self.stdout.write(self.style.WARNING(f"\nDatabase '{db_name}' does not exist. Attempting to create it..."))
                    
                    # Connect to 'postgres' database to create our application database
                    conn = psycopg2.connect(
                        dbname='postgres',
                        user=db_user,
                        password=db_password,
                        host=db_host,
                        port=db_port
                    )
                    conn.autocommit = True
                    cursor = conn.cursor()
                    
                    # Create the database
                    cursor.execute(f"CREATE DATABASE {db_name}")
                    
                    self.stdout.write(self.style.SUCCESS(f"Database '{db_name}' created successfully!"))
                    
                    cursor.close()
                    conn.close()
                    
                    # Test connection to the newly created database
                    conn = psycopg2.connect(
                        dbname=db_name,
                        user=db_user,
                        password=db_password,
                        host=db_host,
                        port=db_port
                    )
                    cursor = conn.cursor()
                    cursor.execute("SELECT version();")
                    version = cursor.fetchone()
                    
                    self.stdout.write(self.style.SUCCESS(f"\nPostgreSQL connection to new database successful!"))
                    self.stdout.write(f"PostgreSQL version: {version[0]}")
                    
                    cursor.close()
                    conn.close()
                    
                else:
                    self.stdout.write(self.style.ERROR(f"\nError connecting to PostgreSQL: {e}"))
                    self.stdout.write(self.style.WARNING(f"If the database doesn't exist, run this command with --create-db flag to create it."))
                    return
            
            # Test Django's database connection
            self.stdout.write("\nTesting Django's database connection...")
            try:
                connection = connections['default']
                connection.ensure_connection()
                
                with connection.cursor() as cursor:
                    cursor.execute("SELECT version();")
                    version = cursor.fetchone()
                
                self.stdout.write(self.style.SUCCESS("Django database connection successful!"))
                self.stdout.write(f"PostgreSQL version via Django: {version[0]}")
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error with Django's database connection: {e}"))
                return
            
            # Everything is successful
            self.stdout.write(self.style.SUCCESS("\nPostgreSQL is properly configured with Django!"))
            
        except Exception as e:
            raise CommandError(f"Error setting up PostgreSQL: {e}") 