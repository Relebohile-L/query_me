from flask import Flask, request, jsonify
from flask_cors import CORS
from text2sql import generate_sql
from db import get_db_connection

app = Flask(__name__)
CORS(app)

@app.route('/generate_sql', methods=['POST'])
def generate_sql_route():
    data = request.get_json()
    question = data.get('question')
    if not question:
        return jsonify({"error": "No question provided"}), 400
    try:
        sql = generate_sql(question)
        return jsonify({"sql": sql})
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"Internal error: {str(e)}"}), 500


@app.route('/execute_sql', methods=['POST'])
def execute_sql_route():
    data = request.get_json()
    sql_query = data.get('sql')
    if not sql_query:
        return jsonify({"error": "No SQL query provided"}), 400
    try:
        if not sql_query.strip().lower().startswith("select"):
            return jsonify({"error": "Only SELECT queries are allowed"}), 400
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(sql_query)
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
        conn.close()
        results = [dict(zip(columns, row)) for row in rows]
        return jsonify({"results": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def index():
    return "API is running"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
