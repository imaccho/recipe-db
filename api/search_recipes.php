<?php
// ==========================================================
// search_recipes.php：レシピ検索
//
//   受け取る形（POST・JSON）：
//     { "cart": ["M001","M032"],      … カート内商品の商品コード
//       "home": ["F002","F035"],      … カート外食材（レシピ材料ID）
//       "exclude": ["F005"] }         … 対象外食材（レシピ材料ID）
//
//   処理：
//     1. カート内商品を foods で食材（レシピ材料ID）に変換する
//     2. 1. とカート外食材を合わせて、重複をなくす → 検索対象食材
//     3. レシピごとに「材料数」「一致数」「対象外食材の数」を数える
//     4. 対象外食材を含まず、一致数が1以上のレシピを、一致数の多い順に返す
//
//   返す形：
//     { "ok": true,
//       "targets": ["F001","F002", ...],   … 検索対象食材（詳細画面の○×に使う）
//       "recipes": [ { "recipe_id": "R001", "recipe_name": "肉じゃが",
//                      "image_path": "image_paths/r001.jpg",
//                      "total_count": 5, "match_count": 3 }, ... ] }
// ==========================================================

require_once __DIR__ . '/db.php';

// ----------------------------------------------------------
// 受け取ったデータを、文字列の配列として取り出す
// ----------------------------------------------------------
function getList($input, $key)
{
    if (!isset($input[$key]) || !is_array($input[$key])) {
        return [];
    }
    $list = [];
    foreach ($input[$key] as $value) {
        if (is_string($value) && $value !== '' && strlen($value) <= 20) {
            $list[] = $value;
        }
    }
    return array_values(array_unique($list));
}

try {
    $input   = json_decode(file_get_contents('php://input'), true);
    $cart    = getList($input, 'cart');
    $home    = getList($input, 'home');
    $exclude = getList($input, 'exclude');

    $pdo = getDb();

    // ---- 1. カート内商品 → 食材（レシピ材料ID） ----
    $cartFoods = [];
    if (count($cart) > 0) {
        $sql = 'SELECT DISTINCT recipe_food_id
                FROM foods
                WHERE mpr_code IN (' . placeholders($cart) . ')';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($cart);
        $cartFoods = $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    // ---- 2. 検索対象食材 ----
    $targets = array_values(array_unique(array_merge($cartFoods, $home)));
    if (count($targets) === 0) {
        sendJson(['ok' => true, 'targets' => [], 'recipes' => []]);
    }

    // ---- 3. レシピごとに数える ----
    //   対象外食材が0件の時は IN () が書けないので、0 を固定で入れる
    $excludeSql = count($exclude) > 0
        ? 'SUM(m.recipe_food_id IN (' . placeholders($exclude) . '))'
        : '0';

    $sql = 'SELECT *
            FROM (
                SELECT r.recipe_id,
                       r.recipe_name,
                       r.image_path,
                       COUNT(m.recipe_food_id)                                         AS total_count,
                       SUM(m.recipe_food_id IN (' . placeholders($targets) . '))       AS match_count,
                       ' . $excludeSql . '                                             AS exclude_count
                FROM recipes r
                JOIN materials m ON m.recipe_id = r.recipe_id
                GROUP BY r.recipe_id, r.recipe_name, r.image_path
            ) AS t
            WHERE match_count >= 1
              AND exclude_count = 0
            ORDER BY match_count DESC,
                     (total_count - match_count) ASC,
                     recipe_id ASC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute(array_merge($targets, $exclude));   // ? の順番どおりに値を渡す
    $recipes = $stmt->fetchAll();

    // 数値は文字列で返ってくることがあるので、数値にそろえる
    foreach ($recipes as &$r) {
        $r['total_count'] = (int)$r['total_count'];
        $r['match_count'] = (int)$r['match_count'];
        unset($r['exclude_count']);
    }
    unset($r);

    sendJson(['ok' => true, 'targets' => $targets, 'recipes' => $recipes]);

} catch (Exception $e) {
    sendError('レシピを検索できませんでした。', $e);
}
