<?php
// ==========================================================
// get_products.php：カート内商品のドロップダウン用の商品一覧
//   販売終了の商品（mpr_sales_end_flag が 1）は除く
//
//   返す形：{ "ok": true, "products": [ { "mpr_code": "M001", "mpr_name": "キャベツ1玉", "mpr_unit_price": 300 }, ... ] }
// ==========================================================

require_once __DIR__ . '/db.php';

try {
    $pdo = getDb();

    $sql = 'SELECT mpr_code, mpr_name, mpr_unit_price
            FROM ms_products
            WHERE mpr_sales_end_flag IS NULL OR mpr_sales_end_flag = 0
            ORDER BY mpr_code';
    $products = $pdo->query($sql)->fetchAll();

    sendJson(['ok' => true, 'products' => $products]);

} catch (Exception $e) {
    sendError('商品の一覧を取得できませんでした。', $e);
}
