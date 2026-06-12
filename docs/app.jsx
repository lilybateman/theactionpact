// app.jsx — nav, shell, tweaks wiring, mount
const { useState, useEffect, useRef } = window.React;
const { Hero, About, WhySubscribe, ConversationClub, Subscribe, Footer, Wordmark, scrollToId, NAV } = window;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "direction": "poster",
  "accent": "#f64d1c",
  "grain": 50,
  "display": "Pridi",
  "background": "paper"
}/*EDITMODE-END*/;

const DISPLAY_FONTS = [
  { value: 'Pridi', label: 'Pridi — rounded slab' },
  { value: 'Sansita', label: 'Sansita — bold serif' },
  { value: 'Pattaya', label: 'Pattaya — brush script' },
];
const DISPLAY_WEIGHT = { Pridi: 700, Sansita: 900, Pattaya: 400 };

function Nav({ active, lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menu);
  }, [menu]);

  const go = (id) => { setMenu(false); scrollToId(id); };

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="wrap nav-inner">
        <button className="nav-logo" style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => { setMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="The Action Pact">
          <img src={lang === 'FR' ? '/images/newestfrenchlogo.png' : '/images/logo.png'} alt="The Action Pact" style={{ height: '38px', width: 'auto', objectFit: 'contain' }} />
        </button>
        <button className="nav-burger" aria-label="Menu" onClick={() => setMenu((m) => !m)}>
          <span></span><span></span><span></span>
        </button>
        <nav className={`nav-links ${menu ? 'open' : ''}`}>
          {NAV[lang === 'FR' ? 'fr' : 'en'].map((n) => (
            <button key={n.id} className={`nav-link ${active === n.id ? 'active' : ''}`} onClick={() => go(n.id)}>{n.label}</button>
          ))}
          <div className="lang">
            <button className={lang === 'FR' ? 'on' : ''} onClick={() => setLang('FR')}>FR</button>
            <span className="sep">/</span>
            <button className={lang === 'EN' ? 'on' : ''} onClick={() => setLang('EN')}>EN</button>
          </div>
        </nav>
      </div>
    </header>
  );
}

function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight * 0.36;
      let cur = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mid) cur = id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [ids.join(',')]);
  return active;
}

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const [lang, setLang] = useState('EN');
  const active = useScrollSpy(['top', 'about', 'club', 'subscribe']);

  // apply tweaks
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--orange', t.accent);
    root.style.setProperty('--grain', String((t.grain ?? 50) / 100));
    root.style.setProperty('--display', `'${t.display}'`);
    root.style.setProperty('--display-weight', String(DISPLAY_WEIGHT[t.display] || 700));
    document.body.classList.toggle('bg-ink', t.background === 'ink');
  }, [t.accent, t.grain, t.display, t.background]);
  const navActive = active === 'top' ? '' : active;
  // map hero-active nav state: 'top' shows nothing active

  return (
    <React.Fragment>
      <Nav active={navActive} lang={lang} setLang={setLang} />
      <main>
        <Hero direction={t.direction} lang={lang} key={t.direction} />
        <About lang={lang} />
        <ConversationClub lang={lang} />
        <Subscribe lang={lang} />
      </main>
      <Footer lang={lang} />

      <window.TweaksPanel>
        <window.TweakSection label="Direction" />
        <window.TweakRadio label="Hero layout" value={t.direction}
          options={['poster', 'newsprint', 'filmstrip']}
          onChange={(v) => setTweak('direction', v)} />

        <window.TweakSection label="Brand" />
        <window.TweakColor label="Accent" value={t.accent}
          options={['#f64d1c', '#e23b2e', '#ef5e23', '#d9482a', '#1b2531']}
          onChange={(v) => setTweak('accent', v)} />
        <window.TweakSelect label="Display font" value={t.display}
          options={DISPLAY_FONTS}
          onChange={(v) => setTweak('display', v)} />

        <window.TweakSection label="Texture" />
        <window.TweakSlider label="Grain" value={t.grain} min={0} max={100} unit="%"
          onChange={(v) => setTweak('grain', v)} />
        <window.TweakRadio label="Background" value={t.background}
          options={['paper', 'ink']}
          onChange={(v) => setTweak('background', v)} />
      </window.TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
