<?php
// ==========================================================
// get_products.php：カート内商品のドロップダウン用の商品一覧
//   販売終了日（mpr_sales_end_flag：DATE型）を過ぎた商品は除く
//   ・販売終了日が空（NULL）→ 販売中
//   ・販売終了日が今日以降 → 販売中（終了日の当日までは選べる）
//
//   返す形：{ "ok": true, "products": [ { "mpr_code": "M001", "mpr_name": "キャベツ1玉", "mpr_unit_price": 300 }, ... ] }
// ==========================================================

require_once __DIR__ . '/db.php';

try {
    $pdo = getDb();

    $sql = 'SELECT mpr_code, mpr_name, mpr_unit_price
            FROM ms_product
            WHERE mpr_sales_end_flag IS NULL
               OR mpr_sales_end_flag >= CURDATE()
            ORDER BY mpr_code';
    $products = $pdo->query($sql)->fetchAll();

    sendJson(['ok' => true, 'products' => $products]);

} catch (Exception $e) {
    sendError('商品の一覧を取得できませんでした。', $e);
}
