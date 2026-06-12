// brand.jsx — brand primitives & small utilities
const { useRef, useEffect, useState } = React;

// Stylized solid maple-leaf mark used as the brand "period".
function Leaf({ className = 'lf', style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path className="leaf" d="M50 6 L55 26 L62 18 L60 33 L78 27 L68 41 L84 44 L70 52 L92 64 L66 62 L72 78 L57 68 L58 86 L52 78 L52 96 L48 96 L48 78 L42 86 L43 68 L28 78 L34 62 L8 64 L30 52 L16 44 L32 41 L22 27 L40 33 L38 18 L45 26 Z" />
    </svg>
  );
}

// Word-mark. stack => words on their own lines. Leaf trails the last word.
function Wordmark({ className = 'wordmark', stack = false, leafClass = 'lf', onClick, style }) {
  const words = ['The', 'Action', 'Pact'];
  return (
    <div className={className} onClick={onClick} style={style} aria-label="The Action Pact">
      {words.map((w, i) => (
        <React.Fragment key={w}>
          {w}
          {i === words.length - 1 ? <Leaf className={leafClass} /> : (stack ? <br /> : ' ')}
        </React.Fragment>
      ))}
    </div>
  );
}

// Smooth-scroll to a section id, accounting for the fixed nav.
function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - 64;
  window.scrollTo({ top, behavior: 'smooth' });
}

// Wrap content so it fades/rises in when scrolled into view.
// Robust against preview environments where IntersectionObserver does not
// fire for elements already on-screen at load: we do an immediate in-viewport
// check on mount, keep an observer for below-the-fold, and a failsafe timer
// guarantees nothing stays hidden (also keeps screenshots / print safe).
function Reveal({ children, className = '', delay = 0, tag = 'div', ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.classList.add('in');
    // Already in (or near) the viewport? Reveal on the next frame so the
    // transition still plays, but never depend on the observer firing.
    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.top < (window.innerHeight || 800) * 0.92 && r.bottom > 0;
    };
    if (inView()) {
      requestAnimationFrame(() => requestAnimationFrame(show));
      return;
    }
    if (typeof IntersectionObserver === 'undefined') { show(); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { show(); io.unobserve(el); } });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    io.observe(el);
    // Failsafe: if the observer never fires (some preview/headless contexts),
    // reveal anyway so content is never permanently hidden.
    const t = setTimeout(show, 2200);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);
  const Tag = tag;
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ transitionDelay: delay ? `${delay}ms` : undefined }} {...rest}>
      {children}
    </Tag>
  );
}

// Render text that uses ⟦…⟧ to mark orange-bold spans.
function RichText({ text, Wrapper = 'span' }) {
  const parts = String(text).split(/⟦|⟧/);
  return (
    <Wrapper>
      {parts.map((p, i) => (i % 2 === 1 ? <b key={i}>{p}</b> : <React.Fragment key={i}>{p}</React.Fragment>))}
    </Wrapper>
  );
}

Object.assign(window, { Leaf, Wordmark, scrollToId, Reveal, RichText });
