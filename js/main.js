// ==========================================================
// main.js：画面の処理（DB版）
//   データは api フォルダのPHPから受け取る（fetch）
//     api/get_products.php   … カート内商品のドロップダウン用
//     api/get_foods.php      … カート外食材・対象外食材のドロップダウン用
//     api/search_recipes.php … レシピ検索
//     api/get_recipe.php     … レシピ詳細
// ==========================================================

// ---------- PHPから受け取ったマスタ ----------
let products = [];   // [{ mpr_code, mpr_name, mpr_unit_price }, ...]
let foods = [];      // [{ recipe_food_id, food_name }, ...]

// ---------- 画面で選んだもの（ブラウザ側で持つ） ----------
const cartProducts = [];  // カート内商品（商品コード M001 など）
const homeFoods = [];     // カート外食材（レシピ材料ID F001 など）
const excludeFoods = [];  // 対象外食材（レシピ材料ID）

// ---------- 最後の検索結果（詳細画面の○×と一致数に使う） ----------
let lastTargets = [];     // 検索対象食材
let lastResults = [];     // 検索結果のレシピ一覧

const NO_IMAGE = "image_paths/noimage.png";  // 画像がない時に表示する画像

window.addEventListener("DOMContentLoaded", init);


// ==========================================================
// init：画面を開いた時の準備
// ==========================================================
async function init() {
  // 追加ボタン
  document.getElementById("cartAddBtn").addEventListener("click", function () {
    addItem(cartProducts, "cartSelect", "cartList", getProductName);
  });
  document.getElementById("homeAddBtn").addEventListener("click", function () {
    addItem(homeFoods, "homeSelect", "homeList", getFoodName);
  });
  document.getElementById("excludeAddBtn").addEventListener("click", function () {
    addItem(excludeFoods, "excludeSelect", "excludeList", getFoodName);
  });

  document.getElementById("searchBtn").addEventListener("click", searchRecipes);
  document.getElementById("backBtn").addEventListener("click", showMain);

  // データベースから商品と食材を読み込む
  setButtonsEnabled(false);
  showMessage("データを読み込んでいます…");
  try {
    const productData = await fetchJson("api/get_products.php");
    const foodData = await fetchJson("api/get_foods.php");
    products = productData.products;
    foods = foodData.foods;

    createOptions(document.getElementById("cartSelect"), products, "mpr_code", "mpr_name");
    createOptions(document.getElementById("homeSelect"), foods, "recipe_food_id", "food_name");
    createOptions(document.getElementById("excludeSelect"), foods, "recipe_food_id", "food_name");

    setButtonsEnabled(true);
    showMessage("商品・食材を追加して「レシピを探す」を押してください。");
  } catch (error) {
    showMessage("データベースに接続できません。（" + error.message + "）");
  }
}


// ==========================================================
// fetchJson：PHPを呼び出して、JSONを受け取る
//   options を渡すと POST などにできる
//   エラーの時は throw する（呼び出し側の catch に進む）
// ==========================================================
async function fetchJson(url, options) {
  const response = await fetch(url, options);

  let data;
  try {
    data = await response.json();
  } catch (e) {
    // PHPのエラー画面など、JSONでないものが返ってきた時
    throw new Error("サーバーから正しい応答がありません");
  }

  if (!data.ok) {
    let message = data.error || "エラーが発生しました";
    // config.php の DEBUG が true の時だけ、PHPが詳しい原因（detail）を返してくる
    if (data.detail) {
      message += "／詳細：" + data.detail;
    }
    throw new Error(message);
  }
  return data;
}


// ==========================================================
// createOptions：ドロップダウンの選択肢を作る
//   items     ：配列（products または foods）
//   valueKey  ：option の値にする項目名
//   textKey   ：表示する項目名
// ==========================================================
function createOptions(selectElement, items, valueKey, textKey) {
  selectElement.innerHTML = "";

  const first = document.createElement("option");
  first.value = "";
  first.textContent = "選択してください";
  selectElement.appendChild(first);

  items.forEach(function (item) {
    const option = document.createElement("option");
    option.value = item[valueKey];
    option.textContent = item[textKey] || item[valueKey];   // 名前が空の時はコードを表示
    selectElement.appendChild(option);
  });
}


