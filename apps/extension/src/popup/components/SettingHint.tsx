import { translate } from '../translate';

export interface SettingHintProps {
  // Locale key of the hint.
  text: string;
}

// A short explanation below a setting.
export function SettingHint(props: SettingHintProps) {
  return <p className="text-muted-foreground text-xs">{translate(props.text)}</p>;
}
