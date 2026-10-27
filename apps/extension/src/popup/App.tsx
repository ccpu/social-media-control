import { Separator } from '@pixpilot/shadcn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@pixpilot/shadcn-ui';

import { siteTabs } from './sites/siteTabs';
import { translate } from './translate';
import { SettingsContext } from './useSettings';

const links = [
  { href: 'https://github.com/ccpu/social-media-control', label: 'view_on_github' },
  {
    href: 'https://github.com/ccpu/social-media-control/issues/new',
    label: 'report_an_issue',
  },
];

// The settings menu in the extension icon. Every site has its own tab.
export function App() {
  return (
    <div className="w-100 px-4 py-3 text-sm">
      <header className="pb-2">
        <h1 className="text-base font-semibold">{translate('__name__')}</h1>
        <p className="text-muted-foreground text-xs">{translate('__version__')}</p>
      </header>

      <Tabs defaultValue={siteTabs[0]?.id} className="pt-1">
        <TabsList className="w-full">
          {siteTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex-1">
              {translate(tab.label)}
            </TabsTrigger>
          ))}
        </TabsList>

        {siteTabs.map(({ id, settings, content: Content }) => (
          <TabsContent key={id} value={id} className="divide-y">
            <SettingsContext value={settings}>
              <Content />
            </SettingsContext>
          </TabsContent>
        ))}
      </Tabs>

      <Separator />

      <footer className="text-muted-foreground flex gap-3 pt-3 text-xs">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground hover:underline"
          >
            {translate(link.label)}
          </a>
        ))}
      </footer>
    </div>
  );
}
