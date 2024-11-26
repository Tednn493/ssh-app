from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
from models import init_db  # Importing the init_db function
import sqlite3
import uuid
import threading

db_lock = threading.Lock()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

DB_FILE = "database.db"

# Initialize the database when the server starts
init_db()

@app.route('/api/baskets', methods=['POST'])
def create_basket():
    """Create a new basket and generate a unique basket code."""
    basket_code = str(uuid.uuid4())[:8]  # Generate a short unique code

    with db_lock:  # Acquire the lock before interacting with the database
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            try:
                cursor.execute('BEGIN IMMEDIATE TRANSACTION')
                cursor.execute('''
                    INSERT INTO baskets (basket_code) VALUES (?)
                ''', (basket_code,))
                conn.commit()
            except sqlite3.OperationalError:
                conn.rollback()
                return jsonify({"error": "Database is busy, try again later"}), 503

            basket_id = cursor.lastrowid

    return jsonify({"basket_id": basket_id, "basket_code": basket_code}), 201


@app.route('/api/baskets/<basket_code>/participants', methods=['POST'])
def join_basket(basket_code):
    """Join a basket using the basket code and participant name."""
    data = request.json
    name = data.get('name')

    with db_lock:  # Acquire the lock
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            try:
                cursor.execute('BEGIN IMMEDIATE TRANSACTION')
                cursor.execute('SELECT id FROM baskets WHERE basket_code = ?', (basket_code,))
                basket = cursor.fetchone()

                if not basket:
                    conn.rollback()
                    return jsonify({"error": "Basket not found"}), 404

                basket_id = basket[0]
                cursor.execute('''
                    INSERT INTO participants (basket_id, name) VALUES (?, ?)
                ''', (basket_id, name))
                conn.commit()
            except sqlite3.OperationalError:
                conn.rollback()
                return jsonify({"error": "Database is busy, try again later"}), 503

    socketio.emit('participant_joined', {"basket_code": basket_code, "name": name}, to=basket_code)

    return jsonify({"message": f"{name} joined the basket"}), 200


@app.route('/api/baskets/<basket_code>/items', methods=['POST'])
def add_item_to_basket(basket_code):
    """Add an item to a specific basket."""
    data = request.json
    product = data.get('product')
    price = data.get('price')
    quantity = data.get('quantity')
    added_by = data.get('added_by')  

    with db_lock:
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT id FROM baskets WHERE basket_code = ?', (basket_code,))
            basket = cursor.fetchone()

            if not basket:
                return jsonify({"error": "Basket not found"}), 404

            basket_id = basket[0]
            cursor.execute('''
                INSERT INTO basket_items (basket_id, product, price, quantity, added_by)
                VALUES (?, ?, ?, ?, ?)
            ''', (basket_id, product, price, quantity, added_by))
            conn.commit()
            return jsonify({"message": "Item added successfully"}), 200



@app.route('/api/baskets/<basket_code>/items/<int:item_id>', methods=['DELETE'])
def delete_item_from_basket(basket_code, item_id):
    """Delete an item from a specific basket."""
    with db_lock:
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            try:
                cursor.execute('BEGIN IMMEDIATE TRANSACTION')
                cursor.execute('SELECT id FROM baskets WHERE basket_code = ?', (basket_code,))
                basket = cursor.fetchone()

                if not basket:
                    conn.rollback()
                    return jsonify({"error": "Basket not found"}), 404

                basket_id = basket[0]
                cursor.execute('''
                    SELECT id FROM basket_items WHERE id = ? AND basket_id = ?
                ''', (item_id, basket_id))
                item = cursor.fetchone()

                if not item:
                    conn.rollback()
                    return jsonify({"error": "Item not found in this basket"}), 404

                cursor.execute('''
                    DELETE FROM basket_items WHERE id = ? AND basket_id = ?
                ''', (item_id, basket_id))
                conn.commit()
            except sqlite3.OperationalError:
                conn.rollback()
                return jsonify({"error": "Database is busy, try again later"}), 503

    socketio.emit('item_deleted', {"basket_code": basket_code, "item_id": item_id}, to=basket_code)

    return jsonify({"message": f"Item with ID {item_id} deleted from basket {basket_code}"}), 200


@app.route('/api/baskets/<basket_code>/items', methods=['GET'])
def get_basket_items(basket_code):
    """Retrieve all items in a specific basket."""
    with db_lock:
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT id FROM baskets WHERE basket_code = ?', (basket_code,))
            basket = cursor.fetchone()

            if not basket:
                return jsonify({"error": "Basket not found"}), 404

            basket_id = basket[0]
            cursor.execute('''
                SELECT id, product, price, quantity, added_by
                FROM basket_items
                WHERE basket_id = ?
            ''', (basket_id,))
            items = cursor.fetchall()

            return jsonify({"items": [
                {"id": row[0], "product": row[1], "price": row[2], "quantity": row[3], "added_by": row[4]}
                for row in items
            ]}), 200



# WebSocket Handlers
@socketio.on('join_room')
def handle_join_room(data):
    """Handle a user joining a basket room."""
    basket_code = data.get('basket_code')
    join_room(basket_code)
    emit('room_joined', {"message": f"Joined basket {basket_code}"}, to=basket_code)


@socketio.on('leave_room')
def handle_leave_room(data):
    """Handle a user leaving a basket room."""
    basket_code = data.get('basket_code')
    leave_room(basket_code)
    emit('room_left', {"message": f"Left basket {basket_code}"}, to=basket_code)


if __name__ == '__main__':
    # The database is initialized here using init_db
    socketio.run(app, host='0.0.0.0', port=8080, debug=True)