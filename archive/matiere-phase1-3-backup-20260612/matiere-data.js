/**
 * KIRARA MUSE — ひらめき技法マチエール
 * データファイル: 光を受ける大きな木
 *
 * @typedef {'horizontal'|'vertical'|'tap'|'flick'|'dot'} MotionType
 *
 * @typedef {{ type: MotionType, label: string, soundWord: string }} MotionInfo
 *
 * @typedef {{ light: string, medium: string, strong: string }} PressureLevels
 *
 * @typedef {{
 *   id: string,
 *   name: string,
 *   yomi: string,
 *   tool: string,
 *   colors: string[],
 *   colorCodes: string[],
 *   motion: MotionInfo,
 *   pressureLevels: PressureLevels,
 *   steps: string[],
 *   mainImage: string,
 *   textureImage: string,
 *   teacherTip: string,
 *   accentColor: string
 * }} TechniqueItem
 *
 * @typedef {{
 *   id: string,
 *   title: string,
 *   artist: string,
 *   description: string,
 *   mainImage: string,
 *   parts: TechniqueItem[]
 * }} ArtworkData
 */

/** @type {TechniqueItem[]} */
var MATIERE_PARTS = [
  {
    id: 'sky',
    name: '空',
    yomi: 'そら',
    tool: '幅の広い平筆（大）',
    colors: ['空色', '水色', 'うすい青'],
    colorCodes: ['#87CEEB', '#B0E2FF', '#DAEEFF'],
    motion: {
      type: 'horizontal',
      label: '横にスーッと',
      soundWord: 'スーッ'
    },
    pressureLevels: {
      light:  'やさしくなでると、うすくてふわっとした空になります',
      medium: 'ふつうの力で、きれいな青空になります',
      strong: 'ぐっと押すと、色が濃く力強い空になります'
    },
    steps: [
      '筆に水をたっぷり含ませる',
      '空色の絵の具を溶かす',
      '上から横にスーッと動かす',
      '下へ少しずつ重ねていく'
    ],
    mainImage: '',
    textureImage: '',
    teacherTip: '筆を同じ方向にまっすぐ動かすと、空がスーッと広がって見えるよ！',
    accentColor: '#daeeff'
  },
  {
    id: 'trunk',
    name: '木の幹',
    yomi: 'きのみき',
    tool: '細い筆（小）または筆のわき腹',
    colors: ['茶色', 'こげ茶', '黒みの茶'],
    colorCodes: ['#A0522D', '#6B3A1F', '#3D1C02'],
    motion: {
      type: 'vertical',
      label: '下から上へザラザラと',
      soundWord: 'ザラザラ'
    },
    pressureLevels: {
      light:  '軽くかすらせると、木の表面がなめらかになります',
      medium: 'ふつうの力で、しっかりした幹になります',
      strong: 'ぐっと押すと、ゴツゴツした力強い幹になります'
    },
    steps: [
      '筆に水を少なめにする',
      '茶色の絵の具をつける',
      '下から上に力強く動かす',
      '筆をかすらせて木の質感を出す'
    ],
    mainImage: '',
    textureImage: '',
    teacherTip: '筆をかすらせると、木のゴツゴツした感じが出るよ！水を少なくするのがコツ！',
    accentColor: '#f5e6d3'
  },
  {
    id: 'leaves',
    name: '木の葉',
    yomi: 'きのは',
    tool: 'スポンジまたは丸筆',
    colors: ['黄緑', 'みどり', '深緑'],
    colorCodes: ['#9ACD32', '#4CAF50', '#2E7D32'],
    motion: {
      type: 'tap',
      label: 'ポンポンと叩く',
      soundWord: 'ポンポン'
    },
    pressureLevels: {
      light:  'やさしくポンポンすると、葉がふわっと広がります',
      medium: 'ふつうにポンポンすると、葉がたくさん重なります',
      strong: 'ぐっとポンポンすると、葉が濃くしっかりします'
    },
    steps: [
      'スポンジに黄緑の絵の具をつける',
      '軽くポンポンと叩く',
      '深緑を少し重ねる',
      '色を変えて奥行きを出す'
    ],
    mainImage: '',
    textureImage: '',
    teacherTip: 'ポンポンとたたくと、葉がたくさんついているように見えるよ！色を何度も重ねるのがコツ！',
    accentColor: '#dff0d8'
  },
  {
    id: 'grass',
    name: '草',
    yomi: 'くさ',
    tool: '細い筆（小）の先',
    colors: ['黄緑', '草色', '明るいみどり'],
    colorCodes: ['#8BC34A', '#4CAF50', '#CDDC39'],
    motion: {
      type: 'flick',
      label: '下から上へシュッと払う',
      soundWord: 'シュッ'
    },
    pressureLevels: {
      light:  'やさしくシュッとすると、細くてしなやかな草になります',
      medium: 'ふつうの力でシュッとすると、ちょうどいい草になります',
      strong: 'ぐっとシュッとすると、太くて力強い草になります'
    },
    steps: [
      '筆の先だけに絵の具をつける',
      '紙の下に筆の先を当てる',
      '下から上へシュッと払う',
      '向きをバラバラにして自然に見せる'
    ],
    mainImage: '',
    textureImage: '',
    teacherTip: '筆をシュッと払うと、草が風に揺れているように見えるよ！向きをバラバラにするのがコツ！',
    accentColor: '#ecf5e0'
  },
  {
    id: 'light',
    name: '光',
    yomi: 'ひかり',
    tool: '幅の広い平筆（中）',
    colors: ['白', 'クリームホワイト', 'うすい黄色'],
    colorCodes: ['#FFFFFF', '#FFFDE7', '#FFF9C4'],
    motion: {
      type: 'dot',
      label: '点をトントンと置く',
      soundWord: 'トントン'
    },
    pressureLevels: {
      light:  'やさしくふわっとすると、やわらかい光になります',
      medium: 'ふつうの力でふわっとすると、きれいな光になります',
      strong: 'ぐっとふわっとすると、強い光になります'
    },
    steps: [
      '白い絵の具を水で薄く溶く',
      '筆でそっと重ねる',
      '乾く前に軽くぼかす',
      '何度も薄く重ねて光を強くする'
    ],
    mainImage: '',
    textureImage: '',
    teacherTip: '白を薄く重ねると、光がやさしく当たっているように見えるよ！一度に厚く塗らないのがコツ！',
    accentColor: '#fffde7'
  }
];

/** @type {ArtworkData} */
var MATIERE_ARTWORK = {
  id: 'big-tree-in-light',
  title: '光を受ける大きな木',
  artist: 'よしかず先生',
  description: '光の当たる大きな木を描いてみよう。空・幹・葉・草・光の5つの技法を覚えれば、あなたも描けるよ！',
  mainImage: 'images/matiere/big-tree.jpg',
  parts: MATIERE_PARTS
};
