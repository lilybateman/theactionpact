import { useState, useRef, useEffect } from "react";

import { useToast } from "@/hooks/use-toast";
import ActionPactLogo from "@/components/ActionPactLogo";
import { supabase } from "@/lib/supabase";

  // Cities list for autocomplete - separate arrays for English and French
const englishCities = [
  "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg", "Quebec City", "Hamilton", "Kitchener",
  "London", "Victoria", "Halifax", "Oshawa", "Windsor", "Saskatoon", "Regina", "St. John's", "Kelowna", "Kingston",
  "Sherbrooke", "Guelph", "Thunder Bay", "Moncton", "Saint John", "Peterborough", "Sault Ste. Marie", "Timmins", "North Bay", "Sudbury",
  "Trois-Rivières", "Laval", "Gatineau", "Longueuil", "Brossard", "Saguenay", "Lévis", "Surrey", "Burnaby", "Richmond",
  "Abbotsford", "Coquitlam", "Nanaimo", "Kamloops", "Prince George", "Fort St. John", "Whitehorse", "Yellowknife", "Iqaluit", "Fredericton",
  "Charlottetown", "Sydney", "Dartmouth", "Brampton", "Mississauga", "Markham", "Vaughan", "Richmond Hill", "Oakville", "Burlington",
  "St. Catharines", "Niagara Falls", "Windsor", "Sarnia", "Thunder Bay", "Sudbury", "North Bay", "Timmins", "Sault Ste. Marie", "Timmins",
  "Barrie", "Orillia", "Peterborough", "Belleville", "Kingston", "Brockville", "Cornwall", "Hawkesbury", "Gatineau", "Ottawa",
];

