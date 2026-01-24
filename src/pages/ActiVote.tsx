import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";

const ActiVote = () => {
  // Override the zoom and overflow settings for this page
  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Slider values (0-5)
  const [climate, setClimate] = useState([0]);
  const [housing, setHousing] = useState([0]);
  const [jobs, setJobs] = useState([0]);
  const [healthcare, setHealthcare] = useState([0]);
  
  // Strategic voting
  const [strategicVoting, setStrategicVoting] = useState(false);
  const [postalCode, setPostalCode] = useState("");
  const [districtProbabilities, setDistrictProbabilities] = useState<{
    PCP: number | null;
    NDP: number | null;
    LIB: number | null;
    GPO: number | null;
  } | null>(null);
  const [districtName, setDistrictName] = useState<string | null>(null);
  const [loadingProbabilities, setLoadingProbabilities] = useState(false);
  const [candidateNames, setCandidateNames] = useState<Record<string, string>>({}); // PartyCode -> CandidateName
  const [useSliderStrategy, setUseSliderStrategy] = useState(false); // Toggle between toggle-only and slider strategies
  const [strategicSlider, setStrategicSlider] = useState([0.5]); // Slider value 0-1, where 0 = less strategic, 1 = more strategic

  // Matrix for party calculation
  // Rows: PC, NDP, Liberal, Green
  // Columns: Climate, Housing, Jobs, Healthcare
  const partyMatrix = [
    [5.5/30, 10.60/30, 17.6/30, 9.92/30], // PC
    [12.17/30, 21.4/30, 19.75/30, 18.67/30], // NDP
    [9.08/30, 15/30, 12.5/30, 15.58/30], // Liberal
    [23/30, 24/30, 19.52/30, 20.83/30], // Green
  ];

  












  const parties = [
    { name: "Progressive Conservative", candidateName: "Pierre Poilievre", color: "text-blue-700", partyCode: "PCP" },
    { name: "NDP", candidateName: "Jagmeet Singh", color: "text-orange-600", partyCode: "NDP" },
    { name: "Liberal", candidateName: "Justin Trudeau", color: "text-red-600", partyCode: "LIB" },
    { name: "Green", candidateName: "Elizabeth May", color: "text-green-600", partyCode: "GPO" },
  ];

  // Helper function to get candidate name for a party (uses real name if available, otherwise fallback)
  const getCandidateName = (partyIndex: number): string => {
    const party = parties[partyIndex];
    if (!party) return "Unknown";
    
    // If we have candidate names from Supabase, use the real name
    if (candidateNames[party.partyCode]) {
      return candidateNames[party.partyCode];
    }
    
    // Otherwise, use the default hardcoded name
    return party.candidateName;
  };

  // Calculate party scores
  const calculatePartyScores = () => {
    // Normalize inputs by dividing by 5
    const normalizedInputs = [
      climate[0] / 5,
      housing[0] / 5,
      jobs[0] / 5,
      healthcare[0] / 5,
    ];

    // Multiply by matrix
    const scores = partyMatrix.map(row => 
      row.reduce((sum, weight, idx) => sum + weight * normalizedInputs[idx], 0)
    );

    return scores;
  };

  // Fetch district probabilities from Supabase when postal code is valid
  useEffect(() => {
    const fetchDistrictProbabilities = async () => {
      console.log('🚀 fetchDistrictProbabilities called', {
        strategicVoting,
        postalCode,
        postalCodeLength: postalCode?.length || 0
      });
      
      if (!strategicVoting || !postalCode) {
        console.log('   ⏸️  Skipping fetch - strategic voting off or no postal code');
        setDistrictProbabilities(null);
        setDistrictName(null);
        setCandidateNames({});
        return;
      }

      const normalizedPostal = postalCode.replace(/\s+/g, '').toUpperCase();
      console.log('   📮 Normalized postal code:', normalizedPostal, 'length:', normalizedPostal.length);
      
      if (normalizedPostal.length !== 6) {
        console.log('   ⏸️  Skipping fetch - postal code not 6 characters');
        setDistrictProbabilities(null);
        setDistrictName(null);
        setCandidateNames({});
        return;
      }

      console.log('   ✅ Starting fetch for postal code:', normalizedPostal);
      
      // Check Supabase connection
      console.log('🔧 Supabase Client Check:');
      console.log('      Supabase client:', supabase ? '✅ Initialized' : '❌ Not initialized');
      if (supabase) {
        const url = (supabase as any).supabaseUrl || (supabase as any).rest?.url || 'Not available';
        const key = (supabase as any).supabaseKey || (supabase as any).rest?.headers?.apikey || 'Not available';
        console.log('      Supabase URL:', url);
        console.log('      Supabase key present:', key !== 'Not available' ? '✅ Yes' : '❌ No');
        console.log('      Supabase key preview:', key !== 'Not available' ? `${String(key).substring(0, 20)}...` : 'N/A');
      }
      
      // Check environment variables
      console.log('🔧 Environment Variables Check:');
      console.log('      VITE_PUBLIC_SUPABASE_URL:', import.meta.env.VITE_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set');
      console.log('      VITE_PUBLIC_SUPABASE_ANON_KEY:', import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');
      
      setLoadingProbabilities(true);
      try {
        console.log('🔍 Step 1: Looking up district for postal code:', normalizedPostal);
        
        // Step 1: Query Represent API to get district name from postal code
        const representResponse = await fetch(`https://represent.opennorth.ca/postcodes/${normalizedPostal}/`);
        
        if (!representResponse.ok) {
          console.error('❌ Represent API Error:', representResponse.status, representResponse.statusText);
          if (representResponse.status === 404) {
            console.error('   💡 Invalid postal code');
          }
          setDistrictProbabilities(null);
          setDistrictName(null);
          setCandidateNames({});
          setLoadingProbabilities(false);
          return;
        }
        
        const representData = await representResponse.json();
        console.log('📦 Represent API Response received');
        
        // Extract federal electoral district name
        // boundaries_centroid is an ARRAY of boundary objects
        let resolvedDistrictName: string | null = null;
        
        // Option 1: Use the current MP's district from representatives_centroid (most reliable for current boundaries)
        if (representData.representatives_centroid && Array.isArray(representData.representatives_centroid)) {
          const mp = representData.representatives_centroid.find((rep: any) => 
            rep.elected_office === 'MP' && rep.representative_set_name === 'House of Commons'
          );
          if (mp && mp.district_name) {
            resolvedDistrictName = mp.district_name;
            console.log('✅ Found district from MP (most current):', resolvedDistrictName);
          }
        }
        
        // Option 2: Find current federal electoral district from boundaries_centroid array
        if (!resolvedDistrictName && representData.boundaries_centroid && Array.isArray(representData.boundaries_centroid)) {
          // Filter for federal electoral districts
          const federalDistricts = representData.boundaries_centroid.filter((b: any) => 
            b.boundary_set_name === 'Federal electoral district'
          );
          
          console.log(`   📊 Found ${federalDistricts.length} federal electoral district(s) in boundaries`);
          
          if (federalDistricts.length > 0) {
            // Prioritize 2023 representation order (most current federal boundaries)
            let district = federalDistricts.find((b: any) => 
              b.url?.includes('federal-electoral-districts-2023-representation-order')
            );
            
            // If no 2023, use the current one (not 2003 or 2013 representation orders)
            if (!district) {
              district = federalDistricts.find((b: any) => 
                b.url?.includes('/federal-electoral-districts/') && 
                !b.url?.includes('-2003-') && 
                !b.url?.includes('-2013-')
              );
            }
            
            // Fallback to first federal district found
            if (!district) {
              district = federalDistricts[0];
            }
            
            if (district && district.name) {
              resolvedDistrictName = district.name;
              console.log('✅ Found district from boundaries:', resolvedDistrictName);
            }
          }
        }
        
        if (!resolvedDistrictName) {
          console.error('❌ Could not find electoral district for this postal code');
          console.error('   Available keys in response:', Object.keys(representData));
          if (representData.boundaries_centroid && Array.isArray(representData.boundaries_centroid)) {
            console.error('   Available boundaries:', representData.boundaries_centroid.map((b: any) => ({
              name: b.name,
              type: b.boundary_set_name
            })));
          }
          setDistrictProbabilities(null);
          setDistrictName(null);
          setCandidateNames({});
          setLoadingProbabilities(false);
          return;
        }
        
        // Normalize em dash to regular dash for better matching
        const normalizedDistrictName = resolvedDistrictName.replace(/—/g, '-').replace(/–/g, '-');
        if (normalizedDistrictName !== resolvedDistrictName) {
          console.log(`   🔄 Normalized district name: "${resolvedDistrictName}" → "${normalizedDistrictName}"`);
        }
        
        // Store the resolved district name in state so we can display it in the UI
        setDistrictName(resolvedDistrictName);
        console.log('📍 District name set:', resolvedDistrictName);
        
        // Helper function to normalize district names for matching
        const normalizeDistrictName = (name: string): string => {
          return name
            .toLowerCase()
            .replace(/—/g, '-')  // Replace em dash with regular dash
            .replace(/–/g, '-')  // Replace en dash with regular dash
            .replace(/[^\w\s-]/g, '') // Remove special characters except dash and spaces
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
        };
        
        // Helper function to extract the first part (before dash or first significant word)
        const extractFirstPart = (name: string): string => {
          const normalized = normalizeDistrictName(name);
          // Split by dash first, then by space
          const parts = normalized.split(/[-–—]/);
          if (parts.length > 0 && parts[0].trim().length > 0) {
            return parts[0].trim();
          }
          // If no dash, get first word
          const words = normalized.split(/\s+/);
          return words.length > 0 ? words[0] : normalized;
        };
        
        // Helper function to calculate string similarity (improved for district names)
        const calculateSimilarity = (str1: string, str2: string): number => {
          const normalized1 = normalizeDistrictName(str1);
          const normalized2 = normalizeDistrictName(str2);
          
          // First check: if normalized strings are exactly the same, return 1.0
          if (normalized1 === normalized2) {
            return 1.0;
          }
          
          // Extract first part (e.g., "Spadina" from "Spadina-Harbourfront")
          const firstPart1 = extractFirstPart(str1);
          const firstPart2 = extractFirstPart(str2);
          
          // If first parts match exactly, give high similarity
          if (firstPart1 === firstPart2 && firstPart1.length > 2) {
            return 0.9; // High similarity if first part matches
          }
          
          // Check if one starts with the other's first part
          if (normalized1.startsWith(firstPart2) || normalized2.startsWith(firstPart1)) {
            return 0.8;
          }
          
          // Word-based matching - split by both spaces and dashes
          const words1 = normalized1.split(/[\s-]+/).filter(w => w.length > 0);
          const words2 = normalized2.split(/[\s-]+/).filter(w => w.length > 0);
          const commonWords = words1.filter(word => words2.includes(word) && word.length > 2);
          const totalWords = Math.max(words1.length, words2.length);
          const wordSimilarity = totalWords > 0 ? commonWords.length / totalWords : 0;
          
          // Character-level similarity using Levenshtein-like approach
          const longer = normalized1.length > normalized2.length ? normalized1 : normalized2;
          const shorter = normalized1.length > normalized2.length ? normalized2 : normalized1;
          let charSimilarity = 0;
          if (longer.startsWith(shorter) && shorter.length > 3) {
            charSimilarity = shorter.length / longer.length;
          } else if (longer.includes(shorter) && shorter.length > 3) {
            charSimilarity = (shorter.length / longer.length) * 0.8;
          }
          
          // Combined score (weighted towards exact match, first part, and word similarity)
          return Math.max(
            (normalized1 === normalized2 ? 1.0 : 0),
            (firstPart1 === firstPart2 && firstPart1.length > 2 ? 0.9 : 0),
            (normalized1.startsWith(firstPart2) || normalized2.startsWith(firstPart1) ? 0.8 : 0),
            (wordSimilarity * 0.7) + (charSimilarity * 0.3)
          );
        };
        
        // Step 2: Query Supabase with the district name (use normalized version)
        console.log('🔍 Step 2: Querying Supabase for district:', normalizedDistrictName);
        console.log('📋 Table: PredictedProbWinning_PerDistrict_15Jan2026');
        console.log('   📍 Original district name:', resolvedDistrictName);
        console.log('   📍 Normalized district name:', normalizedDistrictName);
        
        // Track the matched district name from Supabase (may differ from API name)
        let matchedDistrictName: string | null = null;
        
        // Try exact match first with normalized name
        console.log('   🔵 Supabase Query 1 (exact match):');
        console.log('      Table: PredictedProbWinning_PerDistrict_15Jan2026');
        console.log('      Select: PCP, NDP, LIB, GPO, DistrictName');
        console.log('      Filter: DistrictName =', normalizedDistrictName);
        console.log('      Method: maybeSingle()');
        
        let { data, error } = await (supabase as any)
          .from('PredictedProbWinning_PerDistrict_15Jan2026')
          .select('PCP, NDP, LIB, GPO, DistrictName')
          .eq('DistrictName', normalizedDistrictName)
          .maybeSingle();
        
        console.log('   🔵 Supabase Response 1:');
        console.log('      Data:', data);
        console.log('      Error:', error);
        if (data) {
          console.log('      Data type:', typeof data);
          console.log('      Data keys:', Object.keys(data || {}));
          console.log('      Full data object:', JSON.stringify(data, null, 2));
        }
        if (error) {
          console.log('      Error code:', error.code);
          console.log('      Error message:', error.message);
          console.log('      Error details:', error.details);
          console.log('      Error hint:', error.hint);
        }
        
        if (data && (data as any).DistrictName) {
          matchedDistrictName = (data as any).DistrictName;
          console.log('   ✅ Exact match found! Matched district name:', matchedDistrictName);
        } else if (!data && !error) {
          console.log('   ⚠️  No exact match found (no error, but no data)');
        }
        
        // If no exact match, try case-insensitive and fuzzy matching
        if (!data && !error) {
          console.log('   Trying case-insensitive search...');
          console.log('   🔵 Supabase Query 2 (case-insensitive):');
          console.log('      Table: PredictedProbWinning_PerDistrict_15Jan2026');
          console.log('      Select: PCP, NDP, LIB, GPO, DistrictName');
          console.log('      Filter: DistrictName ILIKE', `%${normalizedDistrictName}%`);
          console.log('      Method: maybeSingle()');
          
          const { data: caseInsensitiveData, error: caseInsensitiveError } = await (supabase as any)
            .from('PredictedProbWinning_PerDistrict_15Jan2026')
            .select('PCP, NDP, LIB, GPO, DistrictName')
            .ilike('DistrictName', `%${normalizedDistrictName}%`)
            .maybeSingle();
          
          console.log('   🔵 Supabase Response 2:');
          console.log('      Data:', caseInsensitiveData);
          console.log('      Error:', caseInsensitiveError);
          if (caseInsensitiveData) {
            console.log('      Data type:', typeof caseInsensitiveData);
            console.log('      Data keys:', Object.keys(caseInsensitiveData || {}));
            console.log('      Full data object:', JSON.stringify(caseInsensitiveData, null, 2));
          }
          if (caseInsensitiveError) {
            console.log('      Error code:', caseInsensitiveError.code);
            console.log('      Error message:', caseInsensitiveError.message);
            console.log('      Error details:', caseInsensitiveError.details);
            console.log('      Error hint:', caseInsensitiveError.hint);
          }
          
          if (caseInsensitiveData) {
            data = caseInsensitiveData;
            matchedDistrictName = caseInsensitiveData.DistrictName;
            console.log(`   ✅ Found with case-insensitive match: ${matchedDistrictName}`);
          } else if (!caseInsensitiveError) {
            // Still no match, try with further normalization (remove special chars)
            const furtherNormalized = normalizeDistrictName(normalizedDistrictName);
            console.log(`   Trying further normalized name: "${furtherNormalized}"`);
            console.log('   🔵 Supabase Query 3 (further normalized):');
            console.log('      Table: PredictedProbWinning_PerDistrict_15Jan2026');
            console.log('      Select: PCP, NDP, LIB, GPO, DistrictName');
            console.log('      Filter: DistrictName ILIKE', `%${furtherNormalized.replace(/[^\w\s-]/g, '')}%`);
            console.log('      Method: maybeSingle()');
            
            const { data: normalizedData, error: normalizedError } = await (supabase as any)
              .from('PredictedProbWinning_PerDistrict_15Jan2026')
              .select('PCP, NDP, LIB, GPO, DistrictName')
              .ilike('DistrictName', `%${furtherNormalized.replace(/[^\w\s-]/g, '')}%`)
              .maybeSingle();
            
            console.log('   🔵 Supabase Response 3:');
            console.log('      Data:', normalizedData);
            console.log('      Error:', normalizedError);
            if (normalizedData) {
              console.log('      Data type:', typeof normalizedData);
              console.log('      Data keys:', Object.keys(normalizedData || {}));
              console.log('      Full data object:', JSON.stringify(normalizedData, null, 2));
            }
            if (normalizedError) {
              console.log('      Error code:', normalizedError.code);
              console.log('      Error message:', normalizedError.message);
            }
            
            if (normalizedData) {
              data = normalizedData;
              matchedDistrictName = normalizedData.DistrictName;
              console.log(`   ✅ Found with normalized match: ${matchedDistrictName}`);
            } else {
              // Try matching by first part (e.g., "Spadina" from "Spadina-Harbourfront")
              const firstPart = extractFirstPart(normalizedDistrictName);
              console.log(`   Trying first-part matching: "${firstPart}"`);
              console.log('   🔵 Supabase Query 4 (first-part):');
              console.log('      Table: PredictedProbWinning_PerDistrict_15Jan2026');
              console.log('      Select: PCP, NDP, LIB, GPO, DistrictName');
              console.log('      Filter: DistrictName ILIKE', `${firstPart}%`);
              console.log('      Method: maybeSingle()');
              
              const { data: firstPartData, error: firstPartError } = await (supabase as any)
                .from('PredictedProbWinning_PerDistrict_15Jan2026')
                .select('PCP, NDP, LIB, GPO, DistrictName')
                .ilike('DistrictName', `${firstPart}%`)
                .maybeSingle();
              
              console.log('   🔵 Supabase Response 4:');
              console.log('      Data:', firstPartData);
              console.log('      Error:', firstPartError);
              if (firstPartData) {
                console.log('      Data type:', typeof firstPartData);
                console.log('      Data keys:', Object.keys(firstPartData || {}));
                console.log('      Full data object:', JSON.stringify(firstPartData, null, 2));
              }
              if (firstPartError) {
                console.log('      Error code:', firstPartError.code);
                console.log('      Error message:', firstPartError.message);
              }
              
              if (firstPartData) {
                data = {
                  PCP: firstPartData.PCP,
                  NDP: firstPartData.NDP,
                  LIB: firstPartData.LIB,
                  GPO: firstPartData.GPO,
                  DistrictName: firstPartData.DistrictName
                };
                matchedDistrictName = firstPartData.DistrictName;
                console.log(`   ✅ Found with first-part match: ${matchedDistrictName}`);
              } else {
                // Last resort: Fetch all districts and use fuzzy matching
                console.log('   Trying fuzzy matching with all districts...');
                console.log('   🔵 Supabase Query 5 (fetch all for fuzzy match):');
                console.log('      Table: PredictedProbWinning_PerDistrict_15Jan2026');
                console.log('      Select: PCP, NDP, LIB, GPO, DistrictName');
                console.log('      Filter: (none - fetching all)');
                console.log('      Method: select()');
                
                const { data: allDistricts, error: allDistrictsError } = await (supabase as any)
                  .from('PredictedProbWinning_PerDistrict_15Jan2026')
                  .select('PCP, NDP, LIB, GPO, DistrictName');
                
                console.log('   🔵 Supabase Response 5:');
                console.log('      Data type:', Array.isArray(allDistricts) ? 'array' : typeof allDistricts);
                console.log('      Data length:', allDistricts?.length || 0);
                console.log('      Error:', allDistrictsError);
                if (allDistrictsError) {
                  console.log('      Error code:', allDistrictsError.code);
                  console.log('      Error message:', allDistrictsError.message);
                  console.log('      Error details:', allDistrictsError.details);
                  console.log('      Error hint:', allDistrictsError.hint);
                }
                if (allDistricts && allDistricts.length > 0) {
                  console.log('      First 3 districts:', allDistricts.slice(0, 3).map((d: any) => d.DistrictName));
                }
                
                if (allDistricts && allDistricts.length > 0) {
                  console.log(`   📊 Fetched ${allDistricts.length} districts from Supabase`);
                  
                  // Calculate similarity and character matches for each district
                  const matches = allDistricts
                    .map((row: any) => {
                      const supabaseName = row.DistrictName || '';
                      const similarity = calculateSimilarity(normalizedDistrictName, supabaseName);
                      
                      // Count character matches (case-insensitive)
                      const normalized1 = normalizedDistrictName.toLowerCase();
                      const normalized2 = supabaseName.toLowerCase();
                      let charMatches = 0;
                      const minLength = Math.min(normalized1.length, normalized2.length);
                      for (let i = 0; i < minLength; i++) {
                        if (normalized1[i] === normalized2[i]) {
                          charMatches++;
                        }
                      }
                      const charMatchRatio = charMatches / Math.max(normalized1.length, normalized2.length);
                      
                      return {
                        ...row,
                        similarity,
                        charMatches,
                        charMatchRatio
                      };
                    })
                    .sort((a: any, b: any) => {
                      // Sort by similarity first, then by character matches
                      if (Math.abs(a.similarity - b.similarity) > 0.01) {
                        return b.similarity - a.similarity;
                      }
                      return b.charMatches - a.charMatches;
                    });
                  
                  // Show top 10 matches for debugging
                  console.log('   🔍 Top 10 most similar districts:');
                  matches.slice(0, 10).forEach((match: any, idx: number) => {
                    console.log(`      ${idx + 1}. "${match.DistrictName}" - ${Math.round(match.similarity * 100)}% similar, ${match.charMatches} char matches`);
                  });
                  
                  // Always pick the best match (highest similarity, or most character matches if similar)
                  if (matches.length > 0) {
                    const bestMatch = matches[0];
                    data = {
                      PCP: bestMatch.PCP,
                      NDP: bestMatch.NDP,
                      LIB: bestMatch.LIB,
                      GPO: bestMatch.GPO,
                      DistrictName: bestMatch.DistrictName
                    };
                    matchedDistrictName = bestMatch.DistrictName;
                    console.log(`   ✅ Found with fuzzy match (${Math.round(bestMatch.similarity * 100)}% similar, ${bestMatch.charMatches} char matches): ${matchedDistrictName}`);
                  } else {
                    console.log(`   ⚠️  No districts to match against`);
                  }
                } else {
                  console.log('   ⚠️  Could not fetch districts from Supabase');
                }
              }
            }
          }
        }

        if (error) {
          console.error('❌ Supabase Error:', error);
          console.error('   Code:', error.code);
          console.error('   Message:', error.message);
          console.error('   Details:', error.details);
          console.error('   Hint:', error.hint);
          
          // If column not found error
          if (error.code === 'PGRST116' || error.message?.includes('column') || error.message?.includes('does not exist')) {
            console.error('\n💡 Suggestion: The districtName column might have a different name.');
            console.error('   Please check your Supabase table for the exact column name.');
          }
          
          // If RLS error
          if (error.code === 'PGRST301' || error.message?.includes('permission') || error.message?.includes('policy')) {
            console.error('\n💡 Suggestion: Row Level Security (RLS) might be blocking the query.');
            console.error('   Check your Supabase RLS policies for the table.');
          }
          
          setDistrictProbabilities(null);
        } else if (data) {
          console.log('✅ Success! Probabilities retrieved:', data);
          console.log('   📍 Matched district name in Supabase:', matchedDistrictName || normalizedDistrictName);
          setDistrictProbabilities({
            PCP: (data as any).PCP ?? null,
            NDP: (data as any).NDP ?? null,
            LIB: (data as any).LIB ?? null,
            GPO: (data as any).GPO ?? null,
          });
          
          // Step 2.5: Fetch candidate names using the matched district name
          const districtNameForCandidates = matchedDistrictName || normalizedDistrictName;
          console.log('🔍 Step 2.5: Fetching candidate names for district:', districtNameForCandidates);
          console.log('   📍 Original district name:', resolvedDistrictName);
          console.log('   📍 Using for candidate lookup:', districtNameForCandidates);
          console.log('📋 Table: CandidateNames_2025');
          
          try {
            // Try exact match first
            console.log('   🔵 Supabase Candidate Query 1 (exact match):');
            console.log('      Table: CandidateNames_2025');
            console.log('      Select: PartyCode, NameOfCandidates, DistrictName');
            console.log('      Filter: DistrictName =', districtNameForCandidates);
            console.log('      Method: select()');
            
            let { data: candidateData, error: candidateError } = await (supabase as any)
              .from('CandidateNames_2025')
              .select('PartyCode, NameOfCandidates, DistrictName')
              .eq('DistrictName', districtNameForCandidates);
            
            console.log('   🔵 Supabase Candidate Response 1:');
            console.log('      Data type:', Array.isArray(candidateData) ? 'array' : typeof candidateData);
            console.log('      Data length:', candidateData?.length || 0);
            console.log('      Data:', candidateData);
            console.log('      Error:', candidateError);
            if (candidateData && candidateData.length > 0) {
              console.log('      First candidate:', JSON.stringify(candidateData[0], null, 2));
            }
            if (candidateError) {
              console.log('      Error code:', candidateError.code);
              console.log('      Error message:', candidateError.message);
              console.log('      Error details:', candidateError.details);
              console.log('      Error hint:', candidateError.hint);
            }
            
            console.log('   📍 Candidate query (exact):', {
              districtName: districtNameForCandidates,
              found: candidateData?.length || 0,
              error: candidateError?.message || null
            });
            
            if (candidateError || (!candidateData || candidateData.length === 0)) {
              if (candidateError) {
                console.error('   ❌ Error with exact match:', candidateError);
              } else {
                console.log('   ⚠️  No candidates found with exact match');
              }
              console.log('   🔄 Trying case-insensitive match...');
              
              // Try case-insensitive match
              console.log('   🔵 Supabase Candidate Query 2 (case-insensitive):');
              console.log('      Table: CandidateNames_2025');
              console.log('      Select: PartyCode, NameOfCandidates, DistrictName');
              console.log('      Filter: DistrictName ILIKE', `%${districtNameForCandidates}%`);
              console.log('      Method: select()');
              
              const { data: candidateDataCaseInsensitive, error: candidateErrorCI } = await (supabase as any)
                .from('CandidateNames_2025')
                .select('PartyCode, NameOfCandidates, DistrictName')
                .ilike('DistrictName', `%${districtNameForCandidates}%`);
              
              console.log('   🔵 Supabase Candidate Response 2:');
              console.log('      Data type:', Array.isArray(candidateDataCaseInsensitive) ? 'array' : typeof candidateDataCaseInsensitive);
              console.log('      Data length:', candidateDataCaseInsensitive?.length || 0);
              console.log('      Data:', candidateDataCaseInsensitive);
              console.log('      Error:', candidateErrorCI);
              if (candidateDataCaseInsensitive && candidateDataCaseInsensitive.length > 0) {
                console.log('      First candidate:', JSON.stringify(candidateDataCaseInsensitive[0], null, 2));
              }
              if (candidateErrorCI) {
                console.log('      Error code:', candidateErrorCI.code);
                console.log('      Error message:', candidateErrorCI.message);
              }
              
              console.log('   📍 Candidate query (case-insensitive):', {
                districtName: districtNameForCandidates,
                found: candidateDataCaseInsensitive?.length || 0,
                error: candidateErrorCI?.message || null
              });
              
              if (candidateDataCaseInsensitive && candidateDataCaseInsensitive.length > 0) {
                const namesMap: Record<string, string> = {};
                candidateDataCaseInsensitive.forEach((row: any) => {
                  if (row.PartyCode && row.NameOfCandidates) {
                    namesMap[row.PartyCode] = row.NameOfCandidates;
                    console.log(`   ✅ Found candidate for ${row.PartyCode}: ${row.NameOfCandidates} (district: ${row.DistrictName})`);
                  }
                });
                setCandidateNames(namesMap);
                console.log('✅ Candidate names retrieved (case-insensitive):', namesMap);
              } else {
                console.log('   ⚠️  No candidate names found with case-insensitive match');
                console.log('   🔄 Trying normalized district name...');
                
                // Try normalized name
                const normalizedDistrict = normalizeDistrictName(districtNameForCandidates);
                const { data: candidateDataNormalized } = await (supabase as any)
                  .from('CandidateNames_2025')
                  .select('PartyCode, NameOfCandidates, DistrictName')
                  .ilike('DistrictName', `%${normalizedDistrict.replace(/[^\w\s-]/g, '')}%`);
                
                console.log('   📍 Candidate query (normalized):', {
                  normalized: normalizedDistrict,
                  found: candidateDataNormalized?.length || 0
                });
                
                if (candidateDataNormalized && candidateDataNormalized.length > 0) {
                  const namesMap: Record<string, string> = {};
                  candidateDataNormalized.forEach((row: any) => {
                    if (row.PartyCode && row.NameOfCandidates) {
                      namesMap[row.PartyCode] = row.NameOfCandidates;
                      console.log(`   ✅ Found candidate for ${row.PartyCode}: ${row.NameOfCandidates} (district: ${row.DistrictName})`);
                    }
                  });
                  setCandidateNames(namesMap);
                  console.log('✅ Candidate names retrieved (normalized):', namesMap);
                } else {
                  // Last resort: fetch all and try fuzzy matching
                  console.log('   🔄 Fetching all candidate districts for fuzzy matching...');
                  const { data: allCandidateDistricts } = await (supabase as any)
                    .from('CandidateNames_2025')
                    .select('PartyCode, NameOfCandidates, DistrictName');
                  
                  if (allCandidateDistricts && allCandidateDistricts.length > 0) {
                    console.log(`   📊 Total candidate districts in table: ${allCandidateDistricts.length}`);
                    
                    // Group by district and find best match
                    const districtGroups = new Map<string, any[]>();
                    allCandidateDistricts.forEach((row: any) => {
                      const distName = row.DistrictName || '';
                      if (!districtGroups.has(distName)) {
                        districtGroups.set(distName, []);
                      }
                      districtGroups.get(distName)!.push(row);
                    });
                    
                    const matches = Array.from(districtGroups.entries())
                      .map(([distName, rows]) => ({
                        districtName: distName,
                        rows,
                        similarity: calculateSimilarity(districtNameForCandidates, distName)
                      }))
                      .filter(m => m.similarity > 0.5)
                      .sort((a, b) => b.similarity - a.similarity);
                    
                    if (matches.length > 0) {
                      const bestMatch = matches[0];
                      console.log(`   ✅ Found fuzzy match (${Math.round(bestMatch.similarity * 100)}%): ${bestMatch.districtName}`);
                      const namesMap: Record<string, string> = {};
                      bestMatch.rows.forEach((row: any) => {
                        if (row.PartyCode && row.NameOfCandidates) {
                          namesMap[row.PartyCode] = row.NameOfCandidates;
                          console.log(`   ✅ Found candidate for ${row.PartyCode}: ${row.NameOfCandidates}`);
                        }
                      });
                      setCandidateNames(namesMap);
                      console.log('✅ Candidate names retrieved (fuzzy):', namesMap);
                    } else {
                      console.log('   ⚠️  No fuzzy matches found for candidates');
                      setCandidateNames({});
                    }
                  } else {
                    console.log('   ⚠️  Could not fetch candidate districts');
                    setCandidateNames({});
                  }
                }
              }
            } else if (candidateData && candidateData.length > 0) {
              const namesMap: Record<string, string> = {};
              candidateData.forEach((row: any) => {
                if (row.PartyCode && row.NameOfCandidates) {
                  namesMap[row.PartyCode] = row.NameOfCandidates;
                  console.log(`   ✅ Found candidate for ${row.PartyCode}: ${row.NameOfCandidates}`);
                }
              });
              setCandidateNames(namesMap);
              console.log('✅ Candidate names retrieved (exact match):', namesMap);
            } else {
              console.log('   ⚠️  No candidate names found (exact match returned empty)');
              setCandidateNames({});
            }
          } catch (candidateFetchError) {
            console.error('❌ Error fetching candidate names:', candidateFetchError);
            setCandidateNames({});
          }
        } else {
          console.log('⚠️  No data found for district:', normalizedDistrictName);
          console.log('   💡 The district name might not match exactly in Supabase.');
          console.log('   💡 Original district from Represent API:', resolvedDistrictName);
          console.log('   💡 Normalized district name:', normalizedDistrictName);
          
          // Fetch all district names from Supabase to help debug
          console.log('   🔍 Fetching available districts from Supabase...');
          const { data: allDistricts } = await (supabase as any)
            .from('PredictedProbWinning_PerDistrict_15Jan2026')
            .select('DistrictName')
            .limit(20);
          
          if (allDistricts && allDistricts.length > 0) {
            const districtNames = allDistricts.map((row: any) => row.DistrictName).filter(Boolean);
            console.log('   📋 Sample districts in Supabase:', districtNames.slice(0, 10));
            console.log('   💡 Try to find a match manually or normalize the district name.');
            console.log('   🔍 Looking for districts similar to:', normalizedDistrictName);
            
            // Show similar district names
            const similarDistricts = districtNames
              .map(name => {
                const similarity = calculateSimilarity(normalizedDistrictName, name);
                const normalized1 = normalizedDistrictName.toLowerCase();
                const normalized2 = name.toLowerCase();
                let charMatches = 0;
                const minLength = Math.min(normalized1.length, normalized2.length);
                for (let i = 0; i < minLength; i++) {
                  if (normalized1[i] === normalized2[i]) {
                    charMatches++;
                  }
                }
                return { name, similarity, charMatches };
              })
              .sort((a, b) => {
                if (Math.abs(a.similarity - b.similarity) > 0.01) {
                  return b.similarity - a.similarity;
                }
                return b.charMatches - a.charMatches;
              })
              .slice(0, 5);
            
            if (similarDistricts.length > 0) {
              console.log('   🔍 Most similar districts found:');
              similarDistricts.forEach(d => {
                console.log(`      - "${d.name}" (${Math.round(d.similarity * 100)}% similar, ${d.charMatches} char matches)`);
              });
            }
          }
          
          setDistrictProbabilities(null);
          setCandidateNames({});
        }
      } catch (error) {
        console.error('❌ Unexpected error:', error);
        setDistrictProbabilities(null);
        setDistrictName(null);
        setCandidateNames({});
      } finally {
        setLoadingProbabilities(false);
      }
    };

    fetchDistrictProbabilities();
  }, [strategicVoting, postalCode]);

  // Check if all sliders are 0
  const allZero = climate[0] === 0 && housing[0] === 0 && jobs[0] === 0 && healthcare[0] === 0;

  // Check if postal code is valid: require 6 characters (ignoring spaces)
  const normalizedPostal = postalCode.replace(/\s+/g, '').toUpperCase();
  const postalCodeValid = normalizedPostal.length === 6;
  // If strategic voting is enabled, require valid postal code and probabilities; otherwise, use slider logic
  const shouldShowResults = strategicVoting ? (postalCodeValid && districtProbabilities !== null) : !allZero;
  
  // Debug logging for UI state
  useEffect(() => {
    if (strategicVoting) {
      console.log('🎯 UI State Debug:', {
        postalCode,
        normalizedPostal,
        postalCodeValid,
        districtName,
        districtProbabilities: districtProbabilities !== null,
        candidateNames: Object.keys(candidateNames).length,
        shouldShowResults,
        loadingProbabilities
      });
    }
  }, [strategicVoting, postalCode, postalCodeValid, districtName, districtProbabilities, candidateNames, shouldShowResults, loadingProbabilities]);

  const scores = calculatePartyScores();
  
  // Normalize scores to percentages that add up to 100%
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const normalizedScores = totalScore > 0 ? scores.map(score => (score / totalScore) * 100) : [0, 0, 0, 0];
  
  // Prepare data for strategic voting logic
  // Most closely aligned parties (sorted by rubric score) - order: NDP, Green, Liberal, Conservative
  const alignedParties = scores.map((score, index) => ({
    partyIndex: index,
    partyName: parties[index].name,
    score: normalizedScores[index],
    rubricScore: score, // Original score before normalization
  })).sort((a, b) => b.rubricScore - a.rubricScore);

  // Most likely to win parties (sorted by probability from Supabase) - order: Conservative, Liberal, NDP, Green
  const strategicParties = districtProbabilities ? [
    { partyIndex: 0, partyName: 'Progressive Conservative', probability: districtProbabilities.PCP ?? 0 }, // PCP
    { partyIndex: 1, partyName: 'NDP', probability: districtProbabilities.NDP ?? 0 }, // NDP
    { partyIndex: 2, partyName: 'Liberal', probability: districtProbabilities.LIB ?? 0 }, // LIB
    { partyIndex: 3, partyName: 'Green', probability: districtProbabilities.GPO ?? 0 }, // GPO
  ].sort((a, b) => b.probability - a.probability) : [];

  // Strategic voting logic
  let topPartyIndex: number;
  let topParty: { name: string; candidateName: string; color: string };
  
  if (strategicVoting && strategicParties.length > 0 && alignedParties.length > 0) {
    // Check if using slider strategy
    if (useSliderStrategy) {
      // Slider Algorithm Implementation
      const sliderValue = strategicSlider[0]; // Get slider value (0-1)
      
      // Find the party with the highest alignment score (topParty)
      const topAlignedParty = alignedParties[0];
      const topAlignedPartyIndex = topAlignedParty.partyIndex;
      const topAlignedPartyScore = topAlignedParty.rubricScore;
      
      // Find the party with the lowest alignment score (worstParty)
      const worstParty = alignedParties[alignedParties.length - 1];
      const worstPartyIndex = worstParty.partyIndex;
      
      // Rank parties by win probability
      const rankedByProb = [...strategicParties].sort((a, b) => b.probability - a.probability);
      
      // If the top-alignment party is ranked 1st or 2nd by probability, return it immediately
      if (rankedByProb[0].partyIndex === topAlignedPartyIndex || 
          (rankedByProb.length > 1 && rankedByProb[1].partyIndex === topAlignedPartyIndex)) {
        topPartyIndex = topAlignedPartyIndex;
        topParty = parties[topPartyIndex];
      } else {
        // Strategy applies
        // Exclude the least-aligned party
        // Slider controls how much value deviation is allowed
        const minValuesAgreement = topAlignedPartyScore * (1 - 0.5 * sliderValue);
        
        // Create a map of party index to alignment score and probability
        const partyData = new Map();
        alignedParties.forEach(p => {
          partyData.set(p.partyIndex, {
            alignmentScore: p.rubricScore,
            probability: strategicParties.find(sp => sp.partyIndex === p.partyIndex)?.probability ?? 0
          });
        });
        
        // Filter eligible parties: not worstParty and alignmentScore >= minValuesAgreement
        const eligibleParties = Array.from(partyData.entries())
          .filter(([index, data]) => 
            index !== worstPartyIndex && data.alignmentScore >= minValuesAgreement
          );
        
        if (eligibleParties.length > 0) {
          // From eligible parties, pick the one with highest weighted score
          // score = (1 - slider) * alignmentScore + slider * probability
          const bestParty = eligibleParties.reduce((best, current) => {
            const [bestIndex, bestData] = best;
            const [currentIndex, currentData] = current;
            
            const bestScore = (1 - sliderValue) * bestData.alignmentScore + sliderValue * bestData.probability;
            const currentScore = (1 - sliderValue) * currentData.alignmentScore + sliderValue * currentData.probability;
            
            return currentScore > bestScore ? current : best;
          });
          
          topPartyIndex = bestParty[0];
          topParty = parties[topPartyIndex];
        } else {
          // Fallback: if no eligible parties, use top aligned party
          topPartyIndex = topAlignedPartyIndex;
          topParty = parties[topPartyIndex];
        }
      }
    } else {
      // Original toggle-only algorithm
      // party_v = parties sorted by values (alignment with user's priorities)
      const party_v = alignedParties;
      // party_p = parties sorted by probabilities (likelihood to win)
      const party_p = strategicParties;
      
      // Get the party indices (not just the sorted arrays)
      const party_v_0_index = party_v[0].partyIndex;
      const party_p_0_index = party_p[0].partyIndex;
      const party_p_1_index = party_p.length > 1 ? party_p[1].partyIndex : -1;
      
      // Rule 1: If party_v[0] == party_p[0], return party_v[0]
      if (party_v_0_index === party_p_0_index) {
        topPartyIndex = party_v_0_index;
      }
      // Rule 2: If party_v[0] == party_p[1], return party_v[0]
      else if (party_v_0_index === party_p_1_index) {
        topPartyIndex = party_v_0_index;
      }
      // Rule 3: Look for close ties in probabilities, then choose party from party_v with least score distance from party_v[0]
      else {
        // Find close ties in probabilities (parties with similar winning probabilities)
        // Consider parties "tied" if their probabilities are within a small threshold (e.g., 5%)
        const topProbability = party_p[0].probability;
        const probabilityThreshold = 0.05; // 5% threshold for considering a tie
        
        const tiedParties = party_p.filter(p => 
          Math.abs(p.probability - topProbability) <= probabilityThreshold
        );
        
        // If there's a tie, check if party_v[0] is in the tied contenders
        if (tiedParties.length > 1) {
        const tiedPartyIndices = new Set(tiedParties.map(p => p.partyIndex));
        
        // Check if the top aligned party (party_v[0]) is in the tied contenders
        if (tiedPartyIndices.has(party_v_0_index)) {
          // If their most aligned party is IN the top tied contenders, return that party
          topPartyIndex = party_v_0_index;
        } else {
          // If it is not, return the most aligned party to the candidate within 30%
          const party_v_0_score = party_v[0].rubricScore;
          
          // Find parties from party_v that are in the tied group
          const candidateParties = party_v.filter(p => tiedPartyIndices.has(p.partyIndex));
          
          if (candidateParties.length > 0) {
            // Calculate score distance and percentage difference from party_v[0] for each candidate
            const candidatesWithDistance = candidateParties.map(p => ({
              partyIndex: p.partyIndex,
              scoreDistance: Math.abs(p.rubricScore - party_v_0_score),
              scoreDifferencePercent: party_v_0_score > 0 ? (Math.abs(p.rubricScore - party_v_0_score) / party_v_0_score) * 100 : 100
            }));
            
            // Filter to only candidates within 30%
            const candidatesWithin30 = candidatesWithDistance.filter(c => c.scoreDifferencePercent <= 30);
            
            if (candidatesWithin30.length > 0) {
              // Choose the one with the least score distance (most aligned)
              const bestCandidate = candidatesWithin30.reduce((best, current) => 
                current.scoreDistance < best.scoreDistance ? current : best
              );
              topPartyIndex = bestCandidate.partyIndex;
            } else {
              // If no candidates within 30%, use the top aligned party
              topPartyIndex = party_v_0_index;
            }
          } else {
            // Fallback: if no aligned parties are in the tie, use the top aligned party
            topPartyIndex = party_v_0_index;
          }
        }
        } else {
          // No close tie: choose the party from top 2 probabilities with closest alignment score to party_v[0]
          // unless that score is too far away (more than 30% difference)
          const topTwoProbabilities = party_p.slice(0, 2); // Top 2 parties by probability
          const topTwoIndices = new Set(topTwoProbabilities.map(p => p.partyIndex));
          
          // Find parties from party_v that are in the top 2 probabilities
          const candidateParties = party_v.filter(p => topTwoIndices.has(p.partyIndex));
          
          if (candidateParties.length > 0) {
            const party_v_0_score = party_v[0].rubricScore;
            
            // Calculate score distance from party_v[0] for each candidate
            const candidatesWithDistance = candidateParties.map(p => ({
              partyIndex: p.partyIndex,
              scoreDistance: Math.abs(p.rubricScore - party_v_0_score),
              scoreDifferencePercent: party_v_0_score > 0 ? (Math.abs(p.rubricScore - party_v_0_score) / party_v_0_score) * 100 : 100
            }));
            
            // Choose the one with the least score distance
            const bestCandidate = candidatesWithDistance.reduce((best, current) => 
              current.scoreDistance < best.scoreDistance ? current : best
            );
            
            // If the best candidate is within 30% of party_v[0]'s score, use it; otherwise use party_v[0]
            if (bestCandidate.scoreDifferencePercent <= 30) {
              topPartyIndex = bestCandidate.partyIndex;
            } else {
              topPartyIndex = party_v_0_index;
            }
          } else {
            // Fallback: if no aligned parties are in top 2 probabilities, use the top aligned party
            topPartyIndex = party_v_0_index;
          }
        }
        
        topParty = parties[topPartyIndex];
      }
    }
  } else {
    // Fallback to regular slider-based logic when strategic voting is off or data unavailable
    const maxScore = totalScore > 0 ? Math.max(...normalizedScores) : 0;
    topPartyIndex = totalScore > 0 ? normalizedScores.indexOf(maxScore) : 0;
    topParty = parties[topPartyIndex];
  }

  return (
    <>
      <header className="container py-4 md:py-6 flex items-center justify-end">
        <div className="flex items-center gap-4 w-full justify-between">
          <a href="/" className="flex items-center">
            <img
              src="/images/logo.png"
              alt="The Action Pact Logo"
              className="h-24 md:h-32 w-auto object-contain"
            />
          </a>
          <a href="/" className="text-sm md:text-base hover:text-primary hover:underline transition-colors">
            Back to Home
          </a>
        </div>
      </header>
      <main className="container py-8 overflow-y-auto max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center text-primary">ActiVote</h1>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Sliders */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Rate Your Priorities (0-5)</h2>
            <div className="space-y-6">
              {/* Climate Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-base font-medium">Climate</label>
                  <span className="text-base font-bold text-primary">{climate[0]}/5</span>
                </div>
                <Slider
                  value={climate}
                  onValueChange={setClimate}
                  min={0}
                  max={5}
                  step={1}
                  className="[&_.absolute.h-full]:!bg-primary [&_[role=slider]]:!bg-primary [&_[role=slider]]:!border-primary"
                />
              </div>

              {/* Housing Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-base font-medium">Housing</label>
                  <span className="text-base font-bold text-primary">{housing[0]}/5</span>
                </div>
                <Slider
                  value={housing}
                  onValueChange={setHousing}
                  min={0}
                  max={5}
                  step={1}
                  className="[&_.absolute.h-full]:!bg-primary [&_[role=slider]]:!bg-primary [&_[role=slider]]:!border-primary"
                />
              </div>

              {/* Jobs Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-base font-medium">Jobs</label>
                  <span className="text-base font-bold text-primary">{jobs[0]}/5</span>
                </div>
                <Slider
                  value={jobs}
                  onValueChange={setJobs}
                  min={0}
                  max={5}
                  step={1}
                  className="[&_.absolute.h-full]:!bg-primary [&_[role=slider]]:!bg-primary [&_[role=slider]]:!border-primary"
                />
              </div>

              {/* Healthcare Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-base font-medium">Healthcare</label>
                  <span className="text-base font-bold text-primary">{healthcare[0]}/5</span>
                </div>
                <Slider
                  value={healthcare}
                  onValueChange={setHealthcare}
                  min={0}
                  max={5}
                  step={1}
                  className="[&_.absolute.h-full]:!bg-primary [&_[role=slider]]:!bg-primary [&_[role=slider]]:!border-primary"
                />
              </div>

              {/* Strategic Voting Toggle */}
              <div className="flex items-center gap-3 mt-4 flex-nowrap">
                <div className="flex items-center gap-2">
                  <Switch
                    id="strategic"
                    checked={strategicVoting}
                    onCheckedChange={setStrategicVoting}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input [&>span]:border-2 [&>span]:border-foreground self-center align-middle leading-none"
                  />
                  <label htmlFor="strategic" className="text-sm font-medium cursor-pointer text-primary leading-none">
                    Strategic Voting
                  </label>
                </div>
                {strategicVoting ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Postal Code"
                      className={`px-2 text-xs border-2 border-foreground rounded w-24 h-8 self-center focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-all ${
                        loadingProbabilities ? 'opacity-50' : ''
                      }`}
                      style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif' }}
                      disabled={loadingProbabilities}
                    />
                    {loadingProbabilities && (
                      <span className="text-xs text-gray-500">Loading...</span>
                    )}
                    {!loadingProbabilities && postalCodeValid && districtProbabilities === null && postalCode.length > 0 && (
                      <span className="text-xs text-red-600">Not found</span>
                    )}
                  </div>
                ) : (
                  // Reserve space so the row height doesn't change when toggled on
                  <div className="w-24 h-8 self-center" />
                )}
              </div>
              
              {/* Strategic Slider (only shown when strategic voting is on and slider strategy is enabled) */}
              {strategicVoting && useSliderStrategy && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-primary">Less Strategic</span>
                    <span className="text-sm font-medium text-primary">More Strategic</span>
                  </div>
                  <Slider
                    value={strategicSlider}
                    onValueChange={setStrategicSlider}
                    min={0}
                    max={1}
                    step={0.01}
                    className="[&_.absolute.h-full]:!bg-primary [&_[role=slider]]:!bg-primary [&_[role=slider]]:!border-primary"
                  />
                </div>
              )}
              
              {/* Disclaimer */}
              <p className="text-sm font-medium text-primary mb-4" style={{ paddingTop: '2px' }}>
                Disclaimer: This tool uses historical data and is currently in beta testing.
              </p>
              
              {/* Co-lead Testing Note */}
              <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-4 mt-4" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                <p className="text-sm text-gray-800 mb-3">
                  <span className="font-semibold">Co-lead testing note</span>
                </p>
                <p className="text-sm text-gray-800 mb-3">
                  Right now the page is using a toggle only strategy approach with this logic.
                </p>
                
                <div className="text-xs text-gray-700 mb-3 space-y-2">
                  <p className="font-semibold text-sm">Toggle-Only Algorithm:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Prepare two sorted lists - parties by alignment with your priorities (highest first) and parties by winning probability (highest first).</li>
                    <li>If your top aligned party is also the most likely to win, choose that party.</li>
                    <li>Otherwise, if your top aligned party is the second most likely to win, choose that party.</li>
                    <li>Otherwise, find parties with probabilities within 5% of the top (tied parties). If there's a tie: If your most aligned party is in the tied contenders, choose that party. If it is not, choose the most aligned party among the tied contenders that is within 30% of your top aligned party's score.</li>
                    <li>Otherwise (if there is not a {'>'}2 party tie), choose the party out of the top two highest probabilities that has a closer alignment score to your top aligned party, if that party's score is within 30%.</li>
                  </ul>
                  
                  <p className="text-sm text-gray-800 mt-4 pt-2 font-semibold">Problems:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-xs text-gray-700 mt-2">
                    <li>Arbitrary thresholds (30% and 5%) don't account for individual preferences and would need some sort of reasoning for the number choice</li>
                    <li>Makes personal calls for users (e.g., what counts as a "close tie")</li>
                    <li>No user control over strategic vs. alignment trade-offs</li>
                    <li>All users treated the same regardless of risk tolerance</li>
                  </ul>
                  
                  <p className="text-sm text-gray-800 mt-4 pt-2 font-semibold">Benefits:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-xs text-gray-700 mt-2">
                    <li>Simpler UI - just a toggle, no additional controls</li>
                    <li>Less decision fatigue for politically disengaged users</li>
                    <li>Though algorithm makes more assumptions, it is more explicit to convey</li>
                    <li>Works well when users want a straightforward recommendation</li>
                  </ul>
                  
                  <p className="text-sm text-gray-800 mt-3">The way I could see us using this one or a toggle variation is if we are explicit about the algorithm to the user.</p>
                  
                  <p className="text-sm text-gray-800 mt-4 pt-2">Alternatively, toggle this blue toggle (in same box) to initiate a slider, which uses this logic</p>
                  <p className="font-semibold text-sm mt-2">Slider Algorithm:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-xs text-gray-700 mt-2">
                    <li>Find the party with the highest alignment score</li>
                    <li>Rank parties by win probability</li>
                    <li>If the top-alignment party is ranked 1st or 2nd by probability: Return it immediately</li>
                    <li>Otherwise: Strategy applies</li>
                    <li>Exclude the least-aligned party</li>
                    <li>Slider controls how much value deviation is allowed</li>
                    <li>From eligible parties, pick the most likely to win (weighted by slider)</li>
                  </ul>
                  <p className="text-xs text-gray-700 mt-2">The slider controls how much the user is willing to compromise their values; within that acceptable range, the tool recommends the party most likely to win — but it never recommends the user's least-aligned party, and it never forces strategy when it isn't needed.</p>
                  
                  <p className="text-sm text-gray-800 mt-4 pt-2 font-semibold">Problems:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-xs text-gray-700 mt-2">
                    <li>More complex UI - requires understanding and adjusting a slider</li>
                    <li>May be overwhelming for less politically engaged users</li>
                    <li>Users need to understand what "strategic" means in this context</li>
                    <li>Requires more cognitive effort to decide on slider position</li>
                  </ul>
                  
                  <p className="text-sm text-gray-800 mt-4 pt-2 font-semibold">Benefits:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-xs text-gray-700 mt-2">
                    <li>Gives users control over their strategic vs. alignment preferences</li>
                    <li>Personalized recommendations based on individual risk tolerance</li>
                    <li>No arbitrary thresholds - user decides acceptable compromise level</li>
                    <li>More transparent - users can see how their choice affects the recommendation</li>
                  </ul>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    id="slider-strategy"
                    checked={useSliderStrategy}
                    onCheckedChange={setUseSliderStrategy}
                    className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 [&>span]:border-2 [&>span]:border-blue-600"
                  />
                  <label htmlFor="slider-strategy" className="text-sm font-medium cursor-pointer text-blue-700">
                    Use Slider Strategy
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div>
            {strategicVoting && districtName && (
              <p className="text-center text-base md:text-lg text-gray-700 mb-2">
                District of <span className="font-semibold">{districtName}</span>
              </p>
            )}
            <h2 className="text-2xl font-bold mb-6 text-center">Your Top Match</h2>
            {/* Show results if strategic voting is enabled and postal code is valid, or if sliders are used */}
            {shouldShowResults ? (
              <>
                <div className="bg-gradient-to-br from-red-50 to-red-100 border-4 border-red-600 rounded-lg p-8 shadow-xl mb-6">
                  {/* Candidate Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-gray-400 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <p className={`text-5xl font-bold ${topParty.color} mb-2`}>
                    {topParty.name}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mb-3">
                    {getCandidateName(topPartyIndex)}
                  </p>
                </div>

                {/* All Parties */}
                <div className="space-y-3">
                  <h3 className="font-bold text-lg mb-3">All Parties:</h3>
                  {parties.map((party, idx) => (
                    <div 
                      key={party.name}
                      className={`p-4 border-2 rounded ${
                        idx === topPartyIndex 
                          ? 'border-red-600 bg-red-50' 
                          : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      <div className="flex flex-col">
                        <p className={`text-lg font-bold ${party.color} mb-1`}>{party.name}</p>
                        <p className="text-sm font-medium text-gray-900">{getCandidateName(idx)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : strategicVoting && loadingProbabilities ? (
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-8 text-center">
                <p className="text-lg text-gray-700">
                  Finding your most aligned candidate…
                </p>
              </div>
            ) : strategicVoting ? (
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-8 text-center">
                <p className="text-lg text-gray-700">
                  Please enter your postal code so we can find your electoral district.
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-8 text-center">
                <p className="text-lg text-gray-700">
                  Please use at least one slider to go to at least 1
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default ActiVote;

