from flask import Flask, render_template, request, jsonify
import sqlite3
from datetime import datetime



app = Flask(__name__)

DB_NAME = "database.db"
resolutions = [
    {"id": 1, "text": "Learn Flask"},
    {"id": 2, "text": "Exercise regularly"}
]

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS resolutions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def get_resolutions():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT id, text, created_at FROM resolutions ORDER BY id DESC")
    rows = c.fetchall()
    conn.close()
    return [{"id": r[0], "text": r[1], "created_at": r[2]} for r in rows]

def add_resolution(text):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("INSERT INTO resolutions (text, created_at) VALUES (?, ?)",
              (text, datetime.now().isoformat()))
    conn.commit()
    conn.close()

def edit_resolution(res_id, new_text):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("UPDATE resolutions SET text=? WHERE id=?", (new_text, res_id))
    conn.commit()
    conn.close()

def delete_resolution(res_id):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("DELETE FROM resolutions WHERE id=?", (res_id,))
    conn.commit()
    conn.close()

@app.route('/')
def home():
    return render_template('home.html')
@app.route('/resolutions')
def resolutions():
    return render_template('resolutions.html')
@app.route('/api/resolutions', methods=['GET'])
def api_get_resolutions():
    return jsonify(get_resolutions())

@app.route('/api/resolutions', methods=['POST'])
def api_add_resolution():
    data = request.get_json()
    text = data.get("text", "").strip()
    if text:
        add_resolution(text)
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "Empty text"}), 400

@app.route('/api/resolutions/<int:res_id>', methods=['PUT'])
def api_edit_resolution(res_id):
    data = request.get_json()
    new_text = data.get("text", "").strip()
    if new_text:
        edit_resolution(res_id, new_text)
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "Empty text"}), 400

@app.route('/api/resolutions/<int:res_id>', methods=['DELETE'])
def api_delete_resolution(res_id):
    delete_resolution(res_id)
    return jsonify({"success": True})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
