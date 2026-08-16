# LAUNCH CHECKLIST

最終更新: 2026-08-16

## Pricing / sources

- [x] Notta日本語公式料金を確認
- [x] Notta Free / Premium / Business / Enterpriseの主要hard limitを確認
- [x] Business Plus（2026-07-27開始）の価格・位置づけを公式発表で確認
- [x] Business Plusは現8入力でBusinessとの差を判定できないため「診断対象外」とUI表示
- [x] Fireflies公式USD価格を確認
- [x] tl;dv公式公開情報のUSD価格を確認
- [x] Otter公式USD価格を確認
- [x] source checked dateをUI表示（2026-08-16）
- [x] 価格/planは変更されうる旨をUI表示

## QA

- [x] 既存5ケース再実行
- [x] boundary 17ケース再実行
- [x] 日本向けNotta価格とproduct data一致QA
- [x] Business Plus診断対象外QA
- [x] JPY / USDを為替換算なしで横断sortしないQA
- [x] source / checked date表示QA
- [x] H1は1つ
- [x] Affiliate linkなし

## SEO / document

- [x] `<title>`
- [x] meta description
- [x] semantic H1/H2/H3
- [x] mobile対応
- [x] JS無効でも料金説明・本文は読める
- [x] canonicalを予定GitHub Pages URLへ設定
- [ ] 公開URLでtitle / description / canonicalを最終確認

## 未導入（意図どおり）

- [x] Affiliate link未導入
- [x] analytics未導入
- [x] 独自domain未設定
- [x] Search Console未登録
- [x] DB / loginなし
- [x] paid APIなし

## GitHub Pages publish handoff

- [x] Public repository: `ricckyyy/notta-plan-selector`
- [x] Default branch: `main`
- [x] Planned Pages URL: `https://ricckyyy.github.io/notta-plan-selector/`
- [x] Canonical set to planned Pages URL
- [x] Relative CSS/JS asset paths confirmed
- [x] No secrets / tokens / credentials detected
- [x] Public MVP files committed to `main`
- [ ] Enable GitHub Pages from `main` / `(root)`
- [ ] Confirm the live URL loads CSS and JavaScript

## 公開後に別途判断すること

- [ ] 公開直前/公開後に4社pricing sourceを再確認する運用を決める
- [ ] privacy policy要否を決める（現MVPは入力保存・analyticsなし。hosting側ログ等はGitHub Pages側に依存）
- [ ] Affiliate導入時はAffiliate disclosureをページへ追加
- [ ] Affiliate承認後もranking logicへ報酬情報を渡さない
- [ ] Search Console / analytics導入は別ゲートで判断
