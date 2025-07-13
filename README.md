Query_me
========

Query_me is an AI-powered application that converts natural language queries into SQL SELECT statements.
It is designed to enable users—regardless of technical expertise—to interact with a database by simply typing in plain English.

Overview
--------

In many organizations, business users must rely on developers or data analysts to write SQL queries for basic reports.
This creates delays and slows down decision-making. Query_me solves this by letting users ask questions like:

    List all customers who reside in Canada

The application then returns a SQL query and executes it on a database, displaying the results in a simple, user-friendly interface.

Features
--------

- Translate natural language (English) into SQL queries
- Execute and display query results directly from a MySQL database
- User-friendly web interface with React
- AI-powered query translation using a Hugging Face model
- No SQL knowledge required for users

Technologies Used
-----------------

Component        | Technology
----------------|----------------------------------------
Frontend         | React
Backend          | Flask
Database         | MySQL
AI Model         | defog/sqlcoder-7b from Hugging Face
Model Runtime    | Google Colab
Database Schema  | Chinook (sourced from GitHub)

Architecture
------------

1. User Input: User types a question in natural language via the React frontend.
2. Request Handling: The Flask backend sends the query to the AI model hosted in Google Colab.
3. Model Inference: The Hugging Face model (sqlcoder-7b) returns a corresponding SQL query.
4. Execution: The SQL query is executed on a local MySQL database.
5. Response: Results are returned and displayed to the user through the frontend.

Setup Instructions
------------------

Note: The model runs in Google Colab and requires a separate environment from the local app components.

1. Clone the Repository

    git clone https://github.com/your-org/query_me.git
    cd query_me

2. Set Up the Backend (Flask)

    cd backend
    pip install -r requirements.txt
    python app.py

3. Set Up the Frontend (React)

    cd ../frontend
    npm install
    npm start

4. Set Up the MySQL Database

- Use the Chinook database schema (https://github.com/lerocha/chinook-database)
- Import it into your local MySQL instance

5. Run the Model on Google Colab

- Open the model notebook
- Load sqlcoder-7b from Hugging Face
- Host an API endpoint using FastAPI or Flask in Colab
- Update the backend to point to the Colab endpoint

Example Query
-------------

Input (natural language):

    List all customers who reside in Canada

Generated SQL:

    SELECT * FROM customers WHERE country = 'Canada';

Result:

A table of customers returned from the MySQL database.

Roadmap
-------

- Add support for more complex SQL operations (joins, grouping, filtering)
- Implement role-based access control
- Support multiple schemas
- Host the model locally for performance and privacy

Contributing
------------

We welcome contributions, suggestions, and feedback. If you'd like to contribute, feel free to fork the repository and open a pull request.

License
-------

This project is open-source and available under the MIT License.

Acknowledgements
----------------

- Hugging Face (https://huggingface.co/) for hosting the sqlcoder-7b model
- Chinook Database (https://github.com/lerocha/chinook-database) for the sample schema
- The open-source community for enabling rapid prototyping and development

Built with Flask, React, MySQL, Google Colab, and AI from Hugging Face.
