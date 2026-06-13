/* KIRARA MUSE — Canvas 描画エンジン v4
   入力平滑化 + BrushEngine.strokeTo 連携
---------------------------------------------------------------- */
(function () {
  'use strict';

  var _canvas = null, _ctx = null, _dpr = 1;
  var _brush     = null;
  var _overrides = {};
  var _isEraser  = false;
  var _drawing   = false;

  /* 生座標（消しゴム用） */
  var _lastX = 0, _lastY = 0;

  /* 平滑化後の座標 */
  var _smoothX = 0, _smoothY = 0;
  var _lastSmX = 0, _lastSmY = 0;
  var _lastAngle = 0;

  var _undoStack = [], MAX_UNDO = 20;

  /* ブラシ種別ごとの平滑化係数 */
  var SMOOTH_FACTORS = {
    flatBrush:    0.22,
    dryFlatBrush: 0.28,
    roundBrush:   0.30,
    spongeBrush:  0.40,
    paletteKnife: 0.18
  };

  /* ---- init ---- */
  function init(canvasEl, initialBrush) {
    _canvas = canvasEl;
    _ctx    = canvasEl.getContext('2d');
    _dpr    = Math.min(window.devicePixelRatio || 1, 2); /* 最大2倍に制限 */
    _brush  = initialBrush;
    _overrides = {};

    _ctx.imageSmoothingEnabled = true;

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(function () { _resize(); }).observe(canvasEl.parentElement);
    } else {
      window.addEventListener('resize', _resize);
    }
    _resize();

    canvasEl.addEventListener('pointerdown',   _onDown);
    canvasEl.addEventListener('pointermove',   _onMove);
    canvasEl.addEventListener('pointerup',     _onUp);
    canvasEl.addEventListener('pointercancel', _onUp);
    canvasEl.addEventListener('touchstart', function (e) { e.preventDefault(); }, { passive: false });
    canvasEl.addEventListener('touchmove',  function (e) { e.preventDefault(); }, { passive: false });
  }

  /* ---- resize ---- */
  function _resize() {
    if (!_canvas) return;
    var p = _canvas.parentElement;
    var w = p.clientWidth, h = p.clientHeight;
    if (w < 1 || h < 1) return;
    var saved = (_canvas.width > 0 && _canvas.height > 0)
      ? _ctx.getImageData(0, 0, _canvas.width, _canvas.height) : null;
    _canvas.width  = Math.round(w * _dpr);
    _canvas.height = Math.round(h * _dpr);
    _canvas.style.width  = w + 'px';
    _canvas.style.height = h + 'px';
    _ctx.setTransform(1, 0, 0, 1, 0, 0);
    _ctx.scale(_dpr, _dpr);
    _fillBg();
    if (saved) _ctx.putImageData(saved, 0, 0);
  }

  function _fillBg() {
    _ctx.fillStyle = '#fffcf5';
    _ctx.fillRect(0, 0, _canvas.width, _canvas.height);
  }

  /* ---- params / color ---- */
  function _getParams() {
    var base = (_brush && _brush.params)
      ? _brush.params
      : { size:40, opacity:0.60, softness:0.50, texture:0.30, colorVariation:0.15, spacing:0.12, paintLoad:0.65 };
    return {
      brushType:      _overrides.brushType      !== undefined ? _overrides.brushType      : ((_brush && _brush.brushType) || 'flatBrush'),
      size:           _overrides.size           !== undefined ? _overrides.size           : base.size,
      opacity:        _overrides.opacity        !== undefined ? _overrides.opacity        : base.opacity,
      softness:       _overrides.softness       !== undefined ? _overrides.softness       : base.softness,
      texture:        _overrides.texture        !== undefined ? _overrides.texture        : base.texture,
      colorVariation: _overrides.colorVariation !== undefined ? _overrides.colorVariation : base.colorVariation,
      spacing:        _overrides.spacing        !== undefined ? _overrides.spacing        : base.spacing,
      paintLoad:      _overrides.paintLoad      !== undefined ? _overrides.paintLoad      : (base.paintLoad !== undefined ? base.paintLoad : 0.65)
    };
  }

  function _getActiveColor() {
    var base = _overrides.color || (_brush && _brush.primaryColor) || '#6AACE0';
    var hsl  = _hexToHsl(base);
    var h = (hsl[0] + (_overrides.hueShift    || 0) + 360) % 360;
    var s = Math.max(0, Math.min(1, hsl[1] * (1 + (_overrides.satMul    || 0))));
    var l = Math.max(0, Math.min(1, hsl[2]    + (_overrides.lightShift || 0)));
    return _hslToHex(h, s, l);
  }

  function _getEffectiveAlpha() {
    return _overrides.alpha !== undefined ? _overrides.alpha : 1.0;
  }

  function _getSmoothingFactor() {
    return SMOOTH_FACTORS[_getParams().brushType] || 0.25;
  }

  /* ---- pointer handlers ---- */
  function _onDown(e) {
    e.preventDefault();
    _drawing = true;
    _canvas.setPointerCapture(e.pointerId);
    _saveSnapshot();
    var p = _pos(e);
    _lastX = p.x; _lastY = p.y;
    _smoothX = p.x; _smoothY = p.y;
    _lastSmX = p.x; _lastSmY = p.y;
    _lastAngle = 0;

    if (_isEraser) {
      _eraseAt(p.x, p.y);
    } else if (typeof BrushEngine !== 'undefined') {
      var params = _getParams();
      BrushEngine.beginStroke(params);
      BrushEngine.strokeTo(_ctx, p.x, p.y, 0, 0, params, _getActiveColor(), _getEffectiveAlpha());
    }
  }

  function _onMove(e) {
    if (!_drawing) return;
    e.preventDefault();
    var raw = _pos(e);

    /* ローパスフィルタ（指数移動平均） */
    var sf = _getSmoothingFactor();
    _smoothX += (raw.x - _smoothX) * sf;
    _smoothY += (raw.y - _smoothY) * sf;

    /* 速度と角度の計算 */
    var dx    = _smoothX - _lastSmX;
    var dy    = _smoothY - _lastSmY;
    var speed = Math.sqrt(dx * dx + dy * dy);
    var angle = speed > 0.08 ? Math.atan2(dy, dx) : _lastAngle;

    if (_isEraser) {
      _eraseStroke(_lastX, _lastY, raw.x, raw.y);
    } else if (typeof BrushEngine !== 'undefined') {
      BrushEngine.strokeTo(
        _ctx, _smoothX, _smoothY, angle, speed,
        _getParams(), _getActiveColor(), _getEffectiveAlpha()
      );
    }

    _lastX = raw.x;  _lastY = raw.y;
    _lastSmX = _smoothX; _lastSmY = _smoothY;
    _lastAngle = angle;
  }

  function _onUp() {
    if (_drawing && !_isEraser && typeof BrushEngine !== 'undefined') {
      BrushEngine.endStroke(
        _ctx, _smoothX, _smoothY, _lastAngle,
        _getParams(), _getActiveColor(), _getEffectiveAlpha()
      );
    }
    _drawing = false;
  }

  function _pos(e) {
    var r = _canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  /* ---- undo ---- */
  function _saveSnapshot() {
    _undoStack.push(_ctx.getImageData(0, 0, _canvas.width, _canvas.height));
    if (_undoStack.length > MAX_UNDO) _undoStack.shift();
  }

  /* ---- eraser ---- */
  function _eraseAt(x, y) {
    var sz = _overrides.size || (_brush && _brush.params ? _brush.params.size : 28);
    _ctx.save();
    _ctx.globalCompositeOperation = 'source-over';
    _ctx.fillStyle = '#fffcf5';
    _ctx.beginPath(); _ctx.arc(x, y, sz * 0.7, 0, Math.PI * 2); _ctx.fill();
    _ctx.restore();
  }
  function _eraseStroke(x1, y1, x2, y2) {
    var sz = _overrides.size || (_brush && _brush.params ? _brush.params.size : 28);
    _ctx.save();
    _ctx.globalCompositeOperation = 'source-over';
    _ctx.strokeStyle = '#fffcf5';
    _ctx.lineWidth   = sz * 1.4;
    _ctx.lineCap = _ctx.lineJoin = 'round';
    _ctx.beginPath(); _ctx.moveTo(x1, y1); _ctx.lineTo(x2, y2); _ctx.stroke();
    _ctx.restore();
  }

  /* ---- HSL utilities ---- */
  function _hexToHsl(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    var r=parseInt(hex.substr(0,2),16)/255, g=parseInt(hex.substr(2,2),16)/255, b=parseInt(hex.substr(4,2),16)/255;
    var mx=Math.max(r,g,b), mn=Math.min(r,g,b), l=(mx+mn)/2, h=0, s=0;
    if (mx !== mn) {
      var d=mx-mn;
      s = l>0.5 ? d/(2-mx-mn) : d/(mx+mn);
      switch(mx){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;default:h=((r-g)/d+4)/6;}
    }
    return [h*360, s, l];
  }
  function _hslToHex(h, s, l) {
    h/=360;
    function hue2rgb(p,q,t){if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;}
    var r,g,b;
    if(s===0){r=g=b=l;}else{var q=l<0.5?l*(1+s):l+s-l*s,pp=2*l-q;r=hue2rgb(pp,q,h+1/3);g=hue2rgb(pp,q,h);b=hue2rgb(pp,q,h-1/3);}
    return '#'+[r,g,b].map(function(v){return('0'+Math.round(v*255).toString(16)).slice(-2);}).join('');
  }

  /* ---- public API ---- */
  function setBrush(brush)    { _brush = brush; _overrides = {}; }
  function setParam(key, val) { _overrides[key] = val; }
  function setColor(color) {
    _overrides.color      = color;
    _overrides.hueShift   = 0;
    _overrides.satMul     = 0;
    _overrides.lightShift = 0;
  }
  function setEraser(on)      { _isEraser = on; }
  function getActiveColor()   { return _getActiveColor(); }
  function getParams()        { return _getParams(); }
  function isDrawing()        { return _drawing; }
  function undo() {
    if (!_undoStack.length) return;
    _ctx.putImageData(_undoStack.pop(), 0, 0);
  }
  function clear() {
    _saveSnapshot();
    _ctx.clearRect(0, 0, _canvas.width / _dpr, _canvas.height / _dpr);
    _fillBg();
  }
  function saveAsImage() {
    var link = document.createElement('a');
    link.download = 'kirara-muse-drawing.png';
    link.href     = _canvas.toDataURL('image/png');
    link.click();
  }

  window.MatiereCanvas = {
    init: init, setBrush: setBrush, setParam: setParam, setColor: setColor,
    setEraser: setEraser, getActiveColor: getActiveColor, getParams: getParams,
    isDrawing: isDrawing, undo: undo, clear: clear, saveAsImage: saveAsImage
  };
})();
