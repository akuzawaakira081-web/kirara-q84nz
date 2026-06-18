/* ============================================================
   KIRARA MUSE — ひらめき技法マチエール
   ============================================================ */
'use strict';

/* ============================================================
   DATA
   ============================================================ */
const TM = {

  artworks: [
    {
      id: 'sky-clouds', title: '光の空と雲', theme: 'sky', themeLabel: '空と雲',
      image: 'assets/images/sample1.jpg',
      description: '空の青と白い雲。光と影の移ろいを筆で追いかけよう。',
      techniques: ['horizontal-sweep', 'sponge-cloud', 'dry-brush-light'],
      hotspots: [
        {
          id: 'sky-blue', label: '空の青', x: 50, y: 22,
          techniqueId: 'horizontal-sweep', tool: '平筆（大）', soundWord: 'スーッ',
          shortDesc: '平筆を横に走らせて、広い空を塗ろう',
          motion: { type: 'horizontalSweep', angle: 0, duration: 1600, repeat: 2,
            pressureCurve: [{t:0,v:0.3},{t:0.2,v:0.7},{t:0.8,v:0.65},{t:1,v:0.2}],
            speedCurve:    [{t:0,v:0.5},{t:0.5,v:0.6},{t:1,v:0.7}] },
          paint: { load:0.7, water:0.6, opacity:0.8, thickness:0.2, bristle:0.3, noise:0.2 },
          colors: ['#87CEEB','#6BB8E0','#A8D8F0'],
          audioType: 'horizontalBrush',
          tip: '筆を水平に保ったまま、一息で引っ張ると空らしくなるよ。',
          easyTip: 'よこに、スーッとひっぱるよ。',
          challengeTip: '筆圧を一定に保ちつつ、水の量で透明感を調整する。'
        },
        {
          id: 'cloud-body', label: '雲', x: 32, y: 42,
          techniqueId: 'sponge-cloud', tool: 'スポンジ', soundWord: 'ポンポン',
          shortDesc: 'スポンジをポンポンと押し当てて、ふわふわ雲を作ろう',
          motion: { type: 'spongePress', angle: 0, duration: 2000, repeat: 5,
            pressureCurve: [{t:0,v:0.4},{t:0.15,v:0.8},{t:0.5,v:0.6},{t:0.85,v:0.7},{t:1,v:0.3}],
            speedCurve:    [{t:0,v:0.3},{t:0.5,v:0.2},{t:1,v:0.3}] },
          paint: { load:0.5, water:0.3, opacity:0.7, thickness:0.15, bristle:0.9, noise:0.85 },
          colors: ['#FFFFFF','#F0F4F8','#E8EEF5'],
          audioType: 'sponge',
          tip: 'スポンジを回転させながら押すと、雲らしいランダムな形になるよ。',
          easyTip: 'スポンジをペタペタ押すよ。',
          challengeTip: 'スポンジの押し圧と絵の具の量を変えて、積乱雲・層雲・巻雲を描き分ける。'
        },
        {
          id: 'light-ray', label: '光の筋', x: 72, y: 35,
          techniqueId: 'dry-brush-light', tool: '硬い平筆', soundWord: 'カサカサ',
          shortDesc: '乾いた筆で軽くかすらせて、光の筋を表現しよう',
          motion: { type: 'dryBrush', angle: -75, duration: 1400, repeat: 3,
            pressureCurve: [{t:0,v:0.15},{t:0.3,v:0.4},{t:0.7,v:0.35},{t:1,v:0.1}],
            speedCurve:    [{t:0,v:0.6},{t:0.5,v:0.75},{t:1,v:0.9}] },
          paint: { load:0.25, water:0.05, opacity:0.5, thickness:0.1, bristle:0.9, noise:0.9 },
          colors: ['#FFF9E0','#FFF0B0','#FFEB80'],
          audioType: 'dryBrush',
          tip: '絵の具は少なめ、筆は乾かして。かすれが光を表現してくれる。',
          easyTip: 'ほとんど絵の具をつけない筆で、さっとなぞるよ。',
          challengeTip: '下地の色を生かしたドライブラシは、インプレッショニズムの光の表現に直結する。'
        },
        {
          id: 'horizon', label: '水平線', x: 50, y: 68,
          techniqueId: 'horizontal-sweep', tool: '平筆（中）', soundWord: 'スーッ',
          shortDesc: '遠くに見える水平線。一直線に引こう',
          motion: { type: 'horizontalSweep', angle: 0, duration: 1200, repeat: 1,
            pressureCurve: [{t:0,v:0.2},{t:0.1,v:0.6},{t:0.9,v:0.6},{t:1,v:0.15}],
            speedCurve:    [{t:0,v:0.4},{t:0.5,v:0.5},{t:1,v:0.6}] },
          paint: { load:0.5, water:0.4, opacity:0.85, thickness:0.15, bristle:0.25, noise:0.15 },
          colors: ['#6BB8E0','#4A90C4'],
          audioType: 'horizontalBrush',
          tip: '息を止めて、肩から動かすと水平線らしい一本線が出るよ。',
          easyTip: 'まっすぐ、一回でひくよ。',
          challengeTip: '遠近法的には地平線は視点の高さと一致する。'
        }
      ],
      replay: [
        {order:1, title:'空を塗る',   desc:'薄い青で空全体を横に塗ろう',     colors:['#87CEEB'],          tool:'平筆',  anim:'wipe',        dur:1800},
        {order:2, title:'雲の形',     desc:'白でスポンジを押して雲を作ろう',  colors:['#FFFFFF','#E8EEF5'],tool:'スポンジ',anim:'dabReveal',  dur:2200},
        {order:3, title:'光を入れる', desc:'乾いた筆で光の筋を入れよう',     colors:['#FFF9E0'],          tool:'平筆',  anim:'strokeReveal',dur:1400},
        {order:4, title:'奥行き',     desc:'遠い空を少し濃く重ねよう',       colors:['#4A90C4'],          tool:'平筆',  anim:'fade',        dur:1600}
      ],
      missions: [
        {id:'sky-m1', text:'平筆の横塗りを体験しよう',   star:'brushStar'},
        {id:'sky-m2', text:'雲の技法音を聞いてみよう',   star:'soundStar'},
        {id:'sky-m3', text:'リプレイを最後まで見よう',   star:'matiereStar'}
      ]
    },
    {
      id: 'big-tree', title: '光を受ける大きな木', theme: 'tree', themeLabel: '木と森',
      image: 'assets/images/sample2.jpg',
      description: '太陽の光を受けて輝く大木。幹の力強さと葉の繊細さを技法で描き分けよう。',
      techniques: ['dry-brush-trunk','sponge-leaves','fine-brush-grass','stipple-light'],
      hotspots: [
        {
          id: 'tree-trunk', label: '木の幹', x: 52, y: 59,
          techniqueId: 'dry-brush-trunk', tool: '硬い平筆', soundWord: 'カサカサ',
          shortDesc: '縦にかすれを重ねて、木の皮を作ろう',
          motion: { type: 'verticalPull', angle: -90, duration: 1800, repeat: 2,
            pressureCurve: [{t:0,v:0.2},{t:0.35,v:0.75},{t:0.8,v:0.55},{t:1,v:0.1}],
            speedCurve:    [{t:0,v:0.3},{t:0.5,v:0.55},{t:1,v:0.8}] },
          paint: { load:0.35, water:0.08, opacity:0.9, thickness:0.3, bristle:0.75, noise:0.8 },
          colors: ['#6B4423','#8B5A2B','#4A2F1A'],
          audioType: 'dryBrush',
          tip: '筆の筋を消さずに残すと、木らしい表情になるよ。',
          easyTip: 'たてに、カサカサとひくよ。',
          challengeTip: 'インパスト技法で筆跡を立体的に残すと、木の皮のマチエールが生まれる。'
        },
        {
          id: 'leaf-mass', label: '葉の茂み', x: 45, y: 32,
          techniqueId: 'sponge-leaves', tool: 'スポンジ', soundWord: 'ポンポン',
          shortDesc: 'スポンジで葉の茂みをポンポンと重ねよう',
          motion: { type: 'spongePress', angle: 0, duration: 2400, repeat: 6,
            pressureCurve: [{t:0,v:0.5},{t:0.2,v:0.8},{t:0.5,v:0.6},{t:0.8,v:0.75},{t:1,v:0.4}],
            speedCurve:    [{t:0,v:0.25},{t:0.5,v:0.2},{t:1,v:0.3}] },
          paint: { load:0.6, water:0.25, opacity:0.75, thickness:0.18, bristle:0.85, noise:0.9 },
          colors: ['#3A7A3A','#5A9A3A','#2A5A2A','#7AC84A'],
          audioType: 'sponge',
          tip: '緑を3色以上重ねると、葉が生き生きしてくるよ。',
          easyTip: 'いろんな緑でポンポンかさねよう。',
          challengeTip: '暖色系の緑を光側、寒色系を影側に配置すると光源が生まれる。'
        },
        {
          id: 'grass-detail', label: '草', x: 28, y: 77,
          techniqueId: 'fine-brush-grass', tool: '細丸筆', soundWord: 'シュッ',
          shortDesc: '細い筆で、下から上へ草を払おう',
          motion: { type: 'flickUp', angle: 90, duration: 1200, repeat: 5,
            pressureCurve: [{t:0,v:0.6},{t:0.4,v:0.8},{t:0.8,v:0.3},{t:1,v:0.05}],
            speedCurve:    [{t:0,v:0.3},{t:0.5,v:0.5},{t:1,v:0.9}] },
          paint: { load:0.5, water:0.4, opacity:0.85, thickness:0.08, bristle:0.2, noise:0.1 },
          colors: ['#5A9A3A','#7AC84A','#4A8A2A'],
          audioType: 'fineBrush',
          tip: '手首のスナップで払い上げると草らしくなる。',
          easyTip: 'したからうえに、シュッとはらうよ。',
          challengeTip: '重心から先端へのグラデーションは、筆圧の自然な解放で表現する。'
        },
        {
          id: 'light-leaves', label: '光を受ける葉', x: 62, y: 28,
          techniqueId: 'stipple-light', tool: '丸筆の先', soundWord: 'トントン',
          shortDesc: 'トントンと点を打って、光あたる葉を作ろう',
          motion: { type: 'stipple', angle: 0, duration: 2000, repeat: 8,
            pressureCurve: [{t:0,v:0.5},{t:0.5,v:0.7},{t:1,v:0.5}],
            speedCurve:    [{t:0,v:0.4},{t:0.5,v:0.3},{t:1,v:0.4}] },
          paint: { load:0.55, water:0.3, opacity:0.8, thickness:0.12, bristle:0.3, noise:0.35 },
          colors: ['#C8E84A','#E0F060','#A8C830'],
          audioType: 'dab',
          tip: '点の大きさをランダムにすると、自然な葉の茂みが生まれる。',
          easyTip: 'ぴかぴかの葉は、トントン点でかくよ。',
          challengeTip: 'ポワンティリズム（点描）の応用。色を混ぜずに並べると視覚混合が起きる。'
        }
      ],
      replay: [
        {order:1, title:'空の背景', desc:'青い空を広く塗る',             colors:['#87CEEB'],          tool:'平筆',  anim:'wipe',        dur:1600},
        {order:2, title:'幹の形',  desc:'茶色で幹の太い形を置く',        colors:['#6B4423'],          tool:'平筆',  anim:'strokeReveal',dur:1800},
        {order:3, title:'木の皮', desc:'ドライブラシで木の皮感を出す',   colors:['#8B5A2B','#4A2F1A'],tool:'硬い平筆',anim:'brushReveal', dur:2000},
        {order:4, title:'葉を重ねる',desc:'スポンジで緑を何層も重ねる',  colors:['#3A7A3A','#5A9A3A'],tool:'スポンジ',anim:'dabReveal',   dur:2400},
        {order:5, title:'光と草', desc:'明るい点描と細い草で完成',       colors:['#C8E84A','#7AC84A'],tool:'丸筆',  anim:'stippleReveal',dur:2000}
      ],
      missions: [
        {id:'tree-m1', text:'幹のドライブラシを体験しよう',   star:'brushStar'},
        {id:'tree-m2', text:'葉のスポンジ音を聞いてみよう',   star:'soundStar'},
        {id:'tree-m3', text:'マチエールビューで凹凸を確認しよう', star:'matiereStar'}
      ]
    },
    {
      id: 'wind-sea', title: '風が走る海', theme: 'sea', themeLabel: '海と水',
      image: 'assets/images/sample3.jpg',
      description: '風が海面を走り、白波が立つ。水平方向の動きと光の反射を技法で表現しよう。',
      techniques: ['water-horizontal','wave-detail','palette-knife-wave','sky-gradient'],
      hotspots: [
        {
          id: 'sea-surface', label: '海の表面', x: 50, y: 55,
          techniqueId: 'water-horizontal', tool: '平筆（大）', soundWord: 'ザーッ',
          shortDesc: '海の色を水平に重ねよう。波の動きを感じながら',
          motion: { type: 'horizontalSweep', angle: 0, duration: 1600, repeat: 3,
            pressureCurve: [{t:0,v:0.25},{t:0.3,v:0.7},{t:0.7,v:0.65},{t:1,v:0.2}],
            speedCurve:    [{t:0,v:0.4},{t:0.5,v:0.55},{t:1,v:0.65}] },
          paint: { load:0.65, water:0.55, opacity:0.78, thickness:0.18, bristle:0.35, noise:0.25 },
          colors: ['#1A6E9A','#2080B4','#0A4A7A'],
          audioType: 'horizontalBrush',
          tip: '筆を少し傾けながら引くと、波の動きが生まれるよ。',
          easyTip: 'うみは、よこよこでぬるよ。',
          challengeTip: '水平ストロークの微妙な揺らぎがインプレッショニスト的な波の動きを暗示する。'
        },
        {
          id: 'wave-lines', label: '波の線', x: 68, y: 62,
          techniqueId: 'wave-detail', tool: '細丸筆', soundWord: 'チョロチョロ',
          shortDesc: '細い筆で波の線を入れよう',
          motion: { type: 'wave', angle: 0, duration: 1800, repeat: 4,
            pressureCurve: [{t:0,v:0.3},{t:0.25,v:0.55},{t:0.5,v:0.45},{t:0.75,v:0.6},{t:1,v:0.25}],
            speedCurve:    [{t:0,v:0.5},{t:0.5,v:0.6},{t:1,v:0.7}] },
          paint: { load:0.45, water:0.5, opacity:0.7, thickness:0.07, bristle:0.2, noise:0.15 },
          colors: ['#4AA0C0','#80C0E0','#2070A0'],
          audioType: 'fineBrush',
          tip: 'くねくねした線を重ねると、波に奥行きが生まれるよ。',
          easyTip: 'なみなみの線をいっぱいかくよ。',
          challengeTip: '線の密度を手前に高く、奥に低くすることで海面の遠近感が生まれる。'
        },
        {
          id: 'white-cap', label: '白波', x: 40, y: 58,
          techniqueId: 'palette-knife-wave', tool: 'パレットナイフ', soundWord: 'ガシッ',
          shortDesc: 'パレットナイフで白い絵の具を盛り上げよう',
          motion: { type: 'paletteKnife', angle: 15, duration: 1200, repeat: 3,
            pressureCurve: [{t:0,v:0.5},{t:0.3,v:0.9},{t:0.7,v:0.85},{t:1,v:0.3}],
            speedCurve:    [{t:0,v:0.7},{t:0.5,v:0.8},{t:1,v:0.6}] },
          paint: { load:0.9, water:0.0, opacity:1.0, thickness:0.6, bristle:0.0, noise:0.4 },
          colors: ['#FFFFFF','#F0F4F8'],
          audioType: 'knifeStroke',
          tip: 'パレットナイフを斜めにして勢いよく動かすと白波の質感が出るよ。',
          easyTip: 'ナイフで白を、ドンッとのせるよ。',
          challengeTip: 'インパスト技法。ナイフの角度と速度が表面テクスチャを決定する。'
        },
        {
          id: 'sky-sea', label: '空のグラデーション', x: 50, y: 22,
          techniqueId: 'sky-gradient', tool: '平筆（大）', soundWord: 'スーッ',
          shortDesc: '上から下へ、色が変わるグラデーション',
          motion: { type: 'verticalPull', angle: -90, duration: 2000, repeat: 2,
            pressureCurve: [{t:0,v:0.4},{t:0.3,v:0.75},{t:0.7,v:0.6},{t:1,v:0.3}],
            speedCurve:    [{t:0,v:0.35},{t:0.5,v:0.5},{t:1,v:0.6}] },
          paint: { load:0.7, water:0.65, opacity:0.85, thickness:0.15, bristle:0.2, noise:0.1 },
          colors: ['#1A3070','#4070B4','#70A0D4','#A0C8E8'],
          audioType: 'horizontalBrush',
          tip: '2色を塗り重ねてから、乾く前に間を溶かすとグラデーションができる。',
          easyTip: 'うえは濃く、したはうすく。ぼかすよ。',
          challengeTip: 'ウェット・イン・ウェット技法：下の色が乾く前に次の色を重ねると自然なグラデーションになる。'
        }
      ],
      replay: [
        {order:1, title:'空のグラデ', desc:'上から下へ色を変えながら空を塗る', colors:['#1A3070','#70A0D4'],tool:'平筆',  anim:'wipe',       dur:2000},
        {order:2, title:'海の青',   desc:'水平ストロークで海の基本色を作る', colors:['#1A6E9A','#0A4A7A'],tool:'平筆',  anim:'brushReveal',dur:1800},
        {order:3, title:'波の動き', desc:'細筆で波線を重ねる',               colors:['#4AA0C0'],          tool:'細丸筆',anim:'strokeReveal',dur:2000},
        {order:4, title:'白波',     desc:'パレットナイフで白い絵の具を盛る', colors:['#FFFFFF'],          tool:'ナイフ',anim:'dabReveal',   dur:1400}
      ],
      missions: [
        {id:'sea-m1', text:'水平ストロークを体験しよう',         star:'brushStar'},
        {id:'sea-m2', text:'パレットナイフの技法音を聞こう',    star:'soundStar'},
        {id:'sea-m3', text:'白波のマチエールを確認しよう',      star:'matiereStar'}
      ]
    }
  ],

  techniques: [
    {id:'horizontal-sweep',   name:'横塗り',        nameEn:'Horizontal Sweep',  category:'brush', tool:'平筆',       color:'#4A90C4', tags:['基本','空','水']},
    {id:'sponge-cloud',       name:'スポンジ雲',    nameEn:'Sponge Cloud',      category:'sponge',tool:'スポンジ',  color:'#6AADA0', tags:['雲','テクスチャ']},
    {id:'dry-brush-light',    name:'ドライブラシ',  nameEn:'Dry Brush',         category:'brush', tool:'平筆',       color:'#C9A84C', tags:['光','かすれ']},
    {id:'dry-brush-trunk',    name:'縦かすれ',      nameEn:'Vertical Dry Brush',category:'brush', tool:'硬い平筆',  color:'#8B6A3A', tags:['幹','木']},
    {id:'sponge-leaves',      name:'スポンジ葉',    nameEn:'Sponge Leaves',     category:'sponge',tool:'スポンジ',  color:'#5A9A3A', tags:['葉','重ね']},
    {id:'fine-brush-grass',   name:'払い上げ',      nameEn:'Flick Up',          category:'brush', tool:'細丸筆',    color:'#7AC84A', tags:['草','払い']},
    {id:'stipple-light',      name:'点描',          nameEn:'Stipple',           category:'brush', tool:'丸筆の先',  color:'#C8E84A', tags:['光','点']},
    {id:'water-horizontal',   name:'水平ストローク',nameEn:'Water Stroke',      category:'brush', tool:'平筆',       color:'#2080B4', tags:['水','海']},
    {id:'wave-detail',        name:'波の細線',      nameEn:'Wave Lines',        category:'brush', tool:'細丸筆',    color:'#4AA0C0', tags:['波','細線']},
    {id:'palette-knife-wave', name:'パレットナイフ',nameEn:'Palette Knife',     category:'knife', tool:'パレットナイフ',color:'#A0B0C0',tags:['白波','厚塗り']},
    {id:'sky-gradient',       name:'グラデーション',nameEn:'Gradient',          category:'brush', tool:'平筆',       color:'#7090C8', tags:['空','グラデ']}
  ],

  comparisons: [
    {
      motif: '葉の茂み',
      question: 'どの表情が好き？どんな気持ちがする？自分ならどれを使う？',
      items: [
        {label:'スポンジ', type:'spongePress', color:'#5A9A3A', desc:'ふんわり重なる'},
        {label:'点描',     type:'stipple',     color:'#C8E84A', desc:'光がキラキラ'},
        {label:'ドライ',   type:'dryBrush',    color:'#C9A84C', desc:'かすれた秋色'}
      ]
    },
    {
      motif: '水・波',
      question: 'どの水が一番本物らしい？',
      items: [
        {label:'横塗り',   type:'horizontalSweep', color:'#2080B4', desc:'静かな水面'},
        {label:'波線',     type:'wave',            color:'#4AA0C0', desc:'動く波'},
        {label:'ナイフ',   type:'paletteKnife',    color:'#A0B0C0', desc:'力強い白波'}
      ]
    }
  ],

  stars: [
    {id:'brushStar',     label:'筆つかいスター', icon:'✦', color:'#C9A84C'},
    {id:'colorLayerStar',label:'色重ねスター',   icon:'◈', color:'#7AC84A'},
    {id:'matiereStar',   label:'マチエールスター',icon:'❋', color:'#A0B0C0'},
    {id:'soundStar',     label:'音スター',       icon:'♪', color:'#4AA0C0'},
    {id:'discoveryStar', label:'発見スター',     icon:'★', color:'#7c6fc4'},
    {id:'challengeStar', label:'チャレンジスター',icon:'⚡', color:'#C7664A'}
  ],

  ageModeLabels: {
    easy:      {name:'かんたん',      suffix:'よ'},
    standard:  {name:'ふつう',        suffix:''},
    challenge: {name:'チャレンジ',    suffix:''}
  }
};

