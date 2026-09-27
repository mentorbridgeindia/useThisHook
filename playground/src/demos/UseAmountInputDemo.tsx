import { useState } from 'react';
import { useAmountInput, type AmountInputLanguage } from 'usethishook';
import { ghostButtonClass, inputClass } from '../components/styles';

const languages: AmountInputLanguage[] = ['en', 'de', 'nl', 'fr'];

interface AmountFieldProps {
  language: AmountInputLanguage;
  decimalCount: number;
}

const AmountField = ({ language, decimalCount }: AmountFieldProps) => {
  const amount = useAmountInput({
    language,
    decimalCount,
    defaultValue: 1234.5,
  });

  return (
    <div className="space-y-3">
      <input
        ref={amount.ref}
        className={inputClass}
        inputMode="decimal"
        value={amount.displayValue}
        onChange={amount.onChange}
        onBlur={amount.onBlur}
        placeholder="Amount"
      />
      <p className="text-sm text-muted">
        Display: {amount.displayValue || '—'} · Canonical: {amount.value || '—'}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={ghostButtonClass}
          onClick={() => amount.updateValue(12345.67)}
        >
          Set 12345.67
        </button>
        <button type="button" className={ghostButtonClass} onClick={amount.reset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export const UseAmountInputDemo = () => {
  const [language, setLanguage] = useState<AmountInputLanguage>('fr');
  const [decimalCount, setDecimalCount] = useState(2);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {languages.map((item) => (
          <button
            key={item}
            type="button"
            className={ghostButtonClass}
            onClick={() => setLanguage(item)}
          >
            {item.toUpperCase()}
            {item === language ? ' · active' : ''}
          </button>
        ))}
      </div>
      <label className="block text-sm text-muted">
        <span className="block">Decimals</span>
        <input
          className={`${inputClass} mt-1 max-w-[8rem]`}
          type="number"
          min={0}
          max={4}
          value={decimalCount}
          onChange={(event) => setDecimalCount(Number(event.target.value) || 0)}
        />
      </label>
      <AmountField
        key={`${language}-${decimalCount}`}
        language={language}
        decimalCount={decimalCount}
      />
    </div>
  );
};

export const useAmountInputExample = `import { useAmountInput } from 'usethishook';

export const PriceField = () => {
  const amount = useAmountInput({ language: 'fr', decimalCount: 2, defaultValue: 0 });
  return (
    <input
      ref={amount.ref}
      value={amount.displayValue}
      onChange={amount.onChange}
      onBlur={amount.onBlur}
    />
  );
};`;
