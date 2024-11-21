import sqlite3

DB_FILE = "database.db"

def init_db():
    """Initialize the SQLite database with necessary tables."""
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()

        # Baskets table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS baskets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                basket_code TEXT NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Participants table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS participants (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                basket_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                FOREIGN KEY (basket_id) REFERENCES baskets (id) ON DELETE CASCADE
            )
        ''')

        # Basket items table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS basket_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                basket_id INTEGER NOT NULL,
                product TEXT NOT NULL,
                price REAL NOT NULL,
                quantity INTEGER NOT NULL,
                FOREIGN KEY (basket_id) REFERENCES baskets (id) ON DELETE CASCADE
            )
        ''')

        conn.commit()
        print("Database initialized successfully!")
