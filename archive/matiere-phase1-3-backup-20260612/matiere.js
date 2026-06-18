/**
 * KIRARA MUSE — ひらめき技法マチエール
 * Phase 1: 静的機能（アニメーションなし）
 *
 * 依存: matiere-data.js (MATIERE_ARTWORK)
 */

(function () {
  'use strict';

  /* --------------------------------------------------------
     初期化
  -------------------------------------------------------- */
  function init() {
    if (typeof MATIERE_ARTWORK === 'undefined') {
      console.error('[matiere] matiere-data.js が読み込まれていません');
      return;
    }

    renderArtwork();
    renderPartSelector();
    selectPart(MATIERE_ARTWORK.parts[0]);
  }

  /* --------------------------------------------------------
     作品画像
  -------------------------------------------------------- */
  function renderArtwork() {
    var img         = document.getElementById('mtiArtworkImg');
    var placeholder = document.getElementById('mtiArtworkPlaceholder');
    if (!img) return;

    var src = MATIERE_ARTWORK.mainImage;
    if (src) {
      img.src = src;
      img.style.display = 'block';
      if (placeholder) placeholder.style.display = 'none';

      img.onerror = function () {
        img.style.display = 'none';
        if (placeholder) placeholder.style.display = 'flex';
      };
    } else {
      img.style.display = 'none';
      if (placeholder) placeholder.style.display = 'flex';
    }
  }

  /* --------------------------------------------------------
     部位選択ボタン
  -------------------------------------------------------- */
  function renderPartSelector() {
    var container = document.getElementById('mtiPartSelector');
    if (!container) return;

    container.innerHTML = MATIERE_ARTWORK.parts.map(function (part, i) {
      return (
        '<button' +
        ' class="mt-part-btn"' +
        ' data-part-id="' + part.id + '"' +
        ' aria-pressed="' + (i === 0 ? 'true' : 'false') + '"' +
        ' style="--mt-part-color:' + part.accentColor + '"' +
        '>' +
        '<span class="mt-part-btn-label">' + esc(part.name) + '</span>' +
        '<span class="mt-part-btn-check" aria-hidden="true">✓ 選択中</span>' +
        '</button>'
      );
    }).join('');

    container.querySelectorAll('.mt-part-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var partId = this.dataset.partId;
        var part = MATIERE_ARTWORK.parts.find(function (p) { return p.id === partId; });
        if (part) selectPart(part);
      });
    });

    /* キーボード: 左右矢印で移動 */
    container.addEventListener('keydown', function (e) {
      var btns = Array.from(container.querySelectorAll('.mt-part-btn'));
      var idx  = btns.indexOf(document.activeElement);
      if (idx === -1) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        btns[(idx + 1) % btns.length].focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        btns[(idx - 1 + btns.length) % btns.length].focus();
      }
    });
  }

  /* --------------------------------------------------------
     部位を選択して技法カードを更新
  -------------------------------------------------------- */
  function selectPart(part) {
    /* 前のアニメーションを停止 */
    if (typeof MatiereMotion !== 'undefined') MatiereMotion.stop();

    /* ボタン状態を更新 */
    document.querySelectorAll('.mt-part-btn').forEach(function (btn) {
      var selected = btn.dataset.partId === part.id;
      btn.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });

    renderTechniqueCard(part);
  }

  /* --------------------------------------------------------
     技法カードを描画
  -------------------------------------------------------- */
  function renderTechniqueCard(part) {
    var section = document.getElementById('mtiTechniqueSection');
    if (!section) return;

    section.innerHTML =
      '<div class="mt-technique-card" style="--mt-accent:' + part.accentColor + '">' +

        /* ヘッダー */
        '<div class="mt-card-header">' +
          '<p class="mt-card-title">' + esc(part.name) + '</p>' +
          '<p class="mt-card-ruby">' + esc(part.yomi) + '</p>' +
        '</div>' +

        /* 道具 */
        buildBlock('道具', '<p class="mt-block-value">' + esc(part.tool) + '</p>') +

        /* 使う色 */
        buildBlock('使う色', buildColors(part)) +

        /* 筆の動き */
        buildBlock('筆の動き',
          '<p class="mt-motion-sound">' + esc(part.motion.soundWord) + '</p>' +
          '<p class="mt-motion-label">' + esc(part.motion.label) + '</p>'
        ) +

        /* MotionDemo */
        buildMotionDemoBlock(part) +

        /* 描く順番 */
        buildBlock('描く順番', buildSteps(part.steps)) +

        /* マチエール拡大 */
        buildBlock('マチエール拡大', buildTexture(part)) +

        /* 先生のヒント */
        '<div class="mt-tip-block">' +
          '<span class="mt-tip-icon" aria-hidden="true">🎨</span>' +
          '<div class="mt-tip-inner">' +
            '<p class="mt-tip-label">よしかず先生のヒント</p>' +
            '<p class="mt-tip-text">' + esc(part.teacherTip) + '</p>' +
          '</div>' +
        '</div>' +

      '</div>';

    setupMotionDemo(part);
    setupPressureSelector();
  }

  /* --------------------------------------------------------
     ヘルパー: カードブロック
  -------------------------------------------------------- */
  function buildBlock(label, innerHtml) {
    return (
      '<div class="mt-card-block">' +
        '<p class="mt-block-label">' + esc(label) + '</p>' +
        innerHtml +
      '</div>'
    );
  }

  function buildColors(part) {
    var dots = part.colorCodes.map(function (code, i) {
      return (
        '<span' +
        ' class="mt-color-dot"' +
        ' style="background-color:' + code + '"' +
        ' title="' + esc(part.colors[i]) + '"' +
        ' aria-label="' + esc(part.colors[i]) + '"' +
        '></span>'
      );
    }).join('');

    var tags = part.colors.map(function (name) {
      return '<span class="mt-color-tag">' + esc(name) + '</span>';
    }).join('');

    return (
      '<div class="mt-color-row">' + dots + '</div>' +
      '<div class="mt-color-names">' + tags + '</div>'
    );
  }

  function buildSteps(steps) {
    var items = steps.map(function (step, i) {
      return (
        '<li class="mt-step-item">' +
          '<span class="mt-step-num" aria-hidden="true">' + (i + 1) + '</span>' +
          '<span class="mt-step-text">' + esc(step) + '</span>' +
        '</li>'
      );
    }).join('');
    return '<ol class="mt-step-list">' + items + '</ol>';
  }

  function buildTexture(part) {
    var inner = part.textureImage
      ? '<img class="mt-texture-img" src="' + part.textureImage + '" alt="' + esc(part.name) + 'のマチエール拡大" />'
      : '<div class="mt-texture-placeholder" style="background-color:' + part.accentColor + '">' +
          '<span class="mt-texture-placeholder-icon" aria-hidden="true">🔍</span>' +
          '<span>拡大画像を準備中</span>' +
        '</div>';

    return '<div class="mt-texture-frame">' + inner + '</div>';
  }

  /* --------------------------------------------------------
     MotionDemo ブロック HTML
  -------------------------------------------------------- */
  /* --------------------------------------------------------
     PressureSelector HTML
  -------------------------------------------------------- */
  var PRESSURE_LABELS = { light: 'やさしく', medium: 'ふつう', strong: 'ぐっと' };
  var PRESSURE_DESCS = {
    light:  '筆をそっと置くと、細くて軽い線になるよ。',
    medium: '自然な力で動かすと、ちょうどよい太さになるよ。',
    strong: '力を入れると、太く濃く、絵の具がしっかり付くよ。'
  };

  function buildPressureSelectorHtml(currentLevel) {
    var levels = ['light', 'medium', 'strong'];
    var btns = levels.map(function (lv) {
      var pressed = (lv === currentLevel) ? 'true' : 'false';
      return (
        '<button class="mt-pressure-btn' + (lv === currentLevel ? ' mt-pressure-btn--on' : '') + '"' +
        ' data-pressure="' + lv + '"' +
        ' aria-pressed="' + pressed + '">' +
        '<span class="mt-pressure-btn-label">' + esc(PRESSURE_LABELS[lv]) + '</span>' +
        '</button>'
      );
    }).join('');
    var desc = esc(PRESSURE_DESCS[currentLevel]);
    return (
      '<div class="mt-pressure-selector">' +
        '<p class="mt-block-label">筆に入れる力</p>' +
        '<div class="mt-pressure-btns" role="group" aria-label="筆圧の選択">' + btns + '</div>' +
        '<p class="mt-pressure-desc" id="mtiPressureDesc">' + desc + '</p>' +
      '</div>'
    );
  }

  function buildPressureCompareHtml() {
    var levels = ['light', 'medium', 'strong'];
    var cols = levels.map(function (lv) {
      var lineH = lv === 'light' ? 3 : lv === 'medium' ? 6 : 10;
      var op    = lv === 'light' ? 0.45 : lv === 'medium' ? 0.75 : 1.0;
      return (
        '<div class="mt-pressure-compare-col">' +
          '<svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">' +
            '<line x1="30" y1="50" x2="30" y2="10" stroke="#7a5a10"' +
            ' stroke-width="' + lineH + '" stroke-linecap="round" opacity="' + op + '"/>' +
          '</svg>' +
          '<p class="mt-pressure-compare-lbl">' + esc(PRESSURE_LABELS[lv]) + '</p>' +
        '</div>'
      );
    }).join('');
    return '<div class="mt-pressure-compare" aria-label="筆圧の違い比較">' + cols + '</div>';
  }

  function setupPressureSelector() {
    var container = document.querySelector('.mt-pressure-btns');
    if (!container || typeof MatiereMotion === 'undefined') return;

    container.querySelectorAll('.mt-pressure-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lv = this.dataset.pressure;
        container.querySelectorAll('.mt-pressure-btn').forEach(function (b) {
          var on = b.dataset.pressure === lv;
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
          b.classList.toggle('mt-pressure-btn--on', on);
        });
        var descEl = document.getElementById('mtiPressureDesc');
        if (descEl) descEl.textContent = PRESSURE_DESCS[lv];
        MatiereMotion.setPressure(lv);
      });
    });

    /* キーボード: 左右矢印 */
    container.addEventListener('keydown', function (e) {
      var btns = Array.from(container.querySelectorAll('.mt-pressure-btn'));
      var idx  = btns.indexOf(document.activeElement);
      if (idx === -1) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); btns[(idx + 1) % btns.length].focus(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); btns[(idx - 1 + btns.length) % btns.length].focus(); }
    });
  }

  /* --------------------------------------------------------
     MOTION_DESCS / MOTION_ARROWS
  -------------------------------------------------------- */
  var MOTION_DESCS = {
    horizontal: '筆を左から右へ、次に右から左へ横に動かします',
    vertical:   '筆を下から上へゆっくり引き上げます',
    tap:        'スポンジを同じ場所にポンポンと3回押します',
    flick:      '筆先を根元から上へシュッと素早く払います（3本）',
    dot:        '筆先で小さな点をトントンとリズミカルに置きます'
  };

  var MOTION_ARROWS = {
    horizontal: '← →',
    vertical:   '↑',
    tap:        '↓ ↑  ↓ ↑  ↓ ↑',
    flick:      '↑  ↑  ↑',
    dot:        '・ ・ ・ ・ ・'
  };

  function buildMotionDemoBlock(part) {
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ariaLbl = esc(part.name) + 'の描き方：' + esc(part.motion.label);
    var desc    = esc(MOTION_DESCS[part.motion.type] || part.motion.label);

    if (reduced) {
      return (
        '<div class="mt-card-block">' +
          '<p class="mt-block-label">筆の動きを見る</p>' +
          '<div class="mt-motion-static" aria-label="' + ariaLbl + '">' +
            '<p class="mt-motion-static-arrow" aria-hidden="true">' + esc(MOTION_ARROWS[part.motion.type] || '→') + '</p>' +
            '<p class="mt-motion-static-sound">' + esc(part.motion.soundWord) + '</p>' +
            '<p class="mt-motion-static-desc">' + desc + '</p>' +
          '</div>' +
          buildPressureCompareHtml() +
        '</div>'
      );
    }

    var currentPressure = (typeof MatiereMotion !== 'undefined') ? MatiereMotion.getPressure() : 'medium';
    return (
      '<div class="mt-card-block">' +
        '<p class="mt-block-label">筆の動きを見る</p>' +
        '<svg id="mtiMotionSVG" class="mt-motion-svg" viewBox="0 0 320 180"' +
          ' role="img" aria-label="' + ariaLbl + '"></svg>' +
        buildPressureSelectorHtml(currentPressure) +
        '<div class="mt-motion-controls" role="group" aria-label="アニメーション操作">' +
          '<button class="mt-motion-btn mt-motion-btn-play" id="mtiPlay">▶ 動きを見る</button>' +
          '<button class="mt-motion-btn mt-motion-btn-stop" id="mtiStop" disabled>■ 止める</button>' +
          '<button class="mt-motion-btn" id="mtiReplay">↺ もう一度</button>' +
        '</div>' +
        '<p class="mt-motion-desc">' + desc + '</p>' +
      '</div>'
    );
  }

  /* --------------------------------------------------------
     MotionDemo セットアップ
  -------------------------------------------------------- */
  function setupMotionDemo(part) {
    var svgEl = document.getElementById('mtiMotionSVG');
    if (!svgEl || typeof MatiereMotion === 'undefined') return;

    MatiereMotion.init(part.motion.type, svgEl);

    var playBtn   = document.getElementById('mtiPlay');
    var stopBtn   = document.getElementById('mtiStop');
    var replayBtn = document.getElementById('mtiReplay');
    if (!playBtn) return;

    function setUI(state) {
      playBtn.disabled  = (state === 'playing');
      stopBtn.disabled  = (state !== 'playing');
    }
    setUI('idle');

    playBtn.addEventListener('click', function () {
      setUI('playing');
      MatiereMotion.play(function () { setUI('done'); });
    });

    stopBtn.addEventListener('click', function () {
      MatiereMotion.stop();
      setUI('idle');
    });

    replayBtn.addEventListener('click', function () {
      setUI('playing');
      MatiereMotion.replay(function () { setUI('done'); });
    });
  }

  /* --------------------------------------------------------
     XSS 対策: 文字列をエスケープ
  -------------------------------------------------------- */
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* --------------------------------------------------------
     起動
  -------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', init);

})();
