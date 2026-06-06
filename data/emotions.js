// 感情データ（テーマ×きもちパレット用）
export const emotions = [
  {
    id: "ureshii",
    name: "うれしい",
    icon: "😊",
    description: "心がぱっと明るくなる気持ち",
    emotionColors: [
      { name: "ひまわり黄",     hex: "#FFD700" },
      { name: "ピーチオレンジ", hex: "#FFAA5C" },
      { name: "ライムグリーン", hex: "#A8E063" },
      { name: "スカイピンク",   hex: "#FFB7C5" },
      { name: "クリーム白",     hex: "#FFFBE6" }
    ],
    toneKeywords: ["明るい", "温かい", "軽やか", "弾む"],
    childExplanation: "うれしいときは、太陽みたいな黄色やオレンジが似合うよ。見るだけでにっこりしてしまう色だね。"
  },
  {
    id: "wakuwaku",
    name: "わくわく",
    icon: "⚡",
    description: "何かが起こりそうなドキドキ感",
    emotionColors: [
      { name: "ビビッドオレンジ",     hex: "#FF6B2B" },
      { name: "エレクトリックブルー", hex: "#0099FF" },
      { name: "ネオンイエロー",       hex: "#FFE000" },
      { name: "マゼンタ",             hex: "#FF3399" },
      { name: "ライトパープル",       hex: "#C084FC" }
    ],
    toneKeywords: ["エネルギー", "躍動", "インパクト", "きらめき"],
    childExplanation: "わくわくするときは、パッと目に飛び込んでくる元気な色が合うよ。ドキドキを色で表してみよう！"
  },
  {
    id: "yasashii",
    name: "やさしい",
    icon: "🌸",
    description: "ふんわりと温かい気持ち",
    emotionColors: [
      { name: "桜ピンク",       hex: "#FFD6E0" },
      { name: "ミントグリーン", hex: "#C8F0E8" },
      { name: "ラベンダー",     hex: "#E1BEE7" },
      { name: "ピーチクリーム", hex: "#FFCBA4" },
      { name: "ミルクホワイト", hex: "#FFF8F0" }
    ],
    toneKeywords: ["柔らか", "淡い", "温もり", "ふんわり"],
    childExplanation: "やさしい気持ちは、ふんわり淡い色にぴったり。桜やパステルの色は見ている人をほっとさせるよ。"
  },
  {
    id: "kanashii",
    name: "かなしい",
    icon: "😢",
    description: "胸がしんとする気持ち",
    emotionColors: [
      { name: "スチールブルー", hex: "#607D8B" },
      { name: "ミスティグレー", hex: "#90A4AE" },
      { name: "ラベンダーグレー", hex: "#9E9BC0" },
      { name: "ペールブルー",   hex: "#BBDEFB" },
      { name: "フォグホワイト", hex: "#ECEFF1" }
    ],
    toneKeywords: ["落ち着いた", "くすんだ", "深み", "静か"],
    childExplanation: "かなしいときの色は、静かで少しくすんだ青やグレー。その気持ちをそのまま絵に込めると、伝わる作品になるよ。"
  },
  {
    id: "samishii",
    name: "さみしい",
    icon: "🌧️",
    description: "ひとりぼっちのような気持ち",
    emotionColors: [
      { name: "ペールブルー",   hex: "#BBDEFB" },
      { name: "ペールグレー",   hex: "#ECEFF1" },
      { name: "クワイエットパープル", hex: "#B39DDB" },
      { name: "ミスティー",     hex: "#CFD8DC" },
      { name: "ディムホワイト", hex: "#F5F5F5" }
    ],
    toneKeywords: ["静か", "薄い", "遠い", "つつまれる"],
    childExplanation: "さみしい気持ちには、遠くに溶けていくような薄い色が合うよ。静かな絵は見ている人の心に響くんだ。"
  },
  {
    id: "yuuki",
    name: "勇気",
    icon: "🔥",
    description: "前に進もうとする強い気持ち",
    emotionColors: [
      { name: "クリムゾンレッド", hex: "#C62828" },
      { name: "ネイビーブルー",  hex: "#1565C0" },
      { name: "ゴールド",        hex: "#FFD700" },
      { name: "ストロンググリーン", hex: "#2E7D32" },
      { name: "ダークネイビー",  hex: "#1A237E" }
    ],
    toneKeywords: ["力強い", "はっきり", "輝く", "深い"],
    childExplanation: "勇気の色は、赤やネイビーの力強い色。ゴールドのアクセントを入れると、ぐっと輝いて見えるよ。"
  },
  {
    id: "kibou",
    name: "希望",
    icon: "🌅",
    description: "明日が楽しみになる前向きな気持ち",
    emotionColors: [
      { name: "ホープスカイ",   hex: "#64B5F6" },
      { name: "ドーンホワイト", hex: "#FFFFFF" },
      { name: "ペールイエロー", hex: "#FFF9C4" },
      { name: "スプリンググリーン", hex: "#A5D6A7" },
      { name: "ドーンピーチ",   hex: "#FFCCBC" }
    ],
    toneKeywords: ["明るい", "さわやか", "朝の光", "広がり"],
    childExplanation: "希望の色は、夜明けの空みたいな明るい青や白。遠くに向かって広がるような気持ちを色で表してみよう。"
  },
  {
    id: "heiwa",
    name: "平和",
    icon: "🕊️",
    description: "穏やかで争いのない温かな気持ち",
    emotionColors: [
      { name: "ソフトブルー",   hex: "#90CAF9" },
      { name: "ピュアホワイト", hex: "#FFFFFF" },
      { name: "ダブグレー",     hex: "#CFD8DC" },
      { name: "オリーブグリーン", hex: "#C5E1A5" },
      { name: "ジェントルゴールド", hex: "#FFF9C4" }
    ],
    toneKeywords: ["穏やか", "澄んだ", "静けさ", "調和"],
    childExplanation: "平和の色は、広い空みたいな澄んだ青と白。見ている人がほっと安心できるような色を選ぼう。"
  },
  {
    id: "fushigi",
    name: "ふしぎ",
    icon: "🔮",
    description: "なぜだろう？と不思議に思う気持ち",
    emotionColors: [
      { name: "ミステリーパープル", hex: "#7B1FA2" },
      { name: "ティール",         hex: "#00BCD4" },
      { name: "シルバー",         hex: "#90A4AE" },
      { name: "ディープインディゴ", hex: "#283593" },
      { name: "スターゴールド",   hex: "#FFD700" }
    ],
    toneKeywords: ["神秘", "深い", "きらめき", "不思議"],
    childExplanation: "ふしぎな気持ちは、紫やティールの深い色がぴったり。金色のアクセントで、魔法のような輝きを加えよう。"
  },
  {
    id: "kowai",
    name: "こわい",
    icon: "😱",
    description: "ドキドキ、ちょっとこわい気持ち",
    emotionColors: [
      { name: "ダークレッド",   hex: "#B71C1C" },
      { name: "シャドウグレー", hex: "#37474F" },
      { name: "ディープパープル", hex: "#4A148C" },
      { name: "ナイトブラック", hex: "#212121" },
      { name: "ゴーストホワイト", hex: "#ECEFF1" }
    ],
    toneKeywords: ["暗い", "緊張感", "深い影", "ドラマチック"],
    childExplanation: "こわい場面は、暗い色とゴーストみたいな白のコントラストがポイント。影を濃くすると、ドキドキ感が出るよ。"
  },
  {
    id: "shizen",
    name: "自然",
    icon: "🌱",
    description: "自然の中にいるような落ち着いた気持ち",
    emotionColors: [
      { name: "フォレストグリーン", hex: "#2E7D32" },
      { name: "アーストーン",       hex: "#795548" },
      { name: "スカイブルー",       hex: "#64B5F6" },
      { name: "サンライト",         hex: "#FFF59D" },
      { name: "ストーングレー",     hex: "#9E9E9E" }
    ],
    toneKeywords: ["落ち着いた", "有機的", "大地", "のびのび"],
    childExplanation: "自然の中にいる気持ちは、みどりや茶色など、地球の色でまとめてみよう。土や木の温かさが伝わるよ。"
  },
  {
    id: "arigatou",
    name: "ありがとう",
    icon: "🙏",
    description: "心から感謝する温かい気持ち",
    emotionColors: [
      { name: "サンクスピンク",   hex: "#F48FB1" },
      { name: "ウォームゴールド", hex: "#FFD600" },
      { name: "ソフトクリーム",   hex: "#FFF9C4" },
      { name: "ジェントルパープル", hex: "#CE93D8" },
      { name: "ハッピーグリーン", hex: "#A5D6A7" }
    ],
    toneKeywords: ["感謝", "温かい", "輝く", "やわらか"],
    childExplanation: "ありがとうの気持ちは、ピンクやゴールドの温かい色で。感謝の気持ちが伝わると、見た人もうれしくなるよ。"
  },
  {
    id: "shinrai",
    name: "信頼",
    icon: "🤝",
    description: "安心して頼れる、しっかりした気持ち",
    emotionColors: [
      { name: "トラストネイビー", hex: "#1A237E" },
      { name: "スチールグレー",   hex: "#546E7A" },
      { name: "クリーンホワイト", hex: "#F5F5F5" },
      { name: "ディープグリーン", hex: "#1B5E20" },
      { name: "シルバー",         hex: "#B0BEC5" }
    ],
    toneKeywords: ["安定", "深い", "誠実", "落ち着き"],
    childExplanation: "信頼の色は、深い青や緑、シルバーのような落ち着いた色。しっかりした色は見ている人に安心感を与えるよ。"
  },
  {
    id: "akogare",
    name: "あこがれ",
    icon: "✨",
    description: "あんなふうになりたい！という気持ち",
    emotionColors: [
      { name: "ドリームゴールド", hex: "#FFD600" },
      { name: "ローズピンク",     hex: "#F48FB1" },
      { name: "ラベンダー",       hex: "#CE93D8" },
      { name: "ドリームクリーム", hex: "#FFFDE7" },
      { name: "スターホワイト",   hex: "#FFFFFF" }
    ],
    toneKeywords: ["煌めき", "夢みる", "やわらか輝き", "ロマンチック"],
    childExplanation: "あこがれの気持ちには、輝くゴールドややわらかいラベンダーが合うよ。キラキラした場面をイメージしてみよう！"
  },
  {
    id: "nukumori",
    name: "ぬくもり",
    icon: "🧡",
    description: "心がほっとする温かさ",
    emotionColors: [
      { name: "ウォームオレンジ", hex: "#FF8F00" },
      { name: "ピーチ",           hex: "#FFCCBC" },
      { name: "ハニーイエロー",   hex: "#FFC107" },
      { name: "クリームブラウン", hex: "#D7CCC8" },
      { name: "ソフトイエロー",   hex: "#FFF9C4" }
    ],
    toneKeywords: ["温かい", "やわらか", "おだやか", "ほっこり"],
    childExplanation: "ぬくもりはオレンジや黄色のあたたかい色。まるでお日様に当たっているような、ほっとする絵が描けるよ。"
  },
  {
    id: "genki",
    name: "元気",
    icon: "💪",
    description: "体いっぱい動きたい元気いっぱいの気持ち",
    emotionColors: [
      { name: "エナジーレッド",   hex: "#D32F2F" },
      { name: "サンセットオレンジ", hex: "#FF6D00" },
      { name: "サンイエロー",     hex: "#FFD600" },
      { name: "ライムグリーン",   hex: "#76FF03" },
      { name: "スカイブルー",     hex: "#87CEEB" }
    ],
    toneKeywords: ["活発", "明るい", "はじける", "躍動"],
    childExplanation: "元気なときは、赤・オレンジ・黄色のはじけるような色がぴったり！見る人も元気になる絵が描けるよ。"
  }
];
