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
    <div className="min-h-screen w-full flex flex-col items-center justify-start p-4 pt-32 md:pt-48 pb-8">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 
          className="text-6xl md:text-8xl font-bold mb-12 md:mb-20 text-center text-black"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t.title}
        </h1>
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-20 items-center justify-center">
          {/* Leadership Party - Shiny Silver */}
          <button
            onClick={() => handlePartyClick('party1')}
            className={`w-72 h-72 md:w-[28rem] md:h-[28rem] rounded-3xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-xl hover:shadow-2xl border relative overflow-hidden ${
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
                  className="w-48 h-48 md:w-72 md:h-72 text-white/70 drop-shadow-lg" 
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
              className={`text-4xl md:text-6xl font-bold text-center px-4 drop-shadow-sm ${
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
            className={`w-72 h-72 md:w-[28rem] md:h-[28rem] rounded-3xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-xl hover:shadow-2xl border relative overflow-hidden ${
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
                  className="w-48 h-48 md:w-72 md:h-72 text-white/70 drop-shadow-lg" 
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
              className={`text-4xl md:text-6xl font-bold text-center px-4 drop-shadow-sm ${
                selectedParty === 'party2' ? 'text-white' : 'text-yellow-800'
              }`}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {lang === 'en' ? <>Service<br />Party</> : <>Parti<br />Service</>}
            </span>
          </button>
        </div>

        {/* Submit button area - always visible */}
        <div className="mt-12 md:mt-16 h-20 flex items-center justify-center">
          {submitted ? (
            <div 
              className="px-20 py-5 text-3xl bg-black text-white rounded-xl flex items-center gap-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t.submitted}
              <svg 
                className="w-8 h-8 text-white" 
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
                className={`px-20 py-5 text-3xl rounded-xl transition-all duration-200 shadow-lg ${
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
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black text-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none shadow-lg">
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
