from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
import bcrypt
import requests
import re

app = Flask(__name__)
CORS(app)

# === CONFIG ===
COLAB_MODEL_URL = "https://2901a70f4cf0.ngrok-free.app/generate_sql"

# === MySQL CONFIG ===
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'Chinook'

mysql = MySQL(app)

# === Helper ===
def fix_sql_for_mysql(sql):
    sql = re.sub(r"(\w+(?:\.\w+)*)\s+ilike\s+'([^']*)'", r"LOWER(\1) LIKE LOWER('\2')", sql, flags=re.IGNORECASE)
    sql = sql.replace("NULLS LAST", "")
    return sql

# === Route: Natural Language to SQL ===
@app.route('/run_query', methods=['POST'])
def run_query():
    try:
        data = request.get_json()
        question = data.get("question")

        if not question:
            return jsonify({"error": "Missing 'question'"}), 400

        model_response = requests.post(COLAB_MODEL_URL, json={"question": question})
        if model_response.status_code != 200:
            return jsonify({"error": "Model error", "detail": model_response.text}), 500

        response_json = model_response.json()
        print("Model response JSON:", response_json)  # Debug print

        sql = response_json.get("sql")
        print("Generated SQL:", repr(sql))  # Debug print

        if not sql or not sql.strip():
            return jsonify({"error": "No SQL returned from model or SQL is empty"}), 500

        sql = fix_sql_for_mysql(sql)

        cursor = mysql.connection.cursor()
        cursor.execute(sql)
        rows = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        cursor.close()

        result = [dict(zip(column_names, row)) for row in rows]
        return jsonify({
            "question": question,
            "sql": sql,
            "result": result or [],
            "message": "Query executed successfully" if result else "No results found."
        })

    except Exception as e:
        return jsonify({"error": "Unexpected error", "detail": str(e)}), 500



# === Route: Sign Up (Employees Only) ===
@app.route('/signup', methods=['POST'])
def signup():
    print("✅ Signup route hit")
    data = request.json
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    if not email or not username or not password:
        return jsonify({'error': 'All fields are required'}), 400

    cursor = mysql.connection.cursor()

    # 1. Check if email exists in Employee table
    cursor.execute("SELECT EmployeeId FROM Employee WHERE Email = %s", (email,))
    employee = cursor.fetchone()

    if not employee:
        return jsonify({'error': 'Email not associated with any employee'}), 403

    employee_id = employee[0]

    # 2. Check if username already exists
    cursor.execute("SELECT * FROM login WHERE username = %s", (username,))
    if cursor.fetchone():
        return jsonify({'error': 'Username already exists'}), 409

    # 3. Hash password with bcrypt
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # 4. Insert into login table
    cursor.execute(
        "INSERT INTO login (username, password_hash, employee_id) VALUES (%s, %s, %s)",
        (username, hashed_password, employee_id)
    )
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Signup successful'}), 201


@app.route('/api/authenticate', methods=['POST'])
def authenticate():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    if not username or not password:
        return jsonify({"message": "Missing username or password"}), 400

    try:
        cursor = mysql.connection.cursor()

        query = """
            SELECT l.employee_id, l.password_hash,
                   e.FirstName, e.LastName, e.Email
            FROM login l
            JOIN Employee e ON l.employee_id = e.EmployeeId
            WHERE l.username = %s
        """
        cursor.execute(query, (username,))
        row = cursor.fetchone()
        cursor.close()

        if not row:
            return jsonify({"message": "Invalid username or password"}), 401

        # Unpack the result manually
        employee_id, password_hash, first_name, last_name, email = row

        if not bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8')):
            return jsonify({"message": "Invalid username or password"}), 401

        return jsonify({
            "message": "Authentication successful",
            "employeeId": employee_id,
            "firstName": first_name,
            "lastName": last_name,
            "email": email,
        })

    except Exception as e:
        return jsonify({"message": "Server error", "error": str(e)}), 500


# === Run Flask App ===
if __name__ == '__main__':
    app.run(debug=True,port=5000)







# === Health Check ===
# === Health Check ===



