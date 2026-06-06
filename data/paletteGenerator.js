// パレット生成ロジック
// テーマ × 感情 × 配色レベル から複数のパレット候補を生成する
import { themes } from './themes.js';
import { emotions } from './emotions.js';
import { toneLevels } from './toneLevels.js';
import { themeEmotionRules } from './themeEmotionRules.js';

// ───────────────────────────────────────────────
//  メイン生成関数
// ───────────────────────────────────────────────
export function generateMixPalettes(themeId, emotionId, toneLevelId) {
  const theme   = themes.find(t => t.id === themeId);
  const emotion = emotions.find(e => e.id === emotionId);
  const tone    = toneLevels.find(t => t.id === toneLevelId);
  if (!theme || !emotion || !tone) return null;

  const rule = themeEmotionRules.find(
    r => r.themeId === themeId && r.emotionId === emotionId
  ) || null;

  const tc = theme.baseColors;    // テーマ色配列
  const ec = emotion.emotionColors; // 感情色配列

  // 3〜4つのパレット候補を生成
  const candidates = [];

  // Candidate A: テーマ重視
  candidates.push(buildCandidate('A', 'テーマ重視',
    [
      { ...tc[0], role: '主役色' },
      { ...tc[1], role: 'サブ色' },
      { ...ec[0], role: 'アクセント色' },
      { ...tc[2], role: '背景色' },
      { ...(ec[1] || tc[3]), role: '中間色' }
    ],
    theme, emotion, tone, rule, 0
  ));

  // Candidate B: 感情重視
  candidates.push(buildCandidate('B', '感情重視',
    [
      { ...ec[0], role: '主役色' },
      { ...ec[1], role: 'サブ色' },
      { ...tc[0], role: 'アクセント色' },
      { ...(ec[2] || tc[3]), role: '背景色' },
      { ...tc[1], role: '中間色' }
    ],
    theme, emotion, tone, rule, 1
  ));

  // Candidate C: バランス型
  candidates.push(buildCandidate('C', 'バランス型',
    [
      { ...tc[0], role: '主役色' },
      { ...ec[0], role: 'サブ色' },
      { ...ec[1], role: 'アクセント色' },
      { ...tc[3] || tc[2], role: '背景色' },
      { ...tc[1], role: '中間色' }
    ],
    theme, emotion, tone, rule, 2
  ));

  // Candidate D: ルールベース特別版（ルールが存在する場合のみ）
  if (rule) {
    candidates.push(buildCandidate('D', 'スペシャル✨',
      [
        { ...tc[0], role: '主役色' },
        { ...ec[0], role: 'サブ色' },
        { ...tc[1], role: 'アクセント色' },
        { ...ec[2] || tc[4] || tc[2], role: '背景色' },
        { ...ec[3] || tc[5] || ec[1], role: '中間色' }
      ],
      theme, emotion, tone, rule, 3
    ));
  }

  // 「なぜこの配色？」説明文を生成
  const whyExplanation = buildWhyExplanation(theme, emotion, rule);

  return { theme, emotion, tone, rule, candidates, whyExplanation };
}

// ───────────────────────────────────────────────
//  パレット候補1つを組み立てる
// ───────────────────────────────────────────────
function buildCandidate(id, badge, colors, theme, emotion, tone, rule, nameIndex) {
  const names = rule?.paletteNames || [];
  const name  = names[nameIndex] || buildAutoName(id, theme, emotion, colors);

  return {
    id,
    badge,
    name,
    colors,
    impression:        buildImpression(badge, theme, emotion),
    childExplanation:  buildChildExplanation(badge, theme, emotion, colors),
    theoryNote:        buildTheoryNote(badge, theme, emotion, colors, tone),
    artworkSuggestion: buildArtworkSuggestion(theme, emotion, colors),
    prompt:            buildPrompt(theme, emotion, tone, colors, badge),
    comparisonTags:    buildComparisonTags(badge, tone),
  };
}

// ───────────────────────────────────────────────
//  パレット名の自動生成
// ───────────────────────────────────────────────
function buildAutoName(id, theme, emotion, colors) {
  const mainColor = colors[0].name;
  const subColor  = colors[1].name;
  const map = {
    A: `${mainColor}が主役の${emotion.name}`,
    B: `${emotion.name}あふれる${mainColor}`,
    C: `${theme.name.slice(0, 5)}×${emotion.name}バランス`,
    D: `${emotion.name}の特別パレット`,
  };
  return map[id] || `パターン${id}`;
}

// ───────────────────────────────────────────────
//  印象文
// ───────────────────────────────────────────────
function buildImpression(badge, theme, emotion) {
  const tAtm = theme.atmosphereKeywords.slice(0, 2).join('・');
  const eTone = emotion.toneKeywords.slice(0, 2).join('・');
  const byBadge = {
    'テーマ重視': `「${tAtm}」のテーマ感を中心に、${emotion.name}の${eTone}さをアクセントで加えた配色`,
    '感情重視':   `${emotion.name}の「${eTone}」を全面に出し、テーマの${tAtm}で安定させた配色`,
    'バランス型': `テーマの${tAtm}と${emotion.name}の${eTone}さを同じ分量でミックスした調和の配色`,
    'スペシャル✨': `「${tAtm}×${eTone}」の最高の組み合わせを目指した、おすすめの特別配色`,
  };
  return byBadge[badge] || `${theme.name}と${emotion.name}の特別な組み合わせ`;
}

