import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface VoteResultsProps {
  lang: 'en' | 'fr';
}

const translations = {
  en: {
    winner: "Winner",
    party1: "Leadership Party",
    party2: "Service Party",
    tie: "Tie",
    votes: "votes",
    totalVotes: "Total votes",
    resetVotes: "Reset Votes",
    loading: "Loading results...",
  },
  fr: {
    winner: "Gagnant",
    party1: "Parti Leadership",
    party2: "Parti Service",
    tie: "Égalité",
    votes: "votes",
    totalVotes: "Total des votes",
    resetVotes: "Réinitialiser",
    loading: "Chargement des résultats...",
  },
};

const VoteResults = ({ lang }: VoteResultsProps) => {
  const [votes, setVotes] = useState({ party1: 0, party2: 0 });
  const [loading, setLoading] = useState(true);

  const t = translations[lang];
  const tableName = lang === 'en' ? 'WorkshopVotesEN' : 'WorkshopVotesFR';

  // Fetch votes from Supabase
  const fetchVotes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('party');

      if (error) {
        console.error('Error fetching votes:', error);
        return;
      }

      // Count votes by party
      const party1Count = data?.filter(v => v.party === 'party1').length || 0;
      const party2Count = data?.filter(v => v.party === 'party2').length || 0;

      setVotes({ party1: party1Count, party2: party2Count });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching votes:', error);
      setLoading(false);
    }
  }, [tableName]);

  useEffect(() => {
    // Initial fetch
    fetchVotes();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`${tableName}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName
        },
        () => {
          // Refetch votes when any change happens
          fetchVotes();
        }
      )
      .subscribe();

    // Also poll every 2 seconds as a fallback
    const interval = setInterval(fetchVotes, 2000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchVotes, tableName]);

  const totalVotes = votes.party1 + votes.party2;
  const party1Percent = totalVotes > 0 ? Math.round((votes.party1 / totalVotes) * 100) : 0;
  const party2Percent = totalVotes > 0 ? Math.round((votes.party2 / totalVotes) * 100) : 0;
  
  // Determine winner
  const winner = votes.party1 > votes.party2 ? 'party1' : votes.party2 > votes.party1 ? 'party2' : null;

  const handleReset = async () => {
    try {
      // Delete all votes from Supabase
      const { error } = await supabase
        .from(tableName)
        .delete()
        .gte('id', 0); // Delete all rows

      if (error) {
        console.error('Error resetting votes:', error);
        return;
      }

      setVotes({ party1: 0, party2: 0 });
    } catch (error) {
      console.error('Error resetting votes:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen lg:h-screen w-full flex flex-col items-center justify-center p-4">
        <p className="text-2xl sm:text-3xl lg:text-4xl text-gray-500" style={{ fontFamily: 'var(--font-display)' }}>
          {t.loading}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col items-center justify-center p-4 py-8 sm:py-12 lg:py-0">
      <div className="flex flex-col items-center justify-center text-center w-full max-w-5xl">
        {/* Winner Title */}
        <h1 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-6 sm:mb-8 lg:mb-12 text-center text-black"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t.winner}
        </h1>

        {/* Winner Party Box - only show if there's a winner */}
        {winner === 'party1' ? (
          <div 
            className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-3xl bg-gradient-to-br from-gray-200 via-white via-40% to-gray-400 flex items-center justify-center shadow-xl border border-gray-300 mb-8 sm:mb-10 lg:mb-12"
            style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.2), inset 0 2px 20px rgba(255,255,255,0.8)' }}
          >
            <span 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-700 text-center px-4 drop-shadow-sm"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t.party1}
            </span>
          </div>
        ) : winner === 'party2' ? (
          <div 
            className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-3xl bg-gradient-to-br from-yellow-300 via-yellow-100 via-40% to-yellow-500 flex items-center justify-center shadow-xl border border-yellow-400 mb-8 sm:mb-10 lg:mb-12"
            style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.2), inset 0 2px 20px rgba(255,255,255,0.8)' }}
          >
            <span 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-yellow-800 text-center px-4 drop-shadow-sm"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {lang === 'en' ? <>Service<br />Party</> : <>Parti<br />Service</>}
            </span>
          </div>
        ) : totalVotes > 0 ? (
          <div 
            className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-3xl flex items-center justify-center shadow-xl mb-8 sm:mb-10 lg:mb-12 overflow-hidden relative"
            style={{ 
              boxShadow: '0 10px 40px rgba(0,0,0,0.2), inset 0 2px 20px rgba(255,255,255,0.8)',
            }}
          >
            {/* Silver half */}
            <div 
              className="absolute inset-0 w-1/2 bg-gradient-to-br from-gray-200 via-white via-40% to-gray-400"
              style={{ boxShadow: 'inset 0 2px 20px rgba(255,255,255,0.8)' }}
            />
            {/* Gold half */}
            <div 
              className="absolute inset-0 left-1/2 w-1/2 bg-gradient-to-br from-yellow-300 via-yellow-100 via-40% to-yellow-500"
              style={{ boxShadow: 'inset 0 2px 20px rgba(255,255,255,0.8)' }}
            />
            <span 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 text-center px-4 drop-shadow-sm relative z-10"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t.tie}
            </span>
          </div>
        ) : null}

        {/* Vote Graph */}
        <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mb-8 sm:mb-10 lg:mb-12 px-4">
          {/* Leadership Party Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between items-center mb-2 gap-4">
              <span 
                className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-700 whitespace-nowrap"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t.party1}
              </span>
              <span 
                className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-700 whitespace-nowrap"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {votes.party1} {t.votes} ({party1Percent}%)
              </span>
            </div>
            <div className="w-full h-8 sm:h-10 md:h-12 lg:h-14 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-gray-400 via-gray-300 to-gray-500 rounded-full transition-all duration-500"
                style={{ width: `${party1Percent}%` }}
              />
            </div>
          </div>

          {/* Service Party Bar */}
          <div>
            <div className="flex justify-between items-center mb-2 gap-4">
              <span 
                className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-yellow-700 whitespace-nowrap"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t.party2}
              </span>
              <span 
                className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-yellow-700 whitespace-nowrap"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {votes.party2} {t.votes} ({party2Percent}%)
              </span>
            </div>
            <div className="w-full h-8 sm:h-10 md:h-12 lg:h-14 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full transition-all duration-500"
                style={{ width: `${party2Percent}%` }}
              />
            </div>
          </div>

          {/* Total votes */}
          <p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mt-4 sm:mt-6 text-center"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t.totalVotes}: {totalVotes}
          </p>
        </div>

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="px-8 sm:px-10 md:px-12 py-3 sm:py-4 text-base sm:text-lg md:text-xl bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t.resetVotes}
        </button>
      </div>
    </div>
  );
};

export default VoteResults;
