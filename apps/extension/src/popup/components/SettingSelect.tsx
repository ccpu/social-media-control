import { Label } from '@pixpilot/shadcn';
import { Select } from '@pixpilot/shadcn-ui';
import { useId } from 'react';

import { translate } from '../translate';

export interface SettingSelectProps<T extends string> {
  // Locale key of the label.
  label: string;
  value: T;
  // Option values mapped to the locale key of their label.
  options: Record<T, string>;
  onChange: (value: T) => void;
}

// A labelled setting with a fixed set of choices.
export function SettingSelect<T extends string>(props: SettingSelectProps<T>) {
  const { label, value, options, onChange } = props;
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5 py-1.5">
      <Label htmlFor={id}>{translate(label)}</Label>
      <Select
        id={id}
        className="w-full"
        position="popper"
        value={value}
        options={Object.entries<string>(options).map(([optionValue, locale]) => ({
          value: optionValue,
          label: translate(locale),
        }))}
        onChange={(selected) => {
          // An empty value is only reported when cleared, which is disabled here.
          if (selected) onChange(selected as T);
        }}
      />
    </div>
  );
}
