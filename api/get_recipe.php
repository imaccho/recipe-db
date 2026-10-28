<?php
// ==========================================================
// get_recipe.php：レシピ詳細（1件）
//
//   受け取る形（GET）：get_recipe.php?id=R001
//   返す形：
//     { "ok": true,
//       "recipe": { "recipe_id": "R001", "recipe_name": "肉じゃが", "description": null,
//                   "image_path": "image_paths/r001.jpg", "cook_time": 30, "servings": 2 },
//       "materials": [ { "recipe_food_id": "F025", "food_name": "牛こま肉", "amount": "150g" }, ... ] }
// ==========================================================

require_once __DIR__ . '/db.php';

try {
    $id = isset($_GET['id']) ? $_GET['id'] : '';
    if ($id === '' || strlen($id) > 20) {
        sendJson(['ok' => false, 'error' => 'レシピIDが正しくありません。'], 400);
    }

    $pdo = getDb();

    // レシピ本体
    $stmt = $pdo->prepare('SELECT recipe_id, recipe_name, description, image_path, cook_time, servings
                           FROM recipes
                           WHERE recipe_id = ?');
    $stmt->execute([$id]);
    $recipe = $stmt->fetch();

    if ($recipe === false) {
        sendJson(['ok' => false, 'error' => 'レシピが見つかりません。'], 404);
    }

    // 材料（レシピ材料IDの順）
    $stmt = $pdo->prepare('SELECT recipe_food_id, food_name, amount
                           FROM materials
                           WHERE recipe_id = ?
                           ORDER BY recipe_food_id');
    $stmt->execute([$id]);
    $materials = $stmt->fetchAll();

    sendJson(['ok' => true, 'recipe' => $recipe, 'materials' => $materials]);

} catch (Exception $e) {
    sendError('レシピの詳細を取得できませんでした。', $e);
}
