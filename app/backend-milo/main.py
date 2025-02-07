# before trying to run the backend app make sure to install all dependencies
# pip install -r requirements.txt
# python main.py to run 

from flask import Flask, request, jsonify 
from db import * 

app = Flask(__name__)
app.secret_key = b'5015fbe01ff54e249e7416f4feb0cf9d'

cors = CORS(app, origins='*') 

@app.route('/api/v1/hello', methods=['GET'])