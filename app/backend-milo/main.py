# before trying to run the backend app make sure to install all dependencies
# pip install -r requirements.txt
# python main.py to run 

from flask import Flask, request, render_template, send_from_directory, jsonify 
from flask_cors import CORS
from db import * 

app = Flask(__name__, static_folder="../frontend-milo", static_url_path="/")
app.secret_key = b'5015fbe01ff54e249e7416f4feb0cf9d'

cors = CORS(app, origins='*') 

create_table()
add_user("sasha","s")

# @app.route("/", methods=["GET"])
# def home(): 
#     return jsonify(
#         {
#             "users": [
#                 'arpan',
#                 'zach',
#                 'jessie'
#             ]
#         }
#     )

@app.route("/")
def index(): 
    return send_from_directory(app.static_folder, "index.html")

@app.route("/login", methods=["POST"])
def login():
    # check if username exists
    try: 
        data = request.get_json()
        username = data.get("username")

        if not username: 
            return jsonify({
                "status": "error",
                "message": "Email is required"
            }), 400  
    
        user = check_user_exists(username)
        if user:
            return jsonify({"status": "success", "message": "User found", "exists": True}), 200
        else:
            return jsonify({"status": "error", "message": "Invalid Credentials", "exists": False}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/home1", methods=["GET"])
def home():
    return jsonify(
        {
            "users": [
                'arpan',
                'zach',
                'jessie'
            ]
        }
    )


@app.route("/loginpass", methods=["POST"])
def loginpass():
    # check if username and password match; last step of authentication
    try: 
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        if not username or not password: 
            return jsonify({
                "status": "error",
                "message": "Username and password are required"
            }), 400  
    
        user = get_user(username, password)
        if user:
            return jsonify({"status": "success", "message": "Login successful", "user": user}), 200
        else:
            return jsonify({"status": "error", "message": "Invalid Credentials"}), 401
    except Exception as e:  
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({
            "status": "error",
            "message": "Username and password are required"
        }), 400

    try:
        add_user(username, password)
        return jsonify({"status": "success", "message": "User created successfully"})
    except sqlite3.IntegrityError: 
        conn.close()
        return jsonify({"status": "error", "message": "User already exists"})

if __name__ == "__main__":
    app.run(debug=True)
# @app.route('/api/v1/hello', methods=['GET'])