const frenchCities = [
  "Montréal", "Ville de Québec", "Trois-Rivières", "Sherbrooke", "Laval", "Gatineau", "Longueuil", "Brossard", "Saguenay", "Lévis",
  "Saint-Jean-sur-Richelieu", "Saint-Hyacinthe", "Joliette", "Saint-Jérôme", "Sainte-Thérèse", "Blainville", "Mirabel", "Saint-Eustache",
  "Repentigny", "Dollard-des-Ormeaux", "Pointe-Claire", "Kirkland", "Beaconsfield", "Baie-D'Urfé", "Sainte-Anne-de-Bellevue", "Senneville",
  "Dorval", "Pincourt", "Vaudreuil-Dorion", "Saint-Lazare", "Hudson", "Rigaud", "Vaudreuil-sur-le-Lac", "Pointe-Calumet", "Saint-Joseph-du-Lac",
  "Oka", "Saint-Placide", "Saint-Canut", "Saint-Benoît", "Sainte-Scholastique", "Saint-Janvier", "Lachute", "Brownsburg-Chatham", "Grenville",
  "Calumet", "Carillon", "Saint-André-d'Argenteuil", "Gore", "Mille-Isles", "Wentworth", "Morin-Heights", "Piedmont", "Sainte-Adèle",
  "Sainte-Marguerite", "Val-Morin", "Val-David", "Sainte-Lucie-des-Laurentides", "Mont-Tremblant", "Labelle", "La Conception", "La Minerve",
  "Lantier", "Val-des-Lacs", "Lac-Supérieur", "Arundel", "Wentworth-Nord", "Saint-Sauveur", "Prévost", "Saint-Hippolyte", "Ville de Toronto",
  "Ville de Vancouver", "Ville de Calgary", "Ville d'Edmonton", "Ville d'Ottawa", "Ville de Winnipeg", "Ville de Hamilton", "Ville de Kitchener",
  "Ville de London", "Ville de Victoria", "Ville d'Halifax", "Ville d'Oshawa", "Ville de Windsor", "Ville de Saskatoon", "Ville de Regina",
  "Saint-Jean de Terre-Neuve", "Ville de Kelowna", "Ville de Kingston", "Ville de Guelph", "Baie du Tonnerre", "Ville de Moncton",
  "Saint-Jean", "Ville de Peterborough", "Sault-Sainte-Marie", "Ville de Timmins", "Ville de North Bay", "Ville de Sudbury", "Ville de Surrey",
  "Ville de Burnaby", "Ville de Richmond", "Ville d'Abbotsford", "Ville de Coquitlam", "Ville de Nanaimo", "Ville de Kamloops",
  "Ville de Prince George", "Fort-Saint-Jean", "Cheval Blanc", "Ville de Yellowknife", "Ville d'Iqaluit", "Ville de Fredericton",
  "Ville de Charlottetown", "Ville de Sydney", "Ville de Dartmouth", "Ville de Brampton", "Ville de Mississauga", "Ville de Markham",
  "Ville de Vaughan", "Ville de Richmond Hill", "Ville d'Oakville", "Ville de Burlington", "Sainte-Catherine", "Chutes du Niagara",
  "Ville de Sarnia", "Ville de Barrie", "Ville d'Orillia", "Ville de Belleville", "Ville de Brockville", "Ville de Cornwall",
  "Ville de Hawkesbury", "Ville de Saint-Jean-sur-Richelieu", "Ville de Saint-Hyacinthe", "Ville de Joliette", "Ville de Saint-Jérôme",
  "Ville de Sainte-Thérèse", "Ville de Blainville", "Ville de Mirabel", "Ville de Saint-Eustache", "Ville de Repentigny",
  "Ville de Dollard-des-Ormeaux", "Ville de Pointe-Claire", "Ville de Kirkland", "Ville de Beaconsfield", "Ville de Baie-D'Urfé",
  "Ville de Sainte-Anne-de-Bellevue", "Ville de Senneville", "Ville de Dorval", "Ville de Pincourt", "Ville de Vaudreuil-Dorion",
  "Ville de Saint-Lazare", "Ville de Hudson", "Ville de Rigaud", "Ville de Vaudreuil-sur-le-Lac", "Ville de Pointe-Calumet",
  "Ville de Saint-Joseph-du-Lac", "Ville d'Oka", "Ville de Saint-Placide", "Ville de Saint-Canut", "Ville de Saint-Benoît",
  "Ville de Sainte-Scholastique", "Ville de Saint-Janvier", "Ville de Lachute", "Ville de Brownsburg-Chatham", "Ville de Grenville",
  "Ville de Calumet", "Ville de Carillon", "Ville de Saint-André-d'Argenteuil", "Ville de Gore", "Ville de Mille-Isles",
  "Ville de Wentworth", "Ville de Morin-Heights", "Ville de Piedmont", "Ville de Sainte-Adèle", "Ville de Sainte-Marguerite",
  "Ville de Val-Morin", "Ville de Val-David", "Ville de Sainte-Lucie-des-Laurentides", "Ville de Mont-Tremblant", "Ville de Labelle",
  "Ville de La Conception", "Ville de La Minerve", "Ville de Lantier", "Ville de Val-des-Lacs", "Ville de Lac-Supérieur",
  "Ville d'Arundel", "Ville de Wentworth-Nord", "Ville de Saint-Sauveur", "Ville de Prévost", "Ville de Saint-Hippolyte"
];

