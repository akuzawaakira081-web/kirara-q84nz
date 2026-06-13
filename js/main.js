/* ===========================
   KIRARA MUSE — 共通スクリプト
   =========================== */

// LINEブラウザ検出 → 外部ブラウザ（Safari/Chrome）で開き直す
(function () {
  if (/Line\//i.test(navigator.userAgent)) {
    var url = new URL(window.location.href);
    if (!url.searchParams.get('openExternalBrowser')) {
      url.searchParams.set('openExternalBrowser', '1');
      window.location.replace(url.toString());
    }
  }
})();

// ナビゲーション：現在ページにactiveクラス付与
(function () {
  const links = document.querySelectorAll('.global-nav a');
  const current = location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === current) link.classList.add('active');
  });
})();

// ハンバーガーメニュー
(function () {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('globalNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // ナビリンクを押したら閉じる
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
})();

/* ===========================
   カードユーティリティ
   =========================== */

// プレースホルダーSVGを返す
function placeholderSVG(label = '') {
  return `
    <div class="card-placeholder">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="8" width="32" height="24" rx="3" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="14" cy="17" r="3" stroke="currentColor" stroke-width="1.5"/>
        <path d="M4 26l9-7 6 5 5-4 8 6" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>
      <span>${label || '画像準備中'}</span>
    </div>`;
}

// 画像エリアHTML（画像あり／なし判定）
function imageAreaHTML(src, alt) {
  if (src) {
    return `
      <img src="${src}" alt="${alt}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="card-placeholder" style="display:none">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="8" width="32" height="24" rx="3" stroke="currentColor" stroke-width="1.5"/>
          <circle cx="14" cy="17" r="3" stroke="currentColor" stroke-width="1.5"/>
          <path d="M4 26l9-7 6 5 5-4 8 6" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
        <span>画像準備中</span>
      </div>`;
  }
  return placeholderSVG();
}

/* ===========================
   保存ボタン（ローカル保存）
   =========================== */
function makeSaveBtn(id, src, title) {
  const saved = isSaved(id);
  return `
    <button class="btn-save${saved ? ' saved' : ''}"
            aria-label="保存"
            onclick="toggleSave(event, '${id}', '${src}', '${title}')">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    </button>`;
}

// 保存済みIDセット（sessionStorageで管理）
function getSavedIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem('kiraramuse_saved') || '[]'));
  } catch { return new Set(); }
}

function isSaved(id) {
  return getSavedIds().has(id);
}

function toggleSave(event, id, src, title) {
  event.preventDefault();
  const btn = event.currentTarget;
  const ids = getSavedIds();

  if (ids.has(id)) {
    ids.delete(id);
    btn.classList.remove('saved');
    btn.setAttribute('aria-label', '保存');
  } else {
    ids.add(id);
    btn.classList.add('saved');
    btn.setAttribute('aria-label', '保存済み');

    // 画像がある場合はダウンロードリンクを生成
    if (src) {
      const a = document.createElement('a');
      a.href = src;
      a.download = title || 'kirara_muse_image';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  localStorage.setItem('kiraramuse_saved', JSON.stringify([...ids]));
}
