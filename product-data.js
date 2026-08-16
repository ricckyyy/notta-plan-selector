(function (root, factory) {
  const data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  root.PRODUCT_DATA = data;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const checkedAt = '2026-08-16';

  function price(currency, annualMonthly, annualTotal, options = {}) {
    return {
      currency,
      billing: options.billing || 'annual',
      annualMonthly,
      annualTotal,
      perSeat: Boolean(options.perSeat),
      tax: options.tax || 'not-stated',
      exactAnnualTotal: options.exactAnnualTotal !== false,
      note: options.note || ''
    };
  }

  return [
    {
      product: 'Notta',
      homepage: 'https://www.notta.ai/pricing',
      checkedAt,
      pricingSourceLabel: 'Notta 日本語公式料金',
      excludedPlans: [
        {
          plan: 'Business Plus',
          price: price('JPY', 5400, 64800, {
            perSeat: true,
            tax: 'tax-exclusive',
            exactAnnualTotal: true,
            note: '年額64,800円/年/アカウント（税抜、12か月一括）。月間契約は9,000円/月/アカウント（税抜）。'
          }),
          source: 'https://www.notta.ai/news/info/notta-business-plus',
          reason: '現8入力には「Notta Brainを本格利用する」「AI学習なしが必須」等がないため、Businessとの差を機械判定できない。料金表には表示するが診断候補には含めない。'
        }
      ],
      plans: [
        {
          plan: 'Free',
          free: true,
          price: price('JPY', 0, 0, { billing: 'free', tax: 'tax-included' }),
          maxSeats: 1,
          monthlyTranscriptionMinutes: 120,
          maxMeetingMinutes: 3,
          supportedMeetingPlatforms: ['zoom', 'teams', 'meet', 'webex'],
          japaneseTranscription: true,
          transcriptTranslation: false,
          crmOrZapier: false,
          videoRecording: false,
          videoPlatforms: [],
          sources: ['https://www.notta.ai/pricing']
        },
        {
          plan: 'Premium',
          free: false,
          price: price('JPY', 1185, 14220, {
            billing: 'annual',
            tax: 'tax-included',
            exactAnnualTotal: true,
            note: '年払い時1,185円/月、総額14,220円（税込・12か月一括）。'
          }),
          maxSeats: 1,
          monthlyTranscriptionMinutes: 1800,
          maxMeetingMinutes: 300,
          supportedMeetingPlatforms: ['zoom', 'teams', 'meet', 'webex'],
          japaneseTranscription: true,
          transcriptTranslation: true,
          crmOrZapier: false,
          videoRecording: false,
          videoPlatforms: [],
          sources: ['https://www.notta.ai/pricing']
        },
        {
          plan: 'Business',
          free: false,
          price: price('JPY', 2508, 30096, {
            billing: 'annual',
            perSeat: true,
            tax: 'tax-included',
            exactAnnualTotal: true,
            note: '年払い時2,508円/月、1アカウント時の総額30,096円（税込・12か月一括）。アカウント数で総額が増える。'
          }),
          maxSeats: null,
          monthlyTranscriptionMinutes: Infinity,
          maxMeetingMinutes: 300,
          supportedMeetingPlatforms: ['zoom', 'teams', 'meet', 'webex'],
          japaneseTranscription: true,
          transcriptTranslation: true,
          crmOrZapier: true,
          videoRecording: true,
          videoPlatforms: ['zoom', 'teams', 'meet', 'webex'],
          sources: ['https://www.notta.ai/pricing']
        },
        {
          plan: 'Enterprise',
          free: false,
          price: null,
          minSeats: null,
          maxSeats: null,
          monthlyTranscriptionMinutes: null,
          maxMeetingMinutes: 300,
          supportedMeetingPlatforms: ['zoom', 'teams', 'meet', 'webex'],
          japaneseTranscription: true,
          transcriptTranslation: true,
          crmOrZapier: true,
          videoRecording: true,
          videoPlatforms: ['zoom', 'teams', 'meet', 'webex'],
          sources: ['https://www.notta.ai/pricing']
        }
      ]
    },
    {
      product: 'Fireflies.ai',
      homepage: 'https://fireflies.ai/pricing',
      checkedAt,
      pricingSourceLabel: 'Fireflies.ai 公式料金（USD）',
      plans: [
        {
          plan: 'Free',
          free: true,
          price: price('USD', 0, 0, { billing: 'free' }),
          maxSeats: null,
          monthlyTranscriptionMinutes: Infinity,
          maxMeetingMinutes: 120,
          supportedMeetingPlatforms: ['zoom', 'teams', 'meet', 'webex'],
          japaneseTranscription: true,
          transcriptTranslation: null,
          crmOrZapier: false,
          videoRecording: false,
          videoPlatforms: [],
          sources: ['https://fireflies.ai/pricing', 'https://guide.fireflies.ai/articles/6176608577-learn-about-fireflies-free-plan-features']
        },
        {
          plan: 'Pro',
          free: false,
          price: price('USD', 10, 120, { billing: 'annual', perSeat: true, exactAnnualTotal: false, note: 'US$10/seat/month billed annually。年間額は月額×12の概算。' }),
          maxSeats: null,
          monthlyTranscriptionMinutes: Infinity,
          maxMeetingMinutes: 120,
          supportedMeetingPlatforms: ['zoom', 'teams', 'meet', 'webex'],
          japaneseTranscription: true,
          transcriptTranslation: null,
          crmOrZapier: true,
          videoRecording: true,
          videoPlatforms: ['zoom', 'teams', 'meet'],
          sources: ['https://fireflies.ai/pricing', 'https://guide.fireflies.ai/articles/1980499609-how-to-capture-video-for-your-fireflies-meetings']
        },
        {
          plan: 'Business',
          free: false,
          price: price('USD', 19, 228, { billing: 'annual', perSeat: true, exactAnnualTotal: false, note: 'US$19/seat/month billed annually。年間額は月額×12の概算。' }),
          maxSeats: null,
          monthlyTranscriptionMinutes: Infinity,
          maxMeetingMinutes: 180,
          supportedMeetingPlatforms: ['zoom', 'teams', 'meet', 'webex'],
          japaneseTranscription: true,
          transcriptTranslation: null,
          crmOrZapier: true,
          videoRecording: true,
          videoPlatforms: ['zoom', 'teams', 'meet'],
          sources: ['https://fireflies.ai/pricing', 'https://guide.fireflies.ai/articles/9592347753-how-long-can-fireflies-stay-in-your-meetings']
        },
        {
          plan: 'Enterprise',
          free: false,
          price: price('USD', 39, 468, { billing: 'annual', perSeat: true, exactAnnualTotal: false, note: 'US$39/seat/month、annual only。年間額は月額×12の概算。' }),
          maxSeats: null,
          monthlyTranscriptionMinutes: Infinity,
          maxMeetingMinutes: 240,
          supportedMeetingPlatforms: ['zoom', 'teams', 'meet', 'webex'],
          japaneseTranscription: true,
          transcriptTranslation: null,
          crmOrZapier: true,
          videoRecording: true,
          videoPlatforms: ['zoom', 'teams', 'meet'],
          sources: ['https://fireflies.ai/pricing', 'https://guide.fireflies.ai/articles/9592347753-how-long-can-fireflies-stay-in-your-meetings']
        }
      ]
    },
    {
      product: 'tl;dv',
      homepage: 'https://tldv.io/',
      checkedAt,
      pricingSourceLabel: 'tl;dv 公式情報（USD）',
      plans: [
        {
          plan: 'Free',
          free: true,
          price: price('USD', 0, 0, { billing: 'free' }),
          maxSeats: null,
          monthlyTranscriptionMinutes: Infinity,
          maxMeetingMinutes: Infinity,
          supportedMeetingPlatforms: ['zoom', 'teams', 'meet'],
          japaneseTranscription: true,
          transcriptTranslation: true,
          crmOrZapier: false,
          videoRecording: true,
          videoPlatforms: ['zoom', 'teams', 'meet'],
          sources: ['https://tldv.io/']
        },
        {
          plan: 'Pro',
          free: false,
          price: price('USD', 18, 216, { billing: 'annual', perSeat: true, exactAnnualTotal: true, note: 'US$18/seat/month billed annually（US$216/year）。' }),
          maxSeats: null,
          monthlyTranscriptionMinutes: Infinity,
          maxMeetingMinutes: Infinity,
          supportedMeetingPlatforms: ['zoom', 'teams', 'meet'],
          japaneseTranscription: true,
          transcriptTranslation: true,
          crmOrZapier: true,
          videoRecording: true,
          videoPlatforms: ['zoom', 'teams', 'meet'],
          sources: ['https://tldv.io/blog/tldv-vs-bluedot/', 'https://tldv.io/blog/tldv-vs-krisp/']
        },
        {
          plan: 'Business',
          free: false,
          price: price('USD', 29, 348, { billing: 'annual', perSeat: true, exactAnnualTotal: true, note: 'US$29/seat/month billed annually（US$348/year）。' }),
          maxSeats: null,
          monthlyTranscriptionMinutes: Infinity,
          maxMeetingMinutes: Infinity,
          supportedMeetingPlatforms: ['zoom', 'teams', 'meet'],
          japaneseTranscription: true,
          transcriptTranslation: true,
          crmOrZapier: true,
          videoRecording: true,
          videoPlatforms: ['zoom', 'teams', 'meet'],
          sources: ['https://tldv.io/blog/tldv-vs-bluedot/', 'https://tldv.io/blog/tldv-vs-krisp/']
        },
        {
          plan: 'Enterprise',
          free: false,
          price: null,
          maxSeats: null,
          monthlyTranscriptionMinutes: Infinity,
          maxMeetingMinutes: Infinity,
          supportedMeetingPlatforms: ['zoom', 'teams', 'meet'],
          japaneseTranscription: true,
          transcriptTranslation: true,
          crmOrZapier: true,
          videoRecording: true,
          videoPlatforms: ['zoom', 'teams', 'meet'],
          sources: ['https://tldv.io/']
        }
      ]
    },
    {
      product: 'Otter.ai',
      homepage: 'https://otter.ai/pricing',
      checkedAt,
      pricingSourceLabel: 'Otter.ai 公式料金（USD）',
      plans: [
        {
          plan: 'Basic',
          free: true,
          price: price('USD', 0, 0, { billing: 'free' }),
          maxSeats: 5,
          monthlyTranscriptionMinutes: 300,
          maxMeetingMinutes: 30,
          supportedMeetingPlatforms: ['zoom', 'teams', 'meet'],
          japaneseTranscription: true,
          transcriptTranslation: true,
          crmOrZapier: false,
          videoRecording: false,
          videoPlatforms: [],
          sources: ['https://otter.ai/pricing', 'https://help.otter.ai/hc/en-us/articles/26660468516631-Transcribe-conversations-in-English-Spanish-French-German-Japanese-or-Chinese-Simplified']
        },
        {
          plan: 'Pro',
          free: false,
          price: price('USD', 8.33, 99.96, { billing: 'annual', perSeat: true, exactAnnualTotal: false, note: 'US$8.33/user/month（annual表示）。年間額は月額×12の概算。' }),
          maxSeats: 5,
          monthlyTranscriptionMinutes: 1200,
          maxMeetingMinutes: 90,
          supportedMeetingPlatforms: ['zoom', 'teams', 'meet'],
          japaneseTranscription: true,
          transcriptTranslation: true,
          crmOrZapier: true,
          videoRecording: false,
          videoPlatforms: [],
          sources: ['https://otter.ai/pricing', 'https://help.otter.ai/hc/en-us/articles/26660468516631-Transcribe-conversations-in-English-Spanish-French-German-Japanese-or-Chinese-Simplified']
        },
        {
          plan: 'Business',
          free: false,
          price: price('USD', 19.99, 239.88, { billing: 'annual', perSeat: true, exactAnnualTotal: false, note: 'US$19.99/user/month（annual表示）。年間額は月額×12の概算。' }),
          maxSeats: 25,
          monthlyTranscriptionMinutes: Infinity,
          maxMeetingMinutes: 240,
          supportedMeetingPlatforms: ['zoom', 'teams', 'meet'],
          japaneseTranscription: true,
          transcriptTranslation: true,
          crmOrZapier: true,
          videoRecording: false,
          videoPlatforms: [],
          sources: ['https://otter.ai/pricing', 'https://help.otter.ai/hc/en-us/articles/26660468516631-Transcribe-conversations-in-English-Spanish-French-German-Japanese-or-Chinese-Simplified']
        },
        {
          plan: 'Enterprise',
          free: false,
          price: null,
          maxSeats: null,
          monthlyTranscriptionMinutes: Infinity,
          maxMeetingMinutes: 240,
          supportedMeetingPlatforms: ['zoom', 'teams', 'meet'],
          japaneseTranscription: true,
          transcriptTranslation: true,
          crmOrZapier: true,
          videoRecording: true,
          videoPlatforms: ['zoom', 'meet'],
          sources: ['https://otter.ai/pricing', 'https://help.otter.ai/hc/en-us/articles/26660468516631-Transcribe-conversations-in-English-Spanish-French-German-Japanese-or-Chinese-Simplified']
        }
      ]
    }
  ];
});
