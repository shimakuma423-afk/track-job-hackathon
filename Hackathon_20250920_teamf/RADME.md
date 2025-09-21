外国人手続きナビ
PythonのFlaskを使用した外国人向け手続きナビゲーションサイトです。

ファイル構造
project/
├── app.py                              # メインのFlaskアプリケーション
├── templates/
│   ├── base.html                       # 共通ベーステンプレート
│   ├── index.html                      # メインページ
│   ├── procedure_detail.html           # 手続き詳細ページ
│   └── search_results.html             # 検索結果ページ
├── static/
│   ├── css/
│   │   └── style.css                   # メインスタイルシート
│   ├── js/
│   │   ├── common.js                   # 共通JavaScript
│   │   └── search.js                   # 検索機能
│   └── data/
│       └── procedures.json             # 手続きデータ
└── README.md
セットアップ手順
1. 必要な環境
Python 3.7以上
Flask
2. インストール
bash
# Flaskのインストール
pip install flask

# プロジェクトディレクトリの作成
mkdir foreign-procedure-nav
cd foreign-procedure-nav
3. ファイルの配置
上記のファイル構造に従って、各ファイルを適切なディレクトリに配置してください。

4. データディレクトリの作成
bash
mkdir -p static/data
mkdir -p static/css
mkdir -p static/js
mkdir templates
5. アプリケーションの起動
bash
python app.py
ブラウザで http://localhost:5000 にアクセスしてください。

機能
✅ 実装済み機能
レスポンシブデザイン: スマートフォン・タブレット・PCに対応
検索機能: リアルタイム検索とハイライト表示
画面遷移: 各手続きの詳細ページへの遷移
関連手続きの提案: 関連する手続きの表示
検索履歴: ローカルストレージを使用した検索履歴
キーボードショートカット: Ctrl+Kで検索フォーカス、Escで戻る
プリント機能: 詳細ページの印刷
🔧 カスタマイズ方法
1. 手続きデータの編集
static/data/procedures.json ファイルを編集して、手続きの内容を変更できます。

json
{
    "new_procedure": {
        "title": "新しい手続き",
        "icon": "fas fa-file",
        "keywords": "新しい 手続き",
        "content": "<h3>説明</h3><p>ここに詳細を記載</p>"
    }
}
2. デザインの変更
static/css/style.css を編集してデザインをカスタマイズできます。

3. 新しいページの追加
app.py に新しいルートを追加
templates/ に新しいテンプレートファイルを作成
必要に応じて JavaScript や CSS を追加
本番環境への展開
使用可能なホスティングサービス
Heroku: Pythonアプリの無料ホスティング
PythonAnywhere: Python専用ホスティング
Vercel: 静的サイト＋サーバーレス関数
AWS/Google Cloud: フルマネージドクラウド
本番設定の例（app.py）
python
if __name__ == '__main__':
    # 本番環境では debug=False に設定
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=False)
トラブルシューティング
よくある問題
テンプレートが見つからない: templates/ ディレクトリが正しい場所にあるか確認
静的ファイルが読み込まれない: static/ ディレクトリの構造を確認
JSONファイルが読み込まれない: static/data/procedures.json の文法を確認
デバッグモード
開発中は app.py の debug=True を有効にして、詳細なエラー情報を表示できます。

ライセンス
MIT License

