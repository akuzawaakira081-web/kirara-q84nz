/* KIRARA MUSE — UI オーケストレーター v3
   ボトムシート / フルスクリーン / 参考画像折りたたみ
---------------------------------------------------------------- */
(function () {
  'use strict';

  var _isEraser    = false;
  var _tapped      = false;
  var _sheetOpen   = false;
  var _fullscreen  = false;
  var _refCollapsed = false;

  function init() {
    if (typeof MATIERE_CONFIG === 'undefined') {
      console.error('[matiere] MATIERE_CONFIG が読み込まれていません');
      return;
    }
    _setupImage();
    _setupSampler();
    _setupPicker();
    _setupCanvas();
    _setupControls();
    _setupToolbar();
    _setupSheet();
    _setupRefToggle();

    var def = MATIERE_CONFIG.brushPresets[MATIERE_CONFIG.defaultBrushId];
    if (def) _selectBrush(def);
  }

  /* ---- 参考画像 ---- */
  function _setupImage() {
    var img = document.getElementById('mcRefImage');
    var ph  = document.getElementById('mcRefPlaceholder');
    if (!img) return;
    function onLoaded() {
      if (ph) ph.style.display = 'none';
      img.style.opacity = '1';
    }
    if (img.complete && img.naturalWidth > 0) {
      onLoaded();
    } else {
      img.addEventListener('load', onLoaded);
      img.addEventListener('error', function () {
        img.style.display = 'none';
        if (ph) ph.style.display = 'flex';
      });
    }
  }

  /* ---- カラーサンプラー ---- */
  function _setupSampler() {
    var img = document.getElementById('mcRefImage');
    if (img && typeof MatiereColorSampler !== 'undefined') {
      MatiereColorSampler.init(img);
    }
  }

  /* ---- ピッカー ---- */
  function _setupPicker() {
    var img = document.getElementById('mcRefImage');
    if (!img || typeof MatierePicker === 'undefined') return;

    MatierePicker.init(MATIERE_CONFIG, function (brush) {
      _selectBrush(brush);
    });

    img.addEventListener('touchend', function (e) {
      _tapped = true;
      var result = MatierePicker.handleTap(e, img);
      if (result) { _showTapMarker(e, img, result); _sampleColors(e, img, result); }
    });
    img.addEventListener('click', function (e) {
      if (_tapped) { _tapped = false; return; }
      var result = MatierePicker.handleTap(e, img);
      if (result) { _showTapMarker(e, img, result); _sampleColors(e, img, result); }
    });
  }

  function _sampleColors(e, imgEl, result) {
    if (typeof MatiereColorSampler === 'undefined' || typeof MatiereControls === 'undefined') return;
    var rect = imgEl.getBoundingClientRect();
    var src  = e.changedTouches ? e.changedTouches[0] : e;
    var xPct = (src.clientX - rect.left) / rect.width  * 100;
    var yPct = (src.clientY - rect.top)  / rect.height * 100;
    var sampled  = MatiereColorSampler.sample(xPct, yPct);
    var fallback = (result.brush && result.brush.swatchColors)
      ? result.brush.swatchColors.map(function (c, i) {
          return { label: ['メイン','光','影','となりの色','アクセント'][i] || ('色'+(i+1)), color: c };
        })
      : null;
    MatiereControls.updatePalette(sampled, fallback);
  }

  /* ---- タップマーカー ---- */
  function _showTapMarker(e, imgEl, result) {
    var rect   = imgEl.getBoundingClientRect();
    var src    = e.changedTouches ? e.changedTouches[0] : e;
    var x      = src.clientX - rect.left;
    var y      = src.clientY - rect.top;
    var marker = document.getElementById('mcTapMarker');
    var lbl    = document.getElementById('mcAreaLabel');
    if (marker) {
      marker.style.cssText = 'left:'+x+'px;top:'+y+'px;display:block';
      marker.classList.remove('mc-tap-anim');
      void marker.offsetWidth;
      marker.classList.add('mc-tap-anim');
      marker.style.borderColor = result.brush ? result.brush.primaryColor : '#fff';
    }
    if (lbl && result.area) {
      var lx = Math.min(x + 14, rect.width - 90);
      var ly = Math.max(y - 30, 4);
      lbl.textContent   = result.area.label;
      lbl.style.cssText = 'left:'+lx+'px;top:'+ly+'px;display:block';
      lbl.classList.remove('mc-label-anim');
      void lbl.offsetWidth;
      lbl.classList.add('mc-label-anim');
    }
  }

  /* ---- ブラシ選択 ---- */
  function _selectBrush(brush) {
    if (typeof MatiereCanvas   !== 'undefined') MatiereCanvas.setBrush(brush);
    if (typeof MatiereControls !== 'undefined') MatiereControls.syncFromBrush(brush);
    if (_isEraser) _setEraser(false);
  }

  /* ---- Canvas ---- */
  function _setupCanvas() {
    var el = document.getElementById('mcCanvas');
    if (!el || typeof MatiereCanvas === 'undefined') return;
    var def = MATIERE_CONFIG.brushPresets[MATIERE_CONFIG.defaultBrushId];
    MatiereCanvas.init(el, def);
  }

  /* ---- コントロール ---- */
  function _setupControls() {
    if (typeof MatiereControls === 'undefined') return;
    MatiereControls.init(
      function (key, val) {
        if (typeof MatiereCanvas !== 'undefined') MatiereCanvas.setParam(key, val);
      },
      function (color) {
        if (typeof MatiereCanvas !== 'undefined') MatiereCanvas.setColor(color);
      },
      function (color) {
        if (typeof MatiereCanvas !== 'undefined') MatiereCanvas.setSecondColor(color);
      }
    );
  }

  /* ---- ツールバー ---- */
  function _setupToolbar() {
    _on('mcUndo',        'click', function () {
      if (typeof MatiereCanvas !== 'undefined') MatiereCanvas.undo();
    });
    _on('mcEraser',      'click', function () { _setEraser(!_isEraser); });
    _on('mcClear',       'click', function () {
      if (!confirm('キャンバスをぜんぶけしますか？')) return;
      if (typeof MatiereCanvas !== 'undefined') MatiereCanvas.clear();
    });
    _on('mcSave',        'click', function () {
      if (typeof MatiereCanvas !== 'undefined') MatiereCanvas.saveAsImage();
    });
    _on('mcOpenSettings','click', function () { _openSheet(); });
    _on('mcFullscreen',  'click', function () { _toggleFullscreen(); });
  }

  function _setEraser(on) {
    _isEraser = on;
    var btn = document.getElementById('mcEraser');
    if (btn) {
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.classList.toggle('mc-tool-btn--active', on);
    }
    if (typeof MatiereCanvas !== 'undefined') MatiereCanvas.setEraser(on);
  }

  /* ================================================================
     ボトムシート
  ================================================================ */
  function _setupSheet() {
    _on('mcSheetClose',    'click', _closeSheet);
    _on('mcSheetBackdrop', 'click', _closeSheet);
    /* スワイプで閉じる（簡易版：touchend で位置チェック） */
    var sheet   = document.getElementById('mcBottomSheet');
    var startY  = 0;
    if (sheet) {
      sheet.addEventListener('touchstart', function (e) {
        startY = e.touches[0].clientY;
      }, { passive: true });
      sheet.addEventListener('touchend', function (e) {
        var dy = e.changedTouches[0].clientY - startY;
        if (dy > 80) _closeSheet();
      }, { passive: true });
    }
  }

  function _openSheet() {
    var sheet   = document.getElementById('mcBottomSheet');
    var backdrop = document.getElementById('mcSheetBackdrop');
    if (sheet)    sheet.classList.add('mc-sheet-open');
    if (backdrop) backdrop.classList.add('mc-sheet-open');
    _sheetOpen = true;
    /* シート内プレビューを更新（描画中でなければ） */
    if (typeof MatiereCanvas !== 'undefined' && !MatiereCanvas.isDrawing()) {
      if (typeof BrushEngine !== 'undefined') {
        var canvas = document.getElementById('mcBrushPreview');
        if (canvas) BrushEngine.drawPreview(canvas, MatiereCanvas.getParams(), MatiereCanvas.getActiveColor(), MatiereCanvas.getSecondColor());
      }
    }
  }

  function _closeSheet() {
    var sheet    = document.getElementById('mcBottomSheet');
    var backdrop = document.getElementById('mcSheetBackdrop');
    if (sheet)    sheet.classList.remove('mc-sheet-open');
    if (backdrop) backdrop.classList.remove('mc-sheet-open');
    _sheetOpen = false;
  }

  /* ================================================================
     フルスクリーン
  ================================================================ */
  function _toggleFullscreen() {
    _fullscreen = !_fullscreen;
    document.body.classList.toggle('mc-fullscreen-mode', _fullscreen);

    var btn = document.getElementById('mcFullscreen');
    if (btn) {
      btn.setAttribute('aria-pressed', _fullscreen ? 'true' : 'false');
      btn.classList.toggle('mc-tool-btn--active', _fullscreen);
      var icon  = btn.querySelector('.mc-tool-icon');
      var label = btn.querySelector('.mc-tool-label');
      if (icon)  icon.textContent  = _fullscreen ? '✕' : '⤢';
      if (label) label.textContent = _fullscreen ? 'もどる' : '大きく';
    }

    /* Fullscreen API（対応していれば） */
    if (_fullscreen) {
      var el = document.getElementById('mcApp');
      if (el && el.requestFullscreen) {
        el.requestFullscreen().catch(function () {});
      }
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(function () {});
      }
    }

    /* キャンバスをリサイズ */
    setTimeout(function () {
      if (typeof MatiereCanvas !== 'undefined' && MatiereCanvas._resize) {
        MatiereCanvas._resize();
      }
    }, 50);
  }

  /* ================================================================
     参考画像 折りたたみ
  ================================================================ */
  function _setupRefToggle() {
    _on('mcRefToggle', 'click', function () {
      _refCollapsed = !_refCollapsed;
      var sec = document.getElementById('mcRefSection');
      var btn = document.getElementById('mcRefToggle');
      if (sec) sec.classList.toggle('mc-ref-collapsed', _refCollapsed);
      if (btn) btn.textContent = _refCollapsed ? '▼ 参考画像を見る' : '▲ 小さくする';
    });
  }

  /* ---- helper ---- */
  function _on(id, ev, fn) {
    var el = document.getElementById(id);
    if (el) el.addEventListener(ev, fn);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
