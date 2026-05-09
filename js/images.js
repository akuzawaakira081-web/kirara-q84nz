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
    <article class="card image-card">
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

document.addEventListener('DOMContentLoaded', loadImages);