// ───────────────────────────────────────────────
//  子ども向け説明
// ───────────────────────────────────────────────
function buildChildExplanation(badge, theme, emotion, colors) {
  const mc = colors[0].name;
  const ac = colors[2].name;
  const base = {
    'テーマ重視':   `「${theme.name}」の雰囲気を大切にした配色だよ。${mc}を主役にして、${emotion.name}の気持ちを${ac}でアクセントとして加えたよ。`,
    '感情重視':     `${emotion.name}という気持ちをたっぷり色に込めたよ！${mc}を主役にすることで、見る人に${emotion.name}の気持ちがぐっと伝わるよ。`,
    'バランス型':   `「${theme.name}」の色と「${emotion.name}」の色をちょうどよいバランスで合わせたよ。どちらも引き立つ調和のとれた配色なんだ。`,
    'スペシャル✨': `「${theme.name}」と「${emotion.name}」を特別なルールで組み合わせた、おすすめの配色だよ！${mc}と${ac}の組み合わせが、伝えたい気持ちをぴったり表してくれるよ。`,
  };
  return base[badge] || `${theme.name}と${emotion.name}の色を合わせたパレットだよ。`;
}

// ───────────────────────────────────────────────
//  色彩理論補足
// ───────────────────────────────────────────────
function buildTheoryNote(badge, theme, emotion, colors, tone) {
  const mc = colors[0].name;
  const tones = {
    soft:       '全体を淡いペールトーンにまとめることで、見る人がほっとする配色になっています。',
    standard:   '明度・彩度のバランスが取れた、見やすい配色です。主役と背景の明暗差がポイントです。',
    vivid:      '彩度を高めに設定し、主役の色が画面からパッと目立つ配色です。',
    grandprix:  '補色関係や明暗の強いコントラストを活かした、コンクール向けの本格配色です。',
  };
  const byBadge = {
    'テーマ重視': `${mc}のテーマカラーをベースに、感情色をアクセントとして効かせる配色です。テーマのメッセージが最も伝わりやすい組み合わせです。`,
    '感情重視':   `感情を表す色を主役にし、テーマカラーをサポートに使う配色です。見る人の感情に働きかける力が強くなります。`,
    'バランス型': `テーマ色と感情色を均等に配置することで、安定した見やすい仕上がりになります。コンクール入賞作品によく使われる配色の考え方です。`,
    'スペシャル✨': `テーマと感情の特性を最大限に活かした配色です。${tone.label}の効果を加えることで、さらに完成度が上がります。`,
  };
  return (byBadge[badge] || '') + ' ' + tones[tone.id] || '';
}

// ───────────────────────────────────────────────
//  作品づくりのアドバイス
// ───────────────────────────────────────────────
function buildArtworkSuggestion(theme, emotion, colors) {
  const subject = theme.recommendedSubjects[0];
  const mc  = colors[0].name;
  const sc  = colors[1].name;
  const ac  = colors[2].name;
  const bgc = colors[3].name;

  return {
    mainSubject: `${subject}を${mc}で力強く描こう。`,
    background:  `${bgc}でやさしく包み込むような背景を作ると、主役が引き立つよ。`,
    colorUsage:  `主役に${mc}、そばを支える色に${sc}を使い、${ac}でひとこと輝きを加えよう。`,
    highlight:   `${emotion.name}の気持ちが一番伝わる場所に${ac}をポイントで入れてみよう。`,
    tip:         `${sc}と${ac}を隣に並べると、色が互いを引き立て合うよ。`,
    voicing:     `「${emotion.name}の気持ちがどこに表れているかな？」と考えながら描いてみよう。`,
  };
}

// ───────────────────────────────────────────────
//  プロンプト生成
// ───────────────────────────────────────────────
function buildPrompt(theme, emotion, tone, colors, badge) {
  const colorList = colors.map(c => `${c.name}(${c.hex})`).join('・');
  const subject   = theme.recommendedSubjects[0];
  return `【テーマ：${theme.name} × 気持ち：${emotion.name}】配色パターン：${badge}
使用色：${colorList}
主役：${subject}。感情「${emotion.name}」（${emotion.toneKeywords.slice(0,2).join('・')}）を色で表現。
${tone.promptSuffix}
画風：子どもらしい丁寧なタッチ、温かみのある絵の具風。光と影をしっかり描き込む。`;
}

// ───────────────────────────────────────────────
//  比較タグ
// ───────────────────────────────────────────────
function buildComparisonTags(badge, tone) {
  const base = {
    'テーマ重視':   ['テーマ感強め', '作品らしい'],
    '感情重視':     ['感情が伝わる', '個性的'],
    'バランス型':   ['バランス◎', 'コンクール向き'],
    'スペシャル✨': ['おすすめ', '特別感あり'],
  };
  const toneTag = {
    soft: 'やさしい印象',
    standard: '見やすい',
    vivid: 'はっきり目立つ',
    grandprix: 'コンクール狙い',
  };
  return [...(base[badge] || []), toneTag[tone.id] || ''];
}

// ───────────────────────────────────────────────
//  「なぜこの配色？」説明文
// ───────────────────────────────────────────────
function buildWhyExplanation(theme, emotion, rule) {
  const tAtm = theme.atmosphereKeywords;
  const eTone = emotion.toneKeywords;

  const points = [
    `「${theme.name}」のテーマには、「${tAtm.slice(0,2).join('」「')}」を感じさせる色が大切です。`,
    `「${emotion.name}」の気持ちには、「${eTone.slice(0,2).join('」「')}」を表す色がぴったりです。`,
    `このふたつの色を組み合わせると、テーマのメッセージと気持ちが両方伝わる、より深い絵になります。`,
    rule?.whyNotes || `「${theme.name}」と「${emotion.name}」の掛け合わせは、コンクール作品でも個性が光る配色になります。`,
  ];

  return points;
}
