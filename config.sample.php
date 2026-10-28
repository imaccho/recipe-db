<?php
// ==========================================================
// config.sample.php：データベース接続設定の見本
//
//   使い方：
//   1. このファイルをコピーして、名前を「config.php」にする
//   2. config.php に、サーバーの接続情報を書き込む
//   ※ config.php にはパスワードが入るため、GitHubにはアップしない
//     （.gitignore で除外している）
// ==========================================================

define('DB_HOST', 'localhost');     // MySQLのホスト名（例：mysql123.example.jp）
define('DB_PORT', '3306');          // ポート番号（ふつうは3306。MAMPは8889）
define('DB_NAME', 'recipe_db');     // データベース名
define('DB_USER', 'username');      // ユーザー名
define('DB_PASS', 'password');      // パスワード

// true にすると、エラーの詳しい内容を画面に返す（作成中の確認用）
// 公開するときは必ず false にする
define('DEBUG', false);
