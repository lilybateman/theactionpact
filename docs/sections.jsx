// sections.jsx — page sections
const { Wordmark, Leaf, Reveal, RichText, scrollToId } = window;

const READINGS = {
  en: {
    intro: [
      "For our spring Conversation Club, we've chosen to focus on lobbying. Lobbying is one of the main ways that people, organizations, companies, and movements try to shape political decisions. In Canada, that can mean everything from paid consultants meeting with federal officials to grassroots groups pushing elected representatives to act. Studying lobbying helps us ask big questions about what influence really is, who gets to exercise it, how transparent the process is, and how citizen groups can participate more effectively and ethically.",
      "We also chose this topic because lobbying can feel oddly mysterious. It is often misunderstood, sometimes folded together with American political practices, and frequently talked about as if it is something only corporations, insiders, or political elites do. We want to dig into that a little more carefully. What is lobbying in the Canadian context? What are its rules and limits? When can it strengthen democracy, and when can it deepen inequality? And how can ordinary people and community groups engage strategically and ethically in systems of influence that can otherwise feel closed off?",
      "Below are a range of pathways into the topic. You definitely do not need to go through everything. Pick the format that appeals to you most, whether that is a video, podcast, article, book, documentary, or official explainer. You're also welcome to bring in other sources that helped shape your thinking. The goal is not to become an expert before the meeting. It is to come in with a few ideas, questions, and reactions that we can think through together.",
    ],
    audio: [
      { n: '01', title: 'Is Lobbying Corrupting Canadian Governments?', type: 'Podcast episode', source: 'Front Burner (CBC)', desc: 'Explores public perceptions of lobbying in Canada and asks whether existing transparency and ethics rules are sufficient to prevent undue influence.', url: 'https://www.cbc.ca/radio/frontburner/is-lobbying-corrupting-canadian-governments-1.7198451' },
      { n: '02', title: 'How Corporate Lobbying Is Delaying Climate Action in Canada', type: 'Documentary-style news Podcast', source: 'The Narwhal', desc: 'Uses climate policy as a case study to examine how corporate actors seek to influence government decision-making and public debate.', url: 'https://www.youtube.com/watch?v=XqVb077iXus' },
    ],
    video: [
      { n: '01', title: 'Citizen Lobbying: How Your Skills Can Fix Democracy', type: 'TED Talk', source: '', desc: 'Argues that lobbying is not just for corporations and professionals, but can also be a democratic tool that citizens and community groups can use to advance change.', url: 'https://www.youtube.com/watch?v=WqNf2OPdu8c' },
      { n: '02', title: 'The “Shadow Lobbying” Problem in Canada', type: 'Video', source: 'House of Commons', desc: 'Lobbying Commissioner testifies at the ethics committee on the use of loopholes by former MPs and Cabinet Ministers.', url: 'https://www.youtube.com/watch?v=i5pw4EtD9Yo' },
    ],
    written: [
      { n: '01', title: 'TC Energy Leaks: B.C. Attorney General Asks for Watchdog Probe', type: 'Investigative news article', source: 'The Narwhal', desc: 'A case study in the public perception of lobbying. Through leaked recordings and a subsequent government investigation, the article explores claims of corporate influence, insider access, and the challenges of ensuring transparency and accountability in policymaking.', url: 'https://thenarwhal.ca/tc-energy-leak-attorney-general-reacts/' },
      { n: '02', title: "Canada’s Lobbying Industry: Business and Public Interest Advocacy from Harper to Trudeau", type: 'Academic journal article', source: '', desc: 'Analyzes the growth of Canada’s lobbying industry and compares the relative influence of business interests and public-interest organizations across recent federal governments.', url: 'https://www.cambridge.org/core/journals/canadian-journal-of-political-science-revue-canadienne-de-science-politique/article/canadas-lobbying-industry-business-and-public-interest-advocacy-from-harper-to-trudeau/215E945A290B55B7C57A3C5FCAE3DDF1' },
      { n: '03', title: 'Lobbying at the Federal Level: At a Glance', type: 'Written explainer', source: 'Office of the Commissioner of Lobbying of Canada', desc: 'A short introduction to what lobbying is in Canada, who must register, and why transparency rules exist.', url: 'https://lobbycanada.gc.ca/en/rules/lobbying-at-the-federal-level-at-a-glance/' },
      { n: '04', title: 'History of the Lobbying Regime in Canada', type: 'Written explainer', source: 'Office of the Commissioner of Lobbying of Canada', desc: 'A brief history of how Canada’s lobbying rules developed and changed over time.', url: 'https://lobbycanada.gc.ca/en/rules/history-of-the-lobbying-regime-in-canada/' },
    ],
    caseStudyIntro: 'We included this US case study because it highlights tensions at the heart of lobbying and advocacy. Three articles look at the same controversy from different perspectives, raising questions like: when should public pressure influence government decision-making, and when should experts and regulators hold the line?',
    caseStudy: [
      { n: 'A', title: 'Pressured by patients, FDA reviews ALS drug with modest data', type: 'News article', source: 'Associated Press', desc: 'Explores how ALS patients and their families pushed regulators to reconsider an experimental treatment despite concerns about the available evidence.', url: 'https://apnews.com/article/science-business-health-lobbying-congress-08f90cb109edd90fd7dd94d608960a05' },
      { n: 'B', title: 'ALS Drug Approved by FDA in Closely Watched Decision, Marking Win for Patients and Developer', type: 'Industry news article', source: 'BioPharma Dive', desc: 'Looks at the eventual approval of the drug and the role advocacy groups, patients, and industry played in the decision.', url: 'https://www.biopharmadive.com/news/amylyx-fda-approval-als-drug-relyvrio/632592/' },
      { n: 'C', title: 'Relyvrio Debacle Shows Why FDA Should Stand Its Ground Against Conflicted Advocacy Groups', type: 'Opinion article', source: 'Cleveland.com', desc: 'Offers a critical perspective on the approval process and the risks of allowing advocacy pressure to outweigh scientific evidence.', url: 'https://www.cleveland.com/opinion/2024/03/relyvrio-debacle-shows-why-fda-should-stand-its-ground-against-conflicted-advocacy-groups-caroline-renko-judy-butler-and-adriane-fugh-berman.html' },
    ],
    labels: { audio: 'Audio', video: 'Video', written: 'Written', caseStudy: 'Case Study' },
  },
  fr: {
    intro: [
      "Pour notre Club de conversation du printemps, nous avons choisi de nous pencher sur le lobbying. Le lobbying est l'un des principaux moyens par lesquels les personnes, les organisations, les entreprises et les mouvements tentent d'influencer les décisions politiques. Au Canada, cela peut aller de consultants rémunérés qui rencontrent des fonctionnaires fédéraux à des groupes citoyens qui pressent les élus d'agir. Étudier le lobbying nous aide à poser de grandes questions : qu'est-ce que l'influence au juste, qui peut l'exercer, à quel point le processus est transparent, et comment les groupes citoyens peuvent participer de manière plus efficace et plus éthique.",
      "Nous avons aussi choisi ce thème parce que le lobbying peut sembler étrangement mystérieux. Il est souvent mal compris, parfois confondu avec les pratiques politiques américaines, et fréquemment présenté comme quelque chose que seules les entreprises, les initiés ou les élites politiques font. Nous voulons examiner cela d'un peu plus près. Qu'est-ce que le lobbying dans le contexte canadien ? Quelles sont ses règles et ses limites ? Quand peut-il renforcer la démocratie, et quand peut-il aggraver les inégalités ? Et comment les gens ordinaires et les groupes communautaires peuvent-ils s'engager de manière stratégique et éthique dans des systèmes d'influence qui peuvent autrement sembler inaccessibles ?",
      "Vous trouverez ci-dessous une variété de portes d'entrée vers le sujet. Vous n'avez vraiment pas besoin de tout parcourir. Choisissez le format qui vous attire le plus, qu'il s'agisse d'une vidéo, d'un balado, d'un article, d'un livre, d'un documentaire ou d'un document explicatif officiel. Vous êtes aussi les bienvenus pour apporter d'autres sources qui ont nourri votre réflexion. Le but n'est pas de devenir un expert avant la rencontre. C'est d'arriver avec quelques idées, questions et réactions que nous pourrons explorer ensemble.",
    ],
    audio: [
      { n: '01', title: 'Le lobbying corrompt-il les gouvernements canadiens ?', type: 'Épisode de balado', source: 'Front Burner (CBC)', desc: 'Explore les perceptions du public à l’égard du lobbying au Canada et se demande si les règles actuelles de transparence et d’éthique suffisent à prévenir une influence indue.', url: 'https://www.cbc.ca/radio/frontburner/is-lobbying-corrupting-canadian-governments-1.7198451' },
      { n: '02', title: 'Comment le lobbying des entreprises retarde l’action climatique au Canada', type: 'Balado d’actualité de style documentaire', source: 'The Narwhal', desc: 'Utilise la politique climatique comme étude de cas pour examiner comment les acteurs corporatifs cherchent à influencer les décisions gouvernementales et le débat public.', url: 'https://www.youtube.com/watch?v=XqVb077iXus' },
    ],
    video: [
      { n: '01', title: 'Le lobbying citoyen : comment vos compétences peuvent réparer la démocratie', type: 'Conférence TED', source: '', desc: 'Soutient que le lobbying n’est pas réservé aux entreprises et aux professionnels, mais qu’il peut aussi être un outil démocratique que les citoyens et les groupes communautaires peuvent utiliser pour faire avancer le changement.', url: 'https://www.youtube.com/watch?v=WqNf2OPdu8c' },
      { n: '02', title: 'Le problème du « lobbying de l’ombre » au Canada', type: 'Vidéo', source: 'Chambre des communes', desc: 'Le commissaire au lobbying témoigne devant le comité d’éthique au sujet de l’utilisation de failles par d’anciens députés et ministres.', url: 'https://www.youtube.com/watch?v=i5pw4EtD9Yo' },
    ],
    written: [
      { n: '01', title: 'Fuites de TC Energy : le procureur général de la C.-B. demande une enquête du chien de garde', type: "Article d'enquête", source: 'The Narwhal', desc: "Une étude de cas sur la perception publique du lobbying. À travers des enregistrements divulgués et l'enquête gouvernementale qui a suivi, l'article explore les allégations d'influence corporative, d'accès privilégié, et les défis liés à la transparence et à la reddition de comptes dans l'élaboration des politiques.", url: 'https://thenarwhal.ca/tc-energy-leak-attorney-general-reacts/' },
      { n: '02', title: "L'industrie du lobbying au Canada : intérêts commerciaux et défense de l'intérêt public, de Harper à Trudeau", type: 'Article de revue universitaire', source: '', desc: "Analyse la croissance de l'industrie du lobbying au Canada et compare l'influence relative des intérêts commerciaux et des organisations d'intérêt public au fil des récents gouvernements fédéraux.", url: 'https://www.cambridge.org/core/journals/canadian-journal-of-political-science-revue-canadienne-de-science-politique/article/canadas-lobbying-industry-business-and-public-interest-advocacy-from-harper-to-trudeau/215E945A290B55B7C57A3C5FCAE3DDF1' },
      { n: '03', title: 'Le lobbying au niveau fédéral : en bref', type: 'Document explicatif', source: 'Commissariat au lobbying du Canada', desc: "Une courte introduction à ce qu'est le lobbying au Canada, à qui doit s'enregistrer, et aux raisons d'être des règles de transparence.", url: 'https://lobbycanada.gc.ca/en/rules/lobbying-at-the-federal-level-at-a-glance/' },
      { n: '04', title: 'Histoire du régime de lobbying au Canada', type: 'Document explicatif', source: 'Commissariat au lobbying du Canada', desc: "Un bref historique de la façon dont les règles canadiennes sur le lobbying se sont développées et ont évolué au fil du temps.", url: 'https://lobbycanada.gc.ca/en/rules/history-of-the-lobbying-regime-in-canada/' },
    ],
    caseStudyIntro: "Nous avons voulu inclure cette étude de cas américaine parce qu'elle met en lumière certaines des tensions au cœur du lobbying et du plaidoyer. Ces trois articles examinent la même controverse sous différents angles et soulèvent des questions dont nous pourrons discuter à notre club de conversation : quand la pression publique devrait-elle influencer les décisions gouvernementales, et quand les experts et les organismes de réglementation devraient-ils tenir bon ?",
    caseStudy: [
      { n: 'A', title: 'Sous la pression des patients, la FDA réexamine un médicament contre la SLA appuyé par des données modestes', type: 'Article de presse', source: 'Associated Press', desc: 'Explore comment les patients atteints de SLA et leurs familles ont poussé les organismes de réglementation à reconsidérer un traitement expérimental malgré des inquiétudes sur les données disponibles.', url: 'https://apnews.com/article/science-business-health-lobbying-congress-08f90cb109edd90fd7dd94d608960a05' },
      { n: 'B', title: 'Un médicament contre la SLA approuvé par la FDA dans une décision très surveillée, une victoire pour les patients et le développeur', type: 'Article spécialisé', source: 'BioPharma Dive', desc: "Se penche sur l'approbation finale du médicament et sur le rôle joué par les groupes de défense, les patients et l'industrie dans la décision.", url: 'https://www.biopharmadive.com/news/amylyx-fda-approval-als-drug-relyvrio/632592/' },
      { n: 'C', title: 'Le fiasco du Relyvrio montre pourquoi la FDA devrait tenir bon face aux groupes de défense en conflit d’intérêts', type: "Article d'opinion", source: 'Cleveland.com', desc: "Offre un point de vue critique sur le processus d'approbation et sur les risques de laisser la pression des groupes de défense l'emporter sur les preuves scientifiques.", url: 'https://www.cleveland.com/opinion/2024/03/relyvrio-debacle-shows-why-fda-should-stand-its-ground-against-conflicted-advocacy-groups-caroline-renko-judy-butler-and-adriane-fugh-berman.html' },
    ],
    labels: { audio: 'Audio', video: 'Vidéo', written: 'Écrit', caseStudy: 'Étude de cas' },
  },
};