// ==========================================================
// addItem：選んだ商品・食材を一覧に追加する
//   list     ：追加先の配列
//   selectId ：ドロップダウンのid
//   ulId     ：一覧のid
//   getName  ：コードから名前を取り出す関数（getProductName / getFoodName）
// ==========================================================
function addItem(list, selectId, ulId, getName) {
  const selectElement = document.getElementById(selectId);
  const code = selectElement.value;

  if (code === "") {
    showMessage("商品・食材を選択してください。");
    return;
  }
  if (list.includes(code)) {
    showMessage("「" + getName(code) + "」は既に追加されています。");
    return;
  }

  list.push(code);
  renderList(list, ulId, getName);
  selectElement.value = "";
  clearRecipeList();
}


// ==========================================================
// removeItem：確認メッセージを出して一覧から削除する
// ==========================================================
function removeItem(list, code, ulId, getName) {
  const ok = confirm("「" + getName(code) + "」を一覧から削除しますか？");
  if (!ok) {
    return;
  }
  list.splice(list.indexOf(code), 1);
  renderList(list, ulId, getName);
  clearRecipeList();
}


// ==========================================================
// renderList：配列の内容を一覧（<ul>）に表示する
// ==========================================================
function renderList(list, ulId, getName) {
  const ul = document.getElementById(ulId);
  ul.innerHTML = "";

  list.forEach(function (code) {
    const li = document.createElement("li");
    li.textContent = getName(code);
    li.title = "ダブルクリックで削除";
    li.addEventListener("dblclick", function () {
      removeItem(list, code, ulId, getName);
    });
    ul.appendChild(li);
  });
}


// ==========================================================
// searchRecipes：PHPにレシピ検索をお願いして、一覧に表示する
// ==========================================================
async function searchRecipes() {
  if (cartProducts.length === 0 && homeFoods.length === 0) {
    clearTable();
    showMessage("検索対象の食材がありません。商品・食材を追加してください。");
    return;
  }

  setButtonsEnabled(false);
  showMessage("検索しています…");
  try {
    const data = await fetchJson("api/search_recipes.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart: cartProducts, home: homeFoods, exclude: excludeFoods })
    });

    lastTargets = data.targets;
    lastResults = data.recipes;

    if (lastTargets.length === 0) {
      // カートの商品がどの食材にも紐付いていない時
      clearTable();
      showMessage("レシピに使える食材がありません。カート外食材も追加してみてください。");
    } else if (lastResults.length === 0) {
      clearTable();
      showMessage("条件に合うレシピがありません。");
    } else {
      renderRecipeList(lastResults);
      showMessage(lastResults.length + "件のレシピが見つかりました。ダブルクリックで詳細を表示します。");
    }
  } catch (error) {
    clearTable();
    showMessage("検索できませんでした。（" + error.message + "）");
  }
  setButtonsEnabled(true);
}


// ==========================================================
// renderRecipeList：レシピ一覧の表を作る
// ==========================================================
function renderRecipeList(results) {
  const tbody = document.getElementById("recipeBody");
  tbody.innerHTML = "";

  results.forEach(function (recipe, i) {
    const tr = document.createElement("tr");

    const tdNo = document.createElement("td");
    tdNo.className = "col-no";
    tdNo.textContent = i + 1;

    const tdImg = document.createElement("td");
    tdImg.appendChild(createImage(recipe.image_path, recipe.recipe_name, "list-image"));

    const tdName = document.createElement("td");
    tdName.textContent = recipe.recipe_name;

    const tdMatch = document.createElement("td");
    tdMatch.className = "col-match";
    tdMatch.textContent = recipe.total_count + "食材中" + recipe.match_count + "食材";

    tr.appendChild(tdNo);
    tr.appendChild(tdImg);
    tr.appendChild(tdName);
    tr.appendChild(tdMatch);

    tr.addEventListener("dblclick", function () {
      showDetail(recipe.recipe_id);
    });

    tbody.appendChild(tr);
  });
}


