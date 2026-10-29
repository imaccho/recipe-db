<?php
// ==========================================================
// get_foods.php：カート外食材・対象外食材のドロップダウン用の食材一覧
//   レシピの材料（materials）に出てくる食材だけを、重複なしで返す
//
//   返す形：{ "ok": true, "foods": [ { "recipe_food_id": "F001", "food_name": "キャベツ" }, ... ] }
// ==========================================================

require_once __DIR__ . '/db.php';

try {
    $pdo = getDb();

    // 材料名（food_name）が空の行は除く
    //   空の行があると、同じ食材が「名前あり」と「名前なし」の2つに分かれて
    //   ドロップダウンに空白の選択肢ができてしまうため
    $sql = "SELECT DISTINCT recipe_food_id, food_name
            FROM materials
            WHERE food_name IS NOT NULL
              AND food_name <> ''
            ORDER BY recipe_food_id";
    $foods = $pdo->query($sql)->fetchAll();

    sendJson(['ok' => true, 'foods' => $foods]);

} catch (Exception $e) {
    sendError('食材の一覧を取得できませんでした。', $e);
}
