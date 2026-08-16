(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.PlanSelector = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const PLATFORM_LABELS = { zoom: 'Zoom', teams: 'Microsoft Teams', meet: 'Google Meet', webex: 'Webex' };

  function money(value, currency) {
    if (value === null || value === undefined || Number.isNaN(value)) return null;
    const precision = currency === 'JPY' ? 0 : 2;
    const factor = 10 ** precision;
    return Math.round(value * factor) / factor;
  }

  function annualCost(plan, input) {
    if (!plan.price) return null;
    if (plan.free) return { amount: 0, currency: plan.price.currency, estimated: false, perSeat: false };
    const seats = plan.price.perSeat ? Math.max(1, Number(input.paidSeats) || 1) : 1;
    const base = plan.price.annualTotal != null
      ? plan.price.annualTotal
      : (plan.price.annualMonthly != null ? plan.price.annualMonthly * 12 : null);
    if (base === null) return null;
    return {
      amount: money(base * seats, plan.price.currency),
      currency: plan.price.currency,
      estimated: plan.price.exactAnnualTotal === false,
      perSeat: plan.price.perSeat,
      seats,
      tax: plan.price.tax,
      billing: plan.price.billing,
      monthlyEquivalent: plan.price.annualMonthly
    };
  }

  function checkKnownBoolean(value, required, okReason, noReason, unknownReason) {
    if (!required) return { state: 'pass', reason: null };
    if (value === true) return { state: 'pass', reason: okReason };
    if (value === false) return { state: 'reject', reason: noReason };
    return { state: 'unknown', reason: unknownReason };
  }

  function evaluatePlan(plan, input) {
    const rejectReasons = [];
    const unknownReasons = [];
    const matchReasons = [];

    const platforms = input.platforms || [];
    for (const platform of platforms) {
      if (!plan.supportedMeetingPlatforms.includes(platform)) {
        rejectReasons.push(`${PLATFORM_LABELS[platform]} の会議取り込みをこのplanでは確認できない`);
      }
    }

    const monthly = Number(input.monthlyMinutes) || 0;
    if (plan.monthlyTranscriptionMinutes === null) {
      if (monthly > 0) unknownReasons.push('月間文字起こし上限が公開情報から確定できない');
    } else if (monthly > plan.monthlyTranscriptionMinutes) {
      rejectReasons.push(`月${monthly.toLocaleString()}分は上限${Number.isFinite(plan.monthlyTranscriptionMinutes) ? plan.monthlyTranscriptionMinutes.toLocaleString() + '分' : 'なし'}を超える`);
    } else if (Number.isFinite(plan.monthlyTranscriptionMinutes)) {
      matchReasons.push(`月${monthly.toLocaleString()}分 ≤ 上限${plan.monthlyTranscriptionMinutes.toLocaleString()}分`);
    } else {
      matchReasons.push('月間meeting文字起こしは無制限');
    }

    const maxMeeting = Number(input.maxMeetingMinutes) || 0;
    if (plan.maxMeetingMinutes === null) {
      if (maxMeeting > 0) unknownReasons.push('1回あたり会議長の上限が公開情報から確定できない');
    } else if (maxMeeting > plan.maxMeetingMinutes) {
      rejectReasons.push(`最長${maxMeeting}分の会議は1回上限${Number.isFinite(plan.maxMeetingMinutes) ? plan.maxMeetingMinutes + '分' : 'なし'}を超える`);
    } else if (Number.isFinite(plan.maxMeetingMinutes)) {
      matchReasons.push(`最長${maxMeeting}分 ≤ 1回上限${plan.maxMeetingMinutes}分`);
    } else {
      matchReasons.push('1回あたりのmeeting時間をmeterしない公開仕様');
    }

    const seats = Math.max(1, Number(input.paidSeats) || 1);
    if (plan.minSeats && seats < plan.minSeats) rejectReasons.push(`${plan.plan} は${plan.minSeats}席以上が開始条件`);
    if (plan.maxSeats && seats > plan.maxSeats) rejectReasons.push(`${seats}人利用に対して最大${plan.maxSeats}席まで`);

    if (input.translationRequired) {
      const c = checkKnownBoolean(
        plan.transcriptTranslation,
        true,
        '翻訳要件に対応',
        '翻訳機能をこのplanでは確認できない',
        '翻訳機能の提供条件を公開情報から確定できない'
      );
      if (c.state === 'reject') rejectReasons.push(c.reason);
      if (c.state === 'unknown') unknownReasons.push(c.reason);
      if (c.state === 'pass' && c.reason) matchReasons.push(c.reason);
    }

    if (input.crmRequired) {
      const c = checkKnownBoolean(
        plan.crmOrZapier,
        true,
        'CRM/Zapier等の連携要件に対応',
        'CRM/Zapier等の連携要件を満たさない',
        'CRM/Zapier等の連携可否が公開情報から確定できない'
      );
      if (c.state === 'reject') rejectReasons.push(c.reason);
      if (c.state === 'unknown') unknownReasons.push(c.reason);
      if (c.state === 'pass' && c.reason) matchReasons.push(c.reason);
    }

    if (input.videoRequired) {
      if (plan.videoRecording === null) {
        unknownReasons.push('会議video recordingの提供条件が公開情報から確定できない');
      } else if (!plan.videoRecording) {
        rejectReasons.push('会議video recordingに対応しない');
      } else {
        for (const platform of platforms) {
          if (plan.videoPlatforms && !plan.videoPlatforms.includes(platform)) {
            rejectReasons.push(`${PLATFORM_LABELS[platform]} でのvideo recordingを確認できない`);
          }
        }
        if (!rejectReasons.some(r => r.includes('video recording'))) matchReasons.push('video recording要件に対応');
      }
    }

    let status = 'meets';
    if (rejectReasons.length) status = 'reject';
    else if (unknownReasons.length) status = 'unknown';

    return {
      plan: plan.plan,
      status,
      annualCost: annualCost(plan, input),
      rejectReasons,
      unknownReasons,
      matchReasons,
      planData: plan
    };
  }

  function evaluateProduct(product, input) {
    const planResults = product.plans.map(plan => evaluatePlan(plan, input));
    const firstConfirmed = planResults.find(r => r.status === 'meets');
    const firstConfirmedIndex = firstConfirmed ? planResults.indexOf(firstConfirmed) : -1;
    const earlierUnknown = firstConfirmedIndex > 0 ? planResults.slice(0, firstConfirmedIndex).find(r => r.status === 'unknown') : null;
    const anyUnknown = planResults.find(r => r.status === 'unknown');

    const common = {
      product: product.product,
      homepage: product.homepage,
      checkedAt: product.checkedAt,
      pricingSourceLabel: product.pricingSourceLabel,
      excludedPlans: product.excludedPlans || [],
      planResults
    };

    if (firstConfirmed && !earlierUnknown) {
      return {
        ...common,
        status: 'meets',
        minimumPlan: firstConfirmed.plan,
        annualCost: firstConfirmed.annualCost,
        reasons: firstConfirmed.matchReasons,
        uncertainty: []
      };
    }

    if (firstConfirmed && earlierUnknown) {
      return {
        ...common,
        status: 'unknown',
        minimumPlan: null,
        confirmedFallbackPlan: firstConfirmed.plan,
        annualCost: firstConfirmed.annualCost,
        reasons: firstConfirmed.matchReasons,
        uncertainty: [`${earlierUnknown.plan} が要件を満たすか公開情報だけでは確定できないため、最低planを断定できない`]
      };
    }

    if (anyUnknown) {
      return {
        ...common,
        status: 'unknown',
        minimumPlan: null,
        annualCost: null,
        reasons: [],
        uncertainty: anyUnknown.unknownReasons
      };
    }

    return {
      ...common,
      status: 'reject',
      minimumPlan: null,
      annualCost: null,
      reasons: [],
      uncertainty: []
    };
  }

  function evaluateAll(input, data) {
    const results = data.map(product => evaluateProduct(product, input));
    const knownMeets = results.filter(r => r.status === 'meets');
    const free = knownMeets.filter(r => r.annualCost && r.annualCost.amount === 0);
    const paidKnown = knownMeets.filter(r => r.annualCost && r.annualCost.amount > 0);
    const customCost = knownMeets.filter(r => !r.annualCost);
    const currencies = [...new Set(paidKnown.map(r => r.annualCost.currency))];
    const comparablePaid = currencies.length <= 1;
    const paidOrdered = comparablePaid
      ? [...paidKnown].sort((a, b) => a.annualCost.amount - b.annualCost.amount || a.product.localeCompare(b.product))
      : paidKnown;
    const unknown = results.filter(r => r.status === 'unknown');
    const rejected = results.filter(r => r.status === 'reject');

    return {
      results,
      ranked: [...free, ...paidOrdered, ...customCost, ...unknown, ...rejected],
      pricingComparable: comparablePaid,
      paidCurrencies: currencies
    };
  }

  return { evaluatePlan, evaluateProduct, evaluateAll, annualCost, PLATFORM_LABELS };
});
