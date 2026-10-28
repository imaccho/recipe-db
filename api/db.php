<?php
// ==========================================================
// db.php：データベース接続と、JSONを返すための共通処理
//   api フォルダの各PHPファイルの最初で require_once して使う
// ==========================================================

require_once __DIR__ . '/../config.php';

// ----------------------------------------------------------
// getDb：データベースに接続して、PDOオブジェクトを返す
// ----------------------------------------------------------
function getDb()
{
    $dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';

    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,  // エラーの時は例外を出す
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,        // 結果を「列名 => 値」の配列で受け取る
        PDO::ATTR_EMULATE_PREPARES   => false,                   // 本物のプリペアドステートメントを使う
    ]);
    return $pdo;
}

// ----------------------------------------------------------
// sendJson：データをJSONにしてブラウザに返し、処理を終える
// ----------------------------------------------------------
function sendJson($data, $status = 200)
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// ----------------------------------------------------------
// sendError：エラーをJSONで返す
//   DEBUG が false の時は、DBのエラー内容（テーブル名など）を画面に出さない
// ----------------------------------------------------------
function sendError($message, $exception = null)
{
    if ($exception !== null) {
        error_log($exception->getMessage());   // サーバーのエラーログに記録する
    }
    $data = ['ok' => false, 'error' => $message];
    if (DEBUG && $exception !== null) {
        $data['detail'] = $exception->getMessage();
    }
    sendJson($data, 500);
}

// ----------------------------------------------------------
// placeholders：IN ( ) の中に入れる「?,?,?」を、配列の数だけ作る
//   例：['F001','F002'] → '?,?'
// ----------------------------------------------------------
function placeholders($array)
{
    return implode(',', array_fill(0, count($array), '?'));
}
