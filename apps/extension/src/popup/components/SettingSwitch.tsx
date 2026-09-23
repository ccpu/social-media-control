import { Label, Switch } from '@pixpilot/shadcn';
import { useId } from 'react';

import { translate } from '../translate';

export interface SettingSwitchProps {
  // Locale key of the label.
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

// A labelled on/off setting.
export function SettingSwitch(props: SettingSwitchProps) {
  const { label, checked, onCheckedChange } = props;
  const id = useId();

  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <Label htmlFor={id} className="cursor-pointer font-normal">
        {translate(label)}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
