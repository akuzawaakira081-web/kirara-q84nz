// テーマデータ（テーマ×きもちパレット用）
export const themes = [
  {
    id: "election",
    name: "明るい選挙ポスター",
    icon: "🗳️",
    description: "みんなの未来を明るくするメッセージ",
    baseColors: [
      { name: "トリコロールブルー", hex: "#003F88" },
      { name: "フレッシュレッド",   hex: "#E8291E" },
      { name: "クリアホワイト",     hex: "#FFFFFF" },
      { name: "サンシャインイエロー", hex: "#FFD700" },
      { name: "スカイブルー",       hex: "#87CEEB" },
      { name: "フレッシュグリーン", hex: "#4CAF50" }
    ],
    recommendedSubjects: ["笑顔の人物", "大きなメッセージ文字", "太陽と旗"],
    atmosphereKeywords: ["信頼", "希望", "清潔感", "前向き", "力強さ"]
  },
  {
    id: "redFeather",
    name: "赤い羽根共同募金",
    icon: "🪶",
    description: "みんなで助け合う温かいポスター",
    baseColors: [
      { name: "スカーレットレッド", hex: "#C0392B" },
      { name: "クリームホワイト",   hex: "#FFFDE7" },
      { name: "若葉グリーン",       hex: "#7CB342" },
      { name: "ゴールデンイエロー", hex: "#F9A825" },
      { name: "ソフトピンク",       hex: "#F8BBD9" },
      { name: "ウォームブラウン",   hex: "#A0726A" }
    ],
    recommendedSubjects: ["赤い羽根", "手をつなぐ人たち", "笑顔の子ども"],
    atmosphereKeywords: ["助け合い", "温かさ", "やさしさ", "感謝", "つながり"]
  },
  {
    id: "nature",
    name: "自然を描こう",
    icon: "🌿",
    description: "生き生きした自然の力と美しさ",
    baseColors: [
      { name: "フォレストグリーン", hex: "#2E7D32" },
      { name: "スカイブルー",       hex: "#64B5F6" },
      { name: "アーストーン",       hex: "#795548" },
      { name: "サンライトゴールド", hex: "#FFF176" },
      { name: "フラワーピンク",     hex: "#F48FB1" },
      { name: "ディープグリーン",   hex: "#1B5E20" }
    ],
    recommendedSubjects: ["大きな木", "川や海", "花畑や生き物"],
    atmosphereKeywords: ["生命力", "広がり", "静けさ", "輝き", "大地"]
  },
  {
    id: "reading",
    name: "読書感想画",
    icon: "📚",
    description: "本の世界を絵で表現する想像の旅",
    baseColors: [
      { name: "ウォームブラウン",   hex: "#5D4037" },
      { name: "ブックページクリーム", hex: "#FFF8E1" },
      { name: "ドリームパープル",   hex: "#7B1FA2" },
      { name: "ストーリーブルー",   hex: "#1565C0" },
      { name: "ディスカバリーゴールド", hex: "#F57F17" },
      { name: "ソフトグレー",       hex: "#ECEFF1" }
    ],
    recommendedSubjects: ["本から飛び出す主人公", "本の中の世界", "読む子どもと想像の場面"],
    atmosphereKeywords: ["想像", "冒険", "知恵", "感動", "発見"]
  },
  {
    id: "future",
    name: "未来の町",
    icon: "🏙️",
    description: "夢のある未来の町をデザインする",
    baseColors: [
      { name: "テクノブルー",       hex: "#1565C0" },
      { name: "シルバーグレー",     hex: "#90A4AE" },
      { name: "ライトパープル",     hex: "#9C27B0" },
      { name: "フューチャーホワイト", hex: "#FAFAFA" },
      { name: "ネオングリーン",     hex: "#69F0AE" },
      { name: "ディープネイビー",   hex: "#0D1B3E" }
    ],
    recommendedSubjects: ["高い建物と空", "乗り物・ロボット", "子どもたちの遊び場"],
    atmosphereKeywords: ["先進", "夢", "スピード", "清潔", "可能性"]
  },
  {
    id: "peace",
    name: "平和ポスター",
    icon: "🕊️",
    description: "平和の大切さを伝える絵",
    baseColors: [
      { name: "ピースブルー",       hex: "#87CEEB" },
      { name: "ピュアホワイト",     hex: "#FFFFFF" },
      { name: "ダブグレー",         hex: "#90A4AE" },
      { name: "オリーブグリーン",   hex: "#689F38" },
      { name: "ジェントルゴールド", hex: "#FFC107" },
      { name: "ソフトピンク",       hex: "#F8BBD9" }
    ],
    recommendedSubjects: ["鳩", "空・虹", "手をつなぐ人たち"],
    atmosphereKeywords: ["静けさ", "誠実さ", "希望", "やさしさ", "広がり"]
  },
  {
    id: "environment",
    name: "環境ポスター",
    icon: "🌍",
    description: "地球と自然を守るメッセージ",
    baseColors: [
      { name: "アースグリーン",     hex: "#388E3C" },
      { name: "オーシャンブルー",   hex: "#0277BD" },
      { name: "アースブラウン",     hex: "#5D4037" },
      { name: "サンイエロー",       hex: "#FFD600" },
      { name: "リーフブライト",     hex: "#8BC34A" },
      { name: "スカイライト",       hex: "#B3E5FC" }
    ],
    recommendedSubjects: ["地球・木", "動物と自然", "エコな暮らし"],
    atmosphereKeywords: ["地球愛", "生命力", "持続可能", "メッセージ", "警告と希望"]
  },
  {
    id: "family",
    name: "家族",
    icon: "👨‍👩‍👧‍👦",
    description: "家族の温かさと絆を描く",
    baseColors: [
      { name: "ウォームオレンジ",   hex: "#FF8F00" },
      { name: "ピーチ",             hex: "#FFCCBC" },
      { name: "ファミリークリーム", hex: "#FFF9C4" },
      { name: "ソフトブラウン",     hex: "#BCAAA4" },
      { name: "ハートレッド",       hex: "#E91E63" },
      { name: "スカイブルー",       hex: "#87CEEB" }
    ],
    recommendedSubjects: ["家族の笑顔", "一緒にいる場面", "家・食卓"],
    atmosphereKeywords: ["温かさ", "絆", "安心", "笑顔", "愛情"]
  },
  {
    id: "thanks",
    name: "ありがとう",
    icon: "🙏",
    description: "感謝の気持ちを色で伝える",
    baseColors: [
      { name: "サンクスピンク",     hex: "#E91E63" },
      { name: "ウォームゴールド",   hex: "#FFD600" },
      { name: "ソフトクリーム",     hex: "#FFF9C4" },
      { name: "ジェントルグリーン", hex: "#A5D6A7" },
      { name: "ラベンダー",         hex: "#CE93D8" },
      { name: "ピュアホワイト",     hex: "#FFFFFF" }
    ],
    recommendedSubjects: ["感謝を伝える手や手紙", "笑顔の人物", "花束・プレゼント"],
    atmosphereKeywords: ["感謝", "喜び", "輝き", "やさしさ", "大切な気持ち"]
  },
  {
    id: "dream",
    name: "夢の世界",
    icon: "🌙",
    description: "不思議な夢の世界を表現する",
    baseColors: [
      { name: "ドリームパープル",   hex: "#7B1FA2" },
      { name: "ローズピンク",       hex: "#F48FB1" },
      { name: "ドリームゴールド",   hex: "#FFD700" },
      { name: "ナイトブルー",       hex: "#1A237E" },
      { name: "ムーンシルバー",     hex: "#B0BEC5" },
      { name: "マジックティール",   hex: "#00BCD4" }
    ],
    recommendedSubjects: ["夢の中の主人公", "不思議な生き物・景色", "星と月"],
    atmosphereKeywords: ["神秘", "夢", "幻想", "輝き", "やわらかさ"]
  }
];
