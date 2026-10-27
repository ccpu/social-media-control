import type { SettingsData } from '@internal/core';
import { Resources } from '../resources';
import { instagramSettings } from '../settings';

// Settings the page script may store. Other page scripts can post messages too, so nothing else is accepted.
const pageStoredSettings = ['lastPlaybackVolume', 'lastPlaybackSpeed'] as const;

// Delay before storing settings from the page. Dragging the volume bar fires many changes and `storage.sync` limits
// the number of writes per minute.
const storeSettingsDelayMs = 500;

export class CommunicationManager {
  // The extension settings.
  private readonly settings = instagramSettings;

  // The extension resources.
  private readonly resources = Resources.shared;

  // Settings from the page waiting to be stored.
  private pendingStoreSettings: Partial<SettingsData> = {};
  private storeSettingsTimerId: ReturnType<typeof setTimeout> | undefined;

  public async init(): Promise<void> {
    // Loads the settings and subscribe for setting changes.
    await this.settings.init();
    this.settings.changed.subscribe((name) => this.onSettingChanged(name));

    // Loads the resources.
    this.resources.init();

    // Store settings changed on the page, like the last used volume.
    window.addEventListener('message', (ev) => this.onMessageHandler(ev));

    // Send the initial settings and then the initialized message.
    this.sendMessageSettings(this.settings.data);
    this.sendMessageInitialized();
  }

  // An extension setting was changed.
  private onSettingChanged(name: keyof SettingsData) {
    const value = this.settings[name];
    this.sendMessageSettings({ [name]: value });
  }

  // Handling messages from the page.
  private onMessageHandler(ev: MessageEvent) {
    if (ev.source !== window) return;
    if (typeof ev.data !== 'object' || ev.data === null) return;
    if (ev.data.type !== 'smc-instagram-store-settings') return;

    const data = ev.data.data as Record<string, unknown> | undefined;
    if (typeof data !== 'object' || data === null) return;

    for (const name of pageStoredSettings) {
      if (typeof data[name] === 'number') this.pendingStoreSettings[name] = data[name];
    }

    clearTimeout(this.storeSettingsTimerId);
    this.storeSettingsTimerId = setTimeout(() => {
      this.settings.applyChanges(this.pendingStoreSettings);
      this.pendingStoreSettings = {};
    }, storeSettingsDelayMs);
  }

  // Informs the page that the extension is initialized.
  private sendMessageInitialized() {
    window.postMessage({
      type: 'smc-instagram-initialized',
      // Since the main DOM cannot access the extension resource, we provide a list of all urls on startup.
      resourceUrls: this.resources.urls,
      localeTexts: this.resources.locales,
    });
  }

  // Informs the page about extension setting changes.
  private sendMessageSettings(data: Partial<SettingsData>) {
    window.postMessage({
      type: 'smc-instagram-settings',
      data,
    });
  }
}
