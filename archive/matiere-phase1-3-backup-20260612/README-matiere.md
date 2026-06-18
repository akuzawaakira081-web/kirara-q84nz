# ひらめき技法マチエール — 実装メモ

## 作品画像の差し替え場所

### メイン作品画像（作品ビューア）

| 項目 | 値 |
|------|-----|
| ファイルパス | `images/matiere/big-tree.jpg` |
| 推奨サイズ | 1120×840px（4:3） |
| 設定箇所 | `js/matiere-data.js` 182行目 `mainImage` プロパティ |

現在は画像未登録のため、🌳 絵文字プレースホルダーが表示されます。
上記パスに画像ファイルを配置するだけで自動的に切り替わります。

### マチエール拡大画像（各部位）

各部位のテクスチャ拡大画像は `js/matiere-data.js` 内の各パートの `textureImage` プロパティに設定します。

| 部位 | プロパティ | 推奨ファイルパス |
|------|-----------|----------------|
| 空 | `MATIERE_PARTS[0].textureImage` | `images/matiere/texture-sky.jpg` |
| 木の幹 | `MATIERE_PARTS[1].textureImage` | `images/matiere/texture-trunk.jpg` |
| 木の葉 | `MATIERE_PARTS[2].textureImage` | `images/matiere/texture-leaves.jpg` |
| 草 | `MATIERE_PARTS[3].textureImage` | `images/matiere/texture-grass.jpg` |
| 光 | `MATIERE_PARTS[4].textureImage` | `images/matiere/texture-light.jpg` |

推奨サイズ: 480×480px（1:1）

## Phase 実装状況

- [x] Phase 1: 静的表示（部位選択・技法カード）
- [ ] Phase 2: MotionDemo（SVGアニメーション）
- [ ] Phase 3: PressureSelector（筆圧）
- [ ] Phase 4: PracticeArea（練習エリア）
- [ ] Phase 5: Audio（効果音）
- [ ] Phase 6: TextureViewer（マチエール光効果）
