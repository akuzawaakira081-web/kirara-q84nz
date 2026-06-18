/**
 * KIRARA MUSE — MotionDemo Phase 2/3
 * SVG + requestAnimationFrame + 筆圧3段階
 */
(function () {
  'use strict';

  var W = 320, H = 180;

  /* ---- pressure presets ---- */
  var PRESSURE_PRESETS = {
    light:  { label: 'かるく', strokeWidthScale: 0.65, opacity: 0.55, toolPressScale: 0.92, soundWordScale: 0.85 },
    medium: { label: 'ふつう', strokeWidthScale: 1.00, opacity: 0.82, toolPressScale: 1.00, soundWordScale: 1.00 },
    strong: { label: 'ぐっと', strokeWidthScale: 1.45, opacity: 1.00, toolPressScale: 1.08, soundWordScale: 1.15 }
  };

  /* ---- state ---- */
  var _raf = null, _t0 = null, _playing = false;
  var _svgEl = null, _type = null, _els = null;
  var _pressure = 'medium';

  var DURATIONS = { horizontal: 2400, vertical: 1800, tap: 1600, flick: 1200, dot: 1600 };

  function pset() { return PRESSURE_PRESETS[_pressure]; }

  /* ---- utils ---- */
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function eio(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
  var NS = 'http://www.w3.org/2000/svg';
  function se(tag, attrs) {
    var el = document.createElementNS(NS, tag);
    var ks = Object.keys(attrs);
    for (var i = 0; i < ks.length; i++) el.setAttribute(ks[i], attrs[ks[i]]);
    return el;
  }
  function sa(el, attrs) {
    var ks = Object.keys(attrs);
    for (var i = 0; i < ks.length; i++) el.setAttribute(ks[i], attrs[ks[i]]);
  }
  function f(n) { return (+n).toFixed(2); }

  function cancel() {
    if (_raf) { cancelAnimationFrame(_raf); _raf = null; }
    _playing = false; _t0 = null;
  }

  /* ---- pressure indicator (bottom-left circle) ---- */
  var PRESS_R = { light: 4, medium: 6, strong: 9 };
  function addPressureIndicator(svg) {
    var g = se('g', { transform: 'translate(14,162)' });
    g.appendChild(se('circle', { cx: 0, cy: 0, r: PRESS_R[_pressure], fill: '#c9a84c', opacity: '0.8' }));
    var txt = se('text', { x: 16, y: 4, 'font-size': 9, fill: '#5a5050', 'text-anchor': 'start', 'font-family': 'sans-serif' });
    txt.textContent = pset().label;
    g.appendChild(txt);
    svg.appendChild(g);
  }

  /* ==========================================================
     HORIZONTAL (空)
  ========================================================== */
  function buildHorizontal(svg) {
    svg.innerHTML = '';
    svg.appendChild(se('rect', { x: 0, y: 0, width: W, height: H, fill: '#e8f4ff', rx: 8 }));
    [42, 72, 102, 132].forEach(function (y) {
      svg.appendChild(se('line', { x1: 0, y1: y, x2: W, y2: y, stroke: '#c0d8f0', 'stroke-width': 0.5, opacity: 0.45 }));
    });
    var trA = se('line', { x1: 30, y1: 88, x2: 30, y2: 88, stroke: '#70bce8', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.85 });
    var trB = se('line', { x1: 290, y1: 98, x2: 290, y2: 98, stroke: '#50a8d8', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.80 });
    svg.appendChild(trA); svg.appendChild(trB);
    svg.appendChild(se('circle', { cx: 30, cy: 88, r: 5, fill: '#c9a84c', opacity: 0.85 }));
    var g = se('g', { transform: 'translate(30,88)' });
    g.appendChild(se('rect', { x: -3, y: -22, width: 6, height: 18, fill: '#7a5a10', rx: 2 }));
    g.appendChild(se('rect', { x: -5, y: -6, width: 10, height: 4, fill: '#aaa', rx: 1 }));
    g.appendChild(se('rect', { x: -18, y: -3, width: 36, height: 7, fill: '#dfc87a', rx: 3 }));
    g.appendChild(se('path', { d: 'M-18,4 Q0,10 18,4', fill: '#c8b060' }));
    svg.appendChild(g);
    var snd = se('text', { x: 30, y: 72, 'font-size': 19, 'font-weight': 'bold', fill: '#3a7ac0', opacity: 0, 'text-anchor': 'middle', 'font-family': 'sans-serif' });
    snd.textContent = 'スーッ';
    svg.appendChild(snd);
    return { trA: trA, trB: trB, brushG: g, sound: snd };
  }

  function drawHorizontal(els, p) {
    var ps = pset();
    var swA = f(7 * ps.strokeWidthScale), swB = f(6 * ps.strokeWidthScale);
    var opA = f(0.85 * ps.opacity), opB = f(0.80 * ps.opacity);
    var x;
    if (p <= 0.5) {
      x = lerp(30, 290, eio(p * 2));
      sa(els.trA, { x1: 30, y1: 88, x2: f(x), y2: 88, 'stroke-width': swA, opacity: opA });
      sa(els.brushG, { transform: 'translate(' + f(x) + ',88)' });
      var sp = p * 2, so = sp < 0.1 ? sp / 0.1 : sp > 0.85 ? lerp(1, 0, (sp - 0.85) / 0.15) : 1;
      sa(els.sound, { x: f(x), y: 72, 'font-size': f(19 * ps.soundWordScale), opacity: f(so) });
    } else {
      sa(els.trA, { x1: 30, y1: 88, x2: 290, y2: 88, 'stroke-width': swA, opacity: opA });
      x = lerp(290, 30, eio((p - 0.5) * 2));
      sa(els.trB, { x1: 290, y1: 98, x2: f(x), y2: 98, 'stroke-width': swB, opacity: opB });
      sa(els.brushG, { transform: 'translate(' + f(x) + ',98)' });
      var sp2 = (p - 0.5) * 2, so2 = sp2 < 0.1 ? sp2 / 0.1 : sp2 > 0.85 ? lerp(1, 0, (sp2 - 0.85) / 0.15) : 1;
      sa(els.sound, { x: f(x), y: 82, 'font-size': f(19 * ps.soundWordScale), opacity: f(so2) });
    }
  }

  /* ==========================================================
     VERTICAL (木の幹)
  ========================================================== */
  var VSEGS = 15;
  function buildVertical(svg) {
    svg.innerHTML = '';
    svg.appendChild(se('rect', { x: 0, y: 0, width: W, height: H, fill: '#f2e8d8', rx: 8 }));
    [128, 196].forEach(function (x) {
      svg.appendChild(se('line', { x1: x, y1: 25, x2: x, y2: 152, stroke: '#c8a070', 'stroke-width': 1.5, opacity: 0.22 }));
    });
    svg.appendChild(se('circle', { cx: 162, cy: 152, r: 5, fill: '#c9a84c', opacity: 0.85 }));
    var segs = [];
    for (var i = 0; i < VSEGS; i++) {
      var s = se('line', { x1: 162, y1: 152, x2: 162, y2: 152, stroke: '#7a4010', 'stroke-linecap': 'round', opacity: 0 });
      svg.appendChild(s); segs.push(s);
    }
    svg.appendChild(se('rect', { x: 264, y: 112, width: 8, height: 40, fill: '#e8e2d8', rx: 2, opacity: 0.5 }));
    var pbar = se('rect', { x: 264, y: 152, width: 8, height: 0, fill: '#c9a84c', rx: 2 });
    svg.appendChild(pbar);
    var plbl = se('text', { x: 268, y: 162, 'font-size': 8, fill: '#7a7570', 'text-anchor': 'middle', 'font-family': 'sans-serif' });
    plbl.textContent = '力'; svg.appendChild(plbl);
    var g = se('g', { transform: 'translate(162,152)' });
    g.appendChild(se('rect', { x: -3, y: 6, width: 6, height: 22, fill: '#7a5a10', rx: 2 }));
    g.appendChild(se('rect', { x: -4, y: 1, width: 8, height: 6, fill: '#aaa', rx: 1 }));
    g.appendChild(se('path', { d: 'M-3,1 Q-4,-12 0,-16 Q4,-12 3,1 Z', fill: '#dfc87a' }));
    svg.appendChild(g);
    var snd = se('text', { x: 182, y: 100, 'font-size': 17, 'font-weight': 'bold', fill: '#8B4513', opacity: 0, 'text-anchor': 'start', 'font-family': 'sans-serif' });
    snd.textContent = 'ザラザラ'; svg.appendChild(snd);
    return { segs: segs, brushG: g, sound: snd, pbar: pbar };
  }

  function drawVertical(els, p) {
    var ps = pset();
    for (var i = 0; i < VSEGS; i++) {
      var t0 = i / VSEGS, t1 = (i + 1) / VSEGS;
      var fill = clamp((p - t0) * VSEGS, 0, 1);
      if (fill <= 0) { sa(els.segs[i], { opacity: 0 }); continue; }
      var y1 = lerp(152, 25, eio(t0)), y2 = lerp(152, 25, eio(t1));
      var pr = Math.sin(((t0 + t1) / 2) * Math.PI);
      sa(els.segs[i], {
        x1: 162, y1: f(y1), x2: 162, y2: f(lerp(y1, y2, fill)),
        'stroke-width': f(lerp(1.5, 5.5, pr) * ps.strokeWidthScale),
        opacity: f(ps.opacity * (0.6 + pr * 0.4))
      });
    }
    var by = lerp(152, 25, eio(p)), pr2 = Math.sin(p * Math.PI);
    sa(els.brushG, { transform: 'translate(162,' + f(by) + ') scale(1,' + f(1 - pr2 * 0.28 * ps.toolPressScale) + ')' });
    var barH = f(pr2 * 38 * ps.strokeWidthScale);
    sa(els.pbar, { y: f(152 - pr2 * 38 * ps.strokeWidthScale), height: barH });
    var so = p > 0.2 && p < 0.8 ? Math.min(1, (p - 0.2) / 0.1) * (p < 0.7 ? 1 : lerp(1, 0, (p - 0.7) / 0.1)) : 0;
    sa(els.sound, { x: 177, y: f(by - 12), 'font-size': f(17 * ps.soundWordScale), opacity: f(so) });
  }

  /* ==========================================================
     TAP (木の葉)  — marks centered at (0,0) within <g translate>
  ========================================================== */
  function buildTap(svg) {
    svg.innerHTML = '';
    svg.appendChild(se('rect', { x: 0, y: 0, width: W, height: H, fill: '#edf6e8', rx: 8 }));
    var positions = [[128, 82], [174, 98], [148, 118]];
    var marks = positions.map(function (pos) {
      var g = se('g', { opacity: 0, transform: 'translate(' + pos[0] + ',' + pos[1] + ')' });
      [[-8,-4],[0,0],[8,-5],[5,7],[-6,6]].forEach(function (off) {
        g.appendChild(se('ellipse', {
          cx: off[0], cy: off[1], rx: 8, ry: 5, fill: '#5aaa38', opacity: 0.65,
          transform: 'rotate(' + (off[0] * 20 + 30) + ',' + off[0] + ',' + off[1] + ')'
        }));
      });
      g.appendChild(se('ellipse', { cx: 0, cy: 0, rx: 10, ry: 8, fill: '#4CAF50', opacity: 0.7 }));
      svg.appendChild(g); return g;
    });
    var g2 = se('g', { transform: 'translate(128,45)' });
    g2.appendChild(se('rect', { x: -3, y: -22, width: 6, height: 20, fill: '#7a5a10', rx: 2 }));
    g2.appendChild(se('ellipse', { cx: 0, cy: 0, rx: 18, ry: 11, fill: '#e8c430', opacity: 0.9 }));
    [[-8,-3],[0,-5],[8,-2],[-5,4],[6,3]].forEach(function (d) {
      g2.appendChild(se('circle', { cx: d[0], cy: d[1], r: 2, fill: '#c8a420', opacity: 0.5 }));
    });
    svg.appendChild(g2);
    var snd = se('text', { x: 128, y: 45, 'font-size': 22, 'font-weight': 'bold', fill: '#2a7a18', opacity: 0, 'text-anchor': 'middle', 'font-family': 'sans-serif' });
    snd.textContent = 'ポン'; svg.appendChild(snd);
    return { marks: marks, spongeG: g2, sound: snd, positions: positions };
  }

  function drawTap(els, p) {
    var ps = pset();
    var n = 3, cycle = 1 / n;
    var ti = Math.min(Math.floor(p / cycle), n - 1);
    var cp = clamp((p - ti * cycle) / cycle, 0, 1);
    var pos = els.positions[ti];
    var sy, scY;
    if (cp < 0.35) {
      sy = lerp(pos[1] - 42, pos[1] - 12, eio(cp / 0.35)); scY = 1;
    } else if (cp < 0.55) {
      var t = (cp - 0.35) / 0.2;
      sy = lerp(pos[1] - 12, pos[1] - 10, t);
      scY = lerp(1, 1 - 0.28 * ps.toolPressScale, t);
    } else {
      var t2 = eio((cp - 0.55) / 0.45);
      sy = lerp(pos[1] - 10, pos[1] - 42, t2);
      scY = lerp(1 - 0.28 * ps.toolPressScale, 1, (cp - 0.55) / 0.45);
    }
    sa(els.spongeG, { transform: 'translate(' + pos[0] + ',' + f(sy) + ') scale(1,' + f(scY) + ')' });
    var ms = f(ps.strokeWidthScale);
    for (var i = 0; i < n; i++) {
      var op = i < ti ? 1 : (i === ti && cp >= 0.42) ? Math.min(1, (cp - 0.42) / 0.13) : 0;
      var mp = els.positions[i];
      sa(els.marks[i], { transform: 'translate(' + mp[0] + ',' + mp[1] + ') scale(' + ms + ')', opacity: f(op * ps.opacity) });
    }
    var so = cp >= 0.35 && cp < 0.7 ? Math.min(1, (cp - 0.35) / 0.1) * (cp < 0.6 ? 1 : lerp(1, 0, (cp - 0.6) / 0.1)) : 0;
    sa(els.sound, { x: pos[0], y: f(sy - 18), 'font-size': f(22 * ps.soundWordScale), opacity: f(so) });
  }

  /* ==========================================================
     FLICK (草) — tip always thin (spec requirement)
  ========================================================== */
  var FSEGS = 7;
  function buildFlick(svg) {
    svg.innerHTML = '';
    svg.appendChild(se('rect', { x: 0, y: 0, width: W, height: H, fill: '#eef5de', rx: 8 }));
    svg.appendChild(se('rect', { x: 0, y: 152, width: W, height: 28, fill: '#b0d878', opacity: 0.35 }));
    svg.appendChild(se('line', { x1: 0, y1: 152, x2: W, y2: 152, stroke: '#68a038', 'stroke-width': 2.5, opacity: 0.5 }));
    var xs = [118, 162, 206], tipYs = [28, 38, 24];
    var strokes = xs.map(function () {
      var segs = [];
      for (var i = 0; i < FSEGS; i++) {
        var s = se('line', { x1: 0, y1: 152, x2: 0, y2: 152, stroke: '#3a7820', 'stroke-linecap': 'round', opacity: 0 });
        svg.appendChild(s); segs.push(s);
      }
      return segs;
    });
    var g = se('g', { transform: 'translate(118,142)' });
    g.appendChild(se('rect', { x: -2, y: 8, width: 4, height: 22, fill: '#7a5a10', rx: 2 }));
    g.appendChild(se('rect', { x: -3, y: 3, width: 6, height: 6, fill: '#aaa', rx: 1 }));
    g.appendChild(se('path', { d: 'M-2,3 Q0,-14 2,3 Z', fill: '#dfc87a' }));
    svg.appendChild(g);
    var snd = se('text', { x: 162, y: 90, 'font-size': 22, 'font-weight': 'bold', fill: '#1a6810', opacity: 0, 'text-anchor': 'middle', 'font-family': 'sans-serif' });
    snd.textContent = 'シュッ'; svg.appendChild(snd);
    return { strokes: strokes, brushG: g, sound: snd, xs: xs, tipYs: tipYs };
  }

  function drawFlick(els, p) {
    var ps = pset();
    var n = 3, cycle = 1 / n;
    var fi = Math.min(Math.floor(p / cycle), n - 1);
    var cp = clamp((p - fi * cycle) / cycle, 0, 1);
    var x = els.xs[fi], tipY = els.tipYs[fi];
    var strokeProg = Math.min(cp / 0.65, 1);

    function flickSeg(segsArr, sx, sty, prog, fullOp) {
      for (var s = 0; s < FSEGS; s++) {
        var fill = clamp((prog - s / FSEGS) * FSEGS, 0, 1);
        if (fill <= 0) { sa(segsArr[s], { opacity: 0 }); continue; }
        var y1 = lerp(152, sty, s / FSEGS), y2 = lerp(152, sty, (s + 1) / FSEGS);
        /* tip is ALWAYS 0.5px regardless of pressure — spec requirement */
        var sw = f(lerp(4 * ps.strokeWidthScale, 0.5, s / (FSEGS - 1)));
        sa(segsArr[s], { x1: sx, y1: f(y1), x2: sx, y2: f(lerp(y1, y2, fill)), 'stroke-width': sw, opacity: f(fullOp * ps.opacity) });
      }
    }

    for (var prev = 0; prev < fi; prev++) { flickSeg(els.strokes[prev], els.xs[prev], els.tipYs[prev], 1, 0.85); }
    flickSeg(els.strokes[fi], x, tipY, strokeProg, 1);

    var curY = lerp(152, tipY, eio(strokeProg));
    var bY = cp < 0.65 ? curY - 8 : lerp(curY - 8, tipY - 40, eio((cp - 0.65) / 0.35));
    sa(els.brushG, { transform: 'translate(' + x + ',' + f(bY) + ')', opacity: f(cp < 0.65 ? 1 : lerp(1, 0.3, (cp - 0.65) / 0.35)) });
    var so = cp > 0.05 && cp < 0.5 ? Math.min(1, (cp - 0.05) / 0.12) * (cp < 0.38 ? 1 : lerp(1, 0, (cp - 0.38) / 0.12)) : 0;
    sa(els.sound, { x: x + 22, y: f(bY - 5), 'font-size': f(22 * ps.soundWordScale), opacity: f(so) });
  }

  /* ==========================================================
     DOT (光) — 5 dots, count stays 5 (spec: size/opacity, not count)
  ========================================================== */
  function buildDot(svg) {
    svg.innerHTML = '';
    svg.appendChild(se('rect', { x: 0, y: 0, width: W, height: H, fill: '#fefde8', rx: 8 }));
    var positions = [[138, 72], [172, 90], [128, 108], [168, 116], [152, 82]];
    var dots = positions.map(function (pos) {
      var g = se('g', { opacity: 0, transform: 'translate(' + pos[0] + ',' + pos[1] + ')' });
      g.appendChild(se('circle', { cx: 0, cy: 0, r: 11, fill: '#fffde7', opacity: 0.7 }));
      g.appendChild(se('circle', { cx: 0, cy: 0, r: 5, fill: '#fff59d', stroke: '#d4b000', 'stroke-width': 1.5 }));
      [0, 60, 120, 180, 240, 300].forEach(function (deg) {
        var rad = deg * Math.PI / 180;
        g.appendChild(se('line', { x1: f(Math.cos(rad)*7), y1: f(Math.sin(rad)*7), x2: f(Math.cos(rad)*13), y2: f(Math.sin(rad)*13), stroke: '#e8d000', 'stroke-width': 1, opacity: 0.6 }));
      });
      svg.appendChild(g); return g;
    });
    var g2 = se('g', { transform: 'translate(138,38)' });
    g2.appendChild(se('rect', { x: -2, y: 8, width: 4, height: 22, fill: '#7a5a10', rx: 2 }));
    g2.appendChild(se('rect', { x: -3, y: 2, width: 6, height: 7, fill: '#aaa', rx: 1 }));
    g2.appendChild(se('path', { d: 'M-2,2 Q0,-10 2,2 Z', fill: '#dfc87a' }));
    svg.appendChild(g2);
    var snd = se('text', { x: 160, y: 60, 'font-size': 18, 'font-weight': 'bold', fill: '#c9a84c', opacity: 0, 'text-anchor': 'middle', 'font-family': 'sans-serif' });
    snd.textContent = 'トン'; svg.appendChild(snd);
    return { dots: dots, brushG: g2, sound: snd, positions: positions };
  }

  function drawDot(els, p) {
    var ps = pset();
    var n = 5, cycle = 1 / n;
    var di = Math.min(Math.floor(p / cycle), n - 1);
    var cp = clamp((p - di * cycle) / cycle, 0, 1);
    var pos = els.positions[di];
    var by, bSc;
    if (cp < 0.28) { by = lerp(pos[1]-36, pos[1]-22, eio(cp/0.28)); bSc = 1; }
    else if (cp < 0.48) { var t = (cp-0.28)/0.2; by = lerp(pos[1]-22, pos[1]-18, t); bSc = lerp(1, 1-0.18*ps.toolPressScale, t); }
    else { by = lerp(pos[1]-18, pos[1]-42, eio((cp-0.48)/0.52)); bSc = lerp(1-0.18*ps.toolPressScale, 1, (cp-0.48)/0.52); }
    sa(els.brushG, { transform: 'translate(' + pos[0] + ',' + f(by) + ') scale(1,' + f(bSc) + ')' });
    var ds = f(ps.strokeWidthScale);
    for (var i = 0; i < n; i++) {
      var op = i < di ? 1 : (i === di && cp >= 0.38) ? Math.min(1, (cp - 0.38) / 0.12) : 0;
      var dp = els.positions[i];
      sa(els.dots[i], { transform: 'translate(' + dp[0] + ',' + dp[1] + ') scale(' + ds + ')', opacity: f(op * ps.opacity) });
    }
    var so = cp >= 0.3 && cp < 0.65 ? Math.min(1, (cp-0.3)/0.1) * (cp < 0.55 ? 1 : lerp(1,0,(cp-0.55)/0.1)) : 0;
    sa(els.sound, { x: f(pos[0]+22), y: f(by-10), 'font-size': f(18*ps.soundWordScale), opacity: f(so) });
  }

  /* ==========================================================
     Dispatch
  ========================================================== */
  function buildAll(type, svg) {
    var els = null;
    switch (type) {
      case 'horizontal': els = buildHorizontal(svg); break;
      case 'vertical':   els = buildVertical(svg);   break;
      case 'tap':        els = buildTap(svg);         break;
      case 'flick':      els = buildFlick(svg);       break;
      case 'dot':        els = buildDot(svg);         break;
    }
    if (els) addPressureIndicator(svg);
    return els;
  }

  function drawAll(type, els, p) {
    switch (type) {
      case 'horizontal': drawHorizontal(els, p); break;
      case 'vertical':   drawVertical(els, p);   break;
      case 'tap':        drawTap(els, p);         break;
      case 'flick':      drawFlick(els, p);       break;
      case 'dot':        drawDot(els, p);         break;
    }
  }

  /* ==========================================================
     Public API
  ========================================================== */
  function init(type, svgDomEl) {
    cancel();
    _svgEl = svgDomEl; _type = type;
    _els = buildAll(type, svgDomEl);
    if (_els) drawAll(type, _els, 0.3);
  }

  function play(onDone) {
    if (!_svgEl || !_type || !_els) return;
    cancel(); _playing = true;
    var dur = DURATIONS[_type] || 2000;
    function frame(ts) {
      if (!_t0) _t0 = ts;
      var prog = clamp((ts - _t0) / dur, 0, 1);
      drawAll(_type, _els, prog);
      if (prog < 1) { _raf = requestAnimationFrame(frame); }
      else { _playing = false; if (onDone) onDone(); }
    }
    _raf = requestAnimationFrame(frame);
  }

  function stop() { cancel(); }

  function replay(onDone) {
    if (!_svgEl || !_type) return;
    cancel();
    _els = buildAll(_type, _svgEl);
    play(onDone);
  }

  function setPressure(level) {
    if (!PRESSURE_PRESETS[level]) return;
    cancel();
    _pressure = level;
    if (_svgEl && _type) {
      _els = buildAll(_type, _svgEl);
      if (_els) drawAll(_type, _els, 0.5);
    }
  }

  function getPressure() { return _pressure; }

  window.MatiereMotion = {
    init: init, play: play, stop: stop, replay: replay,
    setPressure: setPressure, getPressure: getPressure,
    isPlaying: function () { return _playing; }
  };

})();