/* ============================================================
   STATE
   ============================================================ */
const state = {
  ageMode: 'standard',
  soundEnabled: true,
  volume: 0.7,
  selectedArtwork: null,
  selectedHotspot: null,
  progress: {
    seenHotspots: [],
    playedAnimations: [],
    heardSounds: [],
    triedTechniques: [],
    completedArtworks: [],
    earnedStars: {}
  },
  replay: { step: 0, playing: false, speed: 1, timer: null },
  matiere: { auto: true, lightX: 0.3, lightY: 0.3, comparing: false },
  play: { drawing: false, lastPt: null, pressure: 0.5 }
};

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem('tm_state') || '{}');
    if (s.ageMode)   state.ageMode   = s.ageMode;
    if (s.progress)  Object.assign(state.progress, s.progress);
    if (s.soundEnabled !== undefined) state.soundEnabled = s.soundEnabled;
    if (s.volume !== undefined)       state.volume       = s.volume;
  } catch(e) {}
}

function saveState() {
  try {
    localStorage.setItem('tm_state', JSON.stringify({
      ageMode: state.ageMode,
      soundEnabled: state.soundEnabled,
      volume: state.volume,
      progress: state.progress
    }));
  } catch(e) {}
}

/* ============================================================
   AUDIO MANAGER (Web Audio API synthesis)
   ============================================================ */
