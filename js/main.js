// ==========================================================
// main.js：画面の処理
//   食材の追加・削除、レシピ検索、画面の切り替えを行う
// ==========================================================

// ---------- 選択食材（トランザクション） ----------
//   食材IDを入れる配列。画面を開いている間だけ保持する
const cartFoods = [];     // カート内食材
const homeFoods = [];     // カート外食材（家にある食材）
const excludeFoods = [];  // 対象外食材

const NO_IMAGE = "images/noimage.png";  // 画像がない時に表示する画像

// ページの読み込みが終わったら init() を実行する
window.addEventListener("DOMContentLoaded", init);


// ==========================================================
// init：画面を開いた時の準備（E-01）
// ==========================================================
function init() {
  // 3つのドロップダウンに食材マスタの選択肢を作る
  createOptions(document.getElementById("cartSelect"));
  createOptions(document.getElementById("homeSelect"));
  createOptions(document.getElementById("excludeSelect"));

  // 追加ボタン（E-02）
  document.getElementById("cartAddBtn").addEventListener("click", function () {
    addFood(cartFoods, document.getElementById("cartSelect"), document.getElementById("cartList"));
  });
  document.getElementById("homeAddBtn").addEventListener("click", function () {
    addFood(homeFoods, document.getElementById("homeSelect"), document.getElementById("homeList"));
  });
  document.getElementById("excludeAddBtn").addEventListener("click", function () {
    addFood(excludeFoods, document.getElementById("excludeSelect"), document.getElementById("excludeList"));
  });

  // レシピを探すボタン（E-04）
  document.getElementById("searchBtn").addEventListener("click", searchRecipes);

  // 戻るボタン（E-06）
  document.getElementById("backBtn").addEventListener("click", showMain);
}


// ==========================================================
// createOptions：食材マスタからドロップダウンの選択肢を作る
//   カテゴリごとに <optgroup> でまとめる
// ==========================================================
function createOptions(selectElement) {
  // 先頭の「選択してください」
  const first = document.createElement("option");
  first.value = "";
  first.textContent = "選択してください";
  selectElement.appendChild(first);

  // カテゴリごとにグループを作る
  categories.forEach(function (category) {
    const group = document.createElement("optgroup");
    group.label = category.categoryName;

    // このカテゴリの食材だけを追加する
    foods.forEach(function (food) {
      if (food.categoryId === category.categoryId) {
        const option = document.createElement("option");
        option.value = food.foodId;
        option.textContent = food.foodName;
        group.appendChild(option);
      }
    });

    selectElement.appendChild(group);
  });
}


// ==========================================================
// addFood：選んだ食材を一覧に追加する（E-02）
//   list          ：追加先の配列（cartFoods など）
//   selectElement ：ドロップダウン
//   ulElement     ：表示する一覧
// ==========================================================
function addFood(list, selectElement, ulElement) {
  const foodId = selectElement.value;

  // ① 未選択チェック
  if (foodId === "") {
    showMessage("食材を選択してください。");                          // M-01
    return;
  }

  // ② 重複チェック（同じ一覧に既にあるか）
  if (list.includes(foodId)) {
    showMessage("「" + getFoodName(foodId) + "」は既に追加されています。"); // M-02
    return;
  }

  // ③ 配列に追加して一覧を表示し直す
  list.push(foodId);
  renderFoodList(list, ulElement);

  // ④ ドロップダウンを「選択してください」に戻す
  selectElement.value = "";

  // ⑤ 条件が変わったのでレシピ一覧をクリアする
  clearRecipeList();
}


// ==========================================================
// removeFood：確認メッセージを出して一覧から削除する（E-03）
// ==========================================================
function removeFood(list, foodId, ulElement) {
  const ok = confirm("「" + getFoodName(foodId) + "」を一覧から削除しますか？"); // M-03
  if (!ok) {
    return;  // キャンセルの時は何もしない
  }

  // 配列の中の位置を探して1件削除する
  const index = list.indexOf(foodId);
  list.splice(index, 1);

  renderFoodList(list, ulElement);
  clearRecipeList();
}


