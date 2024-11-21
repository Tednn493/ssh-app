from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
from models import init_db  # Importing the init_db function
import sqlite3
import uuid

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
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO baskets (basket_code) VALUES (?)
        ''', (basket_code,))
        conn.commit()
        basket_id = cursor.lastrowid

    return jsonify({"basket_id": basket_id, "basket_code": basket_code}), 201


@app.route('/api/baskets/<basket_code>/participants', methods=['POST'])
def join_basket(basket_code):
    """Join a basket using the basket code and participant name."""
    data = request.json
    name = data.get('name')

    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT id FROM baskets WHERE basket_code = ?', (basket_code,))
        basket = cursor.fetchone()

        if not basket:
            return jsonify({"error": "Basket not found"}), 404

        basket_id = basket[0]
        cursor.execute('''
            INSERT INTO participants (basket_id, name) VALUES (?, ?)
        ''', (basket_id, name))
        conn.commit()

    # Notify all participants in the basket
    socketio.emit('participant_joined', {"basket_code": basket_code, "name": name}, to=basket_code)

    return jsonify({"message": f"{name} joined the basket"}), 200


@app.route('/api/baskets/<basket_code>/items', methods=['POST'])
def add_item_to_basket(basket_code):
    """Add an item to a specific basket."""
    data = request.json
    product = data.get('product')
    price = data.get('price')
    quantity = data.get('quantity')

    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT id FROM baskets WHERE basket_code = ?', (basket_code,))
        basket = cursor.fetchone()

        if not basket:
            return jsonify({"error": "Basket not found"}), 404

        basket_id = basket[0]
        cursor.execute('''
            INSERT INTO basket_items (basket_id, product, price, quantity)
            VALUES (?, ?, ?, ?)
        ''', (basket_id, product, price, quantity))
        conn.commit()

    # Notify all participants in the basket
    socketio.emit('item_added', {
        "basket_code": basket_code,
        "product": product,
        "price": price,
        "quantity": quantity
    }, to=basket_code)

    return jsonify({"message": "Item added to basket"}), 200

@app.route('/api/baskets/<basket_code>/items/<int:item_id>', methods=['DELETE'])
def delete_item_from_basket(basket_code, item_id):
    """Delete an item from a specific basket."""
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()

        # Get the basket ID using the basket_code
        cursor.execute('SELECT id FROM baskets WHERE basket_code = ?', (basket_code,))
        basket = cursor.fetchone()

        if not basket:
            return jsonify({"error": "Basket not found"}), 404

        basket_id = basket[0]

        # Check if the item exists in the basket
        cursor.execute('''
            SELECT id FROM basket_items WHERE id = ? AND basket_id = ?
        ''', (item_id, basket_id))
        item = cursor.fetchone()

        if not item:
            return jsonify({"error": "Item not found in this basket"}), 404

        # Delete the item
        cursor.execute('''
            DELETE FROM basket_items WHERE id = ? AND basket_id = ?
        ''', (item_id, basket_id))
        conn.commit()

    # Notify participants in the basket that an item was deleted
    socketio.emit('item_deleted', {"basket_code": basket_code, "item_id": item_id}, to=basket_code)

    return jsonify({"message": f"Item with ID {item_id} deleted from basket {basket_code}"}), 200

@app.route('/api/baskets/<basket_code>/items', methods=['GET'])
def get_basket_items(basket_code):
    """Retrieve all items in a specific basket."""
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT id FROM baskets WHERE basket_code = ?', (basket_code,))
        basket = cursor.fetchone()

        if not basket:
            return jsonify({"error": "Basket not found"}), 404

        basket_id = basket[0]
        cursor.execute('''
            SELECT product, price, quantity FROM basket_items WHERE basket_id = ?
        ''', (basket_id,))
        items = cursor.fetchall()

    return jsonify({"basket_code": basket_code, "items": [
        {"product": row[0], "price": row[1], "quantity": row[2]} for row in items
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
