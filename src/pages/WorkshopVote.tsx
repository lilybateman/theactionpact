import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface WorkshopVoteProps {
  lang: 'en' | 'fr';
}

const translations = {
  en: {
    title: "Cast Your Vote",
    party1: "Leadership Party",
    party2: "Service Party",
    submit: "Submit",
    submitting: "Submitting...",
    submitted: "Submitted",
    selectParty: "Select a party",
  },
  fr: {
    title: "Votez",
    party1: "Parti Leadership",
    party2: "Parti Service",
    submit: "Soumettre",
    submitting: "Soumission...",
    submitted: "Soumis",
    selectParty: "Sélectionnez un parti",
  },
};

const WorkshopVote = ({ lang }: WorkshopVoteProps) => {
  const [selectedParty, setSelectedParty] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const t = translations[lang];
  const tableName = lang === 'en' ? 'WorkshopVotesEN' : 'WorkshopVotesFR';

  const handlePartyClick = (party: string) => {
    // Don't allow selection while showing submitted state or submitting
    if (submitted || submitting) return;
    // Toggle selection - click again to deselect
    setSelectedParty(selectedParty === party ? null : party);
  };

  const handleSubmit = async () => {
    if (!selectedParty || submitting) return;

    setSubmitting(true);

    try {
      // Insert vote into Supabase
      const { error } = await supabase
        .from(tableName)
        .insert([{ party: selectedParty }]);

      if (error) {
        console.error('Error submitting vote:', error);
        setSubmitting(false);
        return;
      }

      // Uncheck party and show submitted state
      setSelectedParty(null);
      setSubmitted(true);
      setSubmitting(false);

      // Reset after half a second for next voter
      setTimeout(() => {
        setSubmitted(false);
      }, 500);
    } catch (error) {
      console.error('Error submitting vote:', error);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col items-center justify-center p-4 py-8 sm:py-12 lg:py-0">
      <div className="flex flex-col items-center justify-center text-center w-full max-w-7xl">
        <h1 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-8 sm:mb-12 lg:mb-16 text-center text-black"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t.title}
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-center justify-center">
          {/* Leadership Party - Shiny Silver */}
          <button
            onClick={() => handlePartyClick('party1')}
            className={`w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-3xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-xl hover:shadow-2xl border relative overflow-hidden ${
              selectedParty === 'party1' 
                ? 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 border-gray-500' 
                : 'bg-gradient-to-br from-gray-200 via-white via-40% to-gray-400 border-gray-300'
            }`}
            style={{ 
              boxShadow: selectedParty === 'party1' 
                ? '0 10px 40px rgba(0,0,0,0.3), inset 0 2px 10px rgba(0,0,0,0.2)' 
                : '0 10px 40px rgba(0,0,0,0.2), inset 0 2px 20px rgba(255,255,255,0.8)' 
            }}
          >
            {/* Checkmark overlay when selected */}
            {selectedParty === 'party1' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <svg 
                  className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-60 lg:h-60 xl:w-72 xl:h-72 text-white/70 drop-shadow-lg" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="square" 
                    strokeLinejoin="miter" 
                    strokeWidth={4} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
            )}
            <span 
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center px-4 drop-shadow-sm ${
                selectedParty === 'party1' ? 'text-white' : 'text-gray-700'
              }`}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t.party1}
            </span>
          </button>

          {/* Service Party - Shiny Gold */}
          <button
            onClick={() => handlePartyClick('party2')}
            className={`w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-3xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-xl hover:shadow-2xl border relative overflow-hidden ${
              selectedParty === 'party2' 
                ? 'bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 border-yellow-600' 
                : 'bg-gradient-to-br from-yellow-300 via-yellow-100 via-40% to-yellow-500 border-yellow-400'
            }`}
            style={{ 
              boxShadow: selectedParty === 'party2' 
                ? '0 10px 40px rgba(0,0,0,0.3), inset 0 2px 10px rgba(0,0,0,0.2)' 
                : '0 10px 40px rgba(0,0,0,0.2), inset 0 2px 20px rgba(255,255,255,0.8)' 
            }}
          >
            {/* Checkmark overlay when selected */}
            {selectedParty === 'party2' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <svg 
                  className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-60 lg:h-60 xl:w-72 xl:h-72 text-white/70 drop-shadow-lg" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="square" 
                    strokeLinejoin="miter" 
                    strokeWidth={4} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
            )}
            <span 
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center px-4 drop-shadow-sm ${
                selectedParty === 'party2' ? 'text-white' : 'text-yellow-800'
              }`}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {lang === 'en' ? <>Service<br />Party</> : <>Parti<br />Service</>}
            </span>
          </button>
        </div>

        {/* Submit button area - always visible */}
        <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-14 h-16 sm:h-20 flex items-center justify-center">
          {submitted ? (
            <div 
              className="px-12 sm:px-16 md:px-20 py-4 sm:py-5 text-xl sm:text-2xl md:text-3xl bg-black text-white rounded-xl flex items-center gap-3 sm:gap-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t.submitted}
              <svg 
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          ) : (
            <div className="relative group">
              <button
                onClick={handleSubmit}
                disabled={!selectedParty || submitting}
                className={`px-12 sm:px-16 md:px-20 py-4 sm:py-5 text-xl sm:text-2xl md:text-3xl rounded-xl transition-all duration-200 shadow-lg ${
                  selectedParty && !submitting
                    ? 'bg-black text-white hover:bg-gray-800 hover:shadow-xl cursor-pointer' 
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {submitting ? t.submitting : t.submit}
              </button>
              {/* Custom tooltip - shows instantly on hover when disabled */}
              {!selectedParty && !submitting && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black text-base sm:text-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none shadow-lg">
                  {t.selectParty}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkshopVote;
