// ==========================================================
// data.js：マスタデータ
//   データベースの代わりに、JavaScriptの配列でデータを持つ
// ==========================================================

// ---------- カテゴリマスタ ----------
const categories = [
  { categoryId: "C01", categoryName: "野菜" },
  { categoryId: "C02", categoryName: "きのこ" },
  { categoryId: "C03", categoryName: "肉" },
  { categoryId: "C04", categoryName: "加工肉" },
  { categoryId: "C05", categoryName: "魚介" },
  { categoryId: "C06", categoryName: "卵・乳製品" },
  { categoryId: "C07", categoryName: "大豆製品" },
  { categoryId: "C08", categoryName: "主食" },
  { categoryId: "C09", categoryName: "調味料" }
];

// ---------- 食材マスタ（50件） ----------
const foods = [
  // 野菜
  { foodId: "F001", foodName: "キャベツ",     categoryId: "C01" },
  { foodId: "F002", foodName: "玉ねぎ",       categoryId: "C01" },
  { foodId: "F003", foodName: "にんじん",     categoryId: "C01" },
  { foodId: "F004", foodName: "じゃがいも",   categoryId: "C01" },
  { foodId: "F005", foodName: "ピーマン",     categoryId: "C01" },
  { foodId: "F006", foodName: "なす",         categoryId: "C01" },
  { foodId: "F007", foodName: "トマト",       categoryId: "C01" },
  { foodId: "F008", foodName: "きゅうり",     categoryId: "C01" },
  { foodId: "F009", foodName: "レタス",       categoryId: "C01" },
  { foodId: "F010", foodName: "ほうれん草",   categoryId: "C01" },
  { foodId: "F011", foodName: "大根",         categoryId: "C01" },
  { foodId: "F012", foodName: "白菜",         categoryId: "C01" },
  { foodId: "F013", foodName: "長ねぎ",       categoryId: "C01" },
  { foodId: "F014", foodName: "もやし",       categoryId: "C01" },
  { foodId: "F015", foodName: "ブロッコリー", categoryId: "C01" },
  { foodId: "F016", foodName: "にんにく",     categoryId: "C01" },
  { foodId: "F017", foodName: "しょうが",     categoryId: "C01" },
  // きのこ
  { foodId: "F018", foodName: "しめじ",       categoryId: "C02" },
  { foodId: "F019", foodName: "しいたけ",     categoryId: "C02" },
  { foodId: "F020", foodName: "えのき",       categoryId: "C02" },
  // 肉
  { foodId: "F021", foodName: "豚バラ肉",     categoryId: "C03" },
  { foodId: "F022", foodName: "豚こま肉",     categoryId: "C03" },
  { foodId: "F023", foodName: "鶏もも肉",     categoryId: "C03" },
  { foodId: "F024", foodName: "鶏むね肉",     categoryId: "C03" },
  { foodId: "F025", foodName: "牛こま肉",     categoryId: "C03" },
  { foodId: "F026", foodName: "合いびき肉",   categoryId: "C03" },
  // 加工肉
  { foodId: "F027", foodName: "ベーコン",     categoryId: "C04" },
  { foodId: "F028", foodName: "ハム",         categoryId: "C04" },
  { foodId: "F029", foodName: "ウインナー",   categoryId: "C04" },
  // 魚介
  { foodId: "F030", foodName: "鮭",           categoryId: "C05" },
  { foodId: "F031", foodName: "さば",         categoryId: "C05" },
  { foodId: "F032", foodName: "えび",         categoryId: "C05" },
  { foodId: "F033", foodName: "いか",         categoryId: "C05" },
  { foodId: "F034", foodName: "ツナ缶",       categoryId: "C05" },
  // 卵・乳製品
  { foodId: "F035", foodName: "卵",           categoryId: "C06" },
  { foodId: "F036", foodName: "牛乳",         categoryId: "C06" },
  { foodId: "F037", foodName: "バター",       categoryId: "C06" },
  { foodId: "F038", foodName: "チーズ",       categoryId: "C06" },
  // 大豆製品
  { foodId: "F039", foodName: "豆腐",         categoryId: "C07" },
  { foodId: "F040", foodName: "油揚げ",       categoryId: "C07" },
  { foodId: "F041", foodName: "納豆",         categoryId: "C07" },
  // 主食
  { foodId: "F042", foodName: "米",           categoryId: "C08" },
  { foodId: "F043", foodName: "うどん",       categoryId: "C08" },
  { foodId: "F044", foodName: "スパゲッティ", categoryId: "C08" },
  { foodId: "F045", foodName: "食パン",       categoryId: "C08" },
  // 調味料
  { foodId: "F046", foodName: "醤油",         categoryId: "C09" },
  { foodId: "F047", foodName: "味噌",         categoryId: "C09" },
  { foodId: "F048", foodName: "カレールー",   categoryId: "C09" },
  { foodId: "F049", foodName: "ケチャップ",   categoryId: "C09" },
  { foodId: "F050", foodName: "マヨネーズ",   categoryId: "C09" }
];