// ==========================================================
// showDetail：PHPからレシピ詳細を受け取って、詳細画面を表示する
// ==========================================================
async function showDetail(recipeId) {
  let data;
  try {
    data = await fetchJson("api/get_recipe.php?id=" + encodeURIComponent(recipeId));
  } catch (error) {
    showMessage("レシピの詳細を表示できませんでした。（" + error.message + "）");
    return;
  }

  const recipe = data.recipe;
  const materials = data.materials;

  document.getElementById("detailName").textContent = recipe.recipe_name;

  const img = document.getElementById("detailImage");
  img.onerror = function () {
    img.onerror = null;
    img.src = NO_IMAGE;
  };
  img.src = recipe.image_path || NO_IMAGE;
  img.alt = recipe.recipe_name;

  document.getElementById("detailTime").textContent = recipe.cook_time ? recipe.cook_time + "分" : "−";
  document.getElementById("detailServings").textContent = recipe.servings ? "（" + recipe.servings + "人分）" : "";
  document.getElementById("detailDescription").textContent = recipe.description || "";

  // 材料（ある食材は○、ない食材は×で赤字）
  const ul = document.getElementById("detailFoods");
  ul.innerHTML = "";
  let matchCount = 0;

  materials.forEach(function (item) {
    const have = lastTargets.includes(item.recipe_food_id);
    if (have) {
      matchCount++;
    }

    const li = document.createElement("li");
    li.className = have ? "have" : "lack";

    const mark = document.createElement("span");
    mark.className = "mark";
    mark.textContent = have ? "○" : "×";

    const name = document.createElement("span");
    name.className = "food-name";
    name.textContent = item.food_name + (have ? "" : "（不足）");

    const amount = document.createElement("span");
    amount.textContent = item.amount || "";

    li.appendChild(mark);
    li.appendChild(name);
    li.appendChild(amount);
    ul.appendChild(li);
  });

  document.getElementById("detailMatch").textContent =
    materials.length + "食材中" + matchCount + "食材";

  document.getElementById("mainScreen").classList.add("hidden");
  document.getElementById("detailScreen").classList.remove("hidden");
  window.scrollTo(0, 0);
}


// ==========================================================
// showMain：メイン画面に戻る
// ==========================================================
function showMain() {
  document.getElementById("detailScreen").classList.add("hidden");
  document.getElementById("mainScreen").classList.remove("hidden");
  window.scrollTo(0, 0);
}


// ==========================================================
// 共通で使う小さな関数
// ==========================================================

// 商品コードから商品名を取り出す
function getProductName(code) {
  const product = products.find(function (p) {
    return p.mpr_code === code;
  });
  return product && product.mpr_name ? product.mpr_name : code;
}

// レシピ材料IDから食材名を取り出す
function getFoodName(id) {
  const food = foods.find(function (f) {
    return f.recipe_food_id === id;
  });
  return food && food.food_name ? food.food_name : id;
}

// レシピ画像の <img> を作る（画像がない時は noimage.png）
function createImage(path, alt, className) {
  const img = document.createElement("img");
  img.className = className;
  img.alt = alt;
  img.onerror = function () {
    img.onerror = null;
    img.src = NO_IMAGE;
  };
  img.src = path || NO_IMAGE;
  return img;
}

// ボタンを押せる／押せないを切り替える（読み込み中に連打されないように）
function setButtonsEnabled(enabled) {
  ["cartAddBtn", "homeAddBtn", "excludeAddBtn", "searchBtn"].forEach(function (id) {
    document.getElementById(id).disabled = !enabled;
  });
}

function showMessage(text) {
  document.getElementById("message").textContent = text;
}

function clearTable() {
  document.getElementById("recipeBody").innerHTML = "";
}

function clearRecipeList() {
  clearTable();
  showMessage("商品・食材が変更されました。「レシピを探す」を押してください。");
}