function HeroActions({ lang = 'EN' }) {
  return (
    <div className="hero-actions">
      <button className="btn btn-solid" onClick={() => scrollToId('subscribe')}>
        {lang === 'FR' ? "S'abonner" : 'Subscribe'}
      </button>
      <button className="btn btn-out" onClick={() => scrollToId('club')}>
        {lang === 'FR' ? 'Club de conversation' : 'Conversation Club'}
      </button>
    </div>
  );
}

function Tagline({ data }) {
  return (
    <p className="hero-tag">
      {data[0]}<b>{data[1]}</b>{data[2]}
    </p>
  );
}

function HeroLogo({ lang }) {
  const src = lang === 'FR' ? '/images/newestfrenchlogo.webp' : '/images/logo.webp';
  return <img src={src} alt="The Action Pact" style={{ height: 'clamp(180px,28vw,420px)', width: 'auto', objectFit: 'contain', display: 'block', margin: '18px 0 8px' }} />;
}

function Hero({ direction, lang }) {
  const W = window;
  const hero = W.HERO[lang === 'FR' ? 'fr' : 'en'];
  if (direction === 'newsprint') {
    return (
      <section id="top" className="hero newsprint">
        <div className="wrap np-grid">
          <div>
            <Reveal className="kicker" tag="div">{hero.kicker}</Reveal>
            <Reveal><HeroLogo lang={lang} /></Reveal>
            <Reveal><div className="np-rule" /></Reveal>
            <Reveal delay={80}><Tagline data={hero.tagline} /></Reveal>
            <Reveal delay={140}><HeroActions lang={lang} /></Reveal>
          </div>
          <Reveal className="np-figure" delay={120}>
            <span className="tape">Roll 01 · Canada</span>
            <image-slot id="hero-photo-np" placeholder="Drop a hero photo" fit="cover" radius="4"></image-slot>
          </Reveal>
        </div>
      </section>
    );
  }
  if (direction === 'filmstrip') {
    return (
      <section id="top" className="hero filmstrip">
        <div className="wrap">
          <Reveal className="kicker" tag="div">{hero.kicker}</Reveal>
          <Reveal><HeroLogo lang={lang} /></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.05fr)', gap: 'clamp(24px,4vw,56px)', alignItems: 'center', marginTop: 'clamp(20px,3vw,34px)' }} className="fs-row">
            <Reveal delay={80}>
              <Tagline data={hero.tagline} />
              <div style={{ marginTop: 24 }}><HeroActions lang={lang} /></div>
            </Reveal>
            <Reveal className="fs-strip" delay={140}>
              {['28A', '29', '30'].map((n, i) => (
                <div className="fs-cell" key={i}>
                  <span className="fs-num">▸ {n} · TX 5063</span>
                  <image-slot id={`hero-photo-fs-${i + 1}`} placeholder="Drop photo" fit="cover" radius="2"></image-slot>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>
    );
  }
  // poster (default)
  return (
    <section id="top" className="hero poster">
      <div className="photo">
        <image-slot id="hero-photo" src="/images/hero-photo.webp" fit="cover" radius="0"></image-slot>
      </div>
      <div className="wrap">
        <Reveal className="kicker" tag="div">{hero.kicker}</Reveal>
        <Reveal><HeroLogo lang={lang} /></Reveal>
        <Reveal delay={80}><Tagline data={hero.tagline} /></Reveal>
        <Reveal delay={150}><HeroActions lang={lang} /></Reveal>
      </div>
      <div className="frame-tag" style={{ right: 'var(--edge)', bottom: 24 }}>COMMUNICATIONS@THEACTIONPACT.CA</div>
    </section>
  );
}

function About({ lang = 'EN' }) {
  const loc = window.ABOUT[lang === 'FR' ? 'fr' : 'en'];
  return (
    <section id="about" className="sec">
      <div className="wrap about-grid">
        <div className="about-text">
          <Reveal className="sec-eyebrow" tag="div">{loc.eyebrow}</Reveal>
          <Reveal><h2 className="sec-head">{loc.heading}</h2></Reveal>
          <Reveal delay={60}><p className="about-lede">{loc.lede}</p></Reveal>
          <div className="about-body">
            {loc.paras.map((p, i) => (
              <Reveal key={i} tag="p" delay={i * 60}><RichText text={p} /></Reveal>
            ))}
          </div>
          <Reveal className="about-cta" delay={80}>
            <button className="btn btn-solid" onClick={() => scrollToId('subscribe')}>
              {loc.cta} <span className="arr">↓</span>
            </button>
          </Reveal>
        </div>
        <Reveal className="about-figure" delay={120}>
          <img src="/images/about-photo.webp" alt="" loading="lazy" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </Reveal>
      </div>
    </section>
  );
}

function WhySubscribe({ lang = 'EN' }) {
  const W = window;
  const why = W.WHY[lang === 'FR' ? 'fr' : 'en'];
  const isFR = lang === 'FR';
  return (
    <section id="why" className="sec why">
      <div className="wrap">
        <Reveal className="sec-eyebrow" tag="div">{isFR ? 'Pourquoi s\'abonner ?' : 'The case for joining'}</Reveal>
        <Reveal><h2 className="sec-head">{isFR ? 'Pourquoi s\'abonner ?' : 'Why Subscribe?'}</h2></Reveal>
        <div className="why-grid">
          {why.map((c) => (
            <Reveal className="why-card" key={c.n}>
              <span className="why-num">{c.n}</span>
              <h3>{c.head[0]}<span className="hl">{c.head[1]}</span></h3>
              <p>{c.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="why-foot">
          <span className="big">{isFR ? 'Prêt à participer ?' : 'Ready to take part?'}</span>
          <button className="btn btn-solid" onClick={() => scrollToId('subscribe')}>
            {isFR ? "S'abonner" : 'Subscribe'} <span className="arr">↓</span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}

function ConversationClub({ lang = 'EN' }) {
  const W = window;
  const { useState, useEffect } = React;
  const [open, setOpen] = useState(() => window.location.hash === '#resources');
  const club = W.CLUB[lang === 'FR' ? 'fr' : 'en'];
  const isFR = lang === 'FR';
  const r = READINGS[isFR ? 'fr' : 'en'];

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      history.replaceState(null, '', '#resources');
    } else if (window.location.hash === '#resources') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <section id="club" className="sec why" style={{ position: 'relative' }}>
      <img className="books-deco" src="/images/books.webp" alt="" loading="lazy" style={{ position: 'absolute', bottom: '50px', left: '-20px', width: 'clamp(160px, 18vw, 280px)', height: 'auto', pointerEvents: 'none' }} />
      <div className="wrap">
        <Reveal className="sec-eyebrow" tag="div">{isFR ? 'Printemps 2026' : 'Spring 2026'}</Reveal>
        <Reveal><h2 className="sec-head">{isFR ? 'Club de conversation' : 'Conversation Club'}</h2></Reveal>
        <Reveal delay={40}><p style={{ maxWidth: '480px', marginBottom: 'clamp(16px,2vw,24px)', fontFamily: "'Newsreader', serif", fontSize: '16px', lineHeight: 1.6, color: 'var(--ink-soft)' }}>{club.note}</p></Reveal>
        <div className="club-grid">
          <div>
            <Reveal className="club-figure" delay={60}>
              <div style={{ position: 'relative', transform: 'rotate(-2deg)', display: 'inline-block', width: '72%', marginLeft: '8%', marginTop: '16px' }}>
                <div style={{ position: 'relative', backgroundColor: 'var(--white)', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.09'/%3E%3C/svg%3E\")", padding: '10px 10px 44px', boxShadow: '0 0 0 1px rgba(27,37,49,.1)' }}>
                  <img src="/images/club-photo.webp" alt="" loading="lazy" style={{ width: '100%', height: 'auto', display: 'block', filter: 'sepia(0.35) saturate(0.85) contrast(1.2) brightness(1.08) hue-rotate(-8deg)' }} />
                  <div style={{ position: 'absolute', top: '10px', right: '10px', bottom: '44px', left: '10px', background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.28) 100%)', pointerEvents: 'none' }} />
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal className="club-card" delay={120}>
            <div className="club-banner">{club.banner}</div>
            <p style={{ fontFamily: "'Newsreader', serif", fontSize: '17px', lineHeight: 1.6, color: 'var(--ink-soft)', margin: '18px 0 24px' }}>
              {isFR ? 'Cliquez ' : 'Click '}<button onClick={() => setOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--ink)', color: 'var(--paper)', border: 0, borderRadius: 0, padding: '4px 16px', fontFamily: "'Newsreader', serif", fontWeight: 600, fontSize: '16px', cursor: 'pointer', verticalAlign: 'middle', lineHeight: 1.3, textDecoration: 'underline', textDecorationColor: 'var(--orange)', textUnderlineOffset: '3px' }}>{isFR ? 'ici' : 'here'}</button>{isFR ? ' pour en savoir plus sur le lobbying et pourquoi nous avons choisi ce sujet, et pour accéder aux ressources pré-conversation.' : ' to read up on what lobbying is and why we chose it, and to access all the pre-conversation resources.'}
            </p>
            <div className="club-events-grid" style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '20px', margin: '0 0 28px', justifyContent: 'start' }}>
              {[{ city: 'Toronto', date: 'June 22nd @ 7pm', location: 'Danu Social House' }, { city: 'Montreal', date: 'June 26th @ 7pm', location: 'TBD' }].map(({ city, date, location }) => (
                <div key={city} className="club-detail">
                  <div className="row"><span className="k" style={{ textDecoration: 'underline', textDecorationColor: 'var(--orange)', textUnderlineOffset: '4px' }}>{city}</span></div>
                  <div className="row" style={{ whiteSpace: 'nowrap' }}><span className="k">{isFR ? 'Date : ' : 'Date: '}</span><span className="v">{date.replace(/(st|nd|rd|th)/g, '|||$1|||').split('|||').map((s, i) => /^(st|nd|rd|th)$/.test(s) ? <span key={i} style={{ fontSize: '0.65em', position: 'relative', top: '-0.3em' }}>{s}</span> : s)}</span></div>
                  <div className="row" style={{ whiteSpace: 'nowrap' }}><span className="k">{isFR ? 'Lieu : ' : 'Location: '}</span><span className="v">{location}</span></div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 199,
          background: 'rgba(27,37,49,.45)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity .35s ease',
        }}
      />

      {/* Slide-in drawer */}
      <div
        className="drawer-panel"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 200,
          width: '87vw',
          background: 'var(--paper)',
          boxShadow: '-20px 0 60px rgba(0,0,0,.15)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform .4s cubic-bezier(.2,.7,.2,1)',
          display: 'flex',
        }}
      >
        {/* Left scrollable content */}
        <div className="drawer-content" style={{ flex: 1, overflowY: 'auto', padding: 'clamp(16px,3vw,32px) clamp(32px,5vw,56px) clamp(32px,5vw,56px)' }}>
          <button
            onClick={() => setOpen(false)}
            style={{
              display: 'block', marginLeft: 'auto', marginBottom: '20px',
              background: 'none', border: 0, cursor: 'pointer', fontSize: '28px', lineHeight: 1,
              color: 'var(--ink-soft)', fontFamily: 'Newsreader, serif', padding: '4px',
            }}
          >×</button>
          {/* Eyebrow */}
          <p className="drawer-eyebrow-line" style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: '12px', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ink-soft)', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ display: 'inline-block', width: '28px', height: '1.5px', background: 'var(--orange)' }}></span>
            {isFR ? 'Printemps 2026 · Lobbying' : 'Spring 2026 · Lobbying'}
          </p>
          <h2 style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, color: 'var(--orange)', fontSize: 'clamp(28px,4vw,42px)', lineHeight: 1, margin: '0 0 24px', letterSpacing: '-.01em' }}>
            {isFR ? 'Ressources pré-conversation' : 'Pre-Conversation Resources'}
          </h2>
          <div style={{ height: '2px', background: 'var(--ink)', opacity: .85, margin: '0 0 28px' }} />

          {/* Intro paragraphs */}
          {r.intro.map((p, i) => (
            <p key={i} style={{ fontFamily: "'Newsreader', serif", fontSize: '17px', lineHeight: 1.65, color: 'var(--ink-soft)', margin: '0 0 18px' }}>{p}</p>
          ))}

          {(() => {
            const ResourceItem = ({ item, i }) => (
              <div key={i} style={{ borderTop: '2px solid var(--ink)', paddingTop: '16px', paddingBottom: '20px' }}>
                <p style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: '10px', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--ink-soft)', margin: '0 0 5px' }}>
                  {item.type}{item.source ? ' · ' + item.source : ''}
                </p>
                <h4 style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: '1rem', lineHeight: 1.3, color: 'var(--ink)', margin: '0 0 6px' }}>
                  {item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'var(--orange)', textUnderlineOffset: '3px' }}>{item.title}</a> : item.title}
                </h4>
                <p style={{ fontFamily: "'Newsreader', serif", fontSize: '14px', lineHeight: 1.6, color: 'var(--ink-soft)', margin: 0 }}>{item.desc}</p>
              </div>
            );
            const SectionLabel = ({ label }) => (
              <p style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: '11px', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--orange)', margin: '0', fontWeight: 600 }}>{label}</p>
            );
            return (
              <>
                {/* Audio | Video */}
                <div className="drawer-av-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', marginTop: '32px', borderTop: '2px solid var(--ink)', borderBottom: '2px solid var(--ink)' }}>
                  <div style={{ paddingRight: '24px', borderRight: '2px solid var(--ink)', paddingTop: '16px', paddingBottom: '4px' }}>
                    <SectionLabel label={r.labels.audio} />
                    {r.audio.map((item, i) => <ResourceItem key={i} item={item} i={i} />)}
                  </div>
                  <div style={{ paddingLeft: '24px', paddingTop: '16px', paddingBottom: '4px' }}>
                    <SectionLabel label={r.labels.video} />
                    {r.video.map((item, i) => <ResourceItem key={i} item={item} i={i} />)}
                  </div>
                </div>

                {/* Written (label above) | articles + case study */}
                <div style={{ marginTop: '32px' }}>
                  <SectionLabel label={r.labels.written} />
                  <div style={{ height: '2px', background: 'var(--ink)', margin: '8px 0 0' }} />
                  <div className="drawer-wc-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', borderBottom: '2px solid var(--ink)' }}>
                    <div style={{ paddingRight: '24px', borderRight: '2px solid var(--ink)', paddingTop: '16px', paddingBottom: '4px' }}>
                      {r.written.map((item, i) => <ResourceItem key={i} item={item} i={i} />)}
                    </div>
                    <div style={{ background: 'var(--orange)', padding: '16px 24px 4px' }}>
                      <p style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: '11px', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--paper)', margin: '0 0 14px', fontWeight: 600, opacity: 0.85 }}>{r.labels.caseStudy}</p>
                      <p style={{ fontFamily: "'Newsreader', serif", fontSize: '13px', lineHeight: 1.55, color: 'var(--paper)', margin: '0 0 4px', opacity: 0.9 }}>{r.caseStudyIntro}</p>
                      {r.caseStudy.map((item, i) => (
                        <div key={i} style={{ borderTop: '2px solid rgba(255,255,255,0.25)', paddingTop: '16px', paddingBottom: '20px' }}>
                          <p style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: '10px', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--paper)', margin: '0 0 5px', opacity: 0.7 }}>
                            {item.type}{item.source ? ' · ' + item.source : ''}
                          </p>
                          <h4 style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: '1rem', lineHeight: 1.3, color: 'var(--paper)', margin: '0 0 6px' }}>
                            {item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.5)', textUnderlineOffset: '3px' }}>{item.title}</a> : item.title}
                          </h4>
                          <p style={{ fontFamily: "'Newsreader', serif", fontSize: '14px', lineHeight: 1.6, color: 'var(--paper)', margin: 0, opacity: 0.85 }}>{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            );
          })()}

        </div>

        {/* Right image panel */}
        <div className="drawer-photo-panel" style={{ width: '220px', flexShrink: 0, background: '#000', display: 'flex', alignItems: 'center', borderLeft: '4px solid #1b2531' }}>
          <img src="/images/pre-conversation-photo.webp" alt="" loading="lazy" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
      </div>
    </section>
  );
}

function Footer({ lang = 'EN' }) {
  const W = window;
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-top">
          <button style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'flex-end' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="The Action Pact">
            <img src={lang === 'FR' ? '/images/newestfrenchlogo.webp' : '/images/logo.webp'} alt="The Action Pact" style={{ height: '80px', width: 'auto', objectFit: 'contain' }} />
          </button>
          <nav className="foot-nav">
            {W.NAV[lang === 'FR' ? 'fr' : 'en'].map((n) => (
              <button key={n.id} onClick={() => scrollToId(n.id)}>{n.label}</button>
            ))}
          </nav>
        </div>
        <div className="foot-rule" />
        <div className="foot-bot">
          <span>© 2026 The Action Pact</span>
          <a href={`mailto:${W.SUBSCRIBE.email}`}>{W.SUBSCRIBE.email}</a>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Hero, About, WhySubscribe, ConversationClub, Footer });
