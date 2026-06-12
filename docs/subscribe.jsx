// subscribe.jsx — subscribe section & Supabase-backed form
const { useState, useRef, useEffect } = React;

const SB_URL = 'https://ycmwglhpnxiomamtdezc.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljbXdnbGhwbnhpb21hbXRkZXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzIyNTQsImV4cCI6MjA3MDU0ODI1NH0.q2rA6InNpgifggchZaHqFEQg60iDLLbuktuFfDy0F0g';

async function saveSubscriber(name, email, location, lang) {
  const res = await fetch(`${SB_URL}/rest/v1/Newsletter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SB_KEY,
      'Authorization': `Bearer ${SB_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ name: name || null, email, location: location || null, preferred_language: lang }),
  });
  if (!res.ok) throw new Error(await res.text());
}

function LocationField({ prefLang, value, onChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const wrapRef = useRef(null);

  const getCities = () => prefLang === 'fr' ? window.CITIES_FR : window.CITIES_EN;

  const filter = (input) => {
    if (!input.trim()) return [];
    const cities = getCities();
    const filtered = cities.filter(c => c.toLowerCase().includes(input.toLowerCase()));
    const result = [];
    if (!filtered.some(c => c.toLowerCase() === input.trim().toLowerCase())) {
      result.push(input.trim());
    }
    result.push(...filtered.slice(0, 7));
    return result;
  };

  const handleChange = (e) => {
    const v = e.target.value;
    onChange(v);
    const matches = filter(v);
    setSuggestions(matches);
    setShowSuggestions(matches.length > 0 && v.trim().length > 0);
    setSelectedIdx(-1);
  };

  const pick = (city) => {
    onChange(city);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIdx(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (selectedIdx >= 0) pick(suggestions[selectedIdx]); }
    else if (e.key === 'Escape') { setShowSuggestions(false); setSelectedIdx(-1); }
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setSelectedIdx(-1);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <input
        id="sub-location"
        type="text"
        placeholder="Your location"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      {showSuggestions && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
          background: 'var(--ink)', border: '1.5px solid rgba(243,237,225,.2)',
          borderRadius: '12px', marginTop: '6px', overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,.35)',
        }}>
          {suggestions.map((city, i) => (
            <button
              key={city}
              type="button"
              onMouseDown={() => pick(city)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                background: i === selectedIdx ? 'rgba(246,77,28,.18)' : 'transparent',
                border: 0, padding: '10px 16px', cursor: 'pointer',
                fontFamily: '"Newsreader", serif', fontSize: '16px',
                color: i === 0 && !window.CITIES_EN.concat(window.CITIES_FR).some(c => c.toLowerCase() === suggestions[0].toLowerCase())
                  ? 'rgba(243,237,225,.55)' : 'var(--paper)',
                borderBottom: i < suggestions.length - 1 ? '1px solid rgba(243,237,225,.08)' : 'none',
                transition: 'background .15s ease',
              }}
              onMouseEnter={e => { if (i !== selectedIdx) e.currentTarget.style.background = 'rgba(243,237,225,.07)'; }}
              onMouseLeave={e => { if (i !== selectedIdx) e.currentTarget.style.background = 'transparent'; }}
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SubscribeForm({ lang = 'EN' }) {
  const isFR = lang === 'FR';
  const [prefLang, setPrefLang] = useState(lang === 'FR' ? 'fr' : 'en');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    const fd = new FormData(e.currentTarget);
    const email = (fd.get('email') || '').trim();
    const name = (fd.get('name') || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr(isFR ? 'Veuillez entrer une adresse courriel valide.' : 'Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await saveSubscriber(name, email, location, prefLang);
      setDone(true);
    } catch (ex) {
      console.error(ex);
      setErr(isFR ? 'Une erreur est survenue — veuillez réessayer.' : 'Something went wrong — please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="success">
        <p className="mark">{isFR ? "C'est fait !" : "You're in."}</p>
        <p>{isFR ? "Merci de vous joindre à nous. Surveillez votre boîte de réception — l'infolettre est en route." : "Thanks for joining us. Keep an eye on your inbox — the newsletter is on its way."}</p>
        <button className="again" onClick={() => setDone(false)}>{isFR ? "Inscrire une autre adresse" : "Sign up another address"}</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="sub-name">{isFR ? 'Nom' : 'Name'}</label>
        <input id="sub-name" name="name" type="text" placeholder={isFR ? 'Votre nom' : 'Your name'} autoComplete="name" />
      </div>
      <div className="form-field">
        <label htmlFor="sub-location">{isFR ? 'Ville' : 'Location'}</label>
        <LocationField prefLang={prefLang} value={location} onChange={setLocation} />
      </div>
      <div className={`form-field${err ? ' err' : ''}`}>
        <label htmlFor="sub-email">{isFR ? 'Courriel' : 'Email'} <span className="req">*</span></label>
        <input id="sub-email" name="email" type="email" placeholder={isFR ? 'vous@exemple.com' : 'you@example.com'} required autoComplete="email" />
        {err && <div className="field-msg">{err}</div>}
      </div>
      <div className="form-field">
        <label>{isFR ? 'Langue préférée' : 'Preferred language'}</label>
        <div className="lang-pref">
          <button type="button" className={prefLang === 'en' ? 'on' : ''} onClick={() => setPrefLang('en')}>EN</button>
          <button type="button" className={prefLang === 'fr' ? 'on' : ''} onClick={() => setPrefLang('fr')}>FR</button>
        </div>
      </div>
      <button type="submit" className="btn btn-solid form-submit" disabled={loading}>
        {loading ? (isFR ? 'Un moment…' : 'One moment…') : (isFR ? "S'abonner" : 'Subscribe')}
      </button>
    </form>
  );
}

function Subscribe({ lang = 'EN' }) {
  const S = window.SUBSCRIBE;
  const loc = lang === 'FR' ? S.fr : S.en;
  return (
    <section id="subscribe" className="sec sub" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="wrap">
        <p className="sec-eyebrow" style={{ color: 'rgba(243,237,225,.45)' }}>{loc.eyebrow}</p>
        <div className="sub-grid">
          <div className="sub-pitch">
            <p className="big">{loc.big}</p>
            {loc.pitch.map((p, i) => <p key={i}>{p}</p>)}
            <p className="contact">
              <a href={`mailto:${S.email}`}>{S.email}</a>
            </p>
          </div>
          <SubscribeForm lang={lang} />
        </div>
      </div>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: '-10px', right: '-110px',
          width: 'clamp(360px,48vw,680px)', height: 'clamp(380px,50vw,720px)',
          backgroundImage: 'url(/images/subscribe-corner.png)',
          backgroundSize: 'contain', backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right bottom',
          transform: 'scaleX(-1)',
          pointerEvents: 'none',
        }}
      ></div>
    </section>
  );
}

Object.assign(window, { Subscribe });