// Translations
const translations = {
  en: {
    title: "The Action Pact",
    subtitle: "Get in on the Action.",
    name: "Name",
    email: "Email",
    location: "Location",
    submit: "Submit",
    submitting: "Submitting...",
    namePlaceholder: "Your name",
    emailPlaceholder: "you@example.com",
    locationPlaceholder: "Your location",
    successTitle: "You're in!",
    successDescription: (name: string, city: string) => 
      `You're in!`,
    invalidEmail: "Please enter a valid email.",
    preferredLanguage: "Preferred Language:",
    english: "English",
    french: "French",
    fontOptions: "Font Options:",
    artsyText: "Artsy Text - Caveat Handwriting",
    handwrittenText: "Handwritten Text - Architects Daughter",
    markerText: "✓ Marker Text - Permanent Marker (Selected)",
    originalHand: "Original Hand - Kalam",
    blurbTitle: "What is The Action Pact?",
    aboutUs: "About Us",
    whySubscribe: "Why Subscribe?",
    whySubscribeContent1: "We are just getting started and we want you with us from the beginning. The Action Pact is here to make civic engagement in Canada strategic, accessible, and collective.",
    whySubscribeContent2: "By joining our email list, you will be the first to receive The Action Pact newsletter with timely opportunities, events, and resources that make it easy to take action and connect with others.",
    whySubscribeContent3: "Together, we're building a culture of meaningful and enthusiastic participation in Canada's democracy.",
    contactUs: "Contact Us:",
    aboutContent1: "We're building The Action Pact, and we'd love for you to help shape it from the ground up.",
    aboutContent2: "The Action Pact is a civic engagement organization for people who care about what happens in Canada, but have run into barriers that make public participation feel confusing, exhausting, or pointless. We're working to contribute to a culture of meaningful and enthusiastic civic engagement in Canada, so more of us feel confident taking part.",
    aboutContent3: "Our work is grounded in a commitment to action that's strategic, accessible, and collective. We're developing evidence-supported tools and civic education to help people make informed choices. We're making participation easier to understand and easier to fit into real life. And we're building spaces and partnerships that help people learn together and act together."
  },
  fr: {
    title: "Le Pacte d'Action",
    subtitle: "Participez à l'action.",
    name: "Nom",
    email: "Courriel",
    location: "Ville",
    submit: "Soumettre",
    submitting: "Soumission...",
    namePlaceholder: "Votre nom",
    emailPlaceholder: "vous@exemple.com",
    locationPlaceholder: "Votre ville",
    successTitle: "Vous êtes inscrit !",
    successDescription: (name: string, city: string) => 
      `Vous êtes inscrit !`,
    invalidEmail: "Veuillez entrer un email valide.",
    preferredLanguage: "Langue Préférée:",
    english: "Anglais",
    french: "Français",
    fontOptions: "Options de Police:",
    artsyText: "Texte Artistique - Caveat Handwriting",
    handwrittenText: "Texte Manuscrit - Architects Daughter",
    markerText: "✓ Texte Marqueur - Permanent Marker (Sélectionné)",
    originalHand: "Main Originale - Kalam",
    blurbTitle: "Qu'est-ce que Le Pacte d'Action ?",
    aboutUs: "À Propos de Nous",
    whySubscribe: "Pourquoi S'abonner ?",
    whySubscribeContent1: "Nous n'en sommes qu'au début et nous voulons que vous fassiez partie de l'aventure dès le départ. The Action Pact est là pour rendre l'engagement civique au Canada stratégique, accessible et collectif.",
    whySubscribeContent2: "En vous inscrivant à notre liste de diffusion, vous serez les premiers à recevoir l'infolettre de The Action Pact, avec des événements et des ressources qui facilitent le passage à l'action et la connexion avec les autres.",
    whySubscribeContent3: "Ensemble, nous bâtissons une culture de participation impactante et enthousiaste à la démocratie canadienne.",
    contactUs: "Contactez-Nous:",
    aboutContent1: "Nous sommes en train de mettre en place The Action Pact, et nous aimerions que vous nous aidiez à le façonner dès le départ.",
    aboutContent2: "The Action Pact est une organisation d'engagement civique destinée aux personnes qui se soucient de ce qui se passe au Canada, mais qui se heurtent à des obstacles qui rendent la participation publique confuse, épuisante ou inutile. Nous nous efforçons de contribuer à une culture d'engagement civique impactante et enthousiaste au Canada, afin que nous soyons plus nombreux à oser y prendre part.",
    aboutContent3: "Notre travail repose sur un engagement en faveur d'une action stratégique, accessible et collective. Nous développons des outils fondés sur des données probantes et une éducation civique afin d'aider les gens à faire des choix éclairés. Nous rendons la participation plus facile à comprendre et à intégrer dans la vie réelle. Et nous créons des espaces et des partenariats qui aident les gens à apprendre et à agir ensemble."
  }
};