const Audio = (() => {
  let ctx = null;
  let masterGain = null;
  let permitted = false;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = state.volume;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function setVolume(v) {
    state.volume = v;
    if (masterGain) masterGain.gain.setTargetAtTime(v, getCtx().currentTime, 0.05);
  }

  function setMuted(m) {
    state.soundEnabled = !m;
    if (masterGain) masterGain.gain.setTargetAtTime(m ? 0 : state.volume, getCtx().currentTime, 0.05);
  }

  function playNoise(dur, freq, q, vol, fadeIn, fadeOut) {
    if (!state.soundEnabled) return;
    const c = getCtx();
    const bufLen = c.sampleRate * dur;
    const buf = c.createBuffer(1, bufLen, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const filt = c.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = freq;
    filt.Q.value = q;
    const gain = c.createGain();
    const t = c.currentTime;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + fadeIn);
    gain.gain.setValueAtTime(vol, t + dur - fadeOut);
    gain.gain.linearRampToValueAtTime(0, t + dur);
    src.connect(filt); filt.connect(gain); gain.connect(masterGain);
    src.start(t); src.stop(t + dur);
  }

  function playTone(freq, dur, vol, type) {
    if (!state.soundEnabled) return;
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    const t = c.currentTime;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain); gain.connect(masterGain);
    osc.start(t); osc.stop(t + dur);
  }

  const sounds = {
    horizontalBrush: () => playNoise(0.55, 800, 2, 0.25, 0.04, 0.2),
    dryBrush:        () => playNoise(0.45, 3000, 0.8, 0.18, 0.02, 0.15),
    sponge:          () => { playNoise(0.18, 600, 1.5, 0.2, 0.01, 0.06); setTimeout(()=>playNoise(0.18,600,1.5,0.18,0.01,0.06),220); },
    fineBrush:       () => playNoise(0.3, 1800, 2.5, 0.15, 0.02, 0.1),
    dab:             () => playNoise(0.14, 500, 2, 0.22, 0.01, 0.04),
    knifeStroke:     () => playNoise(0.35, 2000, 0.6, 0.28, 0.03, 0.1),
    discovery:       () => {
      [523, 659, 784, 1047].forEach((f, i) =>
        setTimeout(() => playTone(f, 0.35, 0.18), i * 80));
    },
    starEarned: () => {
      [659, 784, 1047, 1319].forEach((f, i) =>
        setTimeout(() => playTone(f, 0.4, 0.16), i * 90));
    },
    uiClick: () => playTone(880, 0.08, 0.1)
  };

  return { play: (type) => { if (sounds[type]) sounds[type](); }, setVolume, setMuted, getCtx };
})();

/* ============================================================
   BRUSH MOTION CANVAS
   ============================================================ */
function lerp(a, b, t) { return a + (b - a) * t; }

function sampleCurve(curve, t) {
  if (t <= 0) return curve[0].v;
  if (t >= 1) return curve[curve.length - 1].v;
  for (let i = 0; i < curve.length - 1; i++) {
    if (t >= curve[i].t && t <= curve[i+1].t) {
      const frac = (t - curve[i].t) / (curve[i+1].t - curve[i].t);
      return lerp(curve[i].v, curve[i+1].v, frac);
    }
  }
  return curve[curve.length - 1].v;
}

function generatePath(motionType, cx, cy, W, H, angle) {
  const pts = [];
  const n = 60;
  switch (motionType) {
    case 'horizontalSweep':
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        pts.push({ x: cx - W*0.4 + t*W*0.8, y: cy + Math.sin(t * Math.PI * 2.5) * H * 0.018, t });
      }
      break;
    case 'verticalPull':
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        pts.push({ x: cx + Math.sin(t * Math.PI * 1.8) * W * 0.025, y: cy - H*0.38 + t*H*0.76, t });
      }
      break;
    case 'dryBrush': {
      const rad = (angle * Math.PI) / 180;
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        pts.push({
          x: cx + Math.cos(rad) * (t - 0.5) * W * 0.7 + (Math.random()-0.5)*3,
          y: cy + Math.sin(rad) * (t - 0.5) * W * 0.7 + (Math.random()-0.5)*2,
          t
        });
      }
      break;
    }
    case 'spongePress':
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const ring = Math.floor(t * 5);
        const angOff = ring * 1.3 + t * Math.PI * 2;
        const r = (ring * 0.07 + 0.05) * Math.min(W, H);
        pts.push({ x: cx + Math.cos(angOff) * r, y: cy + Math.sin(angOff) * r * 0.6, t });
      }
      break;
    case 'flickUp':
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        pts.push({ x: cx + Math.sin(t * Math.PI * 0.5) * W * 0.04, y: cy + H*0.3 - t*H*0.6, t });
      }
      break;
    case 'stipple':
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const a = t * Math.PI * 8;
        const r = t * Math.min(W, H) * 0.3;
        pts.push({ x: cx + Math.cos(a)*r, y: cy + Math.sin(a)*r*0.7, t, dot: true });
      }
      break;
    case 'wave':
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        pts.push({ x: cx - W*0.4 + t*W*0.8, y: cy + Math.sin(t * Math.PI * 6) * H * 0.06, t });
      }
      break;
    case 'paletteKnife': {
      const rad = (angle * Math.PI) / 180;
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        pts.push({
          x: cx + Math.cos(rad) * (t - 0.5) * W * 0.65,
          y: cy + Math.sin(rad) * (t - 0.5) * W * 0.65,
          t
        });
      }
      break;
    }
    default:
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        pts.push({ x: cx - W*0.3 + t*W*0.6, y: cy, t });
      }
  }
  return pts;
}

class BrushCanvas {
  constructor(canvas, hotspot) {
    this.canvas = canvas;
    this.hs = hotspot;
    this.raf = null;
    this.progress = 0;
    this.animStart = null;
    this.running = false;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.resize();
    this.drawIdle();
  }

  resize() {
    const W = this.canvas.offsetWidth || 300;
    const H = Math.round(W * 0.45);
    this.canvas.width  = W * this.dpr;
    this.canvas.height = H * this.dpr;
    this.canvas.style.height = H + 'px';
    this.W = W; this.H = H;
  }

  get ctx() { return this.canvas.getContext('2d'); }

