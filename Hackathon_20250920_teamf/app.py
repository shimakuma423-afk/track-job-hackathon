from flask import Flask, render_template, request
import json
import os

app = Flask(__name__)

# 手続きデータを外部JSONファイルから読み込み
def load_procedure_data():
    try:
        with open('static/data/procedures.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        # デフォルトデータ
        return {
            "resident_registration": {
                "title": "住民票登録",
                "icon": "fas fa-home",
                "content": "デフォルトの住民票登録情報"
            }
        }

@app.route('/')
def index():
    """メインページを表示"""
    return render_template('index.html')

@app.route('/procedure/<procedure_id>')
def procedure_detail(procedure_id):
    """各手続きの詳細ページを表示"""
    procedure_data = load_procedure_data()
    
    if procedure_id not in procedure_data:
        return render_template('error.html', 
                             error_message="指定された手続きが見つかりません"), 404
    
    procedure = procedure_data[procedure_id]
    return render_template('procedure_detail.html', 
                         procedure=procedure, 
                         procedure_id=procedure_id)

@app.route('/search')
def search():
    """検索結果ページ"""
    query = request.args.get('q', '')
    procedure_data = load_procedure_data()
    
    # 検索ロジック
    results = {}
    if query:
        for key, data in procedure_data.items():
            if (query.lower() in data['title'].lower() or 
                query.lower() in data.get('keywords', '').lower()):
                results[key] = data
    
    return render_template('search_results.html', 
                         query=query, 
                         results=results)

if __name__ == '__main__':
    app.run(debug=True)