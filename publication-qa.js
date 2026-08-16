const fs = require('fs');
const data = require('./product-data.js');
const { evaluateAll } = require('./logic.js');

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? 'PASS' : 'FAIL'} | ${name}`);
  if (!ok) failures++;
}

const notta = data.find(p => p.product === 'Notta');
const premium = notta.plans.find(p => p.plan === 'Premium');
const business = notta.plans.find(p => p.plan === 'Business');
const plus = notta.excludedPlans.find(p => p.plan === 'Business Plus');

check('Notta Premium JPY annual total = 14,220 tax included', premium.price.currency === 'JPY' && premium.price.annualMonthly === 1185 && premium.price.annualTotal === 14220 && premium.price.tax === 'tax-included');
check('Notta Business JPY annual total = 30,096 tax included per account', business.price.currency === 'JPY' && business.price.annualMonthly === 2508 && business.price.annualTotal === 30096 && business.price.tax === 'tax-included' && business.price.perSeat === true);
check('Business Plus is displayed as excluded diagnostic plan', Boolean(plus) && !notta.plans.some(p => p.plan === 'Business Plus') && plus.price.annualTotal === 64800 && plus.price.tax === 'tax-exclusive');

const mixed = evaluateAll({ platforms: ['zoom'], maxMeetingMinutes: 90, monthlyMinutes: 2000, usageMode: 'individual', paidSeats: 1, translationRequired: false, crmRequired: true, videoRequired: false }, data);
check('Mixed JPY/USD paid candidates are not marked price-comparable', mixed.pricingComparable === false && mixed.paidCurrencies.includes('JPY') && mixed.paidCurrencies.includes('USD'));
check('Mixed-currency ranking does not claim cross-currency cheapest by sorting', mixed.ranked.filter(r => r.status === 'meets').map(r => r.product).slice(0, 4).join('|') === 'Notta|Fireflies.ai|tl;dv|Otter.ai');

const html = fs.readFileSync('./index.html', 'utf8');
check('UI shows Business Plus diagnostic exclusion', html.includes('Business Plus') && html.includes('対象外'));
check('UI contains checked date', html.includes('2026-08-16'));
check('UI contains official source links', html.includes('https://www.notta.ai/pricing') && html.includes('https://fireflies.ai/pricing') && html.includes('https://otter.ai/pricing'));
check('UI has exactly one H1', (html.match(/<h1\b/g) || []).length === 1);
check('GitHub Pages canonical URL is set', html.includes('<link rel="canonical" href="https://ricckyyy.github.io/notta-plan-selector/">'));
check('No affiliate tracking URL is present', !/impact\.com|firstpromoter|partnerstack|ref=affiliate|utm_(source|medium)=affiliate/i.test(html));

console.log(`\nPublication QA: ${11 - failures}/11 PASS`);
if (failures) process.exit(1);
