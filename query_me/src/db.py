import mysql.connector

def get_db_connection():
    conn = mysql.connector.connect(
        host='192.168.56.1',  # Replace with your Windows machine's IP address
        user='root',
        password='',
        database='chinook'
    )
    return conn

def execute_query(sql: str):
    # Basic validation: Only allow SELECT queries
    if not sql.strip().lower().startswith("select"):
        raise ValueError("Only SELECT queries are allowed.")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(sql)
    columns = [desc[0] for desc in cursor.description]
    rows = cursor.fetchall()
    conn.close()

    results = [dict(zip(columns, row)) for row in rows]
    return results
