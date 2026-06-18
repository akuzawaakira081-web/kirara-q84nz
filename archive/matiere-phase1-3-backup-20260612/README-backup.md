# バックアップ: ひらめき技法マチエール Phase 1–3

## 退避日
2026-06-12

## 旧実装の概要
Phase 1: 静的表示（部位選択・技法カード・カラー・ステップ）
Phase 2: MotionDemo（5モーション SVG アニメーション: horizontal/vertical/tap/flick/dot）
Phase 3: PressureSelector（筆圧3段階: やさしく/ふつう/ぐっと）

CSSプレフィックス: `mt-`
JSグローバル変数: `MATIERE_PARTS`, `MATIERE_ARTWORK`, `MatiereMotion`

## 旧URL
/technique-matiere.html

## バックアップファイル一覧

| ファイル | 元のパス | 概要 |
|---|---|---|
| technique-matiere.html | kirara_muse/technique-matiere.html | エントリーポイント |
| matiere.css | kirara_muse/css/matiere.css | 643行、mt-系スタイル全体 |
| matiere-data.js | kirara_muse/js/matiere-data.js | 189行、5部位データ定義 |
| matiere-motion.js | kirara_muse/js/matiere-motion.js | 399行、SVGアニメーション + 筆圧 |
| matiere.js | kirara_muse/js/matiere.js | 408行、UI制御・カード描画 |
| README-matiere.md | kirara_muse/README-matiere.md | 画像パスメモ・Phase進捗 |

## 流用可能な部分
- `matiere-data.js` の MATIERE_PARTS/MATIERE_ARTWORK データ構造（5部位定義）
- `matiere-motion.js` の PRESSURE_PRESETS 定義（筆圧3段階の数値設定）
- `matiere.css` の CSS変数定義（--mt-cream, --mt-gold, --mt-text 等）

## 流用しない部分
- SVG アニメーション実装（全面再設計予定）
- 部位選択ボタン UI（再設計予定）
- 技法カード構造（再設計予定）
- PressureSelector（再設計予定）

## localStorage キー（旧実装）
- `tm_state`: 旧 technique-matiere.js（tm-系）が使用。mt-系は未使用。
  準備中ページ初回表示時に削除済み。

## 注意
本番側ファイル（kirara_muse/js/matiere*.js、kirara_muse/css/matiere.css）は
リセット後も kirara_muse/ に残置しているが、technique-matiere.html からは
読み込まれていない（scriptタグ・linkタグを除去済み）。
