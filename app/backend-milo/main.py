# before trying to run the backend app make sure to install all dependencies
# pip install -r requirements.txt
# python main.py to run 

from flask import Flask, request, jsonify 
from flask_cors import CORS
from db import * 

app = Flask(__name__)
app.secret_key = b'5015fbe01ff54e249e7416f4feb0cf9d'

cors = CORS(app, origins='*') 

@app.route("/", methods=["GET"])
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

if __name__ == "__main__":
    app.run(debug=True)
# @app.route('/api/v1/hello', methods=['GET'])