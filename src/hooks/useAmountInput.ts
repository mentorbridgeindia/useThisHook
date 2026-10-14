import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type RefCallback,
} from 'react';
import {
  countMeaningfulCharacters,
  formatAmount,
  getCursorPositionFromMeaningfulIndex,
  normalizeExternalValue,
  normalizeInput,
  resolveAmountLocale,
  type AmountInputLanguage,
  type AmountLocaleConfig,
} from './amountInputFormat';

export type { AmountInputLanguage, AmountLocaleConfig };

type AmountInputValue = string | number | null | undefined;

export interface UseAmountInputOptions {
  language: AmountInputLanguage;
  decimalCount: number;
  defaultValue?: string | number | null;
  /** Optional extra (or override) locale configs keyed by language code. */
  locales?: Record<string, AmountLocaleConfig>;
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

export function useAmountInput({
  language,
  decimalCount,
  defaultValue = '',
  locales,
}: UseAmountInputOptions): UseAmountInputReturn {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const locale = useMemo(() => resolveAmountLocale(language, locales), [language, locales]);

  const initialValueRef = useRef<string>(normalizeExternalValue(defaultValue, decimalCount));

  const [rawValue, setRawValue] = useState<string>(initialValueRef.current);

  const [displayValue, setDisplayValue] = useState<string>(() =>
    formatAmount(initialValueRef.current, locale, decimalCount),
  );

  const pendingCursorRef = useRef<number | null>(null);

  const ref = useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node;
  }, []);

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

  const updateValue = useCallback(
    (value: AmountInputValue) => {
      const normalized = normalizeExternalValue(value, decimalCount);
      setRawValue(normalized);
      setDisplayValue(formatAmount(normalized, locale, decimalCount));
      pendingCursorRef.current = null;
    },
    [locale, decimalCount],
  );

  const reset = useCallback(() => {
    const normalized = initialValueRef.current;
    setRawValue(normalized);
    setDisplayValue(formatAmount(normalized, locale, decimalCount));
    pendingCursorRef.current = null;
  }, [locale, decimalCount]);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.target;
      const inputValue = input.value;
      const selectionStart = input.selectionStart ?? inputValue.length;
      const { decimalSeparator } = locale;

      const meaningfulCharactersBeforeCursor = countMeaningfulCharacters(
        inputValue.slice(0, selectionStart),
        decimalSeparator,
      );

      const normalized = normalizeInput(inputValue, locale, decimalCount);
      const formatted = formatAmount(normalized, locale, decimalCount);
      const newCursorPosition = getCursorPositionFromMeaningfulIndex(
        formatted,
        meaningfulCharactersBeforeCursor,
        decimalSeparator,
      );

      pendingCursorRef.current = newCursorPosition;
      setRawValue(normalized);
      setDisplayValue(formatted);
    },
    [locale, decimalCount],
  );

  const onBlur = useCallback(() => {
    const normalized = normalizeInput(displayValue, locale, decimalCount);
    const formatted = formatAmount(normalized, locale, decimalCount);
    setRawValue(normalized);
    setDisplayValue(formatted);
  }, [displayValue, locale, decimalCount]);

  return {
    value: rawValue,
    displayValue,
    onChange,
    onBlur,
    ref,
    reset,
    updateValue,
  };
}
