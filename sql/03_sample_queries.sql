-- ==========================================================
-- 03_sample_queries.sql
--   PHPで使うSQLの見本（phpMyAdminで1つずつ試せる）
--   ? の部分は、PHPでは プリペアドステートメント で値を渡す
--   ここでは試しやすいように値を直接書いている
-- ==========================================================

USE recipe_db;

-- ----------------------------------------------------------
-- 1. カートを新しく作る（買い物を始める時）
-- ----------------------------------------------------------
INSERT INTO t_cart (tca_status) VALUES ('1');
SELECT LAST_INSERT_ID() AS cart_id;   -- 作られたカートIDを取り出す（以下 1 とする）


-- ----------------------------------------------------------
-- 2. 商品をスキャンした時
--   2-1 商品マスタを探す（見つからない・販売終了ならエラー）
-- ----------------------------------------------------------
SELECT mpr_barcode, mpr_sname, mpr_unit_price, mpr_tax_type, mpr_sales_end_flag
FROM m_product
WHERE mpr_barcode = '2000000000015';

--   2-2 同じ商品がカートにあるか調べる
SELECT tci_line_no, tci_quantity
FROM t_cart_item
WHERE tci_cart_id = 1 AND tci_barcode = '2000000000015';

--   2-3a ない時：新しい行を追加する（行番号は今の最大値+1、単価・税区分は商品マスタからコピー）
INSERT INTO t_cart_item (tci_cart_id, tci_line_no, tci_barcode, tci_unit_price, tci_tax_type, tci_quantity)
SELECT 1,
       (SELECT COALESCE(MAX(tci_line_no), 0) + 1 FROM t_cart_item WHERE tci_cart_id = 1),
       mpr_barcode, mpr_unit_price, mpr_tax_type, 1
FROM m_product
WHERE mpr_barcode = '2000000000015';

--   2-3b ある時：数量を +1 する
UPDATE t_cart_item
SET tci_quantity = tci_quantity + 1
WHERE tci_cart_id = 1 AND tci_barcode = '2000000000015';


-- ----------------------------------------------------------
-- 3. カート内商品の一覧（単価・数量・金額）
-- ----------------------------------------------------------
SELECT ci.tci_line_no                    AS line_no,
       ci.tci_barcode                    AS barcode,
       p.mpr_sname                       AS product_name,
       ci.tci_unit_price                 AS unit_price,
       ci.tci_quantity                   AS quantity,
       ci.tci_unit_price * ci.tci_quantity AS amount
FROM t_cart_item ci
JOIN m_product p ON p.mpr_barcode = ci.tci_barcode
WHERE ci.tci_cart_id = 1
ORDER BY ci.tci_line_no;


-- ----------------------------------------------------------
-- 4. カートの合計金額・合計点数
-- ----------------------------------------------------------
SELECT COALESCE(SUM(tci_unit_price * tci_quantity), 0) AS total_amount,
       COALESCE(SUM(tci_quantity), 0)                  AS total_quantity
FROM t_cart_item
WHERE tci_cart_id = 1;


-- ----------------------------------------------------------
-- 5. カート内商品を削除する（一覧でダブルクリック → OK）
-- ----------------------------------------------------------
DELETE FROM t_cart_item
WHERE tci_cart_id = 1 AND tci_line_no = 1;


-- ----------------------------------------------------------
-- 6. カート内商品から、レシピ検索用の食材IDを取り出す
--    （紐付けのない商品＝洗剤などは出てこない）
-- ----------------------------------------------------------
SELECT DISTINCT pf.mpf_food_id AS food_id, f.mfd_name AS food_name
FROM t_cart_item ci
JOIN m_product_food pf ON pf.mpf_barcode = ci.tci_barcode
JOIN m_food f          ON f.mfd_id = pf.mpf_food_id
WHERE ci.tci_cart_id = 1;


-- ----------------------------------------------------------
-- 7. レシピ検索
--    検索対象食材 ＝ カート内の食材（6.）＋ カート外食材（画面から受け取る）
--    対象外食材を材料に含むレシピは表示しない
--    例）検索対象：キャベツ・にんじん・豚バラ肉・玉ねぎ・卵・じゃがいも
--        対象外  ：ピーマン
--    ※PHPでは IN ( ) の中身を食材の数だけ ? にして値を渡す
--    ※対象外食材が0件の時は exclude_count を 0 にする（IN () は空にできないため）
-- ----------------------------------------------------------
SELECT *
FROM (
    -- レシピごとに「材料数」「一致数」「対象外食材の数」を数える
    SELECT r.mrc_id    AS recipe_id,
           r.mrc_name  AS recipe_name,
           r.mrc_image AS image,
           COUNT(i.mri_food_id)                                              AS total_count,
           SUM(i.mri_food_id IN ('F001','F003','F021','F002','F035','F004'))  AS match_count,
           SUM(i.mri_food_id IN ('F005'))                                    AS exclude_count
    FROM m_recipe r
    JOIN m_recipe_ingredient i ON i.mri_recipe_id = r.mrc_id
    GROUP BY r.mrc_id, r.mrc_name, r.mrc_image
) AS t
WHERE match_count >= 1
  AND exclude_count = 0
ORDER BY match_count DESC,
         (total_count - match_count) ASC,
         recipe_id ASC;
--   COUNT(i.mri_food_id) は食材IDがNULLの行（砂糖・水など）を数えない
--   → 「5食材中3食材」の 5 になる


-- ----------------------------------------------------------
-- 8. レシピ詳細
-- ----------------------------------------------------------
SELECT mrc_id, mrc_name, mrc_image, mrc_cook_time, mrc_servings
FROM m_recipe WHERE mrc_id = 'R001';

SELECT mri_line_no, mri_food_id, mri_name, mri_amount
FROM m_recipe_ingredient WHERE mri_recipe_id = 'R001'
ORDER BY mri_line_no;

SELECT mrs_step_no, mrs_text
FROM m_recipe_step WHERE mrs_recipe_id = 'R001'
ORDER BY mrs_step_no;


-- ----------------------------------------------------------
-- 9. 食材ドロップダウン用（カテゴリ順・食材ID順）
-- ----------------------------------------------------------
SELECT f.mfd_id, f.mfd_name, c.mfc_id, c.mfc_name
FROM m_food f
JOIN m_food_category c ON c.mfc_id = f.mfd_category_id
ORDER BY c.mfc_id, f.mfd_id;