// ---------- レシピマスタ（15件） ----------
//   image      ：画像ファイルの場所（ファイルがない時は noimage.png を表示）
//   seasonings ：照合しない基本調味料（表示のみ）
//   steps      ：作り方（順番に並べる）
const recipes = [
  {
    recipeId: "R001", recipeName: "肉じゃが", image: "images/r001.jpg",
    cookTime: 30, servings: 2,
    seasonings: "砂糖 大さじ1、みりん 大さじ2、水 200ml、サラダ油 小さじ2",
    steps: [
      "じゃがいもは皮をむいて一口大に、にんじんは乱切り、玉ねぎはくし切りにする。",
      "鍋に油を熱し、牛こま肉を炒める。色が変わったら野菜を加えて炒める。",
      "水・砂糖・みりんを加え、沸騰したらアクを取る。",
      "醤油を加えて落としぶたをし、弱めの中火で15分ほど煮る。"
    ]
  },
  {
    recipeId: "R002", recipeName: "カレーライス", image: "images/r002.jpg",
    cookTime: 40, servings: 4,
    seasonings: "サラダ油 大さじ1、水 700ml",
    steps: [
      "米を炊いておく。",
      "じゃがいも・にんじんは一口大、玉ねぎはくし切りにする。",
      "鍋に油を熱し、豚こま肉と野菜を炒める。",
      "水を加えて沸騰したらアクを取り、弱火で15分煮る。",
      "火を止めてカレールーを溶かし、再び弱火で5分煮込む。ご飯にかける。"
    ]
  },
  {
    recipeId: "R003", recipeName: "野菜炒め", image: "images/r003.jpg",
    cookTime: 15, servings: 2,
    seasonings: "塩・こしょう 少々、鶏がらスープの素 小さじ1、サラダ油 大さじ1",
    steps: [
      "キャベツはざく切り、にんじんは短冊切り、ピーマンは細切りにする。",
      "フライパンに油を熱し、豚バラ肉を炒める。",
      "にんじん→キャベツ・ピーマン→もやしの順に加えて強火で炒める。",
      "鶏がらスープの素・塩・こしょうで味を調える。"
    ]
  },
  {
    recipeId: "R004", recipeName: "親子丼", image: "images/r004.jpg",
    cookTime: 20, servings: 2,
    seasonings: "砂糖 大さじ1、みりん 大さじ2、水 100ml",
    steps: [
      "米を炊いておく。鶏もも肉は一口大、玉ねぎは薄切りにする。",
      "フライパンに水・醤油・砂糖・みりんを入れて煮立て、鶏肉と玉ねぎを煮る。",
      "鶏肉に火が通ったら、溶いた卵を回し入れてふたをし、半熟で火を止める。",
      "丼にご飯を盛り、上にのせる。"
    ]
  },
  {
    recipeId: "R005", recipeName: "麻婆なす", image: "images/r005.jpg",
    cookTime: 20, servings: 2,
    seasonings: "砂糖 小さじ2、酒 大さじ1、片栗粉 小さじ2、水 100ml、ごま油 大さじ1",
    steps: [
      "なすは乱切り、長ねぎ・にんにく・しょうがはみじん切りにする。",
      "フライパンにごま油を熱し、なすを炒めて一度取り出す。",
      "にんにく・しょうが・合いびき肉を炒め、味噌・砂糖・酒・水を加える。",
      "なすと長ねぎを戻し入れ、水で溶いた片栗粉でとろみをつける。"
    ]
  },
  {
    recipeId: "R006", recipeName: "ハンバーグ", image: "images/r006.jpg",
    cookTime: 30, servings: 2,
    seasonings: "パン粉 大さじ4、塩・こしょう 少々、ウスターソース 大さじ2、サラダ油 小さじ2",
    steps: [
      "玉ねぎはみじん切りにして炒め、冷ましておく。",
      "合いびき肉・玉ねぎ・卵・牛乳・パン粉・塩・こしょうをよくこねる。",
      "2等分して小判形にし、中央を少しくぼませる。",
      "フライパンで両面を焼き、ふたをして弱火で8分蒸し焼きにする。",
      "ケチャップとウスターソースを混ぜてソースを作り、かける。"
    ]
  },
  {
    recipeId: "R007", recipeName: "豚汁", image: "images/r007.jpg",
    cookTime: 25, servings: 4,
    seasonings: "だし汁 800ml、ごま油 小さじ2",
    steps: [
      "大根・にんじんはいちょう切り、長ねぎは小口切り、豆腐は角切りにする。",
      "鍋にごま油を熱し、豚バラ肉・大根・にんじんを炒める。",
      "だし汁を加え、野菜がやわらかくなるまで煮る。",
      "豆腐を入れ、味噌を溶き入れる。最後に長ねぎを加える。"
    ]
  },
  {
    recipeId: "R008", recipeName: "ナポリタン", image: "images/r008.jpg",
    cookTime: 20, servings: 2,
    seasonings: "塩 少々、サラダ油 大さじ1",
    steps: [
      "スパゲッティを塩を入れたお湯でゆでる。",
      "玉ねぎは薄切り、ピーマンは細切り、ウインナーは斜め切りにする。",
      "フライパンに油を熱し、ウインナーと野菜を炒める。",
      "ゆでたスパゲッティとケチャップを加えて炒め合わせる。"
    ]
  },
  {
    recipeId: "R009", recipeName: "鮭のホイル焼き", image: "images/r009.jpg",
    cookTime: 20, servings: 2,
    seasonings: "塩・こしょう 少々、酒 大さじ1",
    steps: [
      "鮭に塩・こしょうをふる。しめじはほぐし、玉ねぎは薄切りにする。",
      "アルミホイルに玉ねぎ・鮭・しめじをのせ、酒をふってバターをのせる。",
      "ホイルを閉じ、フライパンに並べてふたをし、中火で12分蒸し焼きにする。",
      "食べる時に醤油をかける。"
    ]
  },
  {
    recipeId: "R010", recipeName: "オムライス", image: "images/r010.jpg",
    cookTime: 25, servings: 2,
    seasonings: "塩・こしょう 少々、サラダ油 小さじ2",
    steps: [
      "米を炊いておく。鶏もも肉は小さく切り、玉ねぎはみじん切りにする。",
      "バターで鶏肉と玉ねぎを炒め、ご飯とケチャップを加えてチキンライスにする。",
      "溶いた卵を1人分ずつ薄く焼き、チキンライスを包む。",
      "お皿に盛り、ケチャップをかける。"
    ]
  },
  {
    recipeId: "R011", recipeName: "ポテトサラダ", image: "images/r011.jpg",
    cookTime: 25, servings: 3,
    seasonings: "塩・こしょう 少々、酢 小さじ1",
    steps: [
      "じゃがいもとにんじんをゆで、じゃがいもはつぶす。",
      "きゅうりは薄切りにして塩もみし、水気をしぼる。ハムは短冊切りにする。",
      "じゃがいもが熱いうちに酢・塩・こしょうを混ぜ、冷ます。",
      "すべての材料をマヨネーズであえる。"
    ]
  },
  {
    recipeId: "R012", recipeName: "ほうれん草とベーコンのソテー", image: "images/r012.jpg",
    cookTime: 10, servings: 2,
    seasonings: "塩・こしょう 少々",
    steps: [
      "ほうれん草は4cm長さに切り、ベーコンは1cm幅、にんにくは薄切りにする。",
      "フライパンにバターとにんにくを入れて弱火で香りを出す。",
      "ベーコンを炒め、ほうれん草を加えて強火でさっと炒める。",
      "塩・こしょうで味を調える。"
    ]
  },
  {
    recipeId: "R013", recipeName: "豚の生姜焼き", image: "images/r013.jpg",
    cookTime: 15, servings: 2,
    seasonings: "酒 大さじ1、みりん 大さじ2、砂糖 小さじ1、サラダ油 小さじ2",
    steps: [
      "しょうがはすりおろし、醤油・酒・みりん・砂糖と混ぜてたれを作る。",
      "玉ねぎは薄切り、キャベツは千切りにする。",
      "フライパンに油を熱し、豚こま肉と玉ねぎを炒める。",
      "たれを加えて全体にからめ、千切りキャベツと一緒に盛る。"
    ]
  },
  {
    recipeId: "R014", recipeName: "クリームシチュー", image: "images/r014.jpg",
    cookTime: 40, servings: 4,
    seasonings: "小麦粉 大さじ4、水 400ml、コンソメ 1個、塩・こしょう 少々",
    steps: [
      "鶏もも肉・じゃがいも・にんじん・玉ねぎを一口大に切る。ブロッコリーは小房に分けてゆでる。",
      "鍋にバターを溶かし、鶏肉と野菜を炒める。",
      "小麦粉をふり入れて粉っぽさがなくなるまで炒める。",
      "水とコンソメを加えて15分煮る。",
      "牛乳を加えてとろみがつくまで煮て、ブロッコリーを加え、塩・こしょうで味を調える。"
    ]
  },
  {
    recipeId: "R015", recipeName: "白菜と豚バラの重ね蒸し", image: "images/r015.jpg",
    cookTime: 20, servings: 2,
    seasonings: "酒 大さじ2、ポン酢 適量",
    steps: [
      "白菜と豚バラ肉を交互に重ね、5cm幅に切る。しいたけは薄切りにする。",
      "鍋に切り口を上にして詰め、しいたけをのせる。",
      "酒と醤油を回しかけ、ふたをして中火で15分蒸す。",
      "お好みでポン酢をつけて食べる。"
    ]
  }
];

