from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

client = MongoClient("mongodb://localhost:27017/")
db = client['ND_db']
collection = db['users']

@app.route('/')
def index():
    return "Hello World!!"

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    gmail = data.get('gmail')
    birthday = data.get('birthday')
    sex = data.get('sex')

    if collection.find_one({'gmail': gmail}):
        return jsonify({'message': 'Gmail ถูกใช้ไปแล้ว'}), 409
    
    hash_password = generate_password_hash(password)

    new_user = {
        'username': username,
        'password': hash_password,
        'firstname': firstname,
        'lastname': lastname,
        'gmail': gmail,
        'birthday': birthday,
        'sex': sex
    }

    collection.insert_one(new_user)

    return jsonify({'message': 'SignUp is successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = collection.find_one({'username': username})
    if user and check_password_hash(user['password'], password):
        return jsonify({
            'message': 'Login successful',
            'user': {
                'username': user['username'],
                'firstname': user.get('firstname'),
                'lastname': user.get('lastname'),
                'gmail': user.get('gmail'),
                'birthday': user.get('birthday'),
                'sex': user.get('sex')
            }
        }), 200
    return jsonify({'message': 'Invalid username or password'}), 401

@app.route('/users', methods=['GET'])
def get_all_users():
    users = []
    for user in collection.find({}, {'password': 0}):
        user['_id'] = str(user['_id'])
        users.append(user)
    return jsonify(users), 200

@app.route('/delete/<user_id>', methods=['DELETE'])
def delete_user_by_id(user_id):
    try:
        object_id = ObjectId(user_id)
    except:
        return jsonify({'message': 'Invalid user ID'}), 400
    
    result = collection.delete_one({'_id': object_id})

    if result.deleted_count == 0:
        return jsonify({'message': 'User not found'}), 404
    return jsonify({'message': 'User deleted successfully'}), 200

@app.route('/update/<user_id>', methods=['PUT'])
def update_user_by_id(user_id):
    try:
        object_id = ObjectId(user_id)
    except:
        return jsonify({'message': 'Invalid user ID'}), 400

    data = request.get_json()
    update_fields = {}

    allowed_fields = ['username', 'firstname', 'lastname', 'gmail', 'birthday', 'sex', 'password']

    for field in allowed_fields:
        if field in data:
            if field == 'password':
                update_fields['password'] = generate_password_hash(data['password'])
            else:
                update_fields[field] = data[field]

    if not update_fields:
        return jsonify({'message': 'No valid fields provided to update'}), 400

    result = collection.update_one({'_id': object_id}, {'$set': update_fields})

    if result.matched_count == 0:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({'message': 'User updated successfully'}), 200

if __name__ == "__main__":
    app.run(debug=True, port=8080)