const Index = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'fr'>('en');
  const [cityValue, setCityValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const [showAbout, setShowAbout] = useState(false);
  const [showWhySubscribe, setShowWhySubscribe] = useState(false);

  const t = translations[language];

  // Helper function to highlight specific words in red and bold
  const highlightWords = (text: string) => {
    if (language === 'en') {
      // Highlight "strategic, accessible, and collective"
      const parts = text.split(/(strategic, accessible, and collective)/);
      return parts.map((part, i) => 
        part === 'strategic, accessible, and collective' 
          ? <span key={i} className="text-primary font-bold">{part}</span>
          : part
      );
    } else {
      // Highlight "stratégique, accessible et collective"
      const parts = text.split(/(stratégique, accessible et collective)/);
      return parts.map((part, i) => 
        part === 'stratégique, accessible et collective' 
          ? <span key={i} className="text-primary font-bold">{part}</span>
          : part
      );
    }
  };

  // Sync preferred language with site language
  useEffect(() => {
    setPreferredLanguage(language);
  }, [language]);

  // Filter cities based on input and language preference
  const filterCities = (input: string) => {
    if (!input.trim()) return [];
    
    // Use the appropriate city array based on language
    const citiesToSearch = language === 'fr' ? frenchCities : englishCities;
    
    const filtered = citiesToSearch.filter(city => 
      city.toLowerCase().includes(input.toLowerCase())
    );
    
    // Add the user's input as the first option if it's not already in the list
    const userInput = input.trim();
    const suggestions = [];
    
    // Add user input as first option if it's not already in the filtered results
    if (!filtered.some(city => city.toLowerCase() === userInput.toLowerCase())) {
      suggestions.push(userInput);
    }
    
    // Add filtered cities (limit to 7 more to keep total at 8)
    suggestions.push(...filtered.slice(0, 7));
    
    return suggestions;
  };

  // Handle city input change
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCityValue(value);
    const filtered = filterCities(value);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0 && value.trim().length > 0);
    setSelectedIndex(-1);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (city: string) => {
    setCityValue(city);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Supabase database function
  const sendToSupabase = async (name: string, email: string, location: string, preferredLang: 'en' | 'fr') => {
    try {
      const { data, error } = await supabase
        .from('Newsletter')
        .insert([
          {
            name: name || null,
            email: email,
            location: location || null,
            preferred_language: preferredLang,
          }
        ]);

      if (error) {
        console.error('Supabase error:', error);
        return false;
      }

      console.log('Data saved to Supabase successfully:', data);
      return true;
    } catch (error) {
      console.error('Error sending to Supabase:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get("name") as string) || "";
    const email = (data.get("email") as string) || "";
            const location = cityValue || (data.get("location") as string) || "";

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) {
      toast({ title: t.invalidEmail });
      return;
    }

    setLoading(true);
    
    try {
      // Send to Supabase
      const dbSuccess = await sendToSupabase(name, email, location, preferredLanguage);
      
      // Show success message
      if (dbSuccess) {
        toast({
          title: t.successTitle,
        });
      } else {
        // Still show success but mention the data wasn't saved
        toast({
          title: t.successTitle,
          description: "Note: Data may not have been saved to our records",
        });
      }
      
      // Reset form
      form.reset();
      setCityValue('');
      setShowSuggestions(false);
      setSuggestions([]);
      
      console.log("Newsletter signup:", { name, email, location, dbSuccess });
      
    } catch (error) {
      console.error('Form submission error:', error);
      toast({ 
        title: "Error", 
        description: "There was an error submitting your information. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="container py-4 md:py-6 flex items-center justify-end">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setShowAbout(!showAbout);
              if (!showAbout) setShowWhySubscribe(false);
            }}
            className={`text-sm md:text-base font-bold transition-colors cursor-pointer ${
              showAbout ? 'text-primary underline' : 'hover:text-primary hover:underline'
            }`}
          >
            {t.aboutUs}
          </button>
          <button
            onClick={() => {
              setShowWhySubscribe(!showWhySubscribe);
              if (!showWhySubscribe) setShowAbout(false);
            }}
            className={`text-sm md:text-base font-bold transition-colors cursor-pointer ${
              showWhySubscribe ? 'text-primary underline' : 'hover:text-primary hover:underline'
            }`}
          >
            {t.whySubscribe}
          </button>
          <button
            onClick={() => {
              const newLang = language === 'en' ? 'fr' : 'en';
              setLanguage(newLang);
              setPreferredLanguage(newLang);
            }}
            className="text-sm md:text-base font-bold hover:text-primary hover:underline transition-colors"
            aria-label={`Switch to ${language === 'en' ? 'French' : 'English'}`}
          >
            <span className={language === 'fr' ? 'text-primary' : 'text-foreground'}>FR</span>
            <span className="text-foreground">/</span>
            <span className={language === 'en' ? 'text-primary' : 'text-foreground'}>EN</span>
          </button>
        </div>
      </header>
      <main className="min-h-screen flex flex-col">
        <section className="container flex-1 flex flex-col justify-start pt-0 pb-4 md:pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Left column - Logo and Form */}
            <div className="space-y-8">
              <ActionPactLogo />
              
              <div className="sr-only">The Action Pact — Newsletter Signup</div>

              <article id="signup" className="mt-1 md:mt-4 max-w-2xl">
                <p className="marker-text text-xl md:text-3xl mb-4 md:mb-8">{t.subtitle}</p>
                
                <form onSubmit={handleSubmit} className="space-y-2 md:space-y-8" aria-label="Newsletter signup form">
                  <div>
                    <label htmlFor="name" className="scribble-label text-lg md:text-xl">{t.name}</label>
                    <input id="name" name="name" type="text" className="scribble-input py-2 md:py-3 text-lg md:text-xl" placeholder={t.namePlaceholder} autoComplete="name" />
                  </div>
                  <div className="relative">
                    <label htmlFor="location" className="scribble-label text-lg md:text-xl">{t.location}</label>
                    <input 
                      id="location" 
                      name="location" 
                      type="text" 
                      className="scribble-input py-2 md:py-3 text-lg md:text-xl" 
                      placeholder={t.locationPlaceholder} 
                      autoComplete="off"
                      value={cityValue}
                      onChange={handleCityChange}
                      onKeyDown={handleKeyDown}
                      ref={cityInputRef}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <div 
                        ref={suggestionsRef}
                        className="absolute z-50 w-full mt-1 bg-background border-2 border-foreground rounded-md shadow-lg max-h-48 overflow-y-auto autocomplete-dropdown"
                        style={{ borderWidth: '3px' }}
                      >
                        {suggestions.map((city, index) => {
                          // Check if this is the user's input (first option and not in the predefined list)
                          const isUserInput = index === 0 && !englishCities.includes(city) && !frenchCities.includes(city);
                          
                          return (
                            <button
                              key={city}
                              type="button"
                              className={`w-full px-4 py-2 text-left hover:bg-foreground hover:text-background transition-colors ${
                                index === selectedIndex ? 'bg-foreground text-background' : ''
                              } ${isUserInput ? 'font-medium' : ''}`}
                              style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif' }}
                              onClick={() => handleSuggestionClick(city)}
                            >
                              {city}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="mb-2 md:mb-0">
                    <label htmlFor="email" className="scribble-label text-lg md:text-xl">{t.email}</label>
                    <input id="email" name="email" type="email" required className="scribble-input py-2 md:py-3 text-lg md:text-xl" placeholder={t.emailPlaceholder} autoComplete="email" />
                  </div>

                  <div className="pt-4 md:pt-6">
                    <label className="scribble-label text-lg md:text-xl">Language Preference</label>
                    <div className="flex items-center gap-2 mt-2 ml-1">
                      <button
                        type="button"
                        onClick={() => {
                          setLanguage('en');
                          setPreferredLanguage('en');
                        }}
                        className={`px-2 py-1 text-sm md:text-base border rounded transition-colors ${
                          preferredLanguage === 'en' 
                            ? 'bg-primary text-white border-primary' 
                            : 'bg-transparent border-primary text-primary hover:bg-primary/10'
                        }`}
                        style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif', borderWidth: '2px' }}
                      >
                        EN
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLanguage('fr');
                          setPreferredLanguage('fr');
                        }}
                        className={`px-2 py-1 text-sm md:text-base border rounded transition-colors ${
                          preferredLanguage === 'fr' 
                            ? 'bg-primary text-white border-primary' 
                            : 'bg-transparent border-primary text-primary hover:bg-primary/10'
                        }`}
                        style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif', borderWidth: '2px' }}
                      >
                        FR
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 md:pt-6 flex items-start gap-8">
                    <button type="submit" className="scribble-button py-3 md:py-4 !text-lg md:!text-xl" style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif', fontWeight: 500 }} disabled={loading} aria-busy={loading} aria-live="polite">
                      {loading ? t.submitting : t.submit}
                    </button>

                  </div>
                </form>

                {/* Contact information below submit button */}
                <div className="pt-8 md:pt-12">
                  <p className="text-primary font-medium text-base md:text-lg">
                    {t.contactUs} <a href="mailto:communications@theactionpact.ca" className="underline hover:text-primary/80 transition-colors">communications@theactionpact.ca</a>
                  </p>
                </div>
              </article>
            </div>
            
                      {/* Right column - Dropdowns */}
          <div className="hidden lg:block">

            

            
            {/* Why subscribe dropdown */}
            {showWhySubscribe && (
              <div className="max-w-lg">
                <h2 className="text-primary text-xl md:text-2xl font-bold mb-6">{t.whySubscribe}</h2>
                <p className="text-xl mb-6 font-normal" style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif', fontWeight: 500 }}>
                  {t.whySubscribeContent1}
                </p>
                <p className="text-xl mb-6 font-normal" style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif', fontWeight: 500 }}>
                  {t.whySubscribeContent2}
                </p>
                <p className="text-xl font-normal" style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif', fontWeight: 500 }}>
                  {t.whySubscribeContent3}
                </p>
              </div>
            )}
            
            {/* About dropdown */}
            {showAbout && (
              <div className="max-w-lg">
                <h2 className="text-primary text-xl md:text-2xl font-bold mb-6">{t.aboutUs}</h2>
                <p className="text-xl mb-6 font-normal" style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif', fontWeight: 500 }}>
                  {t.aboutContent1}
                </p>
                
                <p className="text-xl mb-6 font-normal" style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif', fontWeight: 500 }}>
                  {t.aboutContent2}
                </p>
                
                <p className="text-xl font-normal" style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif', fontWeight: 500 }}>
                  {highlightWords(t.aboutContent3)}
                </p>
              </div>
            )}
          </div>
          </div>
          
          {/* Mobile: Dismissible text boxes */}
          <div className="md:hidden space-y-4">

            
            {/* Why subscribe text box */}
            {showWhySubscribe && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-background border-2 border-border rounded-lg p-6 relative shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={() => setShowWhySubscribe(false)}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-foreground text-xl font-bold"
                    aria-label="Close"
                  >
                    ×
                  </button>
                
                <h2 className="text-primary text-lg font-bold mb-4">{t.whySubscribe}</h2>
                <p className="text-lg mb-4 font-normal" style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif', fontWeight: 500 }}>
                  {t.whySubscribeContent1}
                </p>
                <p className="text-lg mb-4 font-normal" style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif', fontWeight: 500 }}>
                  {t.whySubscribeContent2}
                </p>
                <p className="text-lg font-normal" style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif', fontWeight: 500 }}>
                  {t.whySubscribeContent3}
                </p>
                </div>
              </div>
            )}
            
            {/* About text box */}
            {showAbout && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-background border-2 border-border rounded-lg p-6 relative shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={() => setShowAbout(false)}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-foreground text-xl font-bold"
                    aria-label="Close"
                  >
                    ×
                  </button>
                
                <h2 className="text-primary text-lg font-bold mb-4">{t.aboutUs}</h2>
                <p className="text-lg mb-4 font-normal" style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif', fontWeight: 500 }}>
                  {t.aboutContent1}
                </p>
                
                <p className="text-lg mb-4 font-normal" style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif', fontWeight: 500 }}>
                  {t.aboutContent2}
                </p>
                
                <p className="text-lg font-normal" style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif', fontWeight: 500 }}>
                  {highlightWords(t.aboutContent3)}
                </p>
                </div>
              </div>
            )}
          </div>
          

        </section>
      </main>
    </>
  );
};

export default Index;
