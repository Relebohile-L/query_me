from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/run_query', methods=['POST'])
def run_query():
    return jsonify({"message": "Route is working"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)