// ==========================================================
// renderFoodList：配列の内容を一覧（<ul>）に表示する
// ==========================================================
function renderFoodList(list, ulElement) {
  ulElement.innerHTML = "";  // 一度空にする

  list.forEach(function (foodId) {
    const li = document.createElement("li");
    li.textContent = getFoodName(foodId);
    li.title = "ダブルクリックで削除";

    // ダブルクリックで削除
    li.addEventListener("dblclick", function () {
      removeFood(list, foodId, ulElement);
    });

    ulElement.appendChild(li);
  });
}


// ==========================================================
// getTargetFoods：検索対象食材を作る
//   カート内食材 ＋ カート外食材（同じ食材は1つにする）
// ==========================================================
function getTargetFoods() {
  const target = [];

  const all = cartFoods.concat(homeFoods);
  all.forEach(function (foodId) {
    if (!target.includes(foodId)) {
      target.push(foodId);
    }
  });

  return target;
}


// ==========================================================
// hasExcludeFood：レシピの材料に対象外食材が含まれているか調べる
//   含まれていれば true、含まれていなければ false を返す
// ==========================================================
function hasExcludeFood(recipeId) {
  const materials = getRecipeFoods(recipeId);

  // some：1つでも条件に当てはまれば true になる
  return materials.some(function (item) {
    return excludeFoods.includes(item.foodId);
  });
}


// ==========================================================
// getRecipeFoods：レシピの材料一覧を取り出す
// ==========================================================
function getRecipeFoods(recipeId) {
  return recipeFoods.filter(function (item) {
    return item.recipeId === recipeId;
  });
}


// ==========================================================
// searchRecipes：レシピを検索して一覧に表示する（E-04）
// ==========================================================
function searchRecipes() {
  const target = getTargetFoods();

  // 検索条件チェック（F-10）
  if (target.length === 0) {
    clearTable();
    showMessage("検索対象の食材がありません。食材を追加してください。");  // M-04
    return;
  }

  // レシピごとに一致数を数える（F-11）
  const results = [];
  recipes.forEach(function (recipe) {
    // 対象外食材を含むレシピは表示しないので、ここで飛ばす
    if (hasExcludeFood(recipe.recipeId)) {
      return;  // forEach の中の return は「次のレシピへ進む」の意味
    }

    const materials = getRecipeFoods(recipe.recipeId);
    let matchCount = 0;

    materials.forEach(function (item) {
      if (target.includes(item.foodId)) {
        matchCount++;
      }
    });

    // 一致数が1以上のレシピだけ残す
    if (matchCount >= 1) {
      results.push({
        recipe: recipe,
        total: materials.length,   // 材料数
        match: matchCount          // 一致数
      });
    }
  });

  // 検索結果なし（F-13）
  if (results.length === 0) {
    clearTable();
    showMessage("条件に合うレシピがありません。");  // M-05
    return;
  }

  // 並び替え（F-12）
  results.sort(function (a, b) {
    // ① 一致数の多い順
    if (a.match !== b.match) {
      return b.match - a.match;
    }
    // ② 不足食材数の少ない順
    const lackA = a.total - a.match;
    const lackB = b.total - b.match;
    if (lackA !== lackB) {
      return lackA - lackB;
    }
    // ③ レシピIDの小さい順
    return a.recipe.recipeId < b.recipe.recipeId ? -1 : 1;
  });

  renderRecipeList(results);
  showMessage(results.length + "件のレシピが見つかりました。ダブルクリックで詳細を表示します。");
}


// ==========================================================
// renderRecipeList：レシピ一覧の表を作る（F-14）
// ==========================================================
function renderRecipeList(results) {
  const tbody = document.getElementById("recipeBody");
  tbody.innerHTML = "";

  results.forEach(function (result, i) {
    const tr = document.createElement("tr");

    // No.
    const tdNo = document.createElement("td");
    tdNo.className = "col-no";
    tdNo.textContent = i + 1;

    // 画像
    const tdImg = document.createElement("td");
    const img = createImage(result.recipe, "list-image");
    tdImg.appendChild(img);

    // レシピ名
    const tdName = document.createElement("td");
    tdName.textContent = result.recipe.recipeName;

    // 一致状況
    const tdMatch = document.createElement("td");
    tdMatch.className = "col-match";
    tdMatch.textContent = result.total + "食材中" + result.match + "食材";

    tr.appendChild(tdNo);
    tr.appendChild(tdImg);
    tr.appendChild(tdName);
    tr.appendChild(tdMatch);

    // ダブルクリックで詳細画面へ（E-05）
    tr.addEventListener("dblclick", function () {
      showDetail(result.recipe.recipeId);
    });

    tbody.appendChild(tr);
  });
}


