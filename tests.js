const data = require('./product-data.js');
const { evaluateAll } = require('./logic.js');

const cases = [
  {
    id: 'A',
    input: { platforms: ['zoom'], maxMeetingMinutes: 60, monthlyMinutes: 600, usageMode: 'individual', paidSeats: 1, translationRequired: false, crmRequired: false, videoRequired: false },
    expect: { 'Notta': ['meets', 'Premium'], 'Fireflies.ai': ['meets', 'Free'], 'tl;dv': ['meets', 'Free'], 'Otter.ai': ['meets', 'Pro'] }
  },
  {
    id: 'B',
    input: { platforms: ['zoom'], maxMeetingMinutes: 90, monthlyMinutes: 2000, usageMode: 'individual', paidSeats: 1, translationRequired: false, crmRequired: true, videoRequired: false },
    expect: { 'Notta': ['meets', 'Business'], 'Fireflies.ai': ['meets', 'Pro'], 'tl;dv': ['meets', 'Pro'], 'Otter.ai': ['meets', 'Business'] }
  },
  {
    id: 'C',
    input: { platforms: ['zoom', 'meet'], maxMeetingMinutes: 120, monthlyMinutes: 5000, usageMode: 'team', paidSeats: 5, translationRequired: false, crmRequired: true, videoRequired: true },
    expect: { 'Notta': ['meets', 'Business'], 'Fireflies.ai': ['meets', 'Pro'], 'tl;dv': ['meets', 'Pro'], 'Otter.ai': ['meets', 'Enterprise'] }
  },
  {
    id: 'D',
    input: { platforms: ['zoom'], maxMeetingMinutes: 60, monthlyMinutes: 800, usageMode: 'individual', paidSeats: 1, translationRequired: true, crmRequired: false, videoRequired: false },
    expect: { 'Notta': ['meets', 'Premium'], 'Fireflies.ai': ['unknown', null], 'tl;dv': ['meets', 'Free'], 'Otter.ai': ['meets', 'Pro'] }
  },
  {
    id: 'E',
    input: { platforms: ['zoom'], maxMeetingMinutes: 60, monthlyMinutes: 100, usageMode: 'individual', paidSeats: 1, translationRequired: false, crmRequired: false, videoRequired: false },
    expect: { 'Notta': ['meets', 'Premium'], 'Fireflies.ai': ['meets', 'Free'], 'tl;dv': ['meets', 'Free'], 'Otter.ai': ['meets', 'Pro'] }
  }
];

let failed = 0;
for (const t of cases) {
  const out = evaluateAll(t.input, data);
  console.log(`\nCase ${t.id}`);
  for (const r of out.results) {
    const cost = r.annualCost ? `${r.annualCost.currency} ${r.annualCost.amount}` : 'custom/unknown';
    console.log(`- ${r.product}: ${r.status} / ${r.minimumPlan || r.confirmedFallbackPlan || '-'} / annual=${cost}`);
    const [status, plan] = t.expect[r.product];
    if (r.status !== status || (r.minimumPlan || null) !== plan) {
      failed++;
      console.error(`  EXPECTED ${status}/${plan}, got ${r.status}/${r.minimumPlan}`);
    }
  }
}

if (failed) {
  console.error(`\nFAILED: ${failed} assertion(s)`);
  process.exit(1);
}
console.log('\nPASS: all 5 cases matched expected minimum-plan outcomes.');
