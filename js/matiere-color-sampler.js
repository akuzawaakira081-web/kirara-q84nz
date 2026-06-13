/* KIRARA MUSE — 参考画像 色サンプラー */
(function () {
  'use strict';

  var _offCanvas = null, _offCtx = null, _ready = false;

  function init(imgEl) {
    try {
      _offCanvas = document.createElement('canvas');
      _offCtx    = _offCanvas.getContext('2d');
      if (imgEl.complete && imgEl.naturalWidth > 0) {
        _draw(imgEl);
      } else {
        imgEl.addEventListener('load', function () { _draw(imgEl); });
      }
    } catch (e) { /* canvas not supported */ }
  }

  function _draw(imgEl) {
    try {
      _offCanvas.width  = imgEl.naturalWidth;
      _offCanvas.height = imgEl.naturalHeight;
      _offCtx.drawImage(imgEl, 0, 0);
      _offCtx.getImageData(0, 0, 1, 1); /* CORS test */
      _ready = true;
    } catch (e) { /* CORS or security error — sampler disabled gracefully */ }
  }

  /* xPct/yPct: 0-100, radius in full-res image pixels */
  function sample(xPct, yPct, radius) {
    if (!_ready) return null;
    radius = radius || 14;
    var cx = Math.round(xPct / 100 * _offCanvas.width);
    var cy = Math.round(yPct / 100 * _offCanvas.height);
    var x0 = Math.max(0, cx - radius);
    var y0 = Math.max(0, cy - radius);
    var w  = Math.min(_offCanvas.width  - x0, radius * 2 + 1);
    var h  = Math.min(_offCanvas.height - y0, radius * 2 + 1);
    if (w < 1 || h < 1) return null;

    var data;
    try { data = _offCtx.getImageData(x0, y0, w, h).data; }
    catch (e) { _ready = false; return null; }

    var pixels = [];
    for (var i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 200) continue;
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }
    if (pixels.length < 4) return null;
    return _extract(pixels);
  }

  function _extract(px) {
    var n = px.length;
    var sR = 0, sG = 0, sB = 0;
    px.forEach(function (p) { sR += p[0]; sG += p[1]; sB += p[2]; });
    var avg    = [Math.round(sR / n), Math.round(sG / n), Math.round(sB / n)];
    var bright = px.reduce(function (b, p) { return _luma(p) > _luma(b) ? p : b; });
    var dark   = px.reduce(function (b, p) { return _luma(p) < _luma(b) ? p : b; });
    var vivid  = px.reduce(function (b, p) { return _sat(p)  > _sat(b)  ? p : b; });
    var accent = px.reduce(function (b, p) { return _dist(p, avg) > _dist(b, avg) ? p : b; });

    return [
      { label: 'メイン',       color: _toHex(avg)    },
      { label: '光',           color: _toHex(bright) },
      { label: '影',           color: _toHex(dark)   },
      { label: 'となりの色',   color: _toHex(vivid)  },
      { label: 'アクセント',   color: _toHex(accent) }
    ];
  }

  function _luma(p) { return 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]; }
  function _sat(p) {
    var r = p[0] / 255, g = p[1] / 255, b = p[2] / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    return mx === 0 ? 0 : (mx - mn) / mx;
  }
  function _dist(a, b) {
    return Math.sqrt(
      (a[0]-b[0])*(a[0]-b[0]) + (a[1]-b[1])*(a[1]-b[1]) + (a[2]-b[2])*(a[2]-b[2])
    );
  }
  function _toHex(p) {
    return '#' + p.map(function (v) {
      return ('0' + Math.max(0, Math.min(255, Math.round(v))).toString(16)).slice(-2);
    }).join('');
  }

  window.MatiereColorSampler = { init: init, sample: sample };
})();
