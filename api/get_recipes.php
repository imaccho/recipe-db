<?php
// ==========================================================
// get_recipes.php：レシピの一覧（全件）
//   ブラウザでこのファイルを直接開くと、recipes テーブルの内容を確認できる
//   material_count は materials に登録されている材料の数
//   （0 のレシピは、材料が未登録か、recipe_id が materials と一致していない）
//
//   返す形：{ "ok": true, "count": 15,
//             "recipes": [ { "recipe_id": "R001", "recipe_name": "肉じゃが",
//                            "image_path": "image_paths/r001.jpg", "material_count": 5 }, ... ] }
// ==========================================================

require_once __DIR__ . '/db.php';

try {
    $pdo = getDb();

    $sql = 'SELECT r.recipe_id,
                   r.recipe_name,
                   r.image_path,
                   COUNT(m.recipe_food_id) AS material_count
            FROM recipes r
            LEFT JOIN materials m ON m.recipe_id = r.recipe_id
            GROUP BY r.recipe_id, r.recipe_name, r.image_path
            ORDER BY r.recipe_id';
    $recipes = $pdo->query($sql)->fetchAll();

    foreach ($recipes as &$r) {
        $r['material_count'] = (int)$r['material_count'];
    }
    unset($r);

    sendJson(['ok' => true, 'count' => count($recipes), 'recipes' => $recipes]);

} catch (Exception $e) {
    sendError('レシピの一覧を取得できませんでした。', $e);
}
