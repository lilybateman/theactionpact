import { useState, useRef, useEffect } from "react";

import { useToast } from "@/hooks/use-toast";

// Cities list for autocomplete
const cities = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
  "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis", "Seattle", "Denver", "Washington",
  "Boston", "El Paso", "Nashville", "Detroit", "Oklahoma City", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore",
  "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento", "Atlanta", "Kansas City", "Long Beach", "Colorado Springs", "Raleigh",
  "Miami", "Virginia Beach", "Omaha", "Oakland", "Minneapolis", "Tampa", "Tulsa", "Arlington", "New Orleans", "Wichita",
  "Cleveland", "Bakersfield", "Aurora", "Anaheim", "Honolulu", "Santa Ana", "Corpus Christi", "Riverside", "Lexington", "Stockton",
  "Henderson", "Saint Paul", "St. Louis", "Fort Wayne", "Jersey City", "Chandler", "Madison", "Lubbock", "Scottsdale", "Reno",
  "Buffalo", "Gilbert", "Glendale", "North Las Vegas", "Winston-Salem", "Chesapeake", "Norfolk", "Fremont", "Garland", "Irving",
  "Hialeah", "Richmond", "Boise", "Spokane", "Baton Rouge", "Tacoma", "San Bernardino", "Grand Rapids", "Huntsville", "Salt Lake City",
  "Frisco", "Cary", "Yonkers", "Amarillo", "Glendale", "McKinney", "Rochester", "Aurora", "Akron", "Modesto",
  "Montreal", "Toronto", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg", "Quebec City", "Hamilton", "Kitchener",
  "London", "Paris", "Berlin", "Madrid", "Rome", "Amsterdam", "Barcelona", "Milan", "Vienna", "Prague",
  "Budapest", "Warsaw", "Bucharest", "Belgrade", "Sofia", "Athens", "Stockholm", "Copenhagen", "Oslo", "Helsinki"
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
    subtitle: "Rejoignez l'Action.",
    name: "Nom",
    email: "Email",
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

  // Filter cities based on input
  const filterCities = (input: string) => {
    if (!input.trim()) return [];
    const filtered = cities.filter(city => 
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
    // Skip if no webhook URL is configured or if it's the default URL
    if (!GOOGLE_SHEETS_WEBHOOK_URL || 
        GOOGLE_SHEETS_WEBHOOK_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL_HERE' ||
        GOOGLE_SHEETS_WEBHOOK_URL.includes('YOUR_ACTUAL_SCRIPT_ID')) {
      console.log('Google Sheets webhook URL not configured, skipping...');
      return true;
    }

    try {
      console.log('Sending to Google Sheets:', { name, email, city, url: GOOGLE_SHEETS_WEBHOOK_URL });
      
      const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          city,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Google Sheets response:', result);
      
      if (!result.success) {
        console.error('Failed to send to Google Sheets:', result.error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error sending to Google Sheets:', error);
      return false;
    }
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
      <header className="container py-6 flex items-center justify-end">
        <button
          onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
          className="language-toggle"
          aria-label={`Switch to ${language === 'en' ? 'French' : 'English'}`}
        >
          <span className={language === 'fr' ? 'text-primary' : 'text-foreground'}>FR</span>
          <span className="text-foreground">/</span>
          <span className={language === 'en' ? 'text-primary' : 'text-foreground'}>EN</span>
        </button>
      </header>
      <main>
        <section className="container pb-24 pt-2">
          <h1 className="display-title text-primary text-6xl sm:text-7xl md:text-8xl leading-[0.9] tracking-tight">
            {language === 'en' ? (
              <>
                The<br />
                Action<br />
                Pact<span className="text-primary">.</span>
              </>
            ) : (
              <>
                Le<br />
                Pacte<br />
                d'Action<span className="text-primary">.</span>
              </>
            )}
            <span className="sr-only"> — Newsletter Signup</span>
          </h1>

          <article id="signup" className="mt-10 max-w-2xl">
            <p className="marker-text text-2xl mb-4">{t.subtitle}</p>
            
            <form onSubmit={handleSubmit} className="space-y-6" aria-label="Newsletter signup form">
              <div>
                <label htmlFor="name" className="scribble-label">{t.name}</label>
                <input id="name" name="name" type="text" className="scribble-input" placeholder={t.namePlaceholder} autoComplete="name" />
              </div>
              <div>
                <label htmlFor="email" className="scribble-label">{t.email}</label>
                <input id="email" name="email" type="email" required className="scribble-input" placeholder={t.emailPlaceholder} autoComplete="email" />
              </div>
              <div className="relative">
                <label htmlFor="city" className="scribble-label">{t.city}</label>
                <input 
                  id="city" 
                  name="city" 
                  type="text" 
                  className="scribble-input" 
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

              <div className="pt-4">
                <button type="submit" className="scribble-button" disabled={loading} aria-busy={loading} aria-live="polite">
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
