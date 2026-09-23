import type { ReactNode } from 'react';

import { translate } from '../translate';

export interface SettingsSectionProps {
  // Locale key of the heading.
  title: string;
  children: ReactNode;
}

// A titled group of settings.
export function SettingsSection(props: SettingsSectionProps) {
  const { title, children } = props;

  return (
    <section className="py-3">
      <h2 className="text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase">
        {translate(title)}
      </h2>
      {children}
    </section>
  );
}
