/* KIRARA MUSE — ブラシ描画エンジン v2
   連続毛筋 / 入力平滑化対応 / ストローク入り抜き / シードランダム
---------------------------------------------------------------- */
(function () {
  'use strict';

  /* ================================================================
     ストローク状態（1ストローク中に持続）
  ================================================================ */
  var _strokeProgress  = 0;       /* 累積距離(px) */
  var _lastAngle       = 0;       /* 直前の角度(rad) */
  var _lastStampX      = null;    /* 直前スタンプ位置 */
  var _lastStampY      = null;
  var _baseX           = null;    /* ベースストローク用直前位置 */
  var _baseY           = null;

  /* 連続毛筋 */
  var _bristlePos      = [];      /* 各毛筋の直前描画端点 {x,y} */
  var _bristleCount    = 0;
  var _bristleNoise    = [];      /* 毛筋ごとの安定ランダム値 */
  var _strokeSeed      = 0;

  /* ================================================================
     シード付き乱数（ストローク中に安定したランダムを確保）
  ================================================================ */
  function _seededRandom(seed) {
    var s = seed;
    return function () {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  /* ================================================================
     beginStroke — ストローク開始
  ================================================================ */
  function beginStroke(params) {
    _strokeSeed      = Math.floor(Math.random() * 99999) + 1;
    _strokeProgress  = 0;
    _lastAngle       = 0;
    _lastStampX      = null;
    _lastStampY      = null;
    _baseX           = null;
    _baseY           = null;
    _bristlePos      = [];

    var size      = params.size || 40;
    var paintLoad = params.paintLoad !== undefined ? params.paintLoad : 0.65;
    var texture   = params.texture   || 0.28;
    var colorVar  = params.colorVariation || 0.12;
    var n = Math.max(4, Math.min(18, Math.round(size / 5)));
    _bristleCount = n;

    var rng = _seededRandom(_strokeSeed);
    _bristleNoise = [];
    for (var i = 0; i < n; i++) {
      var edge     = n > 1 ? Math.abs((i / (n - 1)) - 0.5) : 0;  /* 0:中央 0.5:端 */
      var skipBase = (1 - paintLoad) * texture * (0.25 + edge * 1.6);
      _bristleNoise.push({
        skip:     rng() < skipBase,
        widthMul: 0.40 + rng() * 0.60,
        alphaMul: 0.55 + rng() * 0.45,
        hShift:   (rng() - 0.5) * 2 * colorVar * 6,
        sShift:   (rng() - 0.5) * 2 * colorVar * 0.10,
        lShift:   (rng() - 0.5) * 2 * colorVar * 0.10,
      });
    }
  }

  /* ================================================================
     strokeTo — 平滑化済み座標を受け取りスタンプを打つ
  ================================================================ */
  function strokeTo(ctx, x, y, angle, speed, params, color, alpha) {
    if (_lastStampX === null) {
      /* 最初のスタンプ */
      _lastStampX = x;
      _lastStampY = y;
      _lastAngle  = angle;
      _stampBrush(ctx, x, y, angle, 0, speed, params, color, alpha, true);
      return;
    }

    var dx   = x - _lastStampX;
    var dy   = y - _lastStampY;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 0.08) return;

    var spacingPx = Math.max(0.3, (params.size || 40) * (params.spacing || 0.06) * 0.5);
    var steps     = Math.max(1, Math.ceil(dist / spacingPx));

    for (var i = 1; i <= steps; i++) {
      var t  = i / steps;
      _strokeProgress += spacingPx;
      _stampBrush(
        ctx,
        _lastStampX + dx * t,
        _lastStampY + dy * t,
        angle, _strokeProgress, speed, params, color, alpha, false
      );
    }

    _lastStampX = x;
    _lastStampY = y;
    _lastAngle  = angle;
  }

  /* ================================================================
     endStroke — 筆の抜き（テーパー）
  ================================================================ */
  function endStroke(ctx, x, y, angle, params, color, alpha) {
    var steps = 6;
    for (var i = 0; i < steps; i++) {
      var fade = 1 - (i + 1) / (steps + 1);
      var ex   = x + Math.cos(angle) * i * 3.5;
      var ey   = y + Math.sin(angle) * i * 3.5;
      var mp   = _mergeParams(params, {
        size:    params.size * (0.12 + fade * 0.88),
        opacity: params.opacity * fade
      });
      _strokeProgress += 3.5;
      _stampBrush(ctx, ex, ey, angle, _strokeProgress, 25, mp, color, alpha * fade * 0.55, false);
    }
  }

  /* ================================================================
     ディスパッチ
  ================================================================ */
  function _stampBrush(ctx, x, y, angle, progress, speed, params, color, alpha, isFirst) {
    var type = params.brushType || 'flatBrush';
    switch (type) {
      case 'flatBrush':    _flatBrush   (ctx, x, y, angle, progress, speed, params, color, alpha, isFirst); break;
      case 'dryFlatBrush': _dryFlatBrush(ctx, x, y, angle, progress, speed, params, color, alpha, isFirst); break;
      case 'roundBrush':   _roundBrush  (ctx, x, y, angle, progress, speed, params, color, alpha); break;
      case 'spongeBrush':  _spongeBrush (ctx, x, y, angle, progress, speed, params, color, alpha); break;
      case 'paletteKnife': _paletteKnife(ctx, x, y, angle, progress, speed, params, color, alpha); break;
      default:             _flatBrush   (ctx, x, y, angle, progress, speed, params, color, alpha, isFirst);
    }
  }

  /* ================================================================
     flatBrush — 平筆 (連続毛筋 + ソフトベース)
  ================================================================ */
  function _flatBrush(ctx, x, y, angle, progress, speed, params, color, alpha, isFirst) {
    var size      = params.size;
    var paintLoad = params.paintLoad !== undefined ? params.paintLoad : 0.65;
    var texture   = params.texture   || 0.28;
    var softness  = params.softness  || 0.25;
    var n         = _bristleCount   || 6;

    /* 法線ベクトル（ストロークに垂直な方向） */
    var normalX = -Math.sin(angle);
    var normalY =  Math.cos(angle);

    /* カーブ検出：前回角度との差 */
    var angleDiff = _normAngle(angle - _lastAngle);

    /* 速度係数: 速い→細くかすれる */
    var speedFactor = Math.max(0.55, Math.min(1.15, 1.0 - speed * 0.011));

    /* 描き始めのラップアップ */
    var startTaper  = Math.min(1.0, progress / Math.max(1, size * 0.5));
    var baseOpacity = params.opacity * alpha * (0.38 + startTaper * 0.62) * speedFactor;

    /* ───── ソフトベース（薄い帯） ───── */
    if (paintLoad > 0.35 && !isFirst && _baseX !== null) {
      ctx.save();
      ctx.globalAlpha = Math.min(0.09, baseOpacity * 0.07 * paintLoad);
      ctx.strokeStyle = color;
      ctx.lineWidth   = size * 0.82;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      if (softness > 0.2) {
        ctx.shadowColor = color;
        ctx.shadowBlur  = size * softness * 0.28;
      }
      ctx.beginPath();
      ctx.moveTo(_baseX, _baseY);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.restore();
    }
    _baseX = x;
    _baseY = y;

    /* ───── 毛筋 ───── */
    for (var b = 0; b < n; b++) {
      var noise = _bristleNoise[b] || { skip:false, widthMul:0.7, alphaMul:0.8, hShift:0, sShift:0, lShift:0 };
      if (noise.skip) continue;

      var t = n > 1 ? (b / (n - 1)) - 0.5 : 0;  /* -0.5〜0.5 */

      /* カーブの内側/外側 */
      /* t * angleDiff > 0 → 外側 */
      var curveFactor = Math.min(0.55, Math.abs(angleDiff) * 1.8);
      var outerMul    = (t * angleDiff > 0)
        ? (1 + curveFactor * 0.22)
        : (1 - curveFactor * 0.14);

      /* 毛筋位置（法線方向にオフセット + 微小ジッター） */
      var jitter = (Math.random() - 0.5) * size * 0.022 * texture;
      var bx = x + normalX * (t * size + jitter);
      var by = y + normalY * (t * size + jitter);

      /* 端部フェード */
      var edgeFade = 1 - Math.abs(t) * (0.28 + texture * 0.22);
      var bAlpha   = Math.min(0.95,
        baseOpacity * noise.alphaMul * edgeFade * outerMul
        * (0.70 + Math.random() * 0.30)
      );
      var bWidth = (size / n) * noise.widthMul * (0.45 + Math.random() * 0.55) * speedFactor;

      /* 毛筋ごとの安定色＋微小ゆらぎ */
      var jColor = _applyHslShift(color,
        noise.hShift + (Math.random() - 0.5) * 1.2,
        noise.sShift + (Math.random() - 0.5) * 0.018,
        noise.lShift + (Math.random() - 0.5) * 0.018
      );

      ctx.save();
      ctx.globalAlpha = bAlpha;
      ctx.lineWidth   = bWidth;
      ctx.lineCap     = 'round';

      if (_bristlePos[b] && !isFirst) {
        /* 前回位置から現在位置へ線を引く（連続毛筋） */
        ctx.strokeStyle = jColor;
        ctx.beginPath();
        ctx.moveTo(_bristlePos[b].x, _bristlePos[b].y);
        ctx.lineTo(bx, by);
        ctx.stroke();
      } else if (isFirst) {
        /* 最初は点 */
        ctx.fillStyle = jColor;
        ctx.beginPath();
        ctx.arc(bx, by, bWidth / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      _bristlePos[b] = { x: bx, y: by };
    }
  }

  /* ================================================================
     dryFlatBrush — 硬い平刷毛 (かすれが強い連続毛筋)
  ================================================================ */
  function _dryFlatBrush(ctx, x, y, angle, progress, speed, params, color, alpha, isFirst) {
    var size      = params.size;
    var paintLoad = params.paintLoad !== undefined ? params.paintLoad : 0.28;
    var texture   = params.texture   || 0.82;
    var n         = _bristleCount   || 6;

    var normalX = -Math.sin(angle);
    var normalY =  Math.cos(angle);

    var speedFactor = Math.max(0.45, Math.min(1.10, 1.0 - speed * 0.014));
    var startTaper  = Math.min(1.0, progress / Math.max(1, size * 0.3));
    var baseOpacity = params.opacity * alpha * (0.28 + startTaper * 0.72) * speedFactor;
    var dryness     = 1 - paintLoad;

    for (var b = 0; b < n; b++) {
      var noise = _bristleNoise[b] || { skip:false, widthMul:0.5, alphaMul:0.7, hShift:0, sShift:0, lShift:0 };

      var t         = n > 1 ? (b / (n - 1)) - 0.5 : 0;
      var edgeFactor = Math.abs(t);

      /* ストロークごとに動的にスキップ（かすれ） */
      var skipProb = dryness * texture * (0.45 + edgeFactor * 0.9) + (noise.skip ? 0.38 : 0);
      if (Math.random() < skipProb) {
        /* 位置はリセットしない → 再接続しやすくする */
        continue;
      }

      var jitter = (Math.random() - 0.5) * size * 0.033 * texture;
      var bx = x + normalX * (t * size + jitter);
      var by = y + normalY * (t * size + jitter);

      var edgeFade = 1 - edgeFactor * 0.38;
      var bAlpha   = Math.min(0.92,
        baseOpacity * noise.alphaMul * edgeFade * (0.52 + Math.random() * 0.48)
      );
      var bWidth = (size / n) * noise.widthMul * 0.52 * (0.38 + Math.random() * 0.62) * speedFactor;

      var jColor = _applyHslShift(color,
        noise.hShift + (Math.random() - 0.5) * 2.2,
        noise.sShift + (Math.random() - 0.5) * 0.028,
        noise.lShift + (Math.random() - 0.5) * 0.028
      );

      ctx.save();
      ctx.globalAlpha = bAlpha;
      ctx.lineWidth   = bWidth;
      ctx.lineCap     = 'butt';

      if (_bristlePos[b] && !isFirst && Math.random() > dryness * 0.45) {
        ctx.strokeStyle = jColor;
        ctx.beginPath();
        ctx.moveTo(_bristlePos[b].x, _bristlePos[b].y);
        ctx.lineTo(bx, by);
        ctx.stroke();
      } else if (isFirst) {
        ctx.fillStyle = jColor;
        ctx.beginPath();
        ctx.arc(bx, by, bWidth / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      _bristlePos[b] = { x: bx, y: by };
    }
  }

  /* ================================================================
     roundBrush — 丸筆
  ================================================================ */
  function _roundBrush(ctx, x, y, angle, progress, speed, params, color, alpha) {
    var size      = params.size;
    var paintLoad = params.paintLoad !== undefined ? params.paintLoad : 0.62;
    var texture   = params.texture   || 0.22;
    var colorVar  = params.colorVariation || 0.08;
    var softness  = params.softness  || 0.35;

    var speedFactor = Math.max(0.55, Math.min(1.15, 1.0 - speed * 0.012));
    var startTaper  = Math.min(1.0, progress / Math.max(1, size * 0.4));
    var baseOpacity = params.opacity * alpha * (0.45 + startTaper * 0.55) * speedFactor;

    if (Math.random() < (1 - paintLoad) * texture * 0.5) return;

    var rx = size * (0.30 + Math.random() * 0.16) * speedFactor;
    var ry = size * (0.18 + Math.random() * 0.10);

    var jColor = _jitterHsl(color, colorVar * 4, colorVar * 0.06, colorVar * 0.07);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    if (softness > 0.25) {
      ctx.shadowColor = jColor;
      ctx.shadowBlur  = ry * softness * 3.2;
    }
    ctx.globalAlpha = Math.min(0.96, baseOpacity * (0.76 + Math.random() * 0.24));
    ctx.fillStyle   = jColor;
    ctx.beginPath();
    _drawEllipse(ctx, 0, 0, rx, ry);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  /* ================================================================
     spongeBrush — スポンジ
  ================================================================ */
  function _spongeBrush(ctx, x, y, angle, progress, speed, params, color, alpha) {
    var size      = params.size;
    var paintLoad = params.paintLoad !== undefined ? params.paintLoad : 0.58;
    var texture   = params.texture   || 0.72;
    var colorVar  = params.colorVariation || 0.14;
    var softness  = params.softness  || 0.58;

    var baseOpacity = params.opacity * alpha;
    var dotCount    = Math.max(4, Math.round(size / 9 + Math.random() * 5));
    var dryness     = 1 - paintLoad;

    for (var i = 0; i < dotCount; i++) {
      var r     = size * 0.5 * (0.1 + Math.random() * 0.9);
      var theta = Math.random() * Math.PI * 2;
      var sx    = x + Math.cos(theta) * r;
      var sy    = y + Math.sin(theta) * r;

      if (Math.random() < dryness * texture * 0.62) continue;

      var dotR     = size * (0.06 + Math.random() * 0.20);
      var distFade = 1 - r / (size * 0.5);
      var dotAlpha = Math.min(0.94,
        baseOpacity * (0.42 + Math.random() * 0.58) * (0.32 + distFade * 0.68)
      );
      var jColor = _jitterHsl(color, colorVar * 7, colorVar * 0.12, colorVar * 0.10);

      ctx.save();
      if (softness > 0.2) {
        ctx.shadowColor = jColor;
        ctx.shadowBlur  = dotR * softness * 2.8;
      }
      ctx.globalAlpha = dotAlpha;
      ctx.fillStyle   = jColor;
      ctx.beginPath();
      ctx.arc(sx, sy, dotR, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    }
  }

  /* ================================================================
     paletteKnife — パレットナイフ
  ================================================================ */
  function _paletteKnife(ctx, x, y, angle, progress, speed, params, color, alpha) {
    var size      = params.size;
    var paintLoad = params.paintLoad !== undefined ? params.paintLoad : 0.90;
    var texture   = params.texture   || 0.45;
    var colorVar  = params.colorVariation || 0.06;

    var startTaper  = Math.min(1.0, progress / Math.max(1, size * 0.25));
    var baseOpacity = params.opacity * alpha * (0.62 + startTaper * 0.38);

    var spacingPx = Math.max(0.5, size * (params.spacing || 0.12) * 0.5);
    var knifeW    = spacingPx * 3.2;
    var knifeH    = size * (0.07 + Math.random() * 0.05);

    var mainColor = _jitterHsl(color, colorVar * 3, colorVar * 0.05, colorVar * 0.05);
    var edgeColor = _lightenOrDarken(mainColor, -0.08);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.globalAlpha = Math.min(0.96, baseOpacity * 0.88);
    ctx.fillStyle   = mainColor;
    ctx.beginPath();
    ctx.rect(-knifeW * 0.46, -knifeH * 0.5, knifeW * 0.92, knifeH);
    ctx.fill();

    ctx.globalAlpha = Math.min(0.96, baseOpacity);
    ctx.strokeStyle = edgeColor;
    ctx.lineWidth   = Math.max(0.8, knifeH * 0.25);
    ctx.lineCap     = 'square';
    ctx.beginPath(); ctx.moveTo(-knifeW * 0.46, -knifeH * 0.5); ctx.lineTo(knifeW * 0.46, -knifeH * 0.5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-knifeW * 0.46,  knifeH * 0.5); ctx.lineTo(knifeW * 0.46,  knifeH * 0.5); ctx.stroke();

    if (texture > 0.25 && Math.random() < texture * 0.38) {
      var scrY = (Math.random() - 0.5) * knifeH * 0.55;
      ctx.globalAlpha = baseOpacity * 0.26;
      ctx.strokeStyle = _jitterHsl(color, colorVar * 5, 0, 0);
      ctx.lineWidth   = 0.5 + Math.random() * 1.2;
      ctx.beginPath(); ctx.moveTo(-knifeW * 0.38, scrY); ctx.lineTo(knifeW * 0.38, scrY); ctx.stroke();
    }

    ctx.restore();
  }

  /* ================================================================
     drawPreview — コントロールパネル内プレビュー (S字カーブ)
  ================================================================ */
  function drawPreview(canvas, params, color) {
    if (!canvas || !params || !color) return;

    /* ストローク状態を保存 */
    var sv = {
      prog: _strokeProgress, angle: _lastAngle,
      lx: _lastStampX, ly: _lastStampY,
      bx: _baseX, by: _baseY,
      bpos: _bristlePos.map(function(p){ return p ? {x:p.x,y:p.y} : null; }),
      bn:   _bristleNoise.slice(),
      bc:   _bristleCount,
      seed: _strokeSeed
    };

    var w = canvas.clientWidth  || canvas.width  || 200;
    var h = canvas.clientHeight || canvas.height || 70;
    canvas.width  = w;
    canvas.height = h;

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#fffcf5';
    ctx.fillRect(0, 0, w, h);

    /* プレビュー用スケール */
    var scale   = Math.min(1.0, (h * 0.60) / Math.max(1, params.size));
    var pParams = _mergeParams(params, { size: params.size * scale });

    /* S字カーブのポイント列を生成 */
    var pts = _genSCurve(w, h, 10);

    beginStroke(pParams);

    for (var i = 1; i < pts.length; i++) {
      var dx = pts[i].x - pts[i-1].x;
      var dy = pts[i].y - pts[i-1].y;
      var spd = Math.sqrt(dx*dx + dy*dy);
      strokeTo(ctx, pts[i].x, pts[i].y, Math.atan2(dy, dx), spd, pParams, color, 1.0);
    }
    var last = pts[pts.length - 1];
    var prev = pts[pts.length - 2];
    endStroke(ctx, last.x, last.y, Math.atan2(last.y - prev.y, last.x - prev.x), pParams, color, 1.0);

    /* ストローク状態を復元 */
    _strokeProgress = sv.prog;
    _lastAngle      = sv.angle;
    _lastStampX     = sv.lx;
    _lastStampY     = sv.ly;
    _baseX          = sv.bx;
    _baseY          = sv.by;
    _bristlePos     = sv.bpos;
    _bristleNoise   = sv.bn;
    _bristleCount   = sv.bc;
    _strokeSeed     = sv.seed;
  }

  function _genSCurve(w, h, margin) {
    var pts  = [];
    var steps = 80;
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      pts.push({
        x: margin + (w - margin * 2) * t,
        y: h / 2 + Math.sin(t * Math.PI * 2.5) * (h * 0.30)
      });
    }
    return pts;
  }

  /* ================================================================
     ユーティリティ
  ================================================================ */
  function _normAngle(a) {
    while (a >  Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    return a;
  }

  function _drawEllipse(ctx, cx, cy, rx, ry) {
    if (ctx.ellipse) {
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    } else {
      var k = 0.5523;
      ctx.moveTo(cx, cy - ry);
      ctx.bezierCurveTo(cx+rx*k,cy-ry, cx+rx,cy-ry*k, cx+rx,cy);
      ctx.bezierCurveTo(cx+rx,cy+ry*k, cx+rx*k,cy+ry, cx,cy+ry);
      ctx.bezierCurveTo(cx-rx*k,cy+ry, cx-rx,cy+ry*k, cx-rx,cy);
      ctx.bezierCurveTo(cx-rx,cy-ry*k, cx-rx*k,cy-ry, cx,cy-ry);
      ctx.closePath();
    }
  }

  function _mergeParams(src, overrides) {
    var out = {};
    for (var k in src) if (Object.prototype.hasOwnProperty.call(src, k)) out[k] = src[k];
    for (var k in overrides) if (Object.prototype.hasOwnProperty.call(overrides, k)) out[k] = overrides[k];
    return out;
  }

  /* HSL 変換 */
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
  function _jitterHsl(hex, hR, sR, lR) {
    var hsl=_hexToHsl(hex);
    return _hslToHex(
      (hsl[0]+(Math.random()-0.5)*2*hR+360)%360,
      Math.max(0,Math.min(1,hsl[1]+(Math.random()-0.5)*2*sR)),
      Math.max(0,Math.min(1,hsl[2]+(Math.random()-0.5)*2*lR))
    );
  }
  function _applyHslShift(hex, hShift, sShift, lShift) {
    var hsl=_hexToHsl(hex);
    return _hslToHex(
      (hsl[0]+hShift+360)%360,
      Math.max(0,Math.min(1,hsl[1]+sShift)),
      Math.max(0,Math.min(1,hsl[2]+lShift))
    );
  }
  function _lightenOrDarken(hex, amt) {
    var hsl=_hexToHsl(hex);
    return _hslToHex(hsl[0], hsl[1], Math.max(0,Math.min(1,hsl[2]+amt)));
  }

  /* ================================================================
     公開 API
  ================================================================ */
  window.BrushEngine = {
    beginStroke: beginStroke,   /* (params) */
    strokeTo:    strokeTo,      /* (ctx, x, y, angle, speed, params, color, alpha) */
    endStroke:   endStroke,     /* (ctx, x, y, angle, params, color, alpha) */
    drawPreview: drawPreview    /* (canvas, params, color) */
  };

})();
