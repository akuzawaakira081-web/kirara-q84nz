#!/usr/bin/env node
/**
 * npm run add:image
 * _incoming/ の画像を assets/ にコピーし、JSONに追記するスクリプト
 */

const fs   = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT      = path.join(__dirname, '..');
const INCOMING  = path.join(ROOT, 'images', '_incoming');
const IMG_DIR   = path.join(ROOT, 'assets', 'images');
const WORK_DIR  = path.join(ROOT, 'assets', 'works');
const IMG_JSON  = path.join(ROOT, 'data', 'images.json');
const WORK_JSON = path.join(ROOT, 'data', 'works.json');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(resolve => rl.question(q, resolve));

// --- ユーティリティ ---

function listIncoming() {
  if (!fs.existsSync(INCOMING)) fs.mkdirSync(INCOMING, { recursive: true });
  return fs.readdirSync(INCOMING).filter(f => /\.(jpe?g|png|gif|webp)$/i.test(f));
}

function nextSampleNumber(dir) {
  const files = fs.readdirSync(dir);
  const nums  = files
    .map(f => f.match(/^sample(\d+)\./i))
    .filter(Boolean)
    .map(m => parseInt(m[1], 10));
  return nums.length ? Math.max(...nums) + 1 : 1;
}

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

// --- メイン ---

async function main() {
  console.log('\n✨ KIRARA MUSE 画像追加ツール\n');

  // 1. _incoming のファイル一覧
  const files = listIncoming();
  if (files.length === 0) {
    console.log('images/_incoming/ に画像ファイルがありません。');
    console.log('追加したい画像を images/_incoming/ に入れてから再実行してください。');
    rl.close();
    return;
  }

  console.log('追加できる画像:');
  files.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));

  // 2. ファイル選択
  const fileIdx = parseInt(await ask('\n番号を入力してください: '), 10) - 1;
  if (isNaN(fileIdx) || fileIdx < 0 || fileIdx >= files.length) {
    console.log('無効な番号です。終了します。');
    rl.close();
    return;
  }
  const srcFile = files[fileIdx];
  const srcPath = path.join(INCOMING, srcFile);
  const ext     = path.extname(srcFile).toLowerCase();

  // 3. 種別選択
  console.log('\n種別を選んでください:');
  console.log('  1. ひらめき画像（images.html に表示）');
  console.log('  2. 生徒作品（works.html に表示）');
  const kindInput = await ask('番号を入力してください (1 or 2): ');
  const isWork = kindInput.trim() === '2';

  // 4. 自動採番
  const targetDir = isWork ? WORK_DIR : IMG_DIR;
  const nextNum   = nextSampleNumber(targetDir);
  const newName   = `sample${nextNum}${ext}`;
  const destPath  = path.join(targetDir, newName);
  const assetPath = `assets/${isWork ? 'works' : 'images'}/${newName}`;

  console.log(`\n新しいファイル名: ${newName}`);

  // 5. メタデータ入力
  const title = await ask('タイトル: ');
  const theme = await ask('テーマ（例: 自然を描こう）: ');
  const themeEn = await ask('テーマ英語（例: Nature）: ');
  const desc  = await ask('説明文: ');
  const tagsRaw = await ask('タグ（カンマ区切り、例: 自然,海,波）: ');
  const tags  = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);

  let entry;
  if (isWork) {
    const grade   = await ask('学年（例: 小学生）: ');
    const contest = await ask('コンクール名（受賞なしの場合は空白）: ');
    const award   = await ask('賞（受賞なしの場合は空白）: ');
    const critique = award ? await ask('作品評: ') : '';

    const id = `work${String(Date.now()).slice(-6)}`;
    entry = {
      id,
      title,
      grade,
      theme,
      themeEn,
      ...(contest ? { contest } : {}),
      ...(award   ? { award }   : {}),
      desc,
      ...(critique ? { critique } : {}),
      tags,
      image: assetPath
    };
  } else {
    const id = `image${String(nextNum).padStart(3, '0')}`;
    entry = { id, title, theme, themeEn, desc, tags, image: assetPath };
  }

  // 6. 確認
  console.log('\n--- 追加内容の確認 ---');
  console.log(JSON.stringify(entry, null, 2));
  const confirm = await ask('\nこの内容でよいですか？ (y / n): ');
  if (confirm.trim().toLowerCase() !== 'y') {
    console.log('キャンセルしました。');
    rl.close();
    return;
  }

  // 7. ファイルコピー＆JSON追記
  fs.copyFileSync(srcPath, destPath);
  console.log(`✅ コピー完了: ${assetPath}`);

  const jsonFile = isWork ? WORK_JSON : IMG_JSON;
  const data = readJSON(jsonFile);
  data.push(entry);
  writeJSON(jsonFile, data);
  console.log(`✅ JSON追記完了: data/${isWork ? 'works' : 'images'}.json`);

  // 8. _incoming から削除
  const del = await ask(`\nimages/_incoming/${srcFile} を削除しますか？ (y / n): `);
  if (del.trim().toLowerCase() === 'y') {
    fs.unlinkSync(srcPath);
    console.log('✅ _incoming から削除しました。');
  }

  console.log('\n🎉 完了！ブラウザをリロードして確認してください。\n');

  // 9. GitHub に反映するか
  const pushToGit = await ask('GitHubにも反映しますか？ (y / n): ');
  if (pushToGit.trim().toLowerCase() === 'y') {
    await gitPush(entry, isWork);
  } else {
    console.log('ローカル追加のみで完了しました。\n');
  }

  rl.close();
}

async function gitPush(entry, isWork) {
  const { execSync } = require('child_process');
  const kind = isWork ? '生徒作品' : 'ひらめき画像';
  const commitMsg = `add: ${entry.title}（${entry.id}）`;

  // git status 表示
  console.log('\n--- git status ---');
  try {
    const status = execSync('git status --short', { cwd: ROOT, encoding: 'utf8' });
    console.log(status || '（変更なし）');
  } catch (e) {
    console.log('git status の取得に失敗しました:', e.message);
    return;
  }

  console.log(`自動生成コミットメッセージ: "${commitMsg}"`);

  // push 前確認
  const confirm = await ask('\nこの内容でgit add → commit → pushを実行しますか？ (y / n): ');
  if (confirm.trim().toLowerCase() !== 'y') {
    console.log('pushをキャンセルしました。ローカルの変更は保持されています。\n');
    return;
  }

  try {
    execSync('git add .', { cwd: ROOT, encoding: 'utf8' });
    console.log('✅ git add 完了');

    execSync(`git commit -m "${commitMsg}"`, { cwd: ROOT, encoding: 'utf8' });
    console.log('✅ git commit 完了');

    execSync('git push', { cwd: ROOT, encoding: 'utf8', timeout: 30000 });
    console.log('✅ git push 完了');

    // GitHub Pages URL を表示
    let remote = '';
    try {
      remote = execSync('git remote get-url origin', { cwd: ROOT, encoding: 'utf8' }).trim();
    } catch (_) {}
    const match = remote.match(/github\.com[:/](.+?)(?:\.git)?$/);
    if (match) {
      const repo = match[1];
      const [owner, repoName] = repo.split('/');
      console.log(`\n🌐 GitHub Pages URL:`);
      console.log(`   https://${owner}.github.io/${repoName}/images.html\n`);
    }
  } catch (e) {
    console.error('❌ Git操作中にエラーが発生しました:', e.message);
  }
}

main().catch(err => {
  console.error('エラー:', err.message);
  rl.close();
  process.exit(1);
});
