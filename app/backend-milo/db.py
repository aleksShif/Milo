import sqlite3 
from werkzeug.security import generate_password_hash, check_password_hash

DB_FILE = "database.db"

def get_db_connection():
    return sqlite3.connect(DB_FILE) # opens database if file exists, otherwise creates file 

def create_table(): 
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()

def add_user(username, password):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)
        """,
        (username, password)
    )
    conn.commit()
    conn.close()

def check_user_exists(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT * FROM users WHERE username = ?
        """,
        (username,)
    )
    user = cursor.fetchone()
    conn.close()
    return dict(user) if user else None

def get_user(username, password):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT * FROM users WHERE username = ? AND password = ?
        """,
        (username, password)
    )
    user = cursor.fetchone()
    conn.close()

    if user and password:
        return dict(user)