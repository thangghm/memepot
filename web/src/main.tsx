import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import logoUrl from './assets/logo.png';
import wordmarkUrl from './assets/wordmark.svg';
import './styles.css';

function LandingPage() {
  return (
    <main className="landing-page" aria-label="Memepot coming soon">
      <section className="landing-frame">
        <header className="brand-lockup">
          <img className="brand-logo" src={logoUrl} alt="" aria-hidden />
          <div className="brand-copy">
            <img className="brand-wordmark" src={wordmarkUrl} alt="MemePot" />
            <p className="brand-tagline">Cook Fresh Meme!</p>
          </div>
        </header>

        <h1 className="coming-soon">Coming soon!</h1>

        <p className="copyright">Memepot &copy; Nodehub.Studio 2026</p>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LandingPage />
  </StrictMode>,
);
