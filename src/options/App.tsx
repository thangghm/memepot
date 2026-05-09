import { useState } from 'react';
import { SettingsPage } from '@/app/pages/SettingsPage';
import '@/app/index.css';

export default function OptionsApp() {
  const [activeTab, setActiveTab] = useState<'settings' | 'about'>('settings');

  return (
    <div className="min-h-screen bg-memepot-bg p-6">
      <div className="mb-6 flex items-center gap-4">
        <h1 className="text-2xl font-bold text-memepot-text">Memepot Settings</h1>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`rounded px-3 py-1.5 text-sm ${
              activeTab === 'settings'
                ? 'bg-memepot-primary text-white'
                : 'bg-memepot-surface text-memepot-muted hover:text-memepot-text'
            }`}
          >
            Settings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`rounded px-3 py-1.5 text-sm ${
              activeTab === 'about'
                ? 'bg-memepot-primary text-white'
                : 'bg-memepot-surface text-memepot-muted hover:text-memepot-text'
            }`}
          >
            About
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-memepot-surface p-6">
        {activeTab === 'settings' ? <SettingsPage /> : <AboutSection />}
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-memepot-text">About Memepot</h2>
      <p className="text-sm text-memepot-muted">
        Version 0.1.0 — A fast local meme library and meme clipboard for Chrome.
      </p>
      <p className="text-sm text-memepot-muted">
        Built with React, TypeScript, Vite, Tailwind CSS, and Dexie.js.
      </p>
      <p className="text-xs text-memepot-muted">Nodehub.Studio (c) 2026</p>
    </div>
  );
}
