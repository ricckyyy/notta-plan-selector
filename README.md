# Notta料金・AI議事録 プラン比較

## 公開サイト

- 正規URL：https://notta-plan-selector.pages.dev/
- 解説：https://notta-plan-selector.pages.dev/guides/notta-free-limit/
- GitHub Pagesでも配信。canonicalとsitemapはCloudflareを指定。
- Fireflies紹介リンクあり。報酬情報は判定ロジックに渡さず、本文で広告を開示。
- Cloudflare Web Analytics導入済み。ただし診断完了や外部クリックの独自イベントは未実装。ページ閲覧と成約は別の指標。

## 2026-09-17の改善

- Fireflies FreeはAuto Joinの前提を確認してから無料無制限として判定。未確認ならunknown。
- Freeの保存枠400分など、月間文字起こし以外の制限を表示。
- FreeのCRM連携は料金・案内から適用範囲を確定できないためnull。無料候補に不明点が残る場合、Proを最低プランと断定しない。
- Notta無料版の時間制限を説明するページ、相互リンク、サイトマップを追加。

## データの確認範囲

基本データ：2026-08-16。2026-09-17にNotta公式料金の時間上限・表示価格とFireflies Free公式ガイドを再確認。全社全項目を再監査したという意味ではない。

- https://www.notta.ai/pricing
- https://guide.fireflies.ai/articles/6176608577-learn-about-fireflies-free-plan-features
- https://fireflies.ai/pricing

診断は会議条件が対象。ファイル取り込み回数、保存期間・容量、AI要約回数、リアルタイム翻訳の追加料金は対象外。Notta Business Plusも対象外。入力は保存しない。

## ファイルと確認方法

`product-data.js`に公開仕様、`logic.js`に判定、`app.js`に表示。静的HTMLなのでビルド不要。

```sh
node tests.js
node boundary-tests.js
node publication-qa.js
python3 -m http.server 8000
```

5つの利用シナリオ、22の境界条件、公開前の構造確認を実施する。入力の追加時は画面とシナリオも更新する。

## 計測上の保留

Cloudflareの実アクセスとFirstPromoterのクリック・承認報酬は管理画面の認証待ち。Nottaリンクは通常リンクであり収益化未接続。日本語公式の案内先A8.netと英語公式のImpactを混同せず、既存アカウントの提携・対象国・料率を確認してから設置する。
