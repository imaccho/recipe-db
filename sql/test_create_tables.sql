-- ==========================================================
-- test_create_tables.sql
--   【テスト用】ローカルで動作確認するためのテーブル作成SQL
--   本番のDBは外部サーバーに作成済み（設計書のテーブル設計どおり）。
--   このファイルは、その構成をまねたテスト用DBを作るためのもの。
--
--   設計書から変えている点（本番DBでも検討が必要）：
--   ・materials：recipe_food_id は同じ食材（F002など）が何度も出るため
--     主キーにできない → 連番の material_id を主キーとして追加
--   ・foods.recipe_food_id → materials の外部キーは付けない
--     （レシピで使わない食材 F007 トマトなどが登録できなくなるため）
-- ==========================================================
SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS recipe_test DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE recipe_test;

DROP TABLE IF EXISTS foods;
DROP TABLE IF EXISTS materials;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS ms_products;

-- 商品マスタ
CREATE TABLE ms_products (
  mpr_code            VARCHAR(20)  NOT NULL COMMENT '商品コード',
  mpr_barcode         VARCHAR(20)  NULL     COMMENT 'バーコード',
  mpr_name            VARCHAR(100) NOT NULL COMMENT '商品名',
  mpr_sname           VARCHAR(40)  NULL     COMMENT '商品名（略称）',
  mpr_maker           VARCHAR(20)  NULL     COMMENT 'メーカーコード',
  mpr_unit_price      INT          NOT NULL COMMENT '販売単価（税込）',
  mpr__tax_type       CHAR(1)      NULL     COMMENT '税区分',
  mpr_category        VARCHAR(20)  NULL     COMMENT '商品分類',
  mpr_sales_end_flag  BOOLEAN      NULL     COMMENT '販売終了',
  mpr_created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登録日時',
  mpr_updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  PRIMARY KEY (mpr_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- レシピ
CREATE TABLE recipes (
  recipe_id    VARCHAR(10)  NOT NULL COMMENT 'レシピID',
  recipe_name  VARCHAR(100) NOT NULL COMMENT 'レシピ名',
  description  VARCHAR(255) NULL     COMMENT '紹介文',
  image_path   VARCHAR(255) NULL     COMMENT '画像の保存場所',
  cook_time    INT          NULL     COMMENT '料理時間（分）',
  servings     INT          NULL     COMMENT '分量（人数）',
  PRIMARY KEY (recipe_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- レシピ材料
CREATE TABLE materials (
  material_id     INT          NOT NULL AUTO_INCREMENT COMMENT '連番（テスト用に追加）',
  recipe_food_id  VARCHAR(10)  NOT NULL COMMENT 'レシピ材料ID（食材を表すF001など）',
  recipe_id       VARCHAR(10)  NOT NULL COMMENT 'レシピID',
  amount          VARCHAR(20)  NULL     COMMENT '分量',
  food_name       VARCHAR(40)  NOT NULL COMMENT '材料名',
  PRIMARY KEY (material_id),
  KEY idx_materials_food (recipe_food_id),
  CONSTRAINT fk_materials_recipe FOREIGN KEY (recipe_id) REFERENCES recipes (recipe_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 食材（商品とレシピ材料の紐付け）
CREATE TABLE foods (
  food_id         INT          NOT NULL AUTO_INCREMENT COMMENT '食材ID',
  mpr_code        VARCHAR(20)  NOT NULL COMMENT '商品コード',
  recipe_food_id  VARCHAR(10)  NOT NULL COMMENT 'レシピ材料ID（F001など）',
  PRIMARY KEY (food_id),
  KEY idx_foods_food (recipe_food_id),
  CONSTRAINT fk_foods_product FOREIGN KEY (mpr_code) REFERENCES ms_products (mpr_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
