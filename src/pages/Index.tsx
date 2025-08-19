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
    fontOptions: "Font Options:",
    artsyText: "Artsy Text - Caveat Handwriting",
    handwrittenText: "Handwritten Text - Architects Daughter",
    markerText: "✓ Marker Text - Permanent Marker (Selected)",
    originalHand: "Original Hand - Kalam",
    blurbTitle: "What is The Action Pact?",
    aboutUs: "About Us",
    contactUs: "Contact Us"
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
    fontOptions: "Options de Police:",
    artsyText: "Texte Artistique - Caveat Handwriting",
    handwrittenText: "Texte Manuscrit - Architects Daughter",
    markerText: "✓ Texte Marqueur - Permanent Marker (Sélectionné)",
    originalHand: "Main Originale - Kalam",
    blurbTitle: "Qu'est-ce que Le Pacte d'Action ?",
    aboutUs: "À propos de nous",
    contactUs: "Contactez-nous"
  }
};

const Index = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const [cityValue, setCityValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [showBlurb, setShowBlurb] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const t = translations[language];

  // Filter cities based on input and language preference
  const filterCities = (input: string) => {
    if (!input.trim()) return [];
    
    // Use the appropriate city array based on language
    const citiesToSearch = language === 'fr' ? frenchCities : englishCities;
    
    const filtered = citiesToSearch.filter(city => 
      city.toLowerCase().includes(input.toLowerCase())
    );
    
    return filtered.slice(0, 8); // Limit to 8 suggestions
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
  const sendToSupabase = async (name: string, email: string, location: string) => {
    try {
      const { data, error } = await supabase
        .from('Newsletter')
        .insert([
          {
            name: name || null,
            email: email,
            location: location || null,
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
      const dbSuccess = await sendToSupabase(name, email, location);
      
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
            onClick={() => setShowAbout(!showAbout)}
            className={`text-sm md:text-base transition-colors cursor-pointer ${
              showAbout ? 'text-red-600 underline' : 'hover:text-red-600 hover:underline'
            }`}
          >
            {t.aboutUs}
          </button>
          <button
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            className="text-sm md:text-base hover:text-red-600 hover:underline transition-colors"
            aria-label={`Switch to ${language === 'en' ? 'French' : 'English'}`}
          >
            <span className={language === 'fr' ? 'text-primary' : 'text-foreground'}>FR</span>
            <span className="text-foreground">/</span>
            <span className={language === 'en' ? 'text-primary' : 'text-foreground'}>EN</span>
          </button>
        </div>
      </header>
      <main>
        <section className="container pb-24 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-8 md:mb-12">
            {/* Left column - Logo and Form */}
            <div className="space-y-8">
              <ActionPactLogo />
              
              <div className="sr-only">The Action Pact — Newsletter Signup</div>

              <article id="signup" className="mt-1 md:mt-4 max-w-2xl">
                <p className="marker-text text-xl md:text-3xl mb-0">{t.subtitle}</p>
                <img 
                  src="/images/underline.png" 
                  alt="Decorative underline" 
                  className="w-full max-w-sm md:max-w-lg h-auto mb-4 md:mb-8 opacity-80 -ml-16 md:-ml-24 -mt-1 md:-mt-1"
                />
                
                <form onSubmit={handleSubmit} className="space-y-2 md:space-y-8" aria-label="Newsletter signup form">
                  <div>
                    <label htmlFor="name" className="scribble-label text-sm md:text-base">{t.name}</label>
                    <input id="name" name="name" type="text" className="scribble-input py-2 md:py-3 text-sm md:text-base" placeholder={t.namePlaceholder} autoComplete="name" />
                  </div>
                  <div className="relative">
                    <label htmlFor="location" className="scribble-label text-sm md:text-base">{t.location}</label>
                    <input 
                      id="location" 
                      name="location" 
                      type="text" 
                      className="scribble-input py-2 md:py-3 text-sm md:text-base" 
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
                        {suggestions.map((city, index) => (
                          <button
                            key={city}
                            type="button"
                            className={`w-full px-4 py-2 text-left hover:bg-foreground hover:text-background transition-colors ${
                              index === selectedIndex ? 'bg-foreground text-background' : ''
                            }`}
                            style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif' }}
                            onClick={() => handleSuggestionClick(city)}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mb-2 md:mb-0">
                    <label htmlFor="email" className="scribble-label text-sm md:text-base">{t.email}</label>
                    <input id="email" name="email" type="email" required className="scribble-input py-2 md:py-3 text-sm md:text-base" placeholder={t.emailPlaceholder} autoComplete="email" />
                  </div>

                  <div className="pt-6 md:pt-6 flex items-start gap-8">
                    <button type="submit" className="scribble-button py-3 md:py-4 text-base md:text-lg" disabled={loading} aria-busy={loading} aria-live="polite">
                      {loading ? t.submitting : t.submit}
                    </button>
                    <div className="w-full relative -mt-6">
                      {/* Arrow pointing to submit button */}
                      <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-6 border-l-black border-t-3 border-t-transparent border-b-3 border-b-transparent"></div>
                      
                      <p className="text-black leading-relaxed text-base" style={{ fontFamily: '"Caveat", cursive', maxWidth: 'calc(100% - 7rem)' }}>
                        We are just getting started and we want you with us from the beginning. By joining our email list, you will be the first to receive The Action Pact newsletter with timely opportunities, events, and resources that make it easy to take action and connect with others.
                      </p>
                    </div>
                  </div>
                </form>

                {/* Contact information below submit button */}
                <div className="pt-10 md:pt-12">
                  <p className="text-red-600 font-medium text-lg md:text-xl">
                    {t.contactUs} <a href="mailto:communications@theactionpact.ca" className="underline hover:text-red-800 transition-colors">communications@theactionpact.ca</a>
                  </p>
                </div>
              </article>
            </div>
            
                      {/* Right column - Dropdowns */}
          <div className="hidden lg:block">

            
            {/* Blurb dropdown */}
            {showBlurb && (
              <div className="max-w-lg">
                <p className="text-black leading-relaxed text-lg mb-4">
                  We are just getting started and we want you with us from the beginning.
                </p>
                <p className="text-black leading-relaxed text-lg">
                  By joining our email list, you will be the first to receive The Action Pact newsletter with timely opportunities, events, and resources that make it easy to take action and connect with others.
                </p>
              </div>
            )}
            
            {/* About dropdown */}
            {showAbout && (
              <div className="max-w-lg">
                <p className="text-lg mb-6">
                  We are in the early stage of building The Action Pact and invite you to help shape it from the ground up. The Action Pact is a civic engagement initiative that meets people wherever they are in their democratic journey. Whether you are voting for the first time or already organizing in your community, we are developing practical tools and partnerships to help you participate more meaningfully in public life.
                </p>
                
                <p className="text-lg mb-8">
                  We are creating a one-stop hub for civic engagement in Canada to address barriers like political noise, institutional distrust, social isolation, and fragmented information. Our approach is grounded in three commitments:
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="marker-text text-lg md:text-xl mb-3">Strategic, evidence-supported participation</h3>
                    <p className="text-base">
                      We help you act so your voice and your vote can have the greatest impact, coordinating action that is well-timed, informed, and effective.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="marker-text text-lg md:text-xl mb-3">Democratic confidence</h3>
                    <p className="text-base">
                      We help rebuild trust in our democratic systems by giving you the knowledge and skills to navigate them with clarity and purpose.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="marker-text text-lg md:text-xl mb-3">Community power</h3>
                    <p className="text-base">
                      We cultivate and amplify community by building spaces for connection and collaboration, and by seeking partnerships with grassroots groups, and local advocacy efforts.
                    </p>
                  </div>
                </div>
                
                <p className="text-lg mt-6">
                  By combining strategic action, civic literacy, and strong networks, The Action Pact is building a culture of meaningful and enthusiastic participation in Canada's democracy.
                </p>
              </div>
            )}
          </div>
          </div>
          
          {/* Mobile: Dismissible text boxes */}
          <div className="md:hidden space-y-4 mb-8">
            {/* Blurb text box */}
            {showBlurb && (
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 relative">
                <button
                  onClick={() => setShowBlurb(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                  aria-label="Close"
                >
                  ×
                </button>
                <p className="text-black leading-relaxed text-base mb-3">
                  We are just getting started and we want you with us from the beginning.
                </p>
                <p className="text-black leading-relaxed text-base">
                  By joining our email list, you will be the first to receive The Action Pact newsletter with timely opportunities, events, and resources that make it easy to take action and connect with others.
                </p>
              </div>
            )}
            
            {/* About text box */}
            {showAbout && (
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 relative">
                <button
                  onClick={() => setShowAbout(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                  aria-label="Close"
                >
                  ×
                </button>
                
                <p className="text-base mb-4">
                  We are in the early stage of building The Action Pact and invite you to help shape it from the ground up. The Action Pact is a civic engagement initiative that meets people wherever they are in their democratic journey. Whether you are voting for the first time or already organizing in your community, we are developing practical tools and partnerships to help you participate more meaningfully in public life.
                </p>
                
                <p className="text-base mb-4">
                  We are creating a one-stop hub for civic engagement in Canada to address barriers like political noise, institutional distrust, social isolation, and fragmented information. Our approach is grounded in three commitments:
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="marker-text text-base font-medium mb-2">Strategic, evidence-supported participation</h3>
                    <p className="text-sm">
                      We help you act so your voice and your vote can have the greatest impact, coordinating action that is well-timed, informed, and effective.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="marker-text text-base font-medium mb-2">Democratic confidence</h3>
                    <p className="text-sm">
                      We help rebuild trust in our democratic systems by giving you the knowledge and skills to navigate them with clarity and purpose.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="marker-text text-base font-medium mb-2">Community power</h3>
                    <p className="text-sm">
                      We cultivate and amplify community by building spaces for connection and collaboration, and by seeking partnerships with grassroots groups, and local advocacy efforts.
                    </p>
                  </div>
                </div>
                
                <p className="text-base mt-4">
                  By combining strategic action, civic literacy, and strong networks, The Action Pact is building a culture of meaningful and enthusiastic participation in Canada's democracy.
                </p>
              </div>
            )}
          </div>
          
          <div className="sr-only">The Action Pact — Newsletter Signup</div>

          <article id="signup" className="mt-1 md:mt-4 max-w-2xl">
            <p className="marker-text text-xl md:text-3xl mb-0">{t.subtitle}</p>
            <img 
              src="/images/underline.png" 
              alt="Decorative underline" 
              className="w-full max-w-sm md:max-w-lg h-auto mb-4 md:mb-8 opacity-80 -ml-16 md:-ml-24 -mt-1 md:-mt-1"
            />
            
            <form onSubmit={handleSubmit} className="space-y-2 md:space-y-8" aria-label="Newsletter signup form">
              <div>
                <label htmlFor="name" className="scribble-label text-sm md:text-base">{t.name}</label>
                <input id="name" name="name" type="text" className="scribble-input py-2 md:py-3 text-sm md:text-base" placeholder={t.namePlaceholder} autoComplete="name" />
              </div>
              <div className="relative">
                <label htmlFor="location" className="scribble-label text-sm md:text-base">{t.location}</label>
                <input 
                  id="location" 
                  name="location" 
                  type="text" 
                  className="scribble-input py-2 md:py-3 text-sm md:text-base" 
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
                    {suggestions.map((city, index) => (
                      <button
                        key={city}
                        type="button"
                        className={`w-full px-4 py-2 text-left hover:bg-foreground hover:text-background transition-colors ${
                          index === selectedIndex ? 'bg-foreground text-background' : ''
                        }`}
                        style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif' }}
                        onClick={() => handleSuggestionClick(city)}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-2 md:mb-0">
                <label htmlFor="email" className="scribble-label text-sm md:text-base">{t.email}</label>
                <input id="email" name="email" type="email" required className="scribble-input py-2 md:py-3 text-sm md:text-base" placeholder={t.emailPlaceholder} autoComplete="email" />
              </div>

                                <div className="pt-6 md:pt-6 flex items-start gap-8">
                    <button type="submit" className="scribble-button py-3 md:py-4 text-base md:text-lg" disabled={loading} aria-busy={loading} aria-live="polite">
                      {loading ? t.submitting : t.submit}
                    </button>
                    <div className="w-full relative -mt-6">
                      {/* Arrow pointing to submit button */}
                      <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-6 border-l-black border-t-3 border-t-transparent border-b-3 border-b-transparent"></div>
                      
                      <p className="text-black leading-relaxed text-base" style={{ fontFamily: '"Caveat", cursive', maxWidth: 'calc(100% - 7rem)' }}>
                        We are just getting started and we want you with us from the beginning. By joining our email list, you will be the first to receive The Action Pact newsletter with timely opportunities, events, and resources that make it easy to take action and connect with others.
                      </p>
                    </div>
                  </div>
            </form>

            {/* Contact information below submit button */}
            <div className="pt-10 md:pt-12">
              <p className="text-red-600 font-medium text-lg md:text-xl">
                {t.contactUs} <a href="mailto:communications@theactionpact.ca" className="underline hover:text-red-800 transition-colors">communications@theactionpact.ca</a>
              </p>
            </div>
          </article>
        </section>
      </main>
    </>
  );
};

export default Index;
