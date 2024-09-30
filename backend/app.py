# api.py

from flask import Flask, request, jsonify
from functools import wraps
import secrets

from flask_cors import CORS

import sharepoint_utils as sp
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes
app.secret_key = secrets.token_hex(16)

active_sessions = {}


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        session_token = request.headers.get('Authorization')
        if session_token not in active_sessions:
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)

    return decorated_function


from office365.runtime.auth.authentication_context import AuthenticationContext
from office365.sharepoint.client_context import ClientContext
from office365.runtime.auth.user_credential import UserCredential


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not all([username, password]):
        return jsonify({"error": "Missing username or password"}), 400

    try:
        # Attempt to authenticate
        auth_context = AuthenticationContext(sp.SITE_URL)
        if auth_context.acquire_token_for_user(username, password):
            # Authentication successful, create a client context
            ctx = ClientContext(sp.SITE_URL, auth_context)

            # Test the connection by trying to get the web title
            web = ctx.web
            ctx.load(web)
            ctx.execute_query()

            # If we get here, the connection was successful
            session_token = secrets.token_hex(16)
            active_sessions[session_token] = ctx
            return jsonify({"message": "Login successful", "session_token": session_token})
        else:
            # Authentication failed
            return jsonify({"error": "Invalid username or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    session_token = request.headers.get('Authorization')
    del active_sessions[session_token]
    return jsonify({"message": "Logout successful"})


@app.route('/list_files', methods=['GET'])
@login_required
def list_files():
    session_token = request.headers.get('Authorization')
    ctx = active_sessions[session_token]

    try:
        files = sp.get_folder_files(ctx)
        file_list = [sp.get_file_properties(file) for file in files]
        return jsonify(file_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/search_files', methods=['POST'])
@login_required
def search_files():
    session_token = request.headers.get('Authorization')
    ctx = active_sessions[session_token]

    data = request.json
    search_word = data.get('search_word')

    if not search_word:
        return jsonify({"error": "Missing search_word"}), 400

    try:
        results = sp.search_files(ctx, search_word)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/upload_file', methods=['POST'])
@login_required
def upload_file():
    session_token = request.headers.get('Authorization')
    ctx = active_sessions[session_token]

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        filename = secure_filename(file.filename)
        file_content = file.read()

        try:
            result = sp.upload_file(ctx, filename, file_content)
            return jsonify({"message": "File uploaded successfully", "file_info": result})
        except Exception as e:
            return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
