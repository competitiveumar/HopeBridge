export const CURRENCY_CONFIG = {
  currency: 'GBP',
  locale: 'en-GB',
  currencySymbol: '£',
  currencyFormat: new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }),
};

export const ADDRESS_FORMAT = {
  country: 'United Kingdom',
  format: [
    'line1',
    'line2',
    'city',
    'county',
    'postcode',
  ],
  required: ['line1', 'city', 'postcode'],
};

export const DATE_FORMAT = {
  display: 'dd/MM/yyyy',
  input: 'yyyy-MM-dd',
  locale: 'en-GB',
};

export const LANGUAGE = {
  code: 'en-GB',
  direction: 'ltr',
};

// British English spelling variations
export const SPELLING_VARIATIONS = {
  'center': 'centre',
  'color': 'colour',
  'customize': 'customise',
  'dialog': 'dialogue',
  'fulfill': 'fulfil',
  'organization': 'organisation',
  'program': 'programme',
  'realize': 'realise',
  'specialized': 'specialised',
  'theater': 'theatre',
}; 