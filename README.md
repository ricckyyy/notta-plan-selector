# Notta料金・AI議事録 最低plan比較 — 公開前MVP

静的1ページMVPです。`index.html` をローカルで開くだけで動きます。DB、login、backend、paid API、analytics、Affiliate linkはありません。

## ファイル

- `index.html` — SEO本文、Notta料金概要、8入力calculator、結果枠、信頼性表示
- `styles.css` — mobile対応を含む最小公開UI
- `product-data.js` — 価格・hard limit・対応条件・source。**料金/plan変更時の主更新箇所**
- `logic.js` — 製品非依存hard-filter、年間総額、異通貨sort保護
- `app.js` — 入力と結果表示。将来の通常URL→Affiliate URL差し替えは `.cta-link[data-product]` を入口にできる
- `tests.js` — 指定5ケース
- `boundary-tests.js` — hard limit境界17ケース
- `publication-qa.js` — 日本向け料金、Business Plus除外、異通貨sort、source/checked date等
- `LAUNCH_CHECKLIST.md` — 実公開前の人間作業

## ローカル確認

```bash
node tests.js
node boundary-tests.js
node publication-qa.js
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000/` を開きます。

## 価格方針

- Nottaは日本語公式料金をJPYで保持。
- Premium：年払い時1,185円/月、総額14,220円（税込）。
- Business：年払い時2,508円/月、1アカウント時総額30,096円（税込）。seat数分を掛ける。
- Business Plus：64,800円/年/アカウント（税抜）。現在の8入力ではBusinessとの差を判定できないため、料金表には載せるが診断データから除外。
- Fireflies / tl;dv / Otterは公式USD表示を保持し、JPYへ自動換算しない。
- JPYとUSDの有料候補が混在するとき、価格で横断sortせず「最安」と断定しない。
- Freeは通貨に関係なく無料として先に表示してよい。

## 判定方針

1. planを下位から評価。
2. 既知hard limitを1つでも満たさなければ除外。
3. 必須条件が公開情報で不明ならunknown。推定しない。
4. より安いplanにunknownが残る場合、高いplanを「最低」と断定しない。
5. Affiliate情報はdata/logicに入れない。

## 仕様確認日

2026-08-16


## Planned GitHub Pages URL

`https://ricckyyy.github.io/notta-plan-selector/`

This URL becomes live only after the repository is created and GitHub Pages is enabled.
