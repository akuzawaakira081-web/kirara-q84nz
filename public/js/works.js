/* ===========================
   ひらめき作品ページ
   =========================== */

let allWorks = [];
let activeTheme = 'all';

async function loadWorks() {
  const res = await fetch('data/works.json', { cache: 'no-store' });
  allWorks = (await res.json()).reverse();
  collectThemes(allWorks);
  renderWorks(allWorks);
}

function collectThemes(works) {
  const tagList = document.getElementById('tagList');
  if (!tagList) return;

  const themes = ['すべて', ...new Set(works.map(w => w.theme))];
  tagList.innerHTML = themes.map(t => {
    const val    = t === 'すべて' ? 'all' : t;
    const active = val === activeTheme ? ' active' : '';
    return `<button class="tag${active}" onclick="filterByTheme('${val}')">${t}</button>`;
  }).join('');
}

function filterByTheme(theme) {
  activeTheme = theme;
  document.querySelectorAll('#tagList .tag').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === (theme === 'all' ? 'すべて' : theme));
  });
  const filtered = theme === 'all' ? allWorks : allWorks.filter(w => w.theme === theme);
  renderWorks(filtered);
}

function renderWorks(works) {
  const grid = document.getElementById('worksGrid');
  if (!grid) return;

  if (works.length === 0) {
    grid.innerHTML = `<div class="empty-state"><p>このテーマの作品はまだありません。</p></div>`;
    return;
  }

  grid.innerHTML = works.map(w => workCardHTML(w)).join('');
}

function workCardHTML(w) {
  const tags = (w.tags || []).map(t => `<span class="card-tag">${t}</span>`).join('');
  const awardBadge = w.award
    ? `<div class="card-award">
        <span class="card-award-icon">🏆</span>
        <span class="card-award-contest">${w.contest}</span>
        <span class="card-award-name">${w.award}</span>
       </div>`
    : '';
  const critique = w.critique
    ? `<div class="card-critique">
        <p class="card-critique-label">作品評</p>
        <p class="card-critique-text">${w.critique}</p>
       </div>`
    : '';
  return `
    <article class="card${w.award ? ' card--award' : ''}">
      <div class="card-image-wrap">
        ${imageAreaHTML(w.image, w.title)}
        ${makeSaveBtn(w.id, w.image, w.title)}
      </div>
      <div class="card-caption">
        ${awardBadge}
        <div class="card-meta">
          <span class="card-theme">${w.themeEn}</span>
          ${w.grade ? `<span class="card-grade">${w.grade}</span>` : ''}
        </div>
        <p class="card-title">${w.title}</p>
        ${w.desc ? `<p class="card-sub">${w.desc}</p>` : ''}
        ${critique}
        ${tags ? `<div class="card-tags">${tags}</div>` : ''}
      </div>
    </article>`;
}

document.addEventListener('DOMContentLoaded', loadWorks);