// ==========================================================
// showDetail：レシピ詳細画面を表示する（F-15〜F-17）
// ==========================================================
function showDetail(recipeId) {
  const recipe = recipes.find(function (r) {
    return r.recipeId === recipeId;
  });
  const materials = getRecipeFoods(recipeId);
  const target = getTargetFoods();

  // レシピ名・画像・調理時間
  document.getElementById("detailName").textContent = recipe.recipeName;
  const img = document.getElementById("detailImage");
  img.onerror = function () {
    img.onerror = null;
    img.src = NO_IMAGE;
  };
  img.src = recipe.image;
  img.alt = recipe.recipeName;
  document.getElementById("detailTime").textContent = recipe.cookTime + "分";
  document.getElementById("detailServings").textContent = "（" + recipe.servings + "人分）";

  // 材料（ある食材は○、ない食材は×で赤字）
  const ul = document.getElementById("detailFoods");
  ul.innerHTML = "";
  let matchCount = 0;

  materials.forEach(function (item) {
    const li = document.createElement("li");
    const have = target.includes(item.foodId);
    if (have) {
      matchCount++;
    }
    li.className = have ? "have" : "lack";

    const mark = document.createElement("span");
    mark.className = "mark";
    mark.textContent = have ? "○" : "×";

    const name = document.createElement("span");
    name.className = "food-name";
    name.textContent = getFoodName(item.foodId) + (have ? "" : "（不足）");

    const amount = document.createElement("span");
    amount.textContent = item.amount;

    li.appendChild(mark);
    li.appendChild(name);
    li.appendChild(amount);
    ul.appendChild(li);
  });

  document.getElementById("detailMatch").textContent =
    materials.length + "食材中" + matchCount + "食材";

  // その他の調味料
  document.getElementById("detailSeasonings").textContent =
    "（その他：" + recipe.seasonings + "）";

  // 作り方
  const ol = document.getElementById("detailSteps");
  ol.innerHTML = "";
  recipe.steps.forEach(function (step) {
    const li = document.createElement("li");
    li.textContent = step;
    ol.appendChild(li);
  });

  // 画面を切り替える
  document.getElementById("mainScreen").classList.add("hidden");
  document.getElementById("detailScreen").classList.remove("hidden");
  window.scrollTo(0, 0);
}


// ==========================================================
// showMain：メイン画面に戻る（E-06）
// ==========================================================
function showMain() {
  document.getElementById("detailScreen").classList.add("hidden");
  document.getElementById("mainScreen").classList.remove("hidden");
  window.scrollTo(0, 0);
}


// ==========================================================
// 共通で使う小さな関数
// ==========================================================

// 食材IDから食材名を取り出す
function getFoodName(foodId) {
  const food = foods.find(function (f) {
    return f.foodId === foodId;
  });
  return food ? food.foodName : "";
}

// レシピ画像の <img> を作る（画像がない時は noimage.png）
function createImage(recipe, className) {
  const img = document.createElement("img");
  img.className = className;
  img.alt = recipe.recipeName;
  img.onerror = function () {
    img.onerror = null;     // noimage.png もない時に無限に繰り返さないため
    img.src = NO_IMAGE;
  };
  img.src = recipe.image;
  return img;
}

// メッセージ欄に表示する
function showMessage(text) {
  document.getElementById("message").textContent = text;
}

// レシピ一覧の表を空にする
function clearTable() {
  document.getElementById("recipeBody").innerHTML = "";
}

// 食材が変わった時にレシピ一覧をクリアする
function clearRecipeList() {
  clearTable();
  showMessage("食材が変更されました。「レシピを探す」を押してください。");  // M-06
}
