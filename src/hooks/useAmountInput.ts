import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type RefCallback,
} from 'react';

export type AmountInputLanguage = 'en' | 'de' | 'nl' | 'fr';

type AmountInputValue = string | number | null | undefined;

export interface UseAmountInputOptions {
  language: AmountInputLanguage;
  decimalCount: number;
  defaultValue?: string | number | null;
}

export interface UseAmountInputReturn {
  value: string;
  displayValue: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  ref: RefCallback<HTMLInputElement>;
  reset: () => void;
  updateValue: (value: AmountInputValue) => void;
}

const THOUSAND_SEPARATOR: Record<AmountInputLanguage, string> = {
  fr: ' ',
  nl: '.',
  en: ',',
  de: ' ',
};

const DECIMAL_SEPARATOR: Record<AmountInputLanguage, string> = {
  fr: ',',
  nl: ',',
  en: '.',
  de: ',',
};

export function useAmountInput({
  language,
  decimalCount,
  defaultValue = '',
}: UseAmountInputOptions): UseAmountInputReturn {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const initialValueRef = useRef<string>(normalizeExternalValue(defaultValue, decimalCount));

  const [rawValue, setRawValue] = useState<string>(initialValueRef.current);

  const [displayValue, setDisplayValue] = useState<string>(() =>
    formatAmount(initialValueRef.current, language, decimalCount),
  );

  /**
   * Stores the cursor position that should be restored
   * after React updates the input value.
   */
  const pendingCursorRef = useRef<number | null>(null);

  /**
   * Callback ref exposed to the consumer.
   */
  const ref = useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node;
  }, []);

  /**
   * Restore cursor after React has committed the formatted value.
   */
  useEffect(() => {
    if (pendingCursorRef.current === null || !inputRef.current) {
      return;
    }

    const cursorPosition = pendingCursorRef.current;

    pendingCursorRef.current = null;

    requestAnimationFrame(() => {
      if (!inputRef.current) {
        return;
      }

      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    });
  }, [displayValue]);

  /**
   * Convert whatever the consumer passes to the canonical
   * unformatted representation:
   *
   * "12.50"
   * "12,50"
   * 12.5
   *
   * -> "12.50"
   */
  const updateValue = useCallback(
    (value: AmountInputValue) => {
      const normalized = normalizeExternalValue(value, decimalCount);

      setRawValue(normalized);

      setDisplayValue(formatAmount(normalized, language, decimalCount));

      pendingCursorRef.current = null;
    },
    [language, decimalCount],
  );

  /**
   * Reset to the original default value.
   */
  const reset = useCallback(() => {
    const normalized = initialValueRef.current;

    setRawValue(normalized);

    setDisplayValue(formatAmount(normalized, language, decimalCount));

    pendingCursorRef.current = null;
  }, [language, decimalCount]);

  /**
   * Main input handler.
   */
  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.target;

      const inputValue = input.value;
      const selectionStart = input.selectionStart ?? inputValue.length;

      const decimalSeparator = DECIMAL_SEPARATOR[language];

      /**
       * Count how many meaningful characters existed
       * before the cursor.
       *
       * We count digits + the decimal separator.
       *
       * This allows us to calculate the cursor position
       * after thousand separators are inserted/removed.
       */
      const meaningfulCharactersBeforeCursor = countMeaningfulCharacters(
        inputValue.slice(0, selectionStart),
        decimalSeparator,
      );

      /**
       * Convert the displayed value to canonical form.
       *
       * Example FR:
       *
       * "12 345,67"
       *
       * -> "12345.67"
       */
      const normalized = normalizeInput(inputValue, language, decimalCount);

      /**
       * Format it again for display.
       */
      const formatted = formatAmount(normalized, language, decimalCount);

      /**
       * Calculate the new cursor position.
       */
      const newCursorPosition = getCursorPositionFromMeaningfulIndex(
        formatted,
        meaningfulCharactersBeforeCursor,
        decimalSeparator,
      );

      pendingCursorRef.current = newCursorPosition;

      setRawValue(normalized);
      setDisplayValue(formatted);
    },
    [language, decimalCount],
  );

  /**
   * Blur handler.
   *
   * You can decide whether you want to keep intermediate
   * states such as "12." or normalize them on blur.
   */
  const onBlur = useCallback(() => {
    const normalized = normalizeInput(displayValue, language, decimalCount);

    const formatted = formatAmount(normalized, language, decimalCount);

    setRawValue(normalized);
    setDisplayValue(formatted);
  }, [displayValue, language, decimalCount]);

  return {
    /**
     * Canonical (unformatted) value for forms and APIs.
     *
     * Example:
     * displayValue = "12 345,67"
     * value        = "12345.67"
     */
    value: rawValue,

    /**
     * Locale-formatted string. Bind this to the input.
     */
    displayValue,

    onChange,
    onBlur,
    ref,

    reset,
    updateValue,
  };
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function normalizeExternalValue(value: AmountInputValue, decimalCount: number): string {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const stringValue = String(value);

  /**
   * External values are expected to be canonical numbers,
   * but accepting "," makes the function safer.
   */
  const normalized = stringValue.replace(/\s/g, '').replace(',', '.');

  return normalizeCanonicalValue(normalized, decimalCount);
}