  drawIdle() {
    const ctx = this.ctx;
    const { W, H, dpr } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    // paper texture bg
    ctx.fillStyle = '#faf8f4';
    ctx.fillRect(0, 0, W, H);
    // ghost path
    const hs = this.hs;
    const pts = generatePath(hs.motion.type, W/2, H/2, W, H, hs.motion.angle || 0);
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = hs.colors[0] || '#c9a84c';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();
    ctx.restore();
    // "tap to play" text
    ctx.fillStyle = 'rgba(120,110,90,0.5)';
    ctx.font = `12px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('▶  動きを見る', W/2, H - 12);
  }

  play() {
    if (this.running) return;
    this.running = true;
    this.progress = 0;
    this.animStart = null;
    const dur = this.hs.motion.duration * (1 / (state.replay.speed || 1));
    const totalDur = dur * this.hs.motion.repeat;
    const draw = (ts) => {
      if (!this.animStart) this.animStart = ts;
      const elapsed = ts - this.animStart;
      this.progress = Math.min(elapsed / totalDur, 1);
      this.drawFrame(this.progress);
      if (this.progress < 1) {
        this.raf = requestAnimationFrame(draw);
      } else {
        this.running = false;
        setTimeout(() => this.drawIdle(), 800);
      }
    };
    this.raf = requestAnimationFrame(draw);
  }

  stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.running = false;
  }

  drawFrame(globalT) {
    const ctx = this.ctx;
    const { W, H, dpr, hs } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#faf8f4';
    ctx.fillRect(0, 0, W, H);

    const repeatIdx = Math.floor(globalT * hs.motion.repeat);
    const localT = (globalT * hs.motion.repeat) % 1;
    const pts = generatePath(hs.motion.type, W/2, H/2, W, H, hs.motion.angle || 0);
    const drawPts = pts.filter(p => p.t <= localT);
    if (drawPts.length < 2) return;

    const baseWidth = Math.max(W, H) * 0.035 * (1 + hs.paint.thickness);
    const bristle = hs.paint.bristle;
    const numStrands = bristle > 0.5 ? Math.round(lerp(1, 7, bristle)) : 1;

    for (let s = 0; s < numStrands; s++) {
      const offset = numStrands > 1 ? (s / (numStrands - 1) - 0.5) * baseWidth * bristle : 0;
      ctx.beginPath();
      let prevX = null, prevY = null;
      drawPts.forEach((p, i) => {
        const pressure = sampleCurve(hs.motion.pressureCurve, p.t);
        const speed    = sampleCurve(hs.motion.speedCurve, p.t);
        const w = baseWidth * pressure * (1 / numStrands);
        const alpha = hs.paint.opacity * lerp(0.9, 0.4, speed) * pressure;
        const noiseX = (hs.paint.noise > 0.3) ? (Math.random()-0.5)*hs.paint.noise*3 : 0;
        const noiseY = (hs.paint.noise > 0.3) ? (Math.random()-0.5)*hs.paint.noise*3 : 0;
        const px = p.x + noiseX;
        const py = p.y + offset + noiseY;

        if (p.dot) {
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = hs.colors[i % hs.colors.length] || '#c9a84c';
          ctx.beginPath();
          ctx.arc(px, py, w * 0.6, 0, Math.PI*2);
          ctx.fill();
          ctx.restore();
          return;
        }

        if (i === 0 || prevX === null) {
          ctx.beginPath();
          ctx.moveTo(px, py);
        } else {
          ctx.lineWidth = w;
          ctx.strokeStyle = hs.colors[Math.floor(p.t * hs.colors.length) % hs.colors.length] || '#c9a84c';
          ctx.globalAlpha = alpha;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.lineTo(px, py);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(px, py);
        }
        prevX = px; prevY = py;
      });
    }
    ctx.globalAlpha = 1;

    // repeat counter
    if (hs.motion.repeat > 1) {
      ctx.fillStyle = 'rgba(120,110,90,0.4)';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${repeatIdx + 1} / ${hs.motion.repeat}`, W - 10, H - 10);
    }
  }
}

/* ============================================================
   MATIERE VIEWER (Canvas + CSS light simulation)
   ============================================================ */
class MatiereViewer {
  constructor(canvas, imgSrc) {
    this.canvas = canvas;
    this.imgSrc = imgSrc;
    this.img = null;
    this.raf = null;
    this.autoMode = true;
    this.autoT = 0;
    this.lightX = 0.3;
    this.lightY = 0.3;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.comparing = false;
    this.load();
    this.bindEvents();
  }

