/* KIRARA MUSE — ブラシコントロール UI v3
   isDrawing ガード + キャンバスオーバーレイ同期
---------------------------------------------------------------- */
(function () {
  'use strict';

  var _onParamChange = null;
  var _onColorSelect = null;
  var _palette       = [];
  var _selectedIdx   = 0;
  var _previewTimer  = null;

  function init(onParamChange, onColorSelect) {
    _onParamChange = onParamChange;
    _onColorSelect = onColorSelect;
    _wireSliders();
    _wireBrushTypeButtons();
    _wireResetBtn();
    setTimeout(_refreshPreview, 150);
  }

  /* ================================================================
     ブラシ形状ボタン
  ================================================================ */
  function _wireBrushTypeButtons() {
    var row = document.getElementById('mcBrushTypeRow');
    if (!row) return;
    row.querySelectorAll('.mc-brushtype-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var type = btn.dataset.type;
        _setBrushTypeActive(type);
        _onParamChange('brushType', type);
        _refreshPreview();
      });
    });
  }

  function _setBrushTypeActive(type) {
    var row = document.getElementById('mcBrushTypeRow');
    if (!row) return;
    row.querySelectorAll('.mc-brushtype-btn').forEach(function (btn) {
      btn.classList.toggle('mc-brushtype-btn--active', btn.dataset.type === type);
    });
  }

  /* ================================================================
     スライダー
  ================================================================ */
  function _wireSliders() {
    _wire('mcSliderSize',      function (v) { _onParamChange('size', +v);            _refreshPreview(); });
    _wire('mcSliderOpacity',   function (v) { _onParamChange('opacity', +v);         _refreshPreview(); });
    _wire('mcSliderSoftness',  function (v) { _onParamChange('softness', +v);        _refreshPreview(); });
    _wire('mcSliderPaintLoad', function (v) { _onParamChange('paintLoad', +v);       _refreshPreview(); });
    _wire('mcSliderTexture',   function (v) { _onParamChange('texture', +v);         _refreshPreview(); });
    _wire('mcSliderColorVar',  function (v) { _onParamChange('colorVariation', +v);  _refreshPreview(); });
    _wire('mcSliderSpacing',   function (v) { _onParamChange('spacing', +v);         _refreshPreview(); });
    _wire('mcSliderHue',       function (v) { _onParamChange('hueShift', +v);        _refreshColorPreview(); });
    _wire('mcSliderSat',       function (v) { _onParamChange('satMul', +v);          _refreshColorPreview(); });
    _wire('mcSliderLight',     function (v) { _onParamChange('lightShift', +v);      _refreshColorPreview(); });
    _wire('mcSliderAlpha',     function (v) { _onParamChange('alpha', +v);           _refreshColorPreview(); });
  }

  function _wire(id, fn) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function () {
      _updateDisplay(id, el.value);
      fn(el.value);
    });
  }

  function _setVal(id, val) {
    var el = document.getElementById(id);
    if (el) { el.value = val; _updateDisplay(id, val); }
  }

  function _updateDisplay(sliderId, raw) {
    var dispId = sliderId.replace('mcSlider', 'mcVal');
    var el = document.getElementById(dispId);
    if (!el) return;
    var v = parseFloat(raw);
    if (sliderId === 'mcSliderSize') {
      el.textContent = Math.round(v);
    } else if (sliderId === 'mcSliderHue') {
      el.textContent = (v >= 0 ? '+' : '') + Math.round(v) + '°';
    } else if (sliderId === 'mcSliderSat' || sliderId === 'mcSliderLight') {
      el.textContent = (v >= 0 ? '+' : '-') + Math.round(Math.abs(v) * 100) + '%';
    } else {
      el.textContent = Math.round(v * 100) + '%';
    }
  }

  /* ================================================================
     ブラシプレビューキャンバス (デバウンス付き)
     描画中は実行しない（ストローク状態を壊さないため）
  ================================================================ */
  function _refreshPreview() {
    clearTimeout(_previewTimer);
    _previewTimer = setTimeout(function () {
      if (typeof MatiereCanvas !== 'undefined' && MatiereCanvas.isDrawing()) return;
      var canvas = document.getElementById('mcBrushPreview');
      if (!canvas) return;
      if (typeof BrushEngine   === 'undefined') return;
      if (typeof MatiereCanvas === 'undefined') return;
      BrushEngine.drawPreview(canvas, MatiereCanvas.getParams(), MatiereCanvas.getActiveColor());
    }, 80);
  }

  function _refreshColorPreview() {
    var el = document.getElementById('mcColorAdjPreview');
    if (el && typeof MatiereCanvas !== 'undefined') {
      el.style.background = MatiereCanvas.getActiveColor();
    }
    _updateOverlay();
    _refreshPreview();
  }

  /* キャンバスオーバーレイ（色ドット + ブラシ名）を更新 */
  function _updateOverlay() {
    if (typeof MatiereCanvas === 'undefined') return;
    var dot = document.getElementById('mcCurrentColorDot');
    if (dot) dot.style.background = MatiereCanvas.getActiveColor();
  }

  /* ================================================================
     リセットボタン
  ================================================================ */
  function _wireResetBtn() {
    var btn = document.getElementById('mcColorReset');
    if (!btn) return;
    btn.addEventListener('click', function () {
      _setVal('mcSliderHue',   0);
      _setVal('mcSliderSat',   0);
      _setVal('mcSliderLight', 0);
      _setVal('mcSliderAlpha', 1.0);
      _onParamChange('hueShift',   0);
      _onParamChange('satMul',     0);
      _onParamChange('lightShift', 0);
      _onParamChange('alpha',      1.0);
      _refreshColorPreview();
    });
  }

  /* ================================================================
     ブラシプリセットから UI を同期
  ================================================================ */
  function syncFromBrush(brush) {
    var p = brush.params;
    _setVal('mcSliderSize',      p.size);
    _setVal('mcSliderOpacity',   p.opacity);
    _setVal('mcSliderSoftness',  p.softness);
    _setVal('mcSliderPaintLoad', p.paintLoad  !== undefined ? p.paintLoad  : 0.65);
    _setVal('mcSliderTexture',   p.texture);
    _setVal('mcSliderColorVar',  p.colorVariation);
    _setVal('mcSliderSpacing',   p.spacing);
    _setVal('mcSliderHue',       0);
    _setVal('mcSliderSat',       0);
    _setVal('mcSliderLight',     0);
    _setVal('mcSliderAlpha',     1.0);

    _setBrushTypeActive(brush.brushType || 'flatBrush');

    var nameEl  = document.getElementById('mcBrushName');
    var matEl   = document.getElementById('mcMatiereName');
    var hintEl  = document.getElementById('mcHintText');
    var panelEl = document.getElementById('mcBrushPanel');
    if (nameEl)  nameEl.textContent  = brush.name;
    if (matEl)   matEl.textContent   = brush.matiereName;
    if (hintEl) {
      hintEl.classList.remove('mc-hint-flash');
      void hintEl.offsetWidth;
      hintEl.textContent = brush.hint;
      hintEl.classList.add('mc-hint-flash');
    }
    if (panelEl) panelEl.style.setProperty('--mc-accent', brush.primaryColor);

    /* キャンバスオーバーレイ */
    var nameSmall = document.getElementById('mcBrushNameSmall');
    if (nameSmall) nameSmall.textContent = brush.name;

    setTimeout(function () { _refreshColorPreview(); _refreshPreview(); }, 50);
  }

  /* ================================================================
     カラーパレット
  ================================================================ */
  function updatePalette(colors, fallback) {
    _palette     = (colors && colors.length) ? colors : (fallback || []);
    _selectedIdx = 0;
    _renderPalette();
    if (_palette.length && _onColorSelect) {
      _onColorSelect(_palette[0].color);
      _refreshColorPreview();
    }
  }

  function _renderPalette() {
    var wrap = document.getElementById('mcPaletteSwatches');
    if (!wrap) return;
    if (!_palette.length) {
      wrap.innerHTML = '<p class="mc-palette-hint-text">絵をタップして色を選ぼう</p>';
      return;
    }
    wrap.innerHTML = _palette.map(function (item, i) {
      var active = i === _selectedIdx;
      var textColor = _isDark(item.color) ? '#fff' : '#333';
      return '<button class="mc-palette-swatch' + (active ? ' mc-palette-swatch--active' : '') + '"'
        + ' data-idx="' + i + '"'
        + ' style="background:' + _esc(item.color) + ';color:' + textColor + '"'
        + ' aria-label="' + _esc(item.label) + (active ? '（選択中）' : '') + '"'
        + ' aria-pressed="' + active + '"'
        + '>'
        + (active ? '<span class="mc-palette-check" aria-hidden="true">✓</span>' : '')
        + '<span class="mc-palette-label">' + _esc(item.label) + '</span>'
        + '</button>';
    }).join('');
    wrap.querySelectorAll('.mc-palette-swatch').forEach(function (btn) {
      btn.addEventListener('click', function () {
        _selectedIdx = parseInt(btn.dataset.idx, 10);
        var item = _palette[_selectedIdx];
        if (item && _onColorSelect) {
          _onColorSelect(item.color);
          _refreshColorPreview();
          var panelEl = document.getElementById('mcBrushPanel');
          if (panelEl) panelEl.style.setProperty('--mc-accent', item.color);
        }
        _renderPalette();
      });
    });
  }

  function _isDark(hex) {
    try {
      var h = hex.replace('#','');
      if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
      var r=parseInt(h.substr(0,2),16), g=parseInt(h.substr(2,2),16), b=parseInt(h.substr(4,2),16);
      return (0.299*r + 0.587*g + 0.114*b) < 128;
    } catch(e) { return false; }
  }

  function _esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  window.MatiereControls = { init: init, syncFromBrush: syncFromBrush, updatePalette: updatePalette };
})();
