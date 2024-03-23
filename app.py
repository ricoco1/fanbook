import os
from os.path import join, dirname
from dotenv import load_dotenv
from datetime import datetime
from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

MONGODB_URI = os.environ.get("MONGODB_URI")
DB_NAME =  os.environ.get("DB_NAME")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

app = Flask(__name__)

@app.route('/')
def home():
   return render_template('index.html')

@app.route("/fanbook", methods=["POST"])
def fanbook_post():
    name_receive = request.form["name_give"]
    comment_receive = request.form["comment_give"]

    count = db.comments.count_documents({})
    current_time = datetime.now()
    num = count + 1
    doc = {
        'num':num,
        'name': name_receive,
        'comment':comment_receive,
        'created_at': current_time,
    }
    db.comments.insert_one(doc)
    return jsonify({'msg':'Fanbook Berhasil Disimpan'})

@app.route("/fanbook", methods=["GET"])
def fanbook_get():
    fanbook_list = list(db.comments.find({},{'_id':False}))
    return jsonify({'comments':fanbook_list})


if __name__ == '__main__':
   app.run('0.0.0.0', port=5000, debug=True)