  load() {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this.img = img;
      const W = this.canvas.offsetWidth || 480;
      const H = Math.round(img.naturalHeight / img.naturalWidth * W);
      this.canvas.width  = W * this.dpr;
      this.canvas.height = H * this.dpr;
      this.canvas.style.height = H + 'px';
      this.W = W; this.H = H;
      this.startDraw();
    };
    img.onerror = () => {
      const W = this.canvas.offsetWidth || 480;
      const H = Math.round(W * 0.6);
      this.canvas.width  = W * this.dpr;
      this.canvas.height = H * this.dpr;
      this.canvas.style.height = H + 'px';
      this.W = W; this.H = H;
      this.drawPlaceholder();
    };
    img.src = this.imgSrc;
  }

  bindEvents() {
    const el = this.canvas;
    const move = (cx, cy) => {
      const rect = el.getBoundingClientRect();
      this.lightX = (cx - rect.left) / rect.width;
      this.lightY = (cy - rect.top) / rect.height;
    };
    el.addEventListener('mousemove', e => { if (!this.autoMode) move(e.clientX, e.clientY); });
    el.addEventListener('touchmove', e => {
      e.preventDefault();
      if (!this.autoMode) move(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
  }

  startDraw() {
    const draw = () => {
      if (this.autoMode) {
        this.autoT += 0.008;
        this.lightX = 0.5 + Math.cos(this.autoT) * 0.35;
        this.lightY = 0.5 + Math.sin(this.autoT * 0.7) * 0.25;
      }
      this.drawFrame();
      this.raf = requestAnimationFrame(draw);
    };
    this.raf = requestAnimationFrame(draw);
  }

  stop() { if (this.raf) cancelAnimationFrame(this.raf); }

  drawFrame() {
    const ctx = this.canvas.getContext('2d');
    const { W, H, dpr } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!this.img) return;

    if (this.comparing) {
      ctx.drawImage(this.img, 0, 0, W, H);
      return;
    }

    ctx.drawImage(this.img, 0, 0, W, H);

    // Simulated matiere light overlay
    const lx = this.lightX * W;
    const ly = this.lightY * H;
    const r = Math.max(W, H) * 1.1;

    // Highlight (light source)
    const highlight = ctx.createRadialGradient(lx, ly, 0, lx, ly, r);
    highlight.addColorStop(0,   'rgba(255,245,220,0.28)');
    highlight.addColorStop(0.3, 'rgba(255,240,200,0.12)');
    highlight.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = highlight;
    ctx.fillRect(0, 0, W, H);

    // Shadow (opposite side)
    const sx = W - lx, sy = H - ly;
    const shadow = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 0.8);
    shadow.addColorStop(0,   'rgba(20,15,10,0.25)');
    shadow.addColorStop(0.4, 'rgba(20,15,10,0.1)');
    shadow.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = shadow;
    ctx.fillRect(0, 0, W, H);

    // Texture bump lines (simulated relief)
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = 0.12;
    const dx = lx / W - 0.5;
    const dy = ly / H - 0.5;
    for (let i = 0; i < 18; i++) {
      const y = (i / 18) * H;
      const bump = Math.sin(i * 1.1 + this.autoT * 0.3) * 4;
      ctx.strokeStyle = dx > 0 ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, y + bump);
      ctx.lineTo(W, y + bump + dy * 8);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  drawPlaceholder() {
    const ctx = this.canvas.getContext('2d');
    const { W, H, dpr } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#f5ecd7';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(120,100,60,0.4)';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('マチエール準備中', W/2, H/2);
  }
}

/* ============================================================
   PAINTING REPLAY
   ============================================================ */
class PaintingReplay {
  constructor(canvas, steps) {
    this.canvas = canvas;
    this.steps = steps;
    this.currentStep = 0;
    this.playing = false;
    this.raf = null;
    this.speed = 1;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.resize();
  }

  resize() {
    const W = this.canvas.offsetWidth || 560;
    const H = Math.round(W * 0.6);
    this.canvas.width  = W * this.dpr;
    this.canvas.height = H * this.dpr;
    this.canvas.style.height = H + 'px';
    this.W = W; this.H = H;
    this.render();
  }

  render() {
    const ctx = this.canvas.getContext('2d');
    const { W, H, dpr } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);

    const step = this.steps[this.currentStep];
    if (!step) return;

    // Draw all previous steps faint
    for (let i = 0; i < this.currentStep; i++) {
      this._drawStep(ctx, this.steps[i], W, H, 0.35);
    }
    // Draw current step bright
    this._drawStep(ctx, step, W, H, 1.0);

    // Step label
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = `${Math.round(W * 0.028)}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(`STEP ${step.order}  ${step.title}`, 16, H - 14);
  }

  _drawStep(ctx, step, W, H, alpha) {
    const colors = step.colors || ['#c9a84c'];
    const yBase = (step.order / (this.steps.length + 1)) * H;
    const xSpan = W * 0.75;
    const xStart = W * 0.12;

    ctx.save();
    ctx.globalAlpha = alpha;

    switch (step.anim) {
      case 'wipe':
        colors.forEach((c, ci) => {
          const grd = ctx.createLinearGradient(0, 0, 0, H);
          grd.addColorStop(ci / colors.length, c + 'cc');
          grd.addColorStop(Math.min(1, (ci + 1) / colors.length), (colors[ci+1] || c) + '88');
          ctx.fillStyle = grd;
          ctx.fillRect(0, (ci / colors.length) * H, W, H / colors.length + 2);
        });
        break;
      case 'brushReveal':
      case 'strokeReveal':
        for (let i = 0; i < 4; i++) {
          const y = yBase + (i - 1.5) * H * 0.06;
          ctx.beginPath();
          ctx.moveTo(xStart, y);
          ctx.lineTo(xStart + xSpan, y + (Math.random()-0.5)*8);
          ctx.lineWidth = H * 0.025 * (Math.random()*0.5+0.75);
          ctx.strokeStyle = colors[i % colors.length];
          ctx.lineCap = 'round';
          ctx.stroke();
        }
        break;
      case 'dabReveal':
        for (let i = 0; i < 12; i++) {
          const x = xStart + Math.random() * xSpan;
          const y = yBase + (Math.random()-0.5) * H * 0.2;
          const r = H * 0.04 + Math.random() * H * 0.04;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI*2);
          ctx.fillStyle = colors[i % colors.length];
          ctx.globalAlpha = alpha * (0.5 + Math.random()*0.5);
          ctx.fill();
        }
        break;
      case 'stippleReveal':
        for (let i = 0; i < 30; i++) {
          const x = xStart + Math.random() * xSpan;
          const y = yBase + (Math.random()-0.5) * H * 0.15;
          ctx.beginPath();
          ctx.arc(x, y, H*0.014*(Math.random()+0.5), 0, Math.PI*2);
          ctx.fillStyle = colors[i % colors.length];
          ctx.globalAlpha = alpha * 0.8;
          ctx.fill();
        }
        break;
      default:
        ctx.fillStyle = colors[0];
        ctx.globalAlpha = alpha * 0.6;
        ctx.fillRect(xStart, yBase - H*0.04, xSpan, H * 0.08);
    }
    ctx.restore();
  }

  setStep(i) {
    this.currentStep = Math.max(0, Math.min(this.steps.length - 1, i));
    this.render();
    return this.steps[this.currentStep];
  }

  next()  { return this.setStep(this.currentStep + 1); }
  prev()  { return this.setStep(this.currentStep - 1); }
  first() { return this.setStep(0); }

  async playAll() {
    this.playing = true;
    for (let i = this.currentStep; i < this.steps.length; i++) {
      if (!this.playing) break;
      this.setStep(i);
      await new Promise(r => setTimeout(r, (this.steps[i].dur || 2000) / this.speed));
    }
    this.playing = false;
    updateReplayUI();
  }

  pause() { this.playing = false; }
}

/* ============================================================
   PLAY CANVAS (なぞり体験)
   ============================================================ */
class PlayCanvas {
  constructor(canvas, hotspot) {
    this.canvas = canvas;
    this.hs = hotspot;
    this.drawing = false;
    this.strokes = [];
    this.currentStroke = [];
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.pressure = 0.5;
    this.lastTime = 0;
    this.lastPt = null;
    this.bindEvents();
    this.resize();
    this.drawGuide();
  }

  resize() {
    const W = this.canvas.offsetWidth || 400;
    const H = Math.round(W * 0.6);
    this.canvas.width  = W * this.dpr;
    this.canvas.height = H * this.dpr;
    this.canvas.style.height = H + 'px';
    this.W = W; this.H = H;
  }

  bindEvents() {
    const el = this.canvas;
    el.addEventListener('pointerdown', e => this._down(e));
    el.addEventListener('pointermove', e => this._move(e));
    el.addEventListener('pointerup',   e => this._up(e));
    el.addEventListener('pointercancel', e => this._up(e));
  }

  _getPoint(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);
    let p = e.pressure > 0 ? e.pressure : this.pressure;
    if (e.pointerType === 'touch' && e.pressure === 0) p = this.pressure;
    return { x, y, p, t: performance.now() };
  }

  _down(e) {
    e.preventDefault();
    this.canvas.setPointerCapture(e.pointerId);
    this.drawing = true;
    this.currentStroke = [this._getPoint(e)];
    this.lastPt = this.currentStroke[0];
    this.lastTime = performance.now();
  }

  _move(e) {
    if (!this.drawing) return;
    e.preventDefault();
    const pt = this._getPoint(e);
    const dt = pt.t - this.lastTime;
    const dx = pt.x - this.lastPt.x;
    const dy = pt.y - this.lastPt.y;
    const speed = Math.sqrt(dx*dx + dy*dy) / (dt || 16);
    pt.p = Math.max(0.1, Math.min(1, this.pressure * lerp(1, 0.5, Math.min(speed / 3, 1))));
    this.currentStroke.push(pt);
    this.lastPt = pt;
    this.lastTime = pt.t;
    this._renderStroke();
  }

  _up(e) {
    if (!this.drawing) return;
    this.drawing = false;
    if (this.currentStroke.length > 2) {
      this.strokes.push([...this.currentStroke]);
      this._checkTechnique();
    }
    this.currentStroke = [];
  }

  _renderStroke() {
    const ctx = this.canvas.getContext('2d');
    const { dpr } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this._redraw();
  }

  _redraw() {
    const ctx = this.canvas.getContext('2d');
    const { W, H, dpr } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#fdfaf5';
    ctx.fillRect(0, 0, W, H);
    this._drawGuideLines(ctx);

    const color = this.hs.colors[0] || '#c9a84c';
    const allStrokes = [...this.strokes, this.currentStroke];
    allStrokes.forEach(stroke => {
      if (stroke.length < 2) return;
      for (let i = 1; i < stroke.length; i++) {
        const a = stroke[i-1], b = stroke[i];
        const baseW = Math.max(W, H) * 0.025;
        const w = baseW * b.p * (1 + this.hs.paint.thickness);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineWidth = w;
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.7 + b.p * 0.3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }
    });
    ctx.globalAlpha = 1;
  }

  drawGuide() {
    const ctx = this.canvas.getContext('2d');
    const { W, H, dpr } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#fdfaf5';
    ctx.fillRect(0, 0, W, H);
    this._drawGuideLines(ctx);
  }

  _drawGuideLines(ctx) {
    const { W, H, hs } = this;
    const mt = hs.motion.type;
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.setLineDash([6, 8]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = hs.colors[0] || '#c9a84c';

    if (mt === 'horizontalSweep' || mt === 'wave') {
      for (let i = 0; i < 3; i++) {
        const y = H * 0.3 + i * H * 0.2;
        ctx.beginPath(); ctx.moveTo(W*0.1, y); ctx.lineTo(W*0.9, y); ctx.stroke();
      }
    } else if (mt === 'verticalPull' || mt === 'flickUp') {
      for (let i = 0; i < 3; i++) {
        const x = W * 0.3 + i * W * 0.2;
        ctx.beginPath(); ctx.moveTo(x, H*0.1); ctx.lineTo(x, H*0.9); ctx.stroke();
      }
    } else {
      for (let i = 0; i < 12; i++) {
        const x = W*0.2 + Math.random()*W*0.6;
        const y = H*0.2 + Math.random()*H*0.6;
        ctx.beginPath(); ctx.arc(x, y, H*0.06, 0, Math.PI*2); ctx.stroke();
      }
    }
    ctx.restore();
    ctx.setLineDash([]);

    // instruction text
    ctx.fillStyle = 'rgba(120,100,60,0.45)';
    ctx.font = `${Math.round(W * 0.034)}px sans-serif`;
    ctx.textAlign = 'center';
    const hints = {
      horizontalSweep: '← 横にスーッと動かそう →',
      verticalPull:    '↑ 縦にすーっと動かそう ↓',
      flickUp:         '↑ 下から上へ払い上げよう',
      spongePress:     'ポンポンと押してみよう',
      stipple:         'トントントンと点を打とう',
      wave:            '波のようにゆらゆら動かそう',
      paletteKnife:    '力強く押し付けよう',
      dryBrush:        '軽くかすらせよう'
    };
    ctx.fillText(hints[mt] || '自由に描いてみよう', W/2, H - 14);
  }

  clear() {
    this.strokes = [];
    this.currentStroke = [];
    this.drawGuide();
    document.getElementById('tmPlayFeedback').hidden = true;
  }

  _checkTechnique() {
    if (this.strokes.length < 1) return;
    const mt = this.hs.motion.type;
    const stroke = this.strokes[this.strokes.length - 1];
    const dx = stroke[stroke.length-1].x - stroke[0].x;
    const dy = stroke[stroke.length-1].y - stroke[0].y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    let feedback = '';

    if (mt === 'horizontalSweep' || mt === 'wave') {
      if (Math.abs(angle) < 30 || Math.abs(angle) > 150) {
        feedback = '✨ いい感じ！水平に引けているよ！'; earnStar('brushStar');
      } else {
        feedback = '💡 今度は横にスーッと動かしてみよう';
      }
    } else if (mt === 'verticalPull' || mt === 'flickUp') {
      if (Math.abs(angle) > 60 && Math.abs(angle) < 120) {
        feedback = '✨ 上手！縦に引けているよ！'; earnStar('brushStar');
      } else {
        feedback = '💡 今度は縦に動かしてみよう';
      }
    } else {
      feedback = '✨ いい感じ！続けてみよう！'; earnStar('brushStar');
    }

    if (this.strokes.length >= 3) earnStar('challengeStar');

    const fb = document.getElementById('tmPlayFeedback');
    fb.textContent = feedback;
    fb.hidden = false;
  }
}

/* ============================================================
   COMPARISON LAB
   ============================================================ */
function drawComparisonCanvas(canvas, motionType, colors) {
  const W = canvas.offsetWidth || 160;
  const H = W;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.height = H + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = '#f8f5f0';
  ctx.fillRect(0, 0, W, H);

  const pts = generatePath(motionType, W/2, H/2, W, H, 0);
  const baseW = Math.max(W, H) * 0.04;

  if (motionType === 'stipple') {
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, baseW * 0.5 * (Math.random()*0.5+0.5), 0, Math.PI*2);
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.globalAlpha = 0.7 + Math.random() * 0.3;
      ctx.fill();
    });
  } else if (motionType === 'spongePress') {
    for (let i = 0; i < 30; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * Math.min(W, H) * 0.35;
      ctx.beginPath();
      ctx.arc(W/2 + Math.cos(a)*r, H/2 + Math.sin(a)*r, baseW*(0.5+Math.random()), 0, Math.PI*2);
      ctx.fillStyle = colors[i % colors.length];
      ctx.globalAlpha = 0.3 + Math.random()*0.5;
      ctx.fill();
    }
  } else {
    for (let i = 1; i < pts.length; i++) {
      const p = sampleCurve([{t:0,v:0.3},{t:0.5,v:0.9},{t:1,v:0.2}], pts[i].t);
      ctx.beginPath();
      ctx.moveTo(pts[i-1].x, pts[i-1].y);
      ctx.lineTo(pts[i].x, pts[i].y);
      ctx.lineWidth = baseW * p;
      ctx.strokeStyle = colors[Math.floor(pts[i].t * colors.length) % colors.length];
      ctx.globalAlpha = 0.6 + p * 0.4;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

/* ============================================================
   HERO CANVAS ANIMATION
   ============================================================ */
function initHeroCanvas() {
  const canvas = document.getElementById('tmHeroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];
  let raf;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles.length = 0;
    const count = 22;
    const types = ['stroke', 'drop', 'star', 'stroke'];
    for (let i = 0; i < count; i++) {
      particles.push({
        type: types[Math.floor(Math.random() * types.length)],
        x: Math.random() * 1.2 - 0.1,
        y: 1 + Math.random() * 0.3,
        vx: (Math.random() - 0.5) * 0.0008,
        vy: -(0.0003 + Math.random() * 0.0006),
        size: 0.01 + Math.random() * 0.04,
        alpha: 0,
        maxAlpha: 0.15 + Math.random() * 0.2,
        rotation: Math.random() * Math.PI * 2,
        color: ['#c9a84c','#7c6fc4','#4aa0a8','#c7664a'][Math.floor(Math.random()*4)],
        delay: Math.random() * 4000,
        birth: performance.now()
      });
    }
  }

  function draw(ts) {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      const age = ts - p.birth - p.delay;
      if (age < 0) return;
      const life = age / 8000;
      if (life > 1) { p.birth = ts; p.x = Math.random()*1.2-0.1; p.y = 1; p.alpha = 0; return; }

      p.alpha = life < 0.1 ? p.maxAlpha * (life/0.1) :
                life > 0.85 ? p.maxAlpha * (1 - (life - 0.85)/0.15) : p.maxAlpha;
      p.x += p.vx; p.y += p.vy;
      p.rotation += 0.005;

      const x = p.x * W, y = p.y * H, sz = p.size * Math.min(W, H);
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(x, y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;

      if (p.type === 'star') {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a = (i * 2 * Math.PI / 5) - Math.PI/2;
          const bx = Math.cos(a)*sz, by = Math.sin(a)*sz;
          const a2 = a + Math.PI/5;
          const cx2 = Math.cos(a2)*sz*0.4, cy2 = Math.sin(a2)*sz*0.4;
          if (i === 0) ctx.moveTo(bx, by); else ctx.lineTo(bx, by);
          ctx.lineTo(cx2, cy2);
        }
        ctx.closePath();
        ctx.fill();
      } else if (p.type === 'drop') {
        ctx.beginPath();
        ctx.arc(0, 0, sz * 0.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.lineWidth = sz * 0.15;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-sz, 0);
        ctx.bezierCurveTo(-sz/2, -sz*0.3, sz/2, sz*0.3, sz, 0);
        ctx.stroke();
      }
      ctx.restore();
    });
    raf = requestAnimationFrame(draw);
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  resize();
  createParticles();
  if (!prefersReduced) raf = requestAnimationFrame(draw);
  window.addEventListener('resize', () => { resize(); });
}

/* ============================================================
   PANEL CONTENT BUILDER
   ============================================================ */
let currentBrushCanvas = null;

function buildPanelContent(hs, artwork) {
  const mode = state.ageMode;
  const tip = mode === 'easy' ? hs.easyTip :
              mode === 'challenge' ? hs.challengeTip : hs.tip;

  const colorChips = hs.colors.map(c =>
    `<span class="tm-color-chip" style="background:${c}" title="${c}"></span>`).join('');

  const directionLabel = {
    horizontalSweep: '横方向',
    verticalPull:    '縦方向',
    flickUp:         '下→上',
    spongePress:     '押し当て',
    stipple:         '点打ち',
    wave:            'うねり',
    paletteKnife:    '横押し',
    dryBrush:        '斜め'
  }[hs.motion.type] || '—';

  const pressureAvg = hs.motion.pressureCurve.reduce((s,p) => s+p.v, 0) / hs.motion.pressureCurve.length;
  const pressureLabel = pressureAvg > 0.65 ? '強め' : pressureAvg > 0.4 ? '中くらい' : '弱め';
  const speedAvg = hs.motion.speedCurve.reduce((s,p) => s+p.v, 0) / hs.motion.speedCurve.length;
  const speedLabel = speedAvg > 0.6 ? '速め' : speedAvg > 0.4 ? 'ふつう' : 'ゆっくり';
  const waterLabel = hs.paint.water > 0.55 ? '多め' : hs.paint.water > 0.25 ? '中くらい' : '少なめ';
  const paintLabel = hs.paint.load > 0.65 ? '多め' : hs.paint.load > 0.35 ? '中くらい' : '少なめ';
  const tried = state.progress.triedTechniques.includes(hs.id);

  return `
    <div class="tm-panel-header">
      <p class="tm-panel-motif">${hs.label}</p>
      <h3 class="tm-panel-title">${hs.tool}</h3>
      <p class="tm-panel-soundword">${hs.soundWord}</p>
    </div>
    <div class="tm-panel-body">
      <p class="tm-panel-shortdesc">${hs.shortDesc}</p>
      <ul class="tm-info-list">
        <li class="tm-info-item"><span class="tm-info-label">道具</span><span class="tm-info-value">${hs.tool}</span></li>
        <li class="tm-info-item"><span class="tm-info-label">方向</span><span class="tm-info-value">${directionLabel}</span></li>
        <li class="tm-info-item"><span class="tm-info-label">筆圧</span><span class="tm-info-value">${pressureLabel}</span></li>
        <li class="tm-info-item"><span class="tm-info-label">速さ</span><span class="tm-info-value">${speedLabel}</span></li>
        <li class="tm-info-item"><span class="tm-info-label">絵の具</span><span class="tm-info-value">${paintLabel}</span></li>
        <li class="tm-info-item"><span class="tm-info-label">水の量</span><span class="tm-info-value">${waterLabel}</span></li>
        <li class="tm-info-item"><span class="tm-info-label">色</span><span class="tm-info-value"><div class="tm-color-chips">${colorChips}</div></span></li>
      </ul>

      <div class="tm-brush-canvas-wrap" id="tmBrushCanvasWrap">
        <canvas id="tmBrushCanvas" style="width:100%;height:auto" aria-label="筆の動きアニメーション"></canvas>
        <span class="tm-brush-canvas-label">筆の動き</span>
      </div>

      <div class="tm-panel-actions">
        <button class="tm-action-btn" id="tmActPlay">▶ 動きを見る</button>
        <button class="tm-action-btn" id="tmActSound">♪ 音を聞く</button>
        <button class="tm-action-btn" id="tmActMatiere">🔲 マチエール</button>
        <button class="tm-action-btn" id="tmActPlay2">✏️ 体験する</button>
        <button class="tm-action-btn tm-action-btn--full" id="tmActReplay">↩ 描き方リプレイ</button>
      </div>

      <div class="tm-teacher-tip">
        <p class="tm-teacher-tip-label">よしかず先生のヒント</p>
        <p class="tm-teacher-tip-text">${tip}</p>
      </div>

      <button class="tm-btn-tried${tried ? ' tm-done' : ''}" id="tmBtnTried">
        ${tried ? '✓ やってみた！' : 'やってみた'}
      </button>
    </div>
  `;
}

/* ============================================================
   UI RENDER FUNCTIONS
   ============================================================ */

function renderGallery(theme = 'all') {
  const grid = document.getElementById('tmArtworkGrid');
  const artworks = theme === 'all' ? TM.artworks : TM.artworks.filter(a => a.theme === theme);
  grid.innerHTML = artworks.map(a => `
    <article class="tm-artwork-card" role="listitem" tabindex="0"
             data-id="${a.id}"
             aria-label="${a.title}を選ぶ">
      <div class="tm-artwork-card-img-wrap">
        <img src="${a.image}" alt="${a.title}" loading="lazy"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="tm-artwork-card-placeholder" style="display:none">🎨</div>
        <span class="tm-artwork-card-badge">${a.themeLabel}</span>
        <span class="tm-artwork-card-hotspot-count">${a.hotspots.length} つの秘密</span>
      </div>
      <div class="tm-artwork-card-caption">
        <span class="tm-artwork-card-theme">${a.themeLabel.toUpperCase()}</span>
        <h3 class="tm-artwork-card-title">${a.title}</h3>
        <p class="tm-artwork-card-desc">${a.desc || a.description}</p>
        <div class="tm-artwork-card-tags">
          ${a.techniques.slice(0,3).map(tid => {
            const t = TM.techniques.find(t => t.id === tid);
            return t ? `<span class="tm-artwork-card-tag">${t.name}</span>` : '';
          }).join('')}
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.tm-artwork-card').forEach(card => {
    card.addEventListener('click', () => openArtwork(card.dataset.id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openArtwork(card.dataset.id); } });
  });
}

