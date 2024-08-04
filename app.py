from flask import Flask, request, jsonify, render_template
import jwt
import datetime
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'your_secret_key'

users = {
    "user@example.com": {
        "password": "password123",
        "name": "John Doe"
    },
    "hello@example.com": {
        "password": "password123!",
        "name": "John Wor"
    }
}

def load_places():
    with open(os.path.join('data', 'places.json')) as f:
        return json.load(f)

def get_place_by_id(place_id):
    places = load_places()
    for place in places:
        if place.get('placeId') == place_id:  # Changed to 'placeId'
            return place
    return None

@app.route('/')
def index():
    token = request.cookies.get('token')
    user_logged_in = False
    if token:
        try:
            jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            user_logged_in = True
        except jwt.ExpiredSignatureError:
            pass
        except jwt.InvalidTokenError:
            pass
    return render_template('index.html', user_logged_in=user_logged_in)

@app.route('/places', methods=['GET'])
def get_places():
    auth_header = request.headers.get('Authorization')
    if auth_header:
        token = auth_header.split(" ")[1]
        try:
            jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            places = load_places()
            return jsonify(places)
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
    return jsonify({'message': 'Token is missing'}), 401

@app.route('/places/<int:place_id>', methods=['GET'])
def get_place(place_id):
    auth_header = request.headers.get('Authorization')
    if auth_header:
        token = auth_header.split(" ")[1]
        try:
            jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            place = get_place_by_id(place_id)
            if place:
                return jsonify(place)
            else:
                return jsonify({'message': 'Place not found'}), 404
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
    return jsonify({'message': 'Token is missing'}), 401

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = users.get(email)
        if user and user['password'] == password:
            token = jwt.encode({
                'email': email,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            }, app.config['SECRET_KEY'], algorithm='HS256')

            return jsonify({'access_token': token})

        return jsonify({'message': 'Invalid credentials'}), 401

    # For GET requests, render the login form
    return render_template('login.html')

@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify(error=str(e)), 405

if __name__ == '__main__':
    app.run(debug=True)