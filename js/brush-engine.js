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
  function strokeTo(ctx, x, y, angle, speed, params, color, alpha, secondColor) {
    if (_lastStampX === null) {
      _lastStampX = x;
      _lastStampY = y;
      _lastAngle  = angle;
      _stampBrush(ctx, x, y, angle, 0, speed, params, color, alpha, true, secondColor);
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
        angle, _strokeProgress, speed, params, color, alpha, false, secondColor
      );
    }

    _lastStampX = x;
    _lastStampY = y;
    _lastAngle  = angle;
  }

  /* ================================================================
     endStroke — 筆の抜き（テーパー）
  ================================================================ */
  function endStroke(ctx, x, y, angle, params, color, alpha, secondColor) {
    var isRound  = (params.brushType === 'roundBrush');
    var steps    = isRound ? 3  : 12;
    var exponent = isRound ? 4.0 : 1.8;
    var stepDist = Math.max(1.2, params.size * (params.spacing || 0.06) * 0.5);
    for (var i = 0; i < steps; i++) {
      var t    = (i + 1) / steps;
      var fade = Math.pow(1 - t, exponent);
      var ex   = x + Math.cos(angle) * i * stepDist;
      var ey   = y + Math.sin(angle) * i * stepDist;
      var mp   = _mergeParams(params, {
        size:    params.size * (0.06 + fade * 0.94),
        opacity: params.opacity * fade
      });
      _strokeProgress += stepDist;
      _stampBrush(ctx, ex, ey, angle, _strokeProgress, 25, mp, color, alpha * fade, false, secondColor);
    }

    /* 丸筆：毛先のかすれ（筆を離す瞬間に毛が広がる） */
    if (isRound) {
      _roundBrushTipFraying(ctx, x, y, angle, params, color, alpha);
    }
  }

  function _roundBrushTipFraying(ctx, x, y, angle, params, color, alpha) {
    var size     = params.size;
    var texture  = params.texture || 0.22;
    var colorVar = params.colorVariation || 0.08;
    var baseOp   = params.opacity * alpha;
    var count    = Math.max(5, Math.round(size * 0.22 + texture * 12));
    var normalX  = -Math.sin(angle);
    var normalY  =  Math.cos(angle);

    for (var i = 0; i < count; i++) {
      var spread   = (Math.random() - 0.5) * size * 0.9;
      var bx0      = x + normalX * spread;
      var by0      = y + normalY * spread;
      /* 毛先を長く伸ばす */
      var len      = size * (0.65 + Math.random() * 1.10);  /* 長く */
      var edgeFade = Math.max(0, 1 - Math.abs(spread) / (size * 0.5));
      var baseW    = size * (0.018 + Math.random() * 0.022); /* 根元の太さ */
      var bAlpha   = Math.max(0, baseOp * (0.18 + Math.random() * 0.32) * edgeFade);
      var jColor   = _jitterHsl(color, colorVar * 5, colorVar * 0.06, (Math.random() - 0.5) * 0.14);

      /* 根元→先端を10セグメントで極端にとがらせる */
      var segs = 10;
      for (var s = 0; s < segs; s++) {
        var t0    = s / segs, t1 = (s + 1) / segs;
        var taper = Math.pow(1 - t1, 3.5);           /* 指数を大きくして先端を極細に */
        ctx.save();
        ctx.globalAlpha = bAlpha * Math.pow(1 - t1, 0.6);
        ctx.strokeStyle = jColor;
        ctx.lineWidth   = Math.max(0.15, baseW * taper);
        ctx.lineCap     = s === segs - 1 ? 'round' : 'butt';
        ctx.beginPath();
        ctx.moveTo(bx0 + Math.cos(angle) * len * t0, by0 + Math.sin(angle) * len * t0);
        ctx.lineTo(bx0 + Math.cos(angle) * len * t1, by0 + Math.sin(angle) * len * t1);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  /* ================================================================
     ディスパッチ
  ================================================================ */
  function _stampBrush(ctx, x, y, angle, progress, speed, params, color, alpha, isFirst, secondColor) {
    var type = params.brushType || 'flatBrush';
    switch (type) {
      case 'flatBrush':    _flatBrush   (ctx, x, y, angle, progress, speed, params, color, alpha, isFirst); break;
      case 'dryFlatBrush': _dryFlatBrush(ctx, x, y, angle, progress, speed, params, color, alpha, isFirst); break;
      case 'roundBrush':   _roundBrush  (ctx, x, y, angle, progress, speed, params, color, alpha); break;
      case 'spongeBrush':  _spongeBrush (ctx, x, y, angle, progress, speed, params, color, alpha); break;
      case 'poshBrush':    _poshBrush   (ctx, x, y, angle, progress, speed, params, color, alpha); break;
      case 'dualBrush':    _dualBrush   (ctx, x, y, angle, progress, speed, params, color, alpha, isFirst, secondColor || color); break;
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
     poshBrush — ポッシュ（歯ブラシしぶきブラシ）
     歯ブラシの毛先を弾いたときの飛沫・しぶきを再現する
  ================================================================ */

  /* ポッシュ定数 */
  var POSH_MAX_PARTICLES   = 90;
  var POSH_DEFAULT_SIZE    = 36;
  var POSH_DEFAULT_DENSITY = 28;
  var POSH_DEFAULT_SPREAD  = 45;
  var POSH_PARTICLE_VAR    = 0.65;

  function _clamp(v, mn, mx) { return Math.min(Math.max(v, mn), mx); }
  function _randBetween(mn, mx, rng) { return mn + (rng ? rng() : Math.random()) * (mx - mn); }

  /* 粒のサイズを大中小微細でランダムに決める */
  function _poshParticleRadius(baseSize, rng) {
    var roll = rng();
    var r;
    if (roll < 0.60)      r = _randBetween(baseSize * 0.015, baseSize * 0.055, rng);
    else if (roll < 0.86) r = _randBetween(baseSize * 0.050, baseSize * 0.100, rng);
    else if (roll < 0.97) r = _randBetween(baseSize * 0.100, baseSize * 0.180, rng);
    else                  r = _randBetween(baseSize * 0.180, baseSize * 0.300, rng);
    return Math.max(0.5, r);
  }

  /* 1粒を描画（丸 or 楕円） */
  function _poshDrawParticle(ctx, px, py, radius, rotation, useEllipse, opacity, color, rng) {
    ctx.save();
    ctx.globalAlpha = _clamp(opacity, 0, 1);
    ctx.fillStyle   = color;
    if (useEllipse) {
      ctx.translate(px, py);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0,
        radius * _randBetween(1.2, 2.3, rng),
        radius * _randBetween(0.55, 1.0, rng),
        0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function _poshBrush(ctx, x, y, angle, progress, speed, params, color, alpha) {
    var size     = params.size     || POSH_DEFAULT_SIZE;
    var opacity  = params.opacity  !== undefined ? params.opacity  : 0.8;
    var density  = params.density  !== undefined ? params.density  : POSH_DEFAULT_DENSITY;
    var spread   = params.spread   !== undefined ? params.spread   : POSH_DEFAULT_SPREAD;
    var colorVar = params.colorVariation || 0.10;

    /* ドラッグ速度（0〜1） */
    var velocity = _clamp(speed / 1.5, 0, 1);

    /* 速いほど粒が広がり細かくなる、遅いほどまとまって大きめ */
    var spreadMod = spread * (0.70 + velocity * 0.60);
    var sizeMod   = size   * (1.00 - velocity * 0.30);

    /* 粒数 */
    var requested     = Math.round(density * (0.75 + velocity * 0.50) * (0.80 + Math.random() * 0.40));
    var particleCount = Math.min(requested, POSH_MAX_PARTICLES);

    /* 移動方向ベクトル（正規化） */
    var dirLen = Math.max(0.001, Math.sqrt(
      Math.cos(angle) * Math.cos(angle) + Math.sin(angle) * Math.sin(angle)
    ));
    var dirX = Math.cos(angle) / dirLen;
    var dirY = Math.sin(angle) / dirLen;

    /* シードランダム（ストローク中は安定した結果を得るため） */
    var rng = _seededRandom(_strokeSeed + Math.floor(progress * 7));

    for (var i = 0; i < particleCount; i++) {
      /* 中心ほど密な分布 */
      var pAngle = rng() * Math.PI * 2;
      var normDist = Math.pow(rng(), 1.7);
      var dist     = normDist * spreadMod;
      var offsetX  = Math.cos(pAngle) * dist;
      var offsetY  = Math.sin(pAngle) * dist;

      /* 移動方向への引き */
      var directionalForce = velocity * spreadMod * 0.45;
      var px = x + offsetX + dirX * directionalForce * rng();
      var py = y + offsetY + dirY * directionalForce * rng();

      /* 粒サイズ */
      var radius = _poshParticleRadius(sizeMod, rng);

      /* 楕円か丸か（12%を楕円、速いほど増える） */
      var ellipseProb = 0.12 + velocity * 0.10;
      var useEllipse  = rng() < ellipseProb;

      /* 楕円の向きはドラッグ方向 ± 少しゆらぎ */
      var rotation = angle + _randBetween(-0.35, 0.35, rng);

      /* 粒ごとの濃淡（小さい粒は薄め） */
      var sizeRatio       = radius / (sizeMod * 0.3 + 0.001);
      var particleOpacity = opacity * _randBetween(0.45, 1.0, rng) * _clamp(0.5 + sizeRatio * 0.5, 0.3, 1.0);

      /* 色ゆらぎ */
      var pColor = _jitterHsl(color, colorVar * 8, colorVar * 0.12, colorVar * 0.10);

      _poshDrawParticle(ctx, px, py, radius, rotation, useEllipse,
        particleOpacity * alpha, pColor, rng);
    }
  }

  /* ================================================================
     dualBrush — 二色ブラシ（平筆ベース・左右で色分け）
  ================================================================ */
  function _dualBrush(ctx, x, y, angle, progress, speed, params, color, alpha, isFirst, secondColor) {
    var size      = params.size;
    var paintLoad = params.paintLoad !== undefined ? params.paintLoad : 0.65;
    var texture   = params.texture   || 0.28;
    var softness  = params.softness  || 0.25;
    var n         = _bristleCount || 6;

    var normalX = -Math.sin(angle);
    var normalY =  Math.cos(angle);
    var speedFactor = Math.max(0.55, Math.min(1.15, 1.0 - speed * 0.011));
    var startTaper  = Math.min(1.0, progress / Math.max(1, size * 0.5));
    var baseOpacity = params.opacity * alpha * (0.38 + startTaper * 0.62) * speedFactor;

    /* ソフトベース */
    if (paintLoad > 0.35 && !isFirst && _baseX !== null) {
      ctx.save();
      ctx.globalAlpha = Math.min(0.09, baseOpacity * 0.07 * paintLoad);
      ctx.strokeStyle = color;
      ctx.lineWidth   = size * 0.82;
      ctx.lineCap = ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(_baseX, _baseY); ctx.lineTo(x, y); ctx.stroke();
      ctx.restore();
    }
    _baseX = x; _baseY = y;

    for (var b = 0; b < n; b++) {
      var noise = _bristleNoise[b] || { skip:false, widthMul:0.7, alphaMul:0.8, hShift:0, sShift:0, lShift:0 };
      if (noise.skip) continue;

      var t = n > 1 ? (b / (n - 1)) - 0.5 : 0;   /* -0.5〜0.5 */

      /* 中央の細い帯(±12%)だけブレンド、左右は純色 */
      var raw    = t + 0.5;                /* 0〜1 */
      var blend  = Math.max(0, Math.min(1, (raw - 0.38) / 0.24));
      var mixed  = _lerpColor(color, secondColor, blend);
      var bColor = _applyHslShift(mixed, noise.hShift, noise.sShift, noise.lShift);

      var jitter    = (Math.random() - 0.5) * size * 0.022 * texture;
      var bx        = x + normalX * (t * size + jitter);
      var by        = y + normalY * (t * size + jitter);
      var edgeFade  = 1 - Math.abs(t) * (0.28 + texture * 0.22);
      var bAlpha    = Math.min(0.95, baseOpacity * noise.alphaMul * edgeFade * (0.70 + Math.random() * 0.30));
      var bWidth    = (size / n) * noise.widthMul * (0.45 + Math.random() * 0.55) * speedFactor;

      ctx.save();
      ctx.globalAlpha = bAlpha;
      ctx.lineWidth   = bWidth;
      ctx.lineCap     = 'round';
      if (_bristlePos[b] && !isFirst) {
        ctx.strokeStyle = bColor;
        ctx.beginPath(); ctx.moveTo(_bristlePos[b].x, _bristlePos[b].y); ctx.lineTo(bx, by); ctx.stroke();
      } else if (isFirst) {
        ctx.fillStyle = bColor;
        ctx.beginPath(); ctx.arc(bx, by, bWidth / 2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
      _bristlePos[b] = { x: bx, y: by };
    }
  }

  /* ================================================================
     drawPreview — コントロールパネル内プレビュー (S字カーブ)
  ================================================================ */
  function drawPreview(canvas, params, color, secondColor) {
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
      strokeTo(ctx, pts[i].x, pts[i].y, Math.atan2(dy, dx), spd, pParams, color, 1.0, secondColor);
    }
    var last = pts[pts.length - 1];
    var prev = pts[pts.length - 2];
    endStroke(ctx, last.x, last.y, Math.atan2(last.y - prev.y, last.x - prev.x), pParams, color, 1.0, secondColor);

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
  function _lerpColor(hex1, hex2, t) {
    hex1 = hex1.replace('#',''); hex2 = hex2.replace('#','');
    if (hex1.length===3) hex1=hex1[0]+hex1[0]+hex1[1]+hex1[1]+hex1[2]+hex1[2];
    if (hex2.length===3) hex2=hex2[0]+hex2[0]+hex2[1]+hex2[1]+hex2[2]+hex2[2];
    var r1=parseInt(hex1.substr(0,2),16), g1=parseInt(hex1.substr(2,2),16), b1=parseInt(hex1.substr(4,2),16);
    var r2=parseInt(hex2.substr(0,2),16), g2=parseInt(hex2.substr(2,2),16), b2=parseInt(hex2.substr(4,2),16);
    var r=Math.round(r1+(r2-r1)*t), g=Math.round(g1+(g2-g1)*t), b=Math.round(b1+(b2-b1)*t);
    return '#'+[r,g,b].map(function(v){return('0'+v.toString(16)).slice(-2);}).join('');
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