function openArtwork(id) {
  const artwork = TM.artworks.find(a => a.id === id);
  if (!artwork) return;
  state.selectedArtwork = artwork;
  state.selectedHotspot = null;

  document.getElementById('tmHero').style.display = 'none';
  document.getElementById('tmGallerySection').style.display = 'none';
  document.getElementById('tmAgeSection').style.display = 'none';
  document.getElementById('tmViewerSection').removeAttribute('hidden');
  document.getElementById('tmViewerTitle').textContent = artwork.title;

  // Load image
  const img = document.getElementById('tmArtworkImg');
  const skeleton = document.getElementById('tmArtworkSkeleton');
  img.classList.add('tm-loading');
  img.alt = artwork.title;
  img.src = '';

  img.onload = () => {
    skeleton.classList.add('tm-hidden');
    img.classList.remove('tm-loading');
    placeHotspots(artwork);
  };
  img.onerror = () => {
    skeleton.classList.add('tm-hidden');
    img.classList.remove('tm-loading');
    placeHotspots(artwork);
  };
  img.src = artwork.image;

  // Hotspot list
  const list = document.getElementById('tmHotspotListItems');
  list.innerHTML = artwork.hotspots.map(hs => `
    <li>
      <button class="tm-hotspot-list-item" data-hsid="${hs.id}">
        <span class="tm-hotspot-list-dot" style="background:${TM.techniques.find(t=>t.id===hs.techniqueId)?.color||'#c9a84c'}"></span>
        <span>${hs.label} — ${hs.tool}</span>
      </button>
    </li>
  `).join('');
  list.querySelectorAll('.tm-hotspot-list-item').forEach(btn => {
    btn.addEventListener('click', () => selectHotspot(btn.dataset.hsid));
  });

  // Reset sub-sections
  document.getElementById('tmReplaySection').hidden = true;
  document.getElementById('tmMatiereSection').hidden = true;
  document.getElementById('tmPlaySection').hidden = true;
  document.getElementById('tmComparisonSection').hidden = true;

  // Panel empty state
  resetPanelEmpty();

  // Progress
  if (!state.progress.seenHotspots) state.progress.seenHotspots = [];

  document.getElementById('tmViewerSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  Audio.play('uiClick');
}

function placeHotspots(artwork) {
  const wrap = document.getElementById('tmArtworkWrap');
  wrap.querySelectorAll('.tm-hotspot-btn').forEach(b => b.remove());
  artwork.hotspots.forEach(hs => {
    const btn = document.createElement('button');
    btn.className = 'tm-hotspot-btn';
    btn.style.left = hs.x + '%';
    btn.style.top  = hs.y + '%';
    btn.setAttribute('aria-label', `${hs.label}の技法を見る`);
    btn.dataset.hsid = hs.id;
    btn.innerHTML = `<svg class="tm-hotspot-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>`;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) btn.classList.add('tm-no-motion');
    btn.addEventListener('click', () => selectHotspot(hs.id));
    wrap.appendChild(btn);
  });
}

