import sqlite3 

DB_FILE = "database.db"

def get_db_connection():
    return sqlite3.connect(DB_FILE) # opens database if file exists, otherwise creates file 


