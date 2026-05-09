// LicenseService — stub (Phase 2). No API calls.
import type { License } from '@/features/memes/types/meme.types';

export class LicenseService {
  async validateKey(_key: string): Promise<License> {
    // TODO(Phase 2): call license API
    return { key: _key, tier: 'free' };
  }

  async getLicense(): Promise<License | null> {
    const result = await chrome.storage.local.get('license');
    return (result.license as License) ?? null;
  }

  async saveLicense(_license: License): Promise<void> {
    await chrome.storage.local.set({ license: _license });
  }

  async checkFeatureAccess(_feature: string): Promise<boolean> {
    const license = await this.getLicense();
    return license?.tier === 'pro';
  }
}

export const licenseService = new LicenseService();