function selectHotspot(hsId) {
  const artwork = state.selectedArtwork;
  if (!artwork) return;
  const hs = artwork.hotspots.find(h => h.id === hsId);
  if (!hs) return;
  state.selectedHotspot = hs;

  // Update hotspot button states
  document.querySelectorAll('.tm-hotspot-btn').forEach(btn => {
    btn.classList.toggle('tm-selected', btn.dataset.hsid === hsId);
  });

  // Record discovery
  if (!state.progress.seenHotspots.includes(hsId)) {
    state.progress.seenHotspots.push(hsId);
    earnStar('discoveryStar');
    Audio.play('discovery');
  }

  // Render panel
  const content = buildPanelContent(hs, artwork);
  const mobile = window.innerWidth <= 900;

  if (!mobile) {
    const inner = document.getElementById('tmPanelInner');
    inner.innerHTML = content;
    bindPanelActions(hs, artwork);
    // Init brush canvas after DOM insertion
    setTimeout(() => initBrushCanvas(hs), 50);
  } else {
    const inner = document.getElementById('tmBsInner');
    inner.innerHTML = content;
    bindPanelActions(hs, artwork);
    openBottomSheet();
    setTimeout(() => initBrushCanvas(hs), 50);
  }

  saveState();
}

function initBrushCanvas(hs) {
  const canvas = document.getElementById('tmBrushCanvas');
  if (!canvas) return;
  if (currentBrushCanvas) currentBrushCanvas.stop();
  currentBrushCanvas = new BrushCanvas(canvas, hs);
}

function bindPanelActions(hs, artwork) {
  const get = id => document.getElementById(id);

  get('tmActPlay')?.addEventListener('click', () => {
    if (currentBrushCanvas) {
      currentBrushCanvas.play();
      if (!state.progress.playedAnimations.includes(hs.id)) {
        state.progress.playedAnimations.push(hs.id);
        earnStar('matiereStar');
        saveState();
      }
    }
  });

  get('tmActSound')?.addEventListener('click', () => {
    Audio.play(hs.audioType || 'horizontalBrush');
    if (!state.progress.heardSounds.includes(hs.id)) {
      state.progress.heardSounds.push(hs.id);
      earnStar('soundStar');
      saveState();
    }
  });

  get('tmActMatiere')?.addEventListener('click', () => {
    showMatiere(artwork);
    if (window.innerWidth <= 900) closeBottomSheet();
  });

  get('tmActPlay2')?.addEventListener('click', () => {
    showPlay(hs);
    if (window.innerWidth <= 900) closeBottomSheet();
  });

  get('tmActReplay')?.addEventListener('click', () => {
    showReplay(artwork);
    if (window.innerWidth <= 900) closeBottomSheet();
  });

  get('tmBtnTried')?.addEventListener('click', () => {
    const btn = get('tmBtnTried');
    if (!state.progress.triedTechniques.includes(hs.id)) {
      state.progress.triedTechniques.push(hs.id);
      earnStar('colorLayerStar');
      btn.classList.add('tm-done');
      btn.textContent = '✓ やってみた！';
      saveState();
    }
  });
}

function resetPanelEmpty() {
  const inner = document.getElementById('tmPanelInner');
  inner.innerHTML = `
    <div class="tm-panel-empty">
      <div class="tm-panel-empty-icon" aria-hidden="true">👆</div>
      <p class="tm-panel-empty-text">絵の中の光る点をタップして、<br>描き方の秘密を見つけよう</p>
    </div>`;
}

/* ============================================================
   SUB-SECTION ACTIVATORS
   ============================================================ */

let currentMatiere = null;
let currentPlay = null;
let currentReplay = null;

function showMatiere(artwork) {
  const sec = document.getElementById('tmMatiereSection');
  sec.hidden = false;
  sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (currentMatiere) currentMatiere.stop();
  const canvas = document.getElementById('tmMatiereCanvas');
  currentMatiere = new MatiereViewer(canvas, artwork.image);
  document.getElementById('tmMatiereHint').textContent = '動かして光の方向を変えよう';

  document.getElementById('tmMatiereAuto').addEventListener('click', () => {
    currentMatiere.autoMode = true;
    document.getElementById('tmMatiereAuto').classList.add('tm-tag--active');
    document.getElementById('tmMatiereManual').classList.remove('tm-tag--active');
    document.getElementById('tmMatiereHint').textContent = '自動で光が回転しています';
  });
  document.getElementById('tmMatiereManual').addEventListener('click', () => {
    currentMatiere.autoMode = false;
    document.getElementById('tmMatiereManual').classList.add('tm-tag--active');
    document.getElementById('tmMatiereAuto').classList.remove('tm-tag--active');
    document.getElementById('tmMatiereHint').textContent = '指やマウスで光を動かしてみよう';
  });
  document.getElementById('tmMatiereCompare').addEventListener('click', () => {
    if (currentMatiere) currentMatiere.comparing = !currentMatiere.comparing;
    const btn = document.getElementById('tmMatiereCompare');
    btn.classList.toggle('tm-tag--active', currentMatiere.comparing);
    document.getElementById('tmMatiereHint').textContent =
      currentMatiere.comparing ? '元画像を表示中' : '凹凸加工を表示中';
  });
}

function showPlay(hs) {
  const sec = document.getElementById('tmPlaySection');
  sec.hidden = false;
  document.getElementById('tmPlayTitle').textContent = `なぞり体験：${hs.label}`;
  document.getElementById('tmPlayDesc').textContent = hs.shortDesc + `（${hs.soundWord}）`;
  sec.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const canvas = document.getElementById('tmPlayCanvas');
  currentPlay = new PlayCanvas(canvas, hs);

  const pressureSlider = document.getElementById('tmPlayPressure');
  pressureSlider.addEventListener('input', () => {
    if (currentPlay) currentPlay.pressure = pressureSlider.value / 100;
  });

  document.getElementById('tmPlayClear').addEventListener('click', () => {
    if (currentPlay) currentPlay.clear();
  });
}

function showReplay(artwork) {
  const sec = document.getElementById('tmReplaySection');
  sec.hidden = false;
  sec.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const canvas = document.getElementById('tmReplayCanvas');
  if (currentReplay) currentReplay.pause();
  currentReplay = new PaintingReplay(canvas, artwork.replay);

  renderReplayStepList(artwork.replay);
  updateReplayUI();

  document.getElementById('tmReplayFirst').addEventListener('click', () => { currentReplay.first(); updateReplayStepList(); updateReplayUI(); });
  document.getElementById('tmReplayPrev').addEventListener('click',  () => { currentReplay.prev();  updateReplayStepList(); updateReplayUI(); });
  document.getElementById('tmReplayNext').addEventListener('click',  () => { currentReplay.next();  updateReplayStepList(); updateReplayUI(); });
  document.getElementById('tmReplayPlay').addEventListener('click',  () => {
    if (currentReplay.playing) {
      currentReplay.pause();
    } else {
      currentReplay.playAll();
    }
    updateReplayUI();
  });
  document.getElementById('tmReplaySpeed').addEventListener('change', e => {
    if (currentReplay) currentReplay.speed = parseFloat(e.target.value);
  });
}

function renderReplayStepList(steps) {
  const list = document.getElementById('tmReplayStepList');
  list.innerHTML = steps.map((s, i) => `
    <li><button class="tm-replay-step-item${i === 0 ? ' tm-active' : ''}" data-idx="${i}">
      <span class="tm-replay-step-num">${s.order}</span>
      <span>${s.title}</span>
    </button></li>
  `).join('');
  list.querySelectorAll('.tm-replay-step-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = currentReplay.setStep(parseInt(btn.dataset.idx));
      updateReplayStepList();
      updateReplayUI();
    });
  });
}

function updateReplayStepList() {
  if (!currentReplay) return;
  document.querySelectorAll('.tm-replay-step-item').forEach((btn, i) => {
    btn.classList.toggle('tm-active', i === currentReplay.currentStep);
  });
}

