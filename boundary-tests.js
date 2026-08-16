const data = require('./product-data.js');
const { evaluateAll, evaluateProduct } = require('./logic.js');

function findProduct(name, input) {
  return evaluateAll(input, data).results.find(r => r.product === name);
}

const base = {
  platforms: ['zoom'], maxMeetingMinutes: 1, monthlyMinutes: 1,
  usageMode: 'individual', paidSeats: 1,
  translationRequired: false, crmRequired: false, videoRequired: false
};

const tests = [
  ['Notta Free monthly: 120 stays Free', () => findProduct('Notta', { ...base, monthlyMinutes: 120, maxMeetingMinutes: 3 }), r => r.status === 'meets' && r.minimumPlan === 'Free'],
  ['Notta Free monthly: 121 moves Premium', () => findProduct('Notta', { ...base, monthlyMinutes: 121, maxMeetingMinutes: 3 }), r => r.status === 'meets' && r.minimumPlan === 'Premium'],
  ['Notta Free meeting: 3 stays Free', () => findProduct('Notta', { ...base, monthlyMinutes: 100, maxMeetingMinutes: 3 }), r => r.status === 'meets' && r.minimumPlan === 'Free'],
  ['Notta Free meeting: 4 moves Premium', () => findProduct('Notta', { ...base, monthlyMinutes: 100, maxMeetingMinutes: 4 }), r => r.status === 'meets' && r.minimumPlan === 'Premium'],
  ['Notta Premium monthly: 1800 stays Premium', () => findProduct('Notta', { ...base, monthlyMinutes: 1800, maxMeetingMinutes: 60 }), r => r.status === 'meets' && r.minimumPlan === 'Premium'],
  ['Notta Premium monthly: 1801 moves Business', () => findProduct('Notta', { ...base, monthlyMinutes: 1801, maxMeetingMinutes: 60 }), r => r.status === 'meets' && r.minimumPlan === 'Business'],
  ['Otter Basic monthly: 300 stays Basic', () => findProduct('Otter.ai', { ...base, monthlyMinutes: 300, maxMeetingMinutes: 30 }), r => r.status === 'meets' && r.minimumPlan === 'Basic'],
  ['Otter Basic monthly: 301 moves Pro', () => findProduct('Otter.ai', { ...base, monthlyMinutes: 301, maxMeetingMinutes: 30 }), r => r.status === 'meets' && r.minimumPlan === 'Pro'],
  ['Otter Basic meeting: 30 stays Basic', () => findProduct('Otter.ai', { ...base, monthlyMinutes: 200, maxMeetingMinutes: 30 }), r => r.status === 'meets' && r.minimumPlan === 'Basic'],
  ['Otter Basic meeting: 31 moves Pro', () => findProduct('Otter.ai', { ...base, monthlyMinutes: 200, maxMeetingMinutes: 31 }), r => r.status === 'meets' && r.minimumPlan === 'Pro'],
  ['Otter Pro monthly: 1200 stays Pro', () => findProduct('Otter.ai', { ...base, monthlyMinutes: 1200, maxMeetingMinutes: 90 }), r => r.status === 'meets' && r.minimumPlan === 'Pro'],
  ['Otter Pro monthly: 1201 moves Business', () => findProduct('Otter.ai', { ...base, monthlyMinutes: 1201, maxMeetingMinutes: 90 }), r => r.status === 'meets' && r.minimumPlan === 'Business'],
  ['Otter Pro meeting: 90 stays Pro', () => findProduct('Otter.ai', { ...base, monthlyMinutes: 600, maxMeetingMinutes: 90 }), r => r.status === 'meets' && r.minimumPlan === 'Pro'],
  ['Otter Pro meeting: 91 moves Business', () => findProduct('Otter.ai', { ...base, monthlyMinutes: 600, maxMeetingMinutes: 91 }), r => r.status === 'meets' && r.minimumPlan === 'Business'],
  ['Seat pricing: Fireflies Pro 1 seat = USD120/year', () => findProduct('Fireflies.ai', { ...base, monthlyMinutes: 600, maxMeetingMinutes: 60, crmRequired: true, paidSeats: 1 }), r => r.status === 'meets' && r.minimumPlan === 'Pro' && r.annualCost.currency === 'USD' && r.annualCost.amount === 120],
  ['Seat pricing: Fireflies Pro 5 seats = USD600/year', () => findProduct('Fireflies.ai', { ...base, monthlyMinutes: 600, maxMeetingMinutes: 60, crmRequired: true, usageMode: 'team', paidSeats: 5 }), r => r.status === 'meets' && r.minimumPlan === 'Pro' && r.annualCost.currency === 'USD' && r.annualCost.amount === 600],
  ['Unknown cheaper plan is not skipped', () => {
    const synthetic = { product: 'Boundary Fixture', homepage: '', checkedAt: '2026-08-16', plans: [
      { plan: 'Cheap', free: false, price: { currency: 'USD', annualTotal: 60, annualMonthly: 5, perSeat: true, exactAnnualTotal: true }, maxSeats: null, monthlyTranscriptionMinutes: Infinity, maxMeetingMinutes: Infinity, supportedMeetingPlatforms: ['zoom'], transcriptTranslation: null, crmOrZapier: false, videoRecording: false, videoPlatforms: [] },
      { plan: 'Expensive', free: false, price: { currency: 'USD', annualTotal: 120, annualMonthly: 10, perSeat: true, exactAnnualTotal: true }, maxSeats: null, monthlyTranscriptionMinutes: Infinity, maxMeetingMinutes: Infinity, supportedMeetingPlatforms: ['zoom'], transcriptTranslation: true, crmOrZapier: false, videoRecording: false, videoPlatforms: [] }
    ]};
    return evaluateProduct(synthetic, { ...base, translationRequired: true });
  }, r => r.status === 'unknown' && r.minimumPlan === null && r.confirmedFallbackPlan === 'Expensive']
];

let failures = 0;
for (const [name, run, check] of tests) {
  const result = run();
  const ok = check(result);
  const annual = result.annualCost ? `${result.annualCost.currency}:${result.annualCost.amount}` : '-';
  console.log(`${ok ? 'PASS' : 'FAIL'} | ${name} | status=${result.status} | minimum=${result.minimumPlan || '-'} | fallback=${result.confirmedFallbackPlan || '-'} | annual=${annual}`);
  if (!ok) failures++;
}
console.log(`\nBoundary tests: ${tests.length - failures}/${tests.length} PASS`);
if (failures) process.exit(1);
