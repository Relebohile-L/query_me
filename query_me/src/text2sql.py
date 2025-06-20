from transformers import pipeline

# Load the model pipeline once
nl2sql = pipeline("text2text-generation", model="suriya7/t5-base-text-to-sql")

# Chinook schema metadata (structured)
schema_metadata = {
    "customers": ["CustomerId", "FirstName", "LastName", "Email", "Phone", "Address", "City", "State", "Country", "PostalCode"],
    "invoices": ["InvoiceId", "CustomerId", "InvoiceDate", "BillingAddress", "BillingCity", "BillingState", "BillingCountry", "BillingPostalCode", "Total"],
    "invoicelines": ["InvoiceLineId", "InvoiceId", "TrackId", "UnitPrice", "Quantity"],
    "tracks": ["TrackId", "Name", "AlbumId", "MediaTypeId", "GenreId", "Composer", "Milliseconds", "Bytes", "UnitPrice"],
    "albums": ["AlbumId", "Title", "ArtistId"],
    "artists": ["ArtistId", "Name"],
    "employees": ["EmployeeId", "LastName", "FirstName", "Title", "ReportsTo", "BirthDate", "HireDate", "Address", "City", "State", "Country", "PostalCode", "Phone", "Fax", "Email"],
    "genres": ["GenreId", "Name"],
    "mediatypes": ["MediaTypeId", "Name"],
    "playlists": ["PlaylistId", "Name"],
    "playlisttrack": ["PlaylistId", "TrackId"]
}

# Few-shot examples
few_shot_examples = [
    """### Question: List all customers from Canada
### SQL Query:
SELECT * FROM Customers WHERE Country = 'Canada';""",

    """### Question: Show all invoices with total greater than 10
### SQL Query:
SELECT * FROM Invoices WHERE Total > 10;""",

    """### Question: List all tracks composed by 'AC/DC'
### SQL Query:
SELECT * FROM Tracks WHERE Composer = 'AC/DC';""",

    """### Question: List all albums along with the name of the artist
### SQL Query:
SELECT Albums.Title, Artists.Name
FROM Albums
JOIN Artists ON Albums.ArtistId = Artists.ArtistId;""",

    """### Question: List invoice details with customer name
### SQL Query:
SELECT Invoices.InvoiceId, Customers.FirstName, Customers.LastName, Invoices.Total
FROM Invoices
JOIN Customers ON Invoices.CustomerId = Customers.CustomerId;""",

    """### Question: List all playlist names with their tracks
### SQL Query:
SELECT Playlists.Name AS PlaylistName, Tracks.Name AS TrackName
FROM PlaylistTrack
JOIN Playlists ON PlaylistTrack.PlaylistId = Playlists.PlaylistId
JOIN Tracks ON PlaylistTrack.TrackId = Tracks.TrackId;"""
]

def find_relevant_tables(question: str, schema: dict) -> list[str]:
    """
    Extract relevant table names from question using simple keyword matching.
    """
    question_lower = question.lower()
    relevant_tables = set()

    for table, columns in schema.items():
        if table in question_lower or table.rstrip('s') in question_lower or (table + 's') in question_lower:
            relevant_tables.add(table)
        else:
            for col in columns:
                if col.lower() in question_lower:
                    relevant_tables.add(table)
                    break

    if not relevant_tables:
        relevant_tables = {"customers", "invoices"}

    return list(relevant_tables)

def build_schema_snippet(schema: dict, tables: list[str]) -> str:
    """
    Build a schema snippet string listing relevant tables and columns
    """
    lines = []
    for table in tables:
        cols = ", ".join(schema[table])
        lines.append(f"- {table.capitalize()}({cols})")
    return "Tables and columns:\n" + "\n".join(lines)

def build_few_shot_prompt(schema_snippet: str, examples: list[str], question: str) -> str:
    """
    Build the final prompt with the selected schema snippet, few-shot examples, and the user's question.
    """
    prompt = schema_snippet.strip() + "\n\n"
    for example in examples:
        prompt += example.strip() + "\n\n"
    prompt += f"### Question: {question}\n### SQL Query:\n"
    return prompt

def generate_sql(question: str) -> str:
    relevant_tables = find_relevant_tables(question, schema_metadata)
    schema_snippet = build_schema_snippet(schema_metadata, relevant_tables)
    prompt = build_few_shot_prompt(schema_snippet, few_shot_examples, question)

    # Debug print
    print("\nPROMPT SENT TO MODEL:\n", prompt)

    output = nl2sql(prompt, max_new_tokens=128, clean_up_tokenization_spaces=True)
    generated = output[0]['generated_text'].strip()

    print("\nMODEL RAW OUTPUT:\n", generated)

    if not generated.lower().startswith("select"):
        raise ValueError("Model output is not a SELECT SQL query.")

    return generated