// ---------- レシピ材料（レシピと食材をつなぐ表） ----------
const recipeFoods = [
  // R001 肉じゃが
  { recipeId: "R001", foodId: "F025", amount: "150g" },
  { recipeId: "R001", foodId: "F004", amount: "2個" },
  { recipeId: "R001", foodId: "F003", amount: "1/2本" },
  { recipeId: "R001", foodId: "F002", amount: "1個" },
  { recipeId: "R001", foodId: "F046", amount: "大さじ2" },
  // R002 カレーライス
  { recipeId: "R002", foodId: "F022", amount: "250g" },
  { recipeId: "R002", foodId: "F004", amount: "2個" },
  { recipeId: "R002", foodId: "F003", amount: "1本" },
  { recipeId: "R002", foodId: "F002", amount: "2個" },
  { recipeId: "R002", foodId: "F048", amount: "1/2箱" },
  { recipeId: "R002", foodId: "F042", amount: "2合" },
  // R003 野菜炒め
  { recipeId: "R003", foodId: "F021", amount: "150g" },
  { recipeId: "R003", foodId: "F001", amount: "1/4個" },
  { recipeId: "R003", foodId: "F003", amount: "1/3本" },
  { recipeId: "R003", foodId: "F005", amount: "2個" },
  { recipeId: "R003", foodId: "F014", amount: "1袋" },
  // R004 親子丼
  { recipeId: "R004", foodId: "F023", amount: "1枚" },
  { recipeId: "R004", foodId: "F002", amount: "1/2個" },
  { recipeId: "R004", foodId: "F035", amount: "3個" },
  { recipeId: "R004", foodId: "F042", amount: "1.5合" },
  { recipeId: "R004", foodId: "F046", amount: "大さじ2" },
  // R005 麻婆なす
  { recipeId: "R005", foodId: "F026", amount: "100g" },
  { recipeId: "R005", foodId: "F006", amount: "3本" },
  { recipeId: "R005", foodId: "F013", amount: "1/2本" },
  { recipeId: "R005", foodId: "F016", amount: "1かけ" },
  { recipeId: "R005", foodId: "F017", amount: "1かけ" },
  { recipeId: "R005", foodId: "F047", amount: "大さじ1" },
  // R006 ハンバーグ
  { recipeId: "R006", foodId: "F026", amount: "250g" },
  { recipeId: "R006", foodId: "F002", amount: "1/2個" },
  { recipeId: "R006", foodId: "F035", amount: "1個" },
  { recipeId: "R006", foodId: "F036", amount: "大さじ3" },
  { recipeId: "R006", foodId: "F049", amount: "大さじ3" },
  // R007 豚汁
  { recipeId: "R007", foodId: "F021", amount: "150g" },
  { recipeId: "R007", foodId: "F011", amount: "5cm" },
  { recipeId: "R007", foodId: "F003", amount: "1/2本" },
  { recipeId: "R007", foodId: "F013", amount: "1/2本" },
  { recipeId: "R007", foodId: "F039", amount: "1/2丁" },
  { recipeId: "R007", foodId: "F047", amount: "大さじ3" },
  // R008 ナポリタン
  { recipeId: "R008", foodId: "F044", amount: "200g" },
  { recipeId: "R008", foodId: "F029", amount: "4本" },
  { recipeId: "R008", foodId: "F002", amount: "1/2個" },
  { recipeId: "R008", foodId: "F005", amount: "2個" },
  { recipeId: "R008", foodId: "F049", amount: "大さじ6" },
  // R009 鮭のホイル焼き
  { recipeId: "R009", foodId: "F030", amount: "2切れ" },
  { recipeId: "R009", foodId: "F018", amount: "1/2パック" },
  { recipeId: "R009", foodId: "F002", amount: "1/4個" },
  { recipeId: "R009", foodId: "F037", amount: "20g" },
  { recipeId: "R009", foodId: "F046", amount: "小さじ2" },
  // R010 オムライス
  { recipeId: "R010", foodId: "F042", amount: "1.5合" },
  { recipeId: "R010", foodId: "F023", amount: "1/2枚" },
  { recipeId: "R010", foodId: "F002", amount: "1/2個" },
  { recipeId: "R010", foodId: "F035", amount: "4個" },
  { recipeId: "R010", foodId: "F049", amount: "大さじ5" },
  { recipeId: "R010", foodId: "F037", amount: "20g" },
  // R011 ポテトサラダ
  { recipeId: "R011", foodId: "F004", amount: "3個" },
  { recipeId: "R011", foodId: "F003", amount: "1/3本" },
  { recipeId: "R011", foodId: "F008", amount: "1本" },
  { recipeId: "R011", foodId: "F028", amount: "4枚" },
  { recipeId: "R011", foodId: "F050", amount: "大さじ4" },
  // R012 ほうれん草とベーコンのソテー
  { recipeId: "R012", foodId: "F010", amount: "1束" },
  { recipeId: "R012", foodId: "F027", amount: "3枚" },
  { recipeId: "R012", foodId: "F037", amount: "10g" },
  { recipeId: "R012", foodId: "F016", amount: "1かけ" },
  // R013 豚の生姜焼き
  { recipeId: "R013", foodId: "F022", amount: "250g" },
  { recipeId: "R013", foodId: "F002", amount: "1/2個" },
  { recipeId: "R013", foodId: "F017", amount: "1かけ" },
  { recipeId: "R013", foodId: "F001", amount: "1/8個" },
  { recipeId: "R013", foodId: "F046", amount: "大さじ2" },
  // R014 クリームシチュー
  { recipeId: "R014", foodId: "F023", amount: "1枚" },
  { recipeId: "R014", foodId: "F004", amount: "2個" },
  { recipeId: "R014", foodId: "F003", amount: "1本" },
  { recipeId: "R014", foodId: "F002", amount: "1個" },
  { recipeId: "R014", foodId: "F015", amount: "1/2株" },
  { recipeId: "R014", foodId: "F036", amount: "400ml" },
  { recipeId: "R014", foodId: "F037", amount: "30g" },
  // R015 白菜と豚バラの重ね蒸し
  { recipeId: "R015", foodId: "F012", amount: "1/4株" },
  { recipeId: "R015", foodId: "F021", amount: "200g" },
  { recipeId: "R015", foodId: "F019", amount: "3枚" },
  { recipeId: "R015", foodId: "F046", amount: "大さじ1" }
];
