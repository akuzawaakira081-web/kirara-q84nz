/* KIRARA MUSE — マチエール設定データ v3 */
'use strict';

var MATIERE_CONFIG = {

  referenceImage: {
    src: 'images/matiere/sky-reference.png',
    alt: '夕暮れの空 — タップして色とマチエールを選ぼう',
    naturalWidth: 1610,
    naturalHeight: 977
  },

  areas: [
    { id:'area-highlight', brushId:'highlight',      label:'明るい雲',      rect:{x:8,  y:6,  w:38, h:30} },
    { id:'area-pink',      brushId:'pink-cloud',     label:'ピンクの雲',    rect:{x:32, y:24, w:68, h:44} },
    { id:'area-purple',    brushId:'purple-shadow',  label:'むらさきの影',  rect:{x:0,  y:36, w:50, h:48} },
    { id:'area-sunlight',  brushId:'light-band',     label:'夕焼けの光',    rect:{x:44, y:56, w:56, h:32} },
    { id:'area-sunset',    brushId:'light-band',     label:'水平線',        rect:{x:0,  y:78, w:100,h:22} },
    { id:'area-sky',       brushId:'sky-flow',       label:'青い空',        rect:{x:0,  y:0,  w:100,h:100} }
  ],

  brushPresets: {

    /* ── 空の流れ: 平筆で横に流す ── */
    'sky-flow': {
      id:          'sky-flow',
      name:        '空の流れ',
      matiereName: '平筆スウィープ',
      brushType:   'flatBrush',
      primaryColor:'#6AACE0',
      swatchColors:['#5B9BD5','#87CEEB','#9B8EC4'],
      hint:        '横にスーッとのばしてみよう！',
      params: { size:72, opacity:0.55, softness:0.25, paintLoad:0.65, texture:0.28, colorVariation:0.12, spacing:0.06 }
    },

    /* ── ピンクの雲: スポンジでふわっと ── */
    'pink-cloud': {
      id:          'pink-cloud',
      name:        'ピンクの雲',
      matiereName: 'スポンジクラウド',
      brushType:   'spongeBrush',
      primaryColor:'#F0A8C8',
      swatchColors:['#F0A8C8','#FFFFFF','#C8A8E0'],
      hint:        'ふわっと重ねると雲みたいになるよ！',
      params: { size:52, opacity:0.48, softness:0.58, paintLoad:0.58, texture:0.72, colorVariation:0.14, spacing:0.20 }
    },

    /* ── 光の帯: ポッシュでしぶき ── */
    'light-band': {
      id:          'light-band',
      name:        '光の帯',
      matiereName: 'ポッシュ',
      brushType:   'poshBrush',
      primaryColor:'#F5B842',
      swatchColors:['#F5D068','#F5A030','#F5C898'],
      hint:        '歯ブラシをはじくように、絵の具のしぶきを広げよう！',
      params: { size:36, opacity:0.8, softness:0.04, density:28, spread:45, colorVariation:0.10, spacing:0.16 }
    },

    /* ── 紫の影: ドライフラットブラシでかすれ ── */
    'purple-shadow': {
      id:          'purple-shadow',
      name:        '紫の影',
      matiereName: '硬い平刷毛',
      brushType:   'dryFlatBrush',
      primaryColor:'#7860B8',
      swatchColors:['#7860B8','#5848A0','#9878C8'],
      hint:        '重ねると深みが出るよ！',
      params: { size:64, opacity:0.65, softness:0.08, paintLoad:0.28, texture:0.82, colorVariation:0.16, spacing:0.08 }
    },

    /* ── ハイライト: 丸筆でポンポン ── */
    'highlight': {
      id:          'highlight',
      name:        'キラキラ',
      matiereName: '丸筆ポイント',
      brushType:   'roundBrush',
      primaryColor:'#FFFFFF',
      swatchColors:['#FFFFFF','#FFE8F0','#FFFFF0'],
      hint:        'ポンポンと置くと光るよ！',
      params: { size:22, opacity:0.72, softness:0.35, paintLoad:0.62, texture:0.22, colorVariation:0.08, spacing:0.10 }
    }

  },

  defaultBrushId: 'sky-flow'
};