function updateReplayUI() {
  if (!currentReplay) return;
  const step = currentReplay.steps[currentReplay.currentStep];
  const info = document.getElementById('tmReplayStepInfo');
  if (step) {
    info.innerHTML = `<strong>STEP ${step.order}: ${step.title}</strong><br>${step.desc}<br>
      <span style="color:var(--color-gold);font-size:0.78rem">道具: ${step.tool}</span>`;
  }
  const playBtn = document.getElementById('tmReplayPlay');
  if (playBtn) playBtn.textContent = currentReplay.playing ? '⏸' : '▶';
}

/* ============================================================
   COMPARISON LAB
   ============================================================ */
function renderComparisonLab(artwork) {
  const sec = document.getElementById('tmComparisonSection');
  sec.hidden = false;
  const inner = document.getElementById('tmComparisonInner');
  inner.innerHTML = TM.comparisons.map((comp, ci) => `
    <div class="tm-comparison-block">
      <h4 class="tm-comparison-motif">${comp.motif}</h4>
      <p class="tm-comparison-question">${comp.question}</p>
      <div class="tm-comparison-items">
        ${comp.items.map((item, ii) => `
          <div class="tm-comparison-item" tabindex="0" role="button"
               aria-label="${item.label}を選ぶ"
               data-ci="${ci}" data-ii="${ii}">
            <div class="tm-comparison-canvas-wrap">
              <canvas id="tmComp_${ci}_${ii}" style="display:block;width:100%;height:100%"></canvas>
            </div>
            <div class="tm-comparison-item-label">${item.label}</div>
            <div class="tm-comparison-item-desc">${item.desc}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  // Draw comparison canvases after DOM update
  setTimeout(() => {
    TM.comparisons.forEach((comp, ci) => {
      comp.items.forEach((item, ii) => {
        const canvas = document.getElementById(`tmComp_${ci}_${ii}`);
        if (canvas) drawComparisonCanvas(canvas, item.type, [item.color, item.color + 'aa']);
      });
    });
  }, 50);

  inner.querySelectorAll('.tm-comparison-item').forEach(el => {
    el.addEventListener('click', () => {
      const siblings = el.parentElement.querySelectorAll('.tm-comparison-item');
      siblings.forEach(s => s.classList.remove('tm-selected'));
      el.classList.add('tm-selected');
      earnStar('discoveryStar');
      Audio.play('uiClick');
    });
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') el.click(); });
  });
}

/* ============================================================
   STAR PROGRESS
   ============================================================ */
function earnStar(type) {
  if (state.progress.earnedStars[type]) return;
  state.progress.earnedStars[type] = true;
  saveState();
  renderStarGrid();
  showStarOverlay(type);
  Audio.play('starEarned');
}

function showStarOverlay(type) {
  const star = TM.stars.find(s => s.id === type);
  if (!star) return;
  const overlay = document.getElementById('tmStarOverlay');
  overlay.removeAttribute('hidden');
  overlay.removeAttribute('aria-hidden');
  document.getElementById('tmStarBurst').textContent = star.icon;
  document.getElementById('tmStarMsg').textContent = `${star.label} を獲得！`;
  setTimeout(() => {
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
  }, 2200);
}

function renderStarGrid() {
  const grid = document.getElementById('tmStarGrid');
  grid.innerHTML = TM.stars.map(s => {
    const earned = !!state.progress.earnedStars[s.id];
    return `<div class="tm-star-card${earned ? ' tm-earned' : ''}" role="listitem" aria-label="${s.label}${earned ? '（獲得済み）' : '（未獲得）'}">
      <div class="tm-star-icon" style="${earned ? 'color:' + s.color : ''}">${s.icon}</div>
      <div class="tm-star-label">${s.label}</div>
    </div>`;
  }).join('');

  const earned = TM.stars.filter(s => state.progress.earnedStars[s.id]).length;
  document.getElementById('tmStarSummary').textContent =
    earned > 0 ? `${earned} / ${TM.stars.length} 個のスターを獲得！` : '技法を体験してスターを集めよう。';
}

/* ============================================================
   RECIPE CARDS
   ============================================================ */
function renderRecipeCards() {
  const grid = document.getElementById('tmRecipeGrid');
  const recipes = TM.artworks.map(a => {
    const hs = a.hotspots[0];
    const mode = state.ageMode;
    const tip = mode === 'easy' ? hs.easyTip : mode === 'challenge' ? hs.challengeTip : hs.tip;
    return `
      <div class="tm-recipe-card">
        <div class="tm-recipe-card-title">${hs.label}</div>
        <div class="tm-recipe-card-tool">${hs.tool}</div>
        <div class="tm-recipe-soundword">${hs.soundWord}</div>
        <ol class="tm-recipe-steps">
          <li class="tm-recipe-step"><span class="tm-recipe-step-num">1</span>${hs.shortDesc}</li>
          <li class="tm-recipe-step"><span class="tm-recipe-step-num">2</span>筆圧: ${hs.motion.pressureCurve.some(p=>p.v>0.7) ? '途中で強く' : '一定に'}</li>
          <li class="tm-recipe-step"><span class="tm-recipe-step-num">3</span>水の量: ${hs.paint.water > 0.5 ? '多め' : hs.paint.water > 0.25 ? '中くらい' : '少なめ'}</li>
        </ol>
        <p class="tm-recipe-tip">${tip}</p>
      </div>`;
  });
  grid.innerHTML = recipes.join('');
}

/* ============================================================
   TECHNIQUE LIST
   ============================================================ */
function renderTechniqueList() {
  const grid = document.getElementById('tmTechniqueGrid');
  grid.innerHTML = TM.techniques.map(t => `
    <div class="tm-technique-chip" tabindex="0" aria-label="${t.name}の技法">
      <div class="tm-technique-dot" style="background:${t.color}"></div>
      <div class="tm-technique-name">${t.name}</div>
      <div class="tm-technique-name-en">${t.nameEn}</div>
      <div class="tm-technique-tool">${t.tool}</div>
    </div>`).join('');
}

/* ============================================================
   BOTTOM SHEET
   ============================================================ */
function openBottomSheet() {
  const sheet = document.getElementById('tmBottomSheet');
  const overlay = document.getElementById('tmBsOverlay');
  sheet.classList.add('tm-open');
  sheet.removeAttribute('aria-hidden');
  overlay.style.display = 'block';
  setTimeout(() => overlay.classList.add('tm-active'), 10);
  document.body.style.overflow = 'hidden';
}

function closeBottomSheet() {
  const sheet = document.getElementById('tmBottomSheet');
  const overlay = document.getElementById('tmBsOverlay');
  sheet.classList.remove('tm-open');
  sheet.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('tm-active');
  setTimeout(() => { overlay.style.display = 'none'; }, 300);
  document.body.style.overflow = '';
}

/* ============================================================
   EVENT BINDINGS
   ============================================================ */
function bindEvents() {
  // Hero enter button
  document.getElementById('tmBtnEnter').addEventListener('click', () => {
    document.getElementById('tmAgeSection').scrollIntoView({ behavior: 'smooth' });
  });

  // Age mode cards
  document.querySelectorAll('.tm-age-card').forEach(card => {
    card.addEventListener('click', () => {
      state.ageMode = card.dataset.mode;
      document.querySelectorAll('.tm-age-card').forEach(c => {
        c.classList.remove('tm-active');
        c.setAttribute('aria-checked', 'false');
      });
      card.classList.add('tm-active');
      card.setAttribute('aria-checked', 'true');
      saveState();
      renderRecipeCards();
      Audio.play('uiClick');
    });
  });

  // Theme tabs
  document.querySelectorAll('.tm-theme-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tm-theme-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      renderGallery(tab.dataset.theme);
    });
  });

  // Back button
  document.getElementById('tmBtnBack').addEventListener('click', () => {
    document.getElementById('tmViewerSection').setAttribute('hidden', '');
    document.getElementById('tmHero').style.display = '';
    document.getElementById('tmGallerySection').style.display = '';
    document.getElementById('tmAgeSection').style.display = '';
    state.selectedArtwork = null;
    state.selectedHotspot = null;
    if (currentMatiere) { currentMatiere.stop(); currentMatiere = null; }
    if (currentReplay)  { currentReplay.pause(); currentReplay = null; }
    closeBottomSheet();
    document.getElementById('tmGallerySection').scrollIntoView({ behavior: 'smooth' });
  });

  // Sound toggle
  document.getElementById('tmSoundToggle').addEventListener('click', () => {
    const muted = state.soundEnabled;
    Audio.setMuted(muted);
    const btn = document.getElementById('tmSoundToggle');
    btn.classList.toggle('tm-muted', muted);
    btn.setAttribute('aria-label', muted ? '音をONにする' : '音をOFFにする');
    saveState();
  });

  // Hotspot list toggle
  document.getElementById('tmHotspotListToggle').addEventListener('click', () => {
    const list = document.getElementById('tmHotspotList');
    list.hidden = !list.hidden;
    document.getElementById('tmHotspotListToggle').classList.toggle('tm-active', !list.hidden);
  });

  // Bottom sheet overlay close
  document.getElementById('tmBsOverlay').addEventListener('click', closeBottomSheet);
}

/* ============================================================
   INIT
   ============================================================ */
function init() {
  loadState();

  // Set active age mode
  document.querySelectorAll('.tm-age-card').forEach(card => {
    const active = card.dataset.mode === state.ageMode;
    card.classList.toggle('tm-active', active);
    card.setAttribute('aria-checked', active ? 'true' : 'false');
  });

  // Sound toggle initial state
  const soundBtn = document.getElementById('tmSoundToggle');
  if (!state.soundEnabled) {
    soundBtn.classList.add('tm-muted');
    soundBtn.setAttribute('aria-label', '音をONにする');
  }

  renderGallery();
  renderStarGrid();
  renderRecipeCards();
  renderTechniqueList();
  initHeroCanvas();
  bindEvents();

  // Show comparison lab once an artwork is loaded
  // (triggered from artwork viewer)
}

document.addEventListener('DOMContentLoaded', init);
