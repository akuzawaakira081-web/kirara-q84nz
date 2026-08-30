/* ===========================
   ひらめき画像ページ
   =========================== */

let allImages = [];
let activeImageTheme = 'all';

async function loadImages() {
  const res = await fetch('data/images.json', { cache: 'no-store' });
  allImages = await res.json();
  collectImageThemes(allImages);
  renderImages(allImages);
}

function collectImageThemes(images) {
  const tagList = document.getElementById('imageTagList');
  if (!tagList) return;

  const themes = ['すべて', ...new Set(images.map(i => i.theme))];
  tagList.innerHTML = themes.map(t => {
    const val    = t === 'すべて' ? 'all' : t;
    const active = val === activeImageTheme ? ' active' : '';
    return `<button class="tag${active}" onclick="filterImageByTheme('${val}')">${t}</button>`;
  }).join('');
}

function filterImageByTheme(theme) {
  activeImageTheme = theme;
  document.querySelectorAll('#imageTagList .tag').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === (theme === 'all' ? 'すべて' : theme));
  });
  const filtered = theme === 'all' ? allImages : allImages.filter(i => i.theme === theme);
  renderImages(filtered);
}

function renderImages(images) {
  const grid = document.getElementById('imagesGrid');
  if (!grid) return;

  if (images.length === 0) {
    grid.innerHTML = `<div class="empty-state"><p>このテーマの画像はまだありません。</p></div>`;
    return;
  }

  grid.innerHTML = images.map(img => imageCardHTML(img)).join('');
}

function imageCardHTML(img) {
  const tags = (img.tags || []).map(t => `<span class="card-tag">${t}</span>`).join('');
  return `
    <article class="card image-card" onclick="openImageDetail(event, '${img.id}')">
      <div class="card-image-wrap">
        ${imageAreaHTML(img.image, img.title)}
        ${makeSaveBtn(img.id, img.image, img.title)}
      </div>
      <div class="card-caption">
        <div class="card-meta">
          <span class="card-theme">${img.themeEn}</span>
        </div>
        <p class="card-title">${img.title}</p>
        ${img.desc ? `<p class="card-sub">${img.desc}</p>` : ''}
        ${tags ? `<div class="card-tags">${tags}</div>` : ''}
      </div>
    </article>`;
}

/* ===========================
   拡大詳細表示（モーダル）
   =========================== */

function openImageDetail(event, id) {
  if (event.target.closest('.btn-save')) return;

  const img = allImages.find(i => i.id === id);
  const overlay = document.getElementById('imageDetailOverlay');
  if (!img || !overlay) return;

  const imgEl = document.getElementById('imageDetailImg');
  imgEl.src = img.image;
  imgEl.alt = img.title;

  document.getElementById('imageDetailTheme').textContent = img.themeEn || '';
  document.getElementById('imageDetailTitle').textContent = img.title;
  document.getElementById('imageDetailDesc').textContent = img.desc || '';

  const compWrap = document.getElementById('imageDetailComposition');
  if (img.composition && img.composition.length) {
    compWrap.innerHTML = `
      <span class="image-detail-composition-title">構成の特徴</span>
      <ul>${img.composition.map(c => `<li>${c}</li>`).join('')}</ul>`;
    compWrap.hidden = false;
  } else {
    compWrap.innerHTML = '';
    compWrap.hidden = true;
  }

  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeImageDetail() {
  const overlay = document.getElementById('imageDetailOverlay');
  if (!overlay) return;
  overlay.hidden = true;
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  loadImages();

  const overlay = document.getElementById('imageDetailOverlay');
  document.getElementById('imageDetailClose')?.addEventListener('click', closeImageDetail);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeImageDetail();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeImageDetail();
  });
});
