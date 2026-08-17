(function () {
  const form = document.getElementById('selector-form');
  const resultsRoot = document.getElementById('results');
  const summaryRoot = document.getElementById('summary');
  const nottaRoot = document.getElementById('notta-result');

  // Affiliate URLs are kept outside PRODUCT_DATA and the ranking logic.
  // They are only used for an outbound CTA after eligibility has been evaluated.
  const affiliateLinks = {
    'Fireflies.ai': {
      url: 'https://fireflies.ai/?fpr=riki47',
      label: 'Firefliesを試す（Affiliate）'
    }
  };

  const affiliateDisclosure = document.querySelector('.trust-box .fineprint');
  if (affiliateDisclosure) {
    affiliateDisclosure.textContent = 'このページにはFireflies.aiのAffiliateリンクを含みます。リンク経由で有料契約された場合、運営者が報酬を受け取ることがあります。Affiliate報酬は診断・順位ロジックには使用していません。Notta・tl;dv・Otterのリンクは現在通常リンクです。';
  }

  function getInput() {
    return {
      platforms: [...document.querySelectorAll('input[name="platform"]:checked')].map(el => el.value),
      maxMeetingMinutes: Number(document.getElementById('maxMeetingMinutes').value),
      monthlyMinutes: Number(document.getElementById('monthlyMinutes').value),
      usageMode: document.querySelector('input[name="usageMode"]:checked').value,
      paidSeats: Number(document.getElementById('paidSeats').value),
      translationRequired: document.getElementById('translationRequired').checked,
      crmRequired: document.getElementById('crmRequired').checked,
      videoRequired: document.getElementById('videoRequired').checked
    };
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[ch]);
  }

  function formatMoney(amount, currency) {
    if (currency === 'JPY') return `${Math.round(amount).toLocaleString('ja-JP')}円`;
    if (currency === 'USD') return `US$${Number(amount).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    return `${amount.toLocaleString()} ${currency}`;
  }

  function priceLabel(result, compact = false) {
    const cost = result.annualCost;
    if (!cost) return '要問い合わせ';
    if (cost.amount === 0) return '無料';
    const estimate = cost.estimated ? '概算 ' : '';
    const seats = cost.perSeat && cost.seats > 1 ? `（${cost.seats}席）` : '';
    const tax = cost.currency === 'JPY' && cost.tax === 'tax-included' ? '・税込' : '';
    return compact
      ? `${estimate}${formatMoney(cost.amount, cost.currency)}/年${seats}`
      : `${estimate}年間 ${formatMoney(cost.amount, cost.currency)}${seats}${tax}`;
  }

  function statusLabel(status) {
    if (status === 'meets') return '条件を満たす';
    if (status === 'reject') return '条件を満たさない';
    return '情報不足で判定不能';
  }

  function planBreakdown(result) {
    return result.planResults.map(p => {
      const reasons = p.status === 'reject' ? p.rejectReasons : p.status === 'unknown' ? p.unknownReasons : p.matchReasons;
      const cost = p.annualCost ? `${formatMoney(p.annualCost.amount, p.annualCost.currency)}/年` : '価格要問い合わせ';
      return `<li><strong>${escapeHtml(p.plan)}</strong> — ${statusLabel(p.status)} <span class="plan-price">${escapeHtml(cost)}</span>${reasons.length ? `<br><span>${reasons.map(escapeHtml).join(' / ')}</span>` : ''}</li>`;
    }).join('');
  }

  function resultCard(result) {
    let planText = '—';
    if (result.minimumPlan) planText = result.minimumPlan;
    else if (result.confirmedFallbackPlan) planText = `${result.confirmedFallbackPlan} なら対応確認済み（最低planは未確定）`;

    const mainReasons = result.status === 'reject'
      ? result.planResults.flatMap(p => p.rejectReasons).slice(0, 3)
      : result.status === 'unknown'
        ? result.uncertainty
        : result.reasons;

    const price = result.status === 'meets'
      ? priceLabel(result)
      : (result.status === 'unknown' && result.confirmedFallbackPlan && result.annualCost ? `確認済み上位：${priceLabel(result)}` : '—');

    const affiliate = affiliateLinks[result.product];
    const affiliateCta = affiliate && result.status === 'meets'
      ? `<a class="button button-secondary affiliate-link" data-product="${escapeHtml(result.product)}" href="${escapeHtml(affiliate.url)}" target="_blank" rel="sponsored noopener noreferrer">${escapeHtml(affiliate.label)}</a>`
      : '';

    return `
      <article class="result-card status-${result.status}" data-product="${escapeHtml(result.product)}">
        <div class="result-head">
          <div>
            <h3>${escapeHtml(result.product)}</h3>
            <span class="badge">${statusLabel(result.status)}</span>
          </div>
          <div class="price">${escapeHtml(price)}</div>
        </div>
        <dl>
          <div><dt>最低必要plan</dt><dd>${escapeHtml(planText)}</dd></div>
          <div><dt>仕様確認日</dt><dd>${escapeHtml(result.checkedAt)}</dd></div>
        </dl>
        ${mainReasons.length ? `<ul class="reasons">${mainReasons.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>` : ''}
        <details>
          <summary>planごとの判定・落選理由</summary>
          <ul class="plan-list">${planBreakdown(result)}</ul>
        </details>
        <a class="source-link cta-link" data-product="${escapeHtml(result.product)}" href="${escapeHtml(result.homepage)}" target="_blank" rel="noopener noreferrer">${escapeHtml(result.pricingSourceLabel)}を確認</a>
        ${affiliateCta}
      </article>`;
  }

  function render(outcome) {
    const notta = outcome.results.find(r => r.product === 'Notta');
    const freeCandidates = outcome.results.filter(r => r.status === 'meets' && r.annualCost && r.annualCost.amount === 0);

    if (notta) {
      const label = notta.minimumPlan || (notta.confirmedFallbackPlan ? `${notta.confirmedFallbackPlan}以上（最低plan未確定）` : statusLabel(notta.status));
      nottaRoot.innerHTML = `
        <div class="notta-answer status-${notta.status}">
          <span class="eyebrow">あなたのNotta最低必要plan</span>
          <strong>${escapeHtml(label)}</strong>
          <span>${notta.status === 'meets' ? escapeHtml(priceLabel(notta, true)) : '公開情報だけでは確定できません'}</span>
        </div>`;
    }

    if (freeCandidates.length) {
      summaryRoot.innerHTML = `<strong>無料で条件を満たす候補があります：</strong> ${freeCandidates.map(r => `${escapeHtml(r.product)} ${escapeHtml(r.minimumPlan)}`).join(' / ')}<br><small>無料候補を有料planより優先して表示します。</small>`;
    } else if (!outcome.pricingComparable && outcome.paidCurrencies.length > 1) {
      summaryRoot.innerHTML = `<strong>条件を満たす有料候補があります。</strong><br><small>JPYとUSDが混在するため、為替換算なしで「最安」とは判定せず、各通貨の公式価格をそのまま表示します。</small>`;
    } else {
      const first = outcome.ranked.find(r => r.status === 'meets');
      summaryRoot.innerHTML = first
        ? `<strong>条件を満たす候補：</strong> ${escapeHtml(first.product)} ${escapeHtml(first.minimumPlan)}（${escapeHtml(priceLabel(first, true))}）<br><small>Affiliate報酬は順位に使用していません。</small>`
        : `<strong>確定して条件を満たす候補がありません。</strong><br><small>「判定不能」は推定で埋めず、公式確認が必要な状態です。</small>`;
    }

    resultsRoot.innerHTML = outcome.ranked.map(resultCard).join('');
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const input = getInput();
    if (!input.platforms.length) {
      alert('利用する会議platformを1つ以上選択してください。');
      return;
    }
    render(PlanSelector.evaluateAll(input, PRODUCT_DATA));
    document.getElementById('result-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.querySelectorAll('input[name="usageMode"]').forEach(el => el.addEventListener('change', () => {
    const team = document.querySelector('input[name="usageMode"]:checked').value === 'team';
    const seats = document.getElementById('paidSeats');
    if (!team) seats.value = 1;
    seats.disabled = !team;
  }));
})();
