// data.jsx — content for The Action Pact landing page
const NAV = {
  en: [
    { id: 'about', label: 'About' },
    { id: 'club', label: 'Conversation Club' },
    { id: 'subscribe', label: 'Subscribe' },
  ],
  fr: [
    { id: 'about', label: "À propos" },
    { id: 'club', label: 'Club de conversation' },
    { id: 'subscribe', label: "S’abonner" },
  ],
};

const HERO = {
  en: {
    kicker: 'A Canadian civic engagement movement',
    tagline: ['Get in on the action.', '', ''],
  },
  fr: {
    kicker: "Un mouvement d’engagement civique canadien",
    tagline: ["Participez à l’action.", '', ''],
  },
};

const ABOUT = {
  en: {
    eyebrow: "Who we are",
    heading: "About Us",
    lede: "We're building The Action Pact, and we'd love for you to help shape it from the ground up.",
    paras: [
      "The Action Pact is a civic engagement organization for people who care about what happens in Canada, but have run into barriers that make public participation feel confusing, exhausting, or pointless. We're working to contribute to a culture of meaningful and enthusiastic civic engagement in Canada, so more of us feel confident taking part.",
      "Our work is grounded in a commitment to action that's strategic, accessible, and collective. We're developing evidence-supported tools and civic education to help people make informed choices. We're making participation easier to understand and easier to fit into real life. And we're building spaces and partnerships that help people learn together and act together.",
    ],
    cta: "Help Us Shape It",
  },
  fr: {
    eyebrow: "Qui nous sommes",
    heading: "À Propos de Nous",
    lede: "Nous sommes en train de mettre en place The Action Pact, et nous aimerions que vous nous aidiez à le façonner dès le départ.",
    paras: [
      "The Action Pact est une organisation d'engagement civique destinée aux personnes qui se soucient de ce qui se passe au Canada, mais qui se heurtent à des obstacles qui rendent la participation publique confuse, épuisante ou inutile. Nous nous efforçons de contribuer à une culture d'engagement civique impactante et enthousiaste au Canada, afin que nous soyons plus nombreux à oser y prendre part.",
      "Notre travail repose sur un engagement en faveur d'une action stratégique, accessible et collective. Nous développons des outils fondés sur des données probantes et une éducation civique afin d'aider les gens à faire des choix éclairés. Nous rendons la participation plus facile à comprendre et à intégrer dans la vie réelle. Et nous créons des espaces et des partenariats qui aident les gens à apprendre et à agir ensemble.",
    ],
    cta: "Rejoindre la liste",
  },
};

const WHY = {
  en: [
    { n: '01', head: ['Action you can ', 'actually take.'], body: "Bite-sized, evidence-backed ways to take part — sent when it matters, not when it’s too late. No doomscrolling, no homework." },
    { n: '02', head: ['Plain-language ', 'civics.'], body: 'We translate the confusing stuff — bills, ballots, budgets, and consultations — into language that actually makes sense.' },
    { n: '03', head: ['A community, ', 'not a feed.'], body: 'Conversation Club, book clubs, and local meet-ups where people learn together and act together, in person and online.' },
    { n: '04', head: ['Made in Canada, ', 'for Canada.'], body: 'Built around the decisions that actually shape life here — available in both official languages, wherever you are.' },
  ],
  fr: [
    { n: '01', head: ['Des actions que vous pouvez ', 'vraiment entreprendre.'], body: "Des façons concrètes et fondées sur des données probantes de participer — envoyées au bon moment. Pas de spirale anxiogène, pas de devoirs." },
    { n: '02', head: ['La politique en ', 'langage clair.'], body: "Nous traduisons les choses complexes — projets de loi, bulletins de vote, budgets et consultations — dans un langage qui a vraiment du sens." },
    { n: '03', head: ['Une communauté, ', "pas un fil d’actualité."], body: "Club de conversation, clubs de lecture et rencontres locales où les gens apprennent et agissent ensemble, en personne et en ligne." },
    { n: '04', head: ['Fait au Canada, ', 'pour le Canada.'], body: "Axé sur les décisions qui façonnent vraiment la vie ici — disponible dans les deux langues officielles, où que vous soyez." },
  ],
};

const CLUB = {
  en: {
    banner: "This Season’s Topic: Lobbying!",
    note: 'The Action Pact Conversation Club is a space for people to engage at different levels, bring different forms of knowledge into the room, and think together about civic participation.',
  },
  fr: {
    banner: "Le sujet de cette saison : Le lobbying !",
    note: "Le Club de conversation de The Action Pact est un espace où les gens peuvent s’engager à différents niveaux, apporter différentes formes de connaissances et réfléchir ensemble à la participation civique.",
  },
};

const SUBSCRIBE = {
  email: "communications@theactionpact.ca",
  en: {
    big: "Get in on the Action.",
    eyebrow: "Subscribe",
    pitch: [
      "We are just getting started and we want you with us from the beginning. The Action Pact is here to make civic engagement in Canada strategic, accessible, and collective.",
      "By joining our email list, you will be the first to receive The Action Pact newsletter with timely opportunities, events, and resources that make it easy to take action and connect with others.",
      "Together, we're building a culture of meaningful and enthusiastic participation in Canada's democracy.",
    ],
  },
  fr: {
    big: "Participez à l’action.",
    eyebrow: "S’abonner",
    pitch: [
      "Nous n’en sommes qu’au début et nous voulons que vous fassiez partie de l’aventure dès le départ. The Action Pact est là pour rendre l’engagement civique au Canada stratégique, accessible et collectif.",
      "En vous inscrivant à notre liste de diffusion, vous serez les premiers à recevoir l’infolettre de The Action Pact, avec des événements et des ressources qui facilitent le passage à l’action et la connexion avec les autres.",
      "Ensemble, nous bâtissons une culture de participation impactante et enthousiaste à la démocratie canadienne.",
    ],
  },
};

Object.assign(window, { NAV, HERO, ABOUT, WHY, CLUB, SUBSCRIBE, CITIES_EN, CITIES_FR });
