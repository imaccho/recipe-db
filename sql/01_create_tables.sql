-- ==========================================================
-- 01_create_tables.sql
--   レシピ検索システム（DB版） テーブル作成
--   MySQL 5.7 / 8.x 対応（文字コード utf8mb4）
--
--   使い方：phpMyAdmin の「SQL」タブに貼り付けて実行する
--           または mysql -u root -p < 01_create_tables.sql
-- ==========================================================

CREATE DATABASE IF NOT EXISTS recipe_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

USE recipe_db;

-- 作り直す時のため、外部キーで参照している側から先に削除する
DROP TABLE IF EXISTS t_cart_item;
DROP TABLE IF EXISTS t_cart;
DROP TABLE IF EXISTS m_product_food;
DROP TABLE IF EXISTS m_recipe_step;
DROP TABLE IF EXISTS m_recipe_ingredient;
DROP TABLE IF EXISTS m_recipe;
DROP TABLE IF EXISTS m_product;
DROP TABLE IF EXISTS m_food;
DROP TABLE IF EXISTS m_food_category;


-- ----------------------------------------------------------
-- 食材カテゴリマスタ
-- ----------------------------------------------------------
CREATE TABLE m_food_category (
  mfc_id          VARCHAR(3)   NOT NULL                COMMENT 'カテゴリID（例：C01）',
  mfc_name        VARCHAR(20)  NOT NULL                COMMENT 'カテゴリ名',
  mfc_created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登録日時',
  mfc_updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  PRIMARY KEY (mfc_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食材カテゴリマスタ';


-- ----------------------------------------------------------
-- 食材マスタ（レシピ検索用の食材）
-- ----------------------------------------------------------
CREATE TABLE m_food (
  mfd_id           VARCHAR(4)   NOT NULL               COMMENT '食材ID（例：F001）',
  mfd_name         VARCHAR(40)  NOT NULL               COMMENT '食材名',
  mfd_category_id  VARCHAR(3)   NOT NULL               COMMENT 'カテゴリID',
  mfd_created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登録日時',
  mfd_updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  PRIMARY KEY (mfd_id),
  CONSTRAINT fk_mfd_category FOREIGN KEY (mfd_category_id) REFERENCES m_food_category (mfc_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食材マスタ';


-- ----------------------------------------------------------
-- 商品マスタ（POSレジの商品マスタと同じ構成）
--   主キーはバーコード（JANコード）。商品コードは重複不可。
-- ----------------------------------------------------------
CREATE TABLE m_product (
  mpr_barcode         VARCHAR(20)   NOT NULL           COMMENT 'バーコード（JANコード）',
  mpr_code            VARCHAR(20)   NOT NULL           COMMENT '商品コード（JANとは別管理）',
  mpr_name            VARCHAR(100)  NOT NULL           COMMENT '商品名',
  mpr_sname           VARCHAR(40)   NOT NULL           COMMENT '商品名（略称）レシート用',
  mpr_maker           VARCHAR(20)   NULL               COMMENT 'メーカーコード（将来用）',
  mpr_unit_price      INT           NOT NULL           COMMENT '販売単価（税込）',
  mpr_tax_type        CHAR(1)       NOT NULL           COMMENT '税区分 1:10% 2:8%',
  mpr_category        VARCHAR(20)   NULL               COMMENT '商品分類（将来用）',
  mpr_sales_end_flag  BOOLEAN       NULL               COMMENT '販売終了 NULL/FALSE:販売中 TRUE:販売終了',
  mpr_created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登録日時',
  mpr_updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  PRIMARY KEY (mpr_barcode),
  UNIQUE KEY uq_mpr_code (mpr_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品マスタ';


-- ----------------------------------------------------------
-- 商品食材紐付けマスタ
--   商品（バーコード）→ レシピ検索用の食材
--   レシピに関係ない商品（洗剤など）は登録しない
-- ----------------------------------------------------------
CREATE TABLE m_product_food (
  mpf_barcode     VARCHAR(20)  NOT NULL                COMMENT 'バーコード',
  mpf_food_id     VARCHAR(4)   NOT NULL                COMMENT '食材ID',
  mpf_created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登録日時',
  mpf_updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  PRIMARY KEY (mpf_barcode),
  CONSTRAINT fk_mpf_product FOREIGN KEY (mpf_barcode) REFERENCES m_product (mpr_barcode),
  CONSTRAINT fk_mpf_food    FOREIGN KEY (mpf_food_id) REFERENCES m_food (mfd_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品食材紐付けマスタ';


-- ----------------------------------------------------------
-- レシピマスタ
-- ----------------------------------------------------------
CREATE TABLE m_recipe (
  mrc_id           VARCHAR(4)    NOT NULL              COMMENT 'レシピID（例：R001）',
  mrc_name         VARCHAR(100)  NOT NULL              COMMENT 'レシピ名',
  mrc_description  VARCHAR(255)  NULL                  COMMENT 'ひとこと紹介',
  mrc_image        VARCHAR(255)  NULL                  COMMENT '画像ファイルのパス',
  mrc_cook_time    INT           NOT NULL              COMMENT '調理時間（分）',
  mrc_servings     INT           NOT NULL              COMMENT '何人分か',
  mrc_created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登録日時',
  mrc_updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  PRIMARY KEY (mrc_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='レシピマスタ';


-- ----------------------------------------------------------
-- レシピ材料マスタ
--   食材ID が NULL の材料（砂糖・水など）は照合しない（表示のみ）
-- ----------------------------------------------------------
CREATE TABLE m_recipe_ingredient (
  mri_recipe_id   VARCHAR(4)   NOT NULL                COMMENT 'レシピID',
  mri_line_no     INT          NOT NULL                COMMENT '行番号（表示順）',
  mri_food_id     VARCHAR(4)   NULL                    COMMENT '食材ID（照合しない材料はNULL）',
  mri_name        VARCHAR(40)  NOT NULL                COMMENT '材料の表示名',
  mri_amount      VARCHAR(20)  NOT NULL                COMMENT '分量（例：150g、大さじ2）',
  mri_created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登録日時',
  mri_updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  PRIMARY KEY (mri_recipe_id, mri_line_no),
  CONSTRAINT fk_mri_recipe FOREIGN KEY (mri_recipe_id) REFERENCES m_recipe (mrc_id),
  CONSTRAINT fk_mri_food   FOREIGN KEY (mri_food_id)   REFERENCES m_food (mfd_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='レシピ材料マスタ';


-- ----------------------------------------------------------
-- レシピ手順マスタ
-- ----------------------------------------------------------
CREATE TABLE m_recipe_step (
  mrs_recipe_id   VARCHAR(4)    NOT NULL               COMMENT 'レシピID',
  mrs_step_no     INT           NOT NULL               COMMENT '手順番号',
  mrs_text        VARCHAR(500)  NOT NULL               COMMENT '手順の文章',
  mrs_created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登録日時',
  mrs_updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  PRIMARY KEY (mrs_recipe_id, mrs_step_no),
  CONSTRAINT fk_mrs_recipe FOREIGN KEY (mrs_recipe_id) REFERENCES m_recipe (mrc_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='レシピ手順マスタ';


-- ----------------------------------------------------------
-- カート（トランザクション：見出し）
-- ----------------------------------------------------------
CREATE TABLE t_cart (
  tca_id          INT          NOT NULL AUTO_INCREMENT COMMENT 'カートID（自動採番）',
  tca_status      CHAR(1)      NOT NULL DEFAULT '1'    COMMENT '状態 1:買い物中 2:会計済',
  tca_created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登録日時',
  tca_updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  PRIMARY KEY (tca_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='カート';


-- ----------------------------------------------------------
-- カート明細（トランザクション：明細）
--   1カートに同じバーコードは1行だけ（2回目のスキャンは数量+1）
--   単価・税区分はスキャンした時点の商品マスタの値をコピーして持つ
--   金額（単価×数量）と合計金額は保存せず、表示時にSQLで計算する
-- ----------------------------------------------------------
CREATE TABLE t_cart_item (
  tci_cart_id     INT          NOT NULL                COMMENT 'カートID',
  tci_line_no     INT          NOT NULL                COMMENT '行番号（スキャン順）',
  tci_barcode     VARCHAR(20)  NOT NULL                COMMENT 'バーコード',
  tci_unit_price  INT          NOT NULL                COMMENT '単価（税込・スキャン時点）',
  tci_tax_type    CHAR(1)      NOT NULL                COMMENT '税区分（スキャン時点）1:10% 2:8%',
  tci_quantity    INT          NOT NULL DEFAULT 1      COMMENT '数量',
  tci_created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登録日時（最初のスキャン）',
  tci_updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  PRIMARY KEY (tci_cart_id, tci_line_no),
  UNIQUE KEY uq_tci_cart_barcode (tci_cart_id, tci_barcode),
  CONSTRAINT fk_tci_cart    FOREIGN KEY (tci_cart_id) REFERENCES t_cart (tca_id),
  CONSTRAINT fk_tci_product FOREIGN KEY (tci_barcode) REFERENCES m_product (mpr_barcode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='カート明細';
