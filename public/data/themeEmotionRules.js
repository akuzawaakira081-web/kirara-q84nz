// テーマ×感情 組み合わせルール（特別な配色補正とメモ）
// 定義がないコンビネーションはpaletteGeneratorの汎用アルゴリズムが対応する
export const themeEmotionRules = [

  // ── 明るい選挙ポスター ──
  {
    themeId: "election", emotionId: "kibou",
    paletteNames: ["希望の夜明け", "空に向かう青", "フレッシュスタート"],
    whyNotes: "選挙ポスターに希望の感情が重なると、「明るい未来感」が生まれます。空の青と白で清潔感を出し、黄色で未来へのエネルギーを表しましょう。",
    accentSuggestions: ["スカイブルー", "サンシャインイエロー"],
    avoid: ["ナイトブラック", "ダークレッド"]
  },
  {
    themeId: "election", emotionId: "shinrai",
    paletteNames: ["誠実ブルー", "堂々の信頼", "安心感の配色"],
    whyNotes: "選挙ポスターに信頼の感情が重なると「信頼できるリーダー感」が出ます。深いネイビーと白のコントラストが誠実さを伝えます。",
    accentSuggestions: ["トリコロールブルー", "クリアホワイト"],
    avoid: ["マゼンタ", "ネオンイエロー"]
  },
  {
    themeId: "election", emotionId: "wakuwaku",
    paletteNames: ["みんなでワクワク！", "元気な選挙カラー", "はじける未来"],
    whyNotes: "選挙ポスターにわくわく感情が重なると「みんなで楽しくなろう！」というエネルギーが出ます。鮮やかな配色で活気を表しましょう。",
    accentSuggestions: ["フレッシュレッド", "サンシャインイエロー"],
    avoid: ["ペールグレー", "ダブグレー"]
  },

  // ── 赤い羽根共同募金 ──
  {
    themeId: "redFeather", emotionId: "yasashii",
    paletteNames: ["やさしい赤い羽根", "助け合いのやさしさ", "温かいつながり"],
    whyNotes: "赤い羽根にやさしい感情が重なると「みんなを包む温かさ」が生まれます。赤を主役にしながら、ソフトなクリームとピンクでやさしさを加えましょう。",
    accentSuggestions: ["ソフトピンク", "クリームホワイト"],
    avoid: ["ナイトブラック", "ディープパープル"]
  },
  {
    themeId: "redFeather", emotionId: "arigatou",
    paletteNames: ["ありがとうの羽根", "感謝の赤と金", "感謝のぬくもり"],
    whyNotes: "赤い羽根にありがとうの感情が重なると「感謝が伝わるポスター」になります。赤とゴールドの組み合わせが、深い感謝の気持ちを表します。",
    accentSuggestions: ["ウォームゴールド", "ジェントルパープル"],
    avoid: ["エレクトリックブルー", "ネオングリーン"]
  },
  {
    themeId: "redFeather", emotionId: "nukumori",
    paletteNames: ["ぬくもりの赤羽根", "温かい輪", "あたたかさのパレット"],
    whyNotes: "赤い羽根にぬくもりの感情が重なると「まるで家族のような温かさ」が伝わります。オレンジやピーチを加えて、ほっこりした絵に仕上げましょう。",
    accentSuggestions: ["ウォームオレンジ", "ゴールデンイエロー"],
    avoid: ["ナイトブラック", "スチールグレー"]
  },

  // ── 自然を描こう ──
  {
    themeId: "nature", emotionId: "fushigi",
    paletteNames: ["森の不思議", "自然の神秘", "ふしぎな光の中"],
    whyNotes: "自然テーマにふしぎ感情が重なると「自然の神秘的な美しさ」が表れます。深い緑と紫・ティールを組み合わせて、幻想的な自然を描きましょう。",
    accentSuggestions: ["ミステリーパープル", "ティール"],
    avoid: ["クリムゾンレッド", "エナジーレッド"]
  },
  {
    themeId: "nature", emotionId: "heiwa",
    paletteNames: ["穏やかな自然", "静かな森", "平和な緑の世界"],
    whyNotes: "自然テーマに平和感情が重なると「静かで穏やかな自然風景」になります。緑と青のさわやかな配色が平和な空気を作ります。",
    accentSuggestions: ["ソフトブルー", "ピュアホワイト"],
    avoid: ["エナジーレッド", "ビビッドオレンジ"]
  },

  // ── 読書感想画 ──
  {
    themeId: "reading", emotionId: "kanashii",
    paletteNames: ["悲しい物語の色", "涙の読書", "しんとした想像"],
    whyNotes: "読書感想画にかなしい感情が重なると「物語の切ない場面」を表現できます。くすんだ青やグレーに本の茶色を組み合わせて、深みのある作品にしましょう。",
    accentSuggestions: ["スチールブルー", "ラベンダーグレー"],
    avoid: ["ネオンイエロー", "ライムグリーン"]
  },
  {
    themeId: "reading", emotionId: "fushigi",
    paletteNames: ["本の中のふしぎ", "想像の魔法", "ページの向こうの不思議"],
    whyNotes: "読書感想画にふしぎ感情が重なると「本の世界に吸い込まれる感覚」が表れます。紫と金色で魔法のような雰囲気を演出しましょう。",
    accentSuggestions: ["ドリームパープル", "スターゴールド"],
    avoid: ["エナジーレッド", "クリムゾンレッド"]
  },
  {
    themeId: "reading", emotionId: "wakuwaku",
    paletteNames: ["冒険の始まり！", "ワクワク物語", "飛び出す本のヒーロー"],
    whyNotes: "読書感想画にわくわく感情が重なると「本のページから主人公が飛び出してくる！」感じが出ます。明るくはっきりした色で冒険心を表現しましょう。",
    accentSuggestions: ["ストーリーブルー", "ディスカバリーゴールド"],
    avoid: ["ペールグレー", "フォグホワイト"]
  },

  // ── 未来の町 ──
  {
    themeId: "future", emotionId: "yuuki",
    paletteNames: ["勇気の未来都市", "力強い明日", "ヒーローの町"],
    whyNotes: "未来の町に勇気感情が重なると「強くたくましい未来」が表れます。ネイビーと赤、ゴールドの力強い配色で、未来へ立ち向かうエネルギーを描きましょう。",
    accentSuggestions: ["クリムゾンレッド", "ゴールド"],
    avoid: ["ペールブルー", "フォグホワイト"]
  },
  {
    themeId: "future", emotionId: "kibou",
    paletteNames: ["希望の未来都市", "明日の空", "輝く明日"],
    whyNotes: "未来の町に希望感情が重なると「みんなが幸せに暮らせる未来」が表れます。明るいブルーと白で広がりを出し、緑で自然との共存を表しましょう。",
    accentSuggestions: ["ホープスカイ", "スプリンググリーン"],
    avoid: ["ナイトブラック", "ディープパープル"]
  },

  // ── 平和ポスター ──
  {
    themeId: "peace", emotionId: "heiwa",
    paletteNames: ["澄んだ平和", "白い鳩と青い空", "静かな誓い"],
    whyNotes: "平和ポスターに平和感情が重なると「最も純粋な平和の表現」になります。白と空の青を中心に、オリーブグリーンを加えて生命力も表しましょう。",
    accentSuggestions: ["ピュアホワイト", "ソフトブルー"],
    avoid: ["ダークレッド", "ナイトブラック"]
  },
  {
    themeId: "peace", emotionId: "kibou",
    paletteNames: ["平和への希望", "明日の虹", "希望の鳩"],
    whyNotes: "平和ポスターに希望感情が重なると「平和な未来への願い」が表れます。夜明けの色と白で、平和で明るい未来への希望を描きましょう。",
    accentSuggestions: ["ホープスカイ", "ジェントルゴールド"],
    avoid: ["ダークレッド", "ディープパープル"]
  },

  // ── 環境ポスター ──
  {
    themeId: "environment", emotionId: "shizen",
    paletteNames: ["地球を守る緑", "自然の豊かさ", "大地と海の誓い"],
    whyNotes: "環境ポスターに自然感情が重なると「地球の恵みへの感謝」が表れます。地球の色そのままの配色で、自然を守りたい気持ちを伝えましょう。",
    accentSuggestions: ["アースグリーン", "オーシャンブルー"],
    avoid: ["マゼンタ", "ネオンイエロー"]
  },
  {
    themeId: "environment", emotionId: "kibou",
    paletteNames: ["緑の希望", "地球の明るい未来", "エコの夜明け"],
    whyNotes: "環境ポスターに希望感情が重なると「これからの地球を明るくしよう！」というメッセージが生まれます。鮮やかな緑と明るい青で、未来への希望を表しましょう。",
    accentSuggestions: ["リーフブライト", "ホープスカイ"],
    avoid: ["ダークレッド", "ナイトブラック"]
  },

  // ── 家族 ──
  {
    themeId: "family", emotionId: "nukumori",
    paletteNames: ["家族のぬくもり", "一緒にいる温かさ", "家族の輪"],
    whyNotes: "家族テーマにぬくもり感情が重なると「家族でいる幸福感」が最大に表れます。オレンジとピーチの温かい色で、家族の絆を描きましょう。",
    accentSuggestions: ["ウォームオレンジ", "ピーチ"],
    avoid: ["ナイトブラック", "ダークレッド"]
  },
  {
    themeId: "family", emotionId: "ureshii",
    paletteNames: ["家族の笑顔", "みんなでハッピー", "にぎやかな家族"],
    whyNotes: "家族テーマにうれしい感情が重なると「笑顔あふれる家族の場面」が生まれます。明るい黄色とオレンジで、楽しい家族の時間を表しましょう。",
    accentSuggestions: ["ひまわり黄", "ピーチオレンジ"],
    avoid: ["ダークレッド", "ナイトブラック"]
  },

  // ── ありがとう ──
  {
    themeId: "thanks", emotionId: "arigatou",
    paletteNames: ["ありがとうのきらめき", "感謝の花束", "心からのありがとう"],
    whyNotes: "ありがとうテーマにありがとう感情が重なると「最大の感謝表現」になります。ピンクとゴールドの輝く配色で、心からの感謝を伝えましょう。",
    accentSuggestions: ["サンクスピンク", "ウォームゴールド"],
    avoid: ["ナイトブラック", "シャドウグレー"]
  },
  {
    themeId: "thanks", emotionId: "yasashii",
    paletteNames: ["やさしいありがとう", "ふんわり感謝", "柔らかな感謝の色"],
    whyNotes: "ありがとうテーマにやさしい感情が重なると「ふんわりした優しい感謝」が表れます。淡いピンクとラベンダーで、包み込むような温かさを表しましょう。",
    accentSuggestions: ["桜ピンク", "ラベンダー"],
    avoid: ["ビビッドオレンジ", "エナジーレッド"]
  },

  // ── 夢の世界 ──
  {
    themeId: "dream", emotionId: "fushigi",
    paletteNames: ["ふしぎな夢の国", "魔法の夜", "不思議な夢の旅"],
    whyNotes: "夢の世界テーマにふしぎ感情が重なると「まるで本当に夢の中にいる感覚」が表れます。紫と深い青、金色の星で幻想的な世界を描きましょう。",
    accentSuggestions: ["ミステリーパープル", "スターゴールド"],
    avoid: ["エナジーレッド", "クリムゾンレッド"]
  },
  {
    themeId: "dream", emotionId: "akogare",
    paletteNames: ["あこがれの夢世界", "キラキラな夢", "夢に向かう輝き"],
    whyNotes: "夢の世界テーマにあこがれ感情が重なると「いつかこんな世界に行きたい！」という輝く憧れが表れます。ゴールドとローズで、煌めく夢を描きましょう。",
    accentSuggestions: ["ドリームゴールド", "ローズピンク"],
    avoid: ["ナイトブラック", "ダークレッド"]
  }
];
