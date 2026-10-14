export interface AmountLocaleConfig {
  thousandSeparator: string;
  decimalSeparator: string;
}

export type AmountInputLanguage = 'en' | 'de' | 'nl' | 'fr' | (string & {});

type AmountInputValue = string | number | null | undefined;

const BUILTIN_LOCALES: Record<string, AmountLocaleConfig> = {
  en: { thousandSeparator: ',', decimalSeparator: '.' },
  de: { thousandSeparator: ' ', decimalSeparator: ',' },
  nl: { thousandSeparator: '.', decimalSeparator: ',' },
  fr: { thousandSeparator: ' ', decimalSeparator: ',' },
};

const FALLBACK_LOCALE = BUILTIN_LOCALES.en!;

export function resolveAmountLocale(
  language: AmountInputLanguage,
  locales?: Record<string, AmountLocaleConfig>,
): AmountLocaleConfig {
  const candidate = locales?.[language] ?? BUILTIN_LOCALES[language];

  if (!candidate || candidate.thousandSeparator === candidate.decimalSeparator) {
    return FALLBACK_LOCALE;
  }

  return candidate;
}

export function normalizeExternalValue(value: AmountInputValue, decimalCount: number): string {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const stringValue = String(value);
  const normalized = stringValue.replace(/\s/g, '').replace(',', '.');

  return normalizeCanonicalValue(normalized, decimalCount);
}

export function normalizeInput(
  value: string,
  locale: AmountLocaleConfig,
  decimalCount: number,
): string {
  const { decimalSeparator, thousandSeparator } = locale;

  let input = value;

  if (thousandSeparator === ' ') {
    input = input.replace(/\s/g, '');
  } else {
    input = input.split(thousandSeparator).join('');
  }

  if (decimalSeparator !== '.') {
    input = input.replace(new RegExp(escapeRegExp(decimalSeparator), 'g'), '.');
  }

  input = input.replace(/[^\d.]/g, '');

  const firstDot = input.indexOf('.');

  if (firstDot !== -1) {
    input = input.slice(0, firstDot + 1) + input.slice(firstDot + 1).replaceAll('.', '');
  }

  let [integerPart, decimalPart] = input.split('.');

  integerPart ??= '';

  if (decimalPart !== undefined) {
    decimalPart = decimalPart.replace(/\D/g, '').slice(0, decimalCount);
  }

  if (integerPart.length > 1) {
    integerPart = integerPart.replace(/^0+(?=\d)/, '');
  }

  if (decimalPart !== undefined) {
    return `${integerPart || '0'}.${decimalPart}`;
  }

  return integerPart;
}

export function normalizeCanonicalValue(value: string, decimalCount: number): string {
  if (!value) {
    return '';
  }

  let normalized = value.replace(/[^\d.]/g, '');

  const firstDot = normalized.indexOf('.');

  if (firstDot !== -1) {
    normalized =
      normalized.slice(0, firstDot + 1) + normalized.slice(firstDot + 1).replaceAll('.', '');

    const [integerPart, decimalPart = ''] = normalized.split('.');

    normalized = `${integerPart || '0'}.${decimalPart.slice(0, decimalCount)}`;
  }

  if (!normalized.includes('.') && normalized.length > 1) {
    normalized = normalized.replace(/^0+(?=\d)/, '');
  }

  return normalized;
}

export function formatAmount(
  value: string,
  locale: AmountLocaleConfig,
  decimalCount: number,
): string {
  if (!value) {
    return '';
  }

  const { thousandSeparator, decimalSeparator } = locale;
  const [integerPart = '', decimalPart] = value.split('.');
  const formattedInteger = insertThousandSeparators(integerPart, thousandSeparator);

  if (decimalPart !== undefined && decimalCount > 0) {
    return formattedInteger + decimalSeparator + decimalPart;
  }

  return formattedInteger;
}

export function countMeaningfulCharacters(value: string, decimalSeparator: string): number {
  let count = 0;

  for (const character of value) {
    if (/\d/.test(character) || character === decimalSeparator) {
      count++;
    }
  }

  return count;
}

export function getCursorPositionFromMeaningfulIndex(
  formattedValue: string,
  meaningfulIndex: number,
  decimalSeparator: string,
): number {
  if (meaningfulIndex <= 0) {
    return 0;
  }

  let meaningfulCount = 0;

  for (let index = 0; index < formattedValue.length; index++) {
    const character = formattedValue[index] ?? '';

    if (/\d/.test(character) || character === decimalSeparator) {
      meaningfulCount++;

      if (meaningfulCount >= meaningfulIndex) {
        return index + 1;
      }
    }
  }

  return formattedValue.length;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

function insertThousandSeparators(integerPart: string, separator: string): string {
  if (!integerPart) return '';

  let result = '';
  let digitCount = 0;

  for (let index = integerPart.length - 1; index >= 0; index--) {
    result = `${integerPart[index] ?? ''}${result}`;
    digitCount += 1;
    if (digitCount % 3 === 0 && index !== 0) result = `${separator}${result}`;
  }

  return result;
}