function normalizeInput(
  value: string,
  language: AmountInputLanguage,
  decimalCount: number,
): string {
  const decimalSeparator = DECIMAL_SEPARATOR[language];

  /**
   * Remove thousand separators.
   */
  const thousandSeparator = THOUSAND_SEPARATOR[language];

  let input = value;

  if (thousandSeparator === ' ') {
    input = input.replace(/\s/g, '');
  } else {
    input = input.split(thousandSeparator).join('');
  }

  /**
   * Convert language-specific decimal separator
   * to canonical ".".
   */
  if (decimalSeparator !== '.') {
    input = input.replace(new RegExp(escapeRegExp(decimalSeparator), 'g'), '.');
  }

  /**
   * Keep only digits and ".".
   */
  input = input.replace(/[^\d.]/g, '');

  /**
   * Only one decimal point.
   */
  const firstDot = input.indexOf('.');

  if (firstDot !== -1) {
    input = input.slice(0, firstDot + 1) + input.slice(firstDot + 1).replaceAll('.', '');
  }

  /**
   * Split integer / decimal parts.
   */
  let [integerPart, decimalPart] = input.split('.');

  /**
   * Handle input such as ".50".
   */
  integerPart ??= '';

  /**
   * Limit decimals.
   */
  if (decimalPart !== undefined) {
    decimalPart = decimalPart.replace(/\D/g, '').slice(0, decimalCount);
  }

  /**
   * Avoid unnecessary leading zeros while
   * preserving "0.xxx".
   */
  if (integerPart.length > 1) {
    integerPart = integerPart.replace(/^0+(?=\d)/, '');
  }

  if (decimalPart !== undefined) {
    return `${integerPart || '0'}.${decimalPart}`;
  }

  return integerPart;
}

function normalizeCanonicalValue(value: string, decimalCount: number): string {
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

function formatAmount(value: string, language: AmountInputLanguage, decimalCount: number): string {
  if (!value) {
    return '';
  }

  const thousandSeparator = THOUSAND_SEPARATOR[language];

  const decimalSeparator = DECIMAL_SEPARATOR[language];

  const [integerPart = '', decimalPart] = value.split('.');

  /**
   * Format thousands without regex backtracking.
   */
  const formattedInteger = insertThousandSeparators(integerPart, thousandSeparator);

  /**
   * Don't add decimal separator unless
   * the user actually entered decimals.
   */
  if (decimalPart !== undefined && decimalCount > 0) {
    return formattedInteger + decimalSeparator + decimalPart;
  }

  return formattedInteger;
}

/**
 * Count meaningful characters before cursor.
 *
 * Example:
 *
 * "12 345,6"
 *       ^
 *
 * meaningful count = 6
 *
 * 1 2 3 4 5 ,
 */
function countMeaningfulCharacters(value: string, decimalSeparator: string): number {
  let count = 0;

  for (const character of value) {
    if (/\d/.test(character) || character === decimalSeparator) {
      count++;
    }
  }

  return count;
}

/**
 * Convert a meaningful-character index into a
 * formatted string cursor position.
 */
function getCursorPositionFromMeaningfulIndex(
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
