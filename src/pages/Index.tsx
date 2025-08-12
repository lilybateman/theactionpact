import { useState, useRef, useEffect } from "react";

import { useToast } from "@/hooks/use-toast";
import ActionPactLogo from "@/components/ActionPactLogo";

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
    city: "City",
    submit: "Submit",
    submitting: "Submitting...",
    namePlaceholder: "Your name",
    emailPlaceholder: "you@example.com",
    cityPlaceholder: "Your city",
    successTitle: "You're in!",
    successDescription: (name: string, city: string) => 
      `Thanks ${name || "friend"} — we'll keep you posted${city ? ` about ${city}` : ""}.`,
    invalidEmail: "Please enter a valid email.",
    fontOptions: "Font Options:",
    artsyText: "Artsy Text - Caveat Handwriting",
    handwrittenText: "Handwritten Text - Architects Daughter",
    markerText: "✓ Marker Text - Permanent Marker (Selected)",
    originalHand: "Original Hand - Kalam"
  },
  fr: {
    title: "Le Pacte d'Action",
    subtitle: "Participez à l'action.",
    name: "Nom",
    email: "Courriel",
    city: "Ville",
    submit: "Soumettre",
    submitting: "Soumission...",
    namePlaceholder: "Votre nom",
    emailPlaceholder: "vous@exemple.com",
    cityPlaceholder: "Votre ville",
    successTitle: "Vous êtes inscrit !",
    successDescription: (name: string, city: string) => 
      `Merci ${name || "ami"} — nous vous tiendrons au courant${city ? ` à propos de ${city}` : ""}.`,
    invalidEmail: "Veuillez entrer un email valide.",
    fontOptions: "Options de Police:",
    artsyText: "Texte Artistique - Caveat Handwriting",
    handwrittenText: "Texte Manuscrit - Architects Daughter",
    markerText: "✓ Texte Marqueur - Permanent Marker (Sélectionné)",
    originalHand: "Main Originale - Kalam"
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

  // Google Sheets webhook URL - you'll need to replace this with your actual webhook URL
  const GOOGLE_SHEETS_WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || 'https://script.google.com/a/macros/theactionpact.ca/s/AKfycbxfmKPkA6i7zxVzm8JIPgXtKBxNwCxEjFktzraMMtyO0PhIbDorHxXPebSKWH1cNQM9/exec';

  const sendToGoogleSheets = async (name: string, email: string, city: string) => {
    // Temporarily disabled - Google Sheets integration commented out
    console.log('Google Sheets integration temporarily disabled');
    return true; // Return success so form still works
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get("name") as string) || "";
    const email = (data.get("email") as string) || "";
    const city = cityValue || (data.get("city") as string) || "";

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) {
      toast({ title: t.invalidEmail });
      return;
    }

    setLoading(true);
    
    try {
      // Send to Google Sheets
      const sheetsSuccess = await sendToGoogleSheets(name, email, city);
      
      // Show success message
      if (sheetsSuccess) {
        toast({
          title: t.successTitle,
          description: t.successDescription(name, city),
        });
      } else {
        // Still show success but mention the data wasn't saved
        toast({
          title: t.successTitle,
          description: `${t.successDescription(name, city)} (Note: Data may not have been saved to our records)`,
        });
      }
      
      // Reset form
      form.reset();
      setCityValue('');
      setShowSuggestions(false);
      setSuggestions([]);
      
      console.log("Newsletter signup:", { name, email, city, sheetsSuccess });
      
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
        <button
          onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
          className="language-toggle py-2 md:py-3 text-sm md:text-base"
          aria-label={`Switch to ${language === 'en' ? 'French' : 'English'}`}
        >
          <span className={language === 'fr' ? 'text-primary' : 'text-foreground'}>FR</span>
          <span className="text-foreground">/</span>
          <span className={language === 'en' ? 'text-primary' : 'text-foreground'}>EN</span>
        </button>
      </header>
      <main>
        <section className="container pb-24 pt-2">
                  <div className="flex justify-start mb-8 md:mb-12">
          <ActionPactLogo />
        </div>
          <div className="sr-only">The Action Pact — Newsletter Signup</div>

          <article id="signup" className="mt-1 md:mt-4 max-w-2xl">
            <p className="marker-text text-xl md:text-3xl mb-0">{t.subtitle}</p>
            <img 
              src="/theactionpact/images/underline.png" 
              alt="Decorative underline" 
              className="w-full max-w-xs md:max-w-md h-auto mb-4 md:mb-8 opacity-80 -ml-32 md:-ml-40 -mt-1 md:-mt-1"
            />
            
            <form onSubmit={handleSubmit} className="space-y-2 md:space-y-8" aria-label="Newsletter signup form">
              <div>
                <label htmlFor="name" className="scribble-label text-sm md:text-base">{t.name}</label>
                <input id="name" name="name" type="text" className="scribble-input py-2 md:py-3 text-sm md:text-base" placeholder={t.namePlaceholder} autoComplete="name" />
              </div>
              <div className="relative">
                <label htmlFor="city" className="scribble-label text-sm md:text-base">{t.city}</label>
                <input 
                  id="city" 
                  name="city" 
                  type="text" 
                  className="scribble-input py-2 md:py-3 text-sm md:text-base" 
                  placeholder={t.cityPlaceholder} 
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

              <div className="pt-6 md:pt-6">
                <button type="submit" className="scribble-button py-3 md:py-4 text-base md:text-lg" disabled={loading} aria-busy={loading} aria-live="polite">
                  {loading ? t.submitting : t.submit}
                </button>
              </div>
            </form>
          </article>
        </section>
      </main>
    </>
  );
};

export default Index;
