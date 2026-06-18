/* KIRARA MUSE — エリア判定・ブラシ選択エンジン */
(function () {
  'use strict';

  var _config = null;
  var _onPick = null;

  function init(config, onPickCallback) {
    _config = config;
    _onPick = onPickCallback;
  }

  /* xPct, yPct : 0–100 の %座標 */
  function pickArea(xPct, yPct) {
    if (!_config) return null;
    var areas = _config.areas;
    for (var i = 0; i < areas.length; i++) {
      var r = areas[i].rect;
      if (xPct >= r.x && xPct <= r.x + r.w &&
          yPct >= r.y && yPct <= r.y + r.h) {
        var brush = _config.brushPresets[areas[i].brushId];
        if (brush && _onPick) _onPick(brush, areas[i]);
        return { brush: brush, area: areas[i], xPct: xPct, yPct: yPct };
      }
    }
    return null;
  }

  /* pointer/touch/click イベントから %座標を計算してエリア判定 */
  function handleTap(e, imgEl) {
    e.preventDefault();
    var rect = imgEl.getBoundingClientRect();
    var src  = e.changedTouches ? e.changedTouches[0]
             : e.touches       ? e.touches[0]
             : e;
    var xPct = (src.clientX - rect.left) / rect.width  * 100;
    var yPct = (src.clientY - rect.top)  / rect.height * 100;
    xPct = Math.max(0, Math.min(100, xPct));
    yPct = Math.max(0, Math.min(100, yPct));
    return pickArea(xPct, yPct);
  }

  window.MatierePicker = { init: init, pickArea: pickArea, handleTap: handleTap };
})();
