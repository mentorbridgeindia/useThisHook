import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAmountInput } from './useAmountInput';

const AmountField = () => {
  const amount = useAmountInput({
    language: 'fr',
    decimalCount: 2,
    defaultValue: 1234.5,
  });

  return (
    <input
      ref={amount.ref}
      aria-label="amount"
      value={amount.displayValue}
      onChange={amount.onChange}
      onBlur={amount.onBlur}
      data-canonical={amount.value}
    />
  );
};

describe('useAmountInput', () => {
  it('formats the default value for the selected language', () => {
    const { result } = renderHook(() =>
      useAmountInput({ language: 'fr', decimalCount: 2, defaultValue: 1234.5 }),
    );

    expect(result.current.value).toBe('1234.5');
    expect(result.current.displayValue).toBe('1 234,5');
  });

  it('updates and resets the canonical value', () => {
    const { result } = renderHook(() =>
      useAmountInput({ language: 'en', decimalCount: 2, defaultValue: 10 }),
    );

    act(() => {
      result.current.updateValue(12345.67);
    });
    expect(result.current.value).toBe('12345.67');
    expect(result.current.displayValue).toBe('12,345.67');

    act(() => {
      result.current.reset();
    });
    expect(result.current.value).toBe('10');
    expect(result.current.displayValue).toBe('10');
  });

  it('formats typed input and keeps a canonical submit value', () => {
    render(<AmountField />);
    const input = screen.getByLabelText('amount') as HTMLInputElement;

    expect(input.value).toBe('1 234,5');

    fireEvent.change(input, { target: { value: '12345,67' } });

    expect(input.value).toBe('12 345,67');
    expect(input.getAttribute('data-canonical')).toBe('12345.67');
  });

  it('formats with a custom locale from locales', () => {
    const { result } = renderHook(() =>
      useAmountInput({
        language: 'es',
        decimalCount: 2,
        defaultValue: 1234.5,
        locales: {
          es: { thousandSeparator: '.', decimalSeparator: ',' },
        },
      }),
    );

    expect(result.current.value).toBe('1234.5');
    expect(result.current.displayValue).toBe('1.234,5');
  });

  it('falls back to en when language is unknown and not in locales', () => {
    const { result } = renderHook(() =>
      useAmountInput({ language: 'xx', decimalCount: 2, defaultValue: 1234.5 }),
    );

    expect(result.current.displayValue).toBe('1,234.5');
  });

  it('allows overriding a built-in locale via locales', () => {
    const { result } = renderHook(() =>
      useAmountInput({
        language: 'fr',
        decimalCount: 2,
        defaultValue: 1234.5,
        locales: {
          fr: { thousandSeparator: '.', decimalSeparator: ',' },
        },
      }),
    );

    expect(result.current.displayValue).toBe('1.234,5');
  });

  it('falls back to en when separators are identical', () => {
    const { result } = renderHook(() =>
      useAmountInput({
        language: 'bad',
        decimalCount: 2,
        defaultValue: 1234.5,
        locales: {
          bad: { thousandSeparator: '.', decimalSeparator: '.' },
        },
      }),
    );

    expect(result.current.displayValue).toBe('1,234.5');
  });
});
