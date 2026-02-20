import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/lib/supabase";

const translations = {
  en: {
    scoreHeading: "Score how important each issue is to you",
    scaleLabel: "0 = not important, 5 = very important",
    climate: "Climate",
    housing: "Housing",
    jobs: "Jobs",
    healthcare: "Healthcare",
    postalCode: "Postal Code",
    required: "Required",
    loading: "Loading...",
    notFound: "Not found",
    matchBasedOnScores: "Match based on scores",
    strategic: "Strategic",
    disclaimer: "This tool uses historical data and is currently in beta testing.",
    howSliderWorks: "How the slider works",
    sliderBullet1: "When slider is at 0: Recommendations are based only on alignment with your priorities (not strategic).",
    sliderBullet2: "When slider is above 0: We use two lists — parties by alignment (your priorities) and parties by win probability in your district.",
    sliderBullet3: "If your top-aligned party is 1st or 2nd by probability, we recommend them.",
    sliderBullet4: "Otherwise: Strategy applies. We exclude the least-aligned party.",
    sliderBullet5: "The slider controls how much value deviation is allowed.",
    sliderBullet6: "From eligible parties, we pick the one with the highest weighted score (alignment + probability).",
    districtOf: "District of",
    yourTopMatch: "Your Top Match",
    allParties: "All Parties:",
    findingCandidate: "Finding your most aligned candidate…",
    enterPostalCode: "Please enter your postal code so we can find candidates from your electoral district.",
    useOneSlider: "Please use at least one slider to go to at least 1",
    ariaInfo: "How the strategic voting slider works",
    close: "Close",
    partyNames: ["Ontario PC Party", "NDP", "Liberal", "Green"],
  },
  fr: {
    scoreHeading: "Indiquez l'importance de chaque enjeu pour vous",
    scaleLabel: "0 = pas important, 5 = très important",
    climate: "Climat",
    housing: "Logement",
    jobs: "Emplois",
    healthcare: "Santé",
    postalCode: "Code postal",
    required: "Obligatoire",
    loading: "Chargement…",
    notFound: "Introuvable",
    matchBasedOnScores: "Correspondance selon les scores",
    strategic: "Stratégique",
    disclaimer: "Cet outil utilise des données historiques et est en phase de test.",
    howSliderWorks: "Comment fonctionne le curseur",
    sliderBullet1: "À 0 : Les recommandations se basent uniquement sur l'alignement avec vos priorités (pas stratégique).",
    sliderBullet2: "Au-dessus de 0 : Nous utilisons deux listes — les partis par alignement (vos priorités) et les partis par probabilité de victoire dans votre circonscription.",
    sliderBullet3: "Si votre parti le plus aligné est 1er ou 2e en probabilité, nous le recommandons.",
    sliderBullet4: "Sinon : La stratégie s'applique. Nous excluons le parti le moins aligné.",
    sliderBullet5: "Le curseur contrôle la déviation de valeur autorisée.",
    sliderBullet6: "Parmi les partis admissibles, nous choisissons celui avec le score pondéré le plus élevé (alignement + probabilité).",
    districtOf: "Circonscription de",
    yourTopMatch: "Votre meilleur choix",
    allParties: "Tous les partis :",
    findingCandidate: "Recherche de votre candidat le plus aligné…",
    enterPostalCode: "Veuillez entrer votre code postal pour trouver les candidats de votre circonscription.",
    useOneSlider: "Veuillez utiliser au moins un curseur (au moins 1).",
    ariaInfo: "Comment fonctionne le curseur de vote stratégique",
    close: "Fermer",
    partyNames: ["Parti Ontario PC", "NPD", "Libéral", "Parti vert"],
  },
} as const;

type Lang = keyof typeof translations;

const ActiVote = () => {
  const [lang, setLang] = useState<Lang>("en");
  const t = translations[lang];

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
  
  // Postal code and district data
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
  const [strategicSlider, setStrategicSlider] = useState([0]); // Slider value 0-1, where 0 = not strategic (alignment only), 1 = more strategic
  const [infoPopoverOpen, setInfoPopoverOpen] = useState(false);

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
    { name: "Ontario PC Party", candidateName: "Pierre Poilievre", color: "text-blue-700", partyCode: "PCP" },
    { name: "NDP", candidateName: "Jagmeet Singh", color: "text-orange-600", partyCode: "NDP" },
    { name: "Liberal", candidateName: "Justin Trudeau", color: "text-red-600", partyCode: "LIB" },
    { name: "Green", candidateName: "Elizabeth May", color: "text-green-600", partyCode: "GPO" },
  ];

  // When we have district data, only show parties that have a candidate in the dataset (no fallback)
  const hasDistrictCandidateData = Boolean(districtName && !loadingProbabilities);
  const partyEntriesWithCandidates = hasDistrictCandidateData
    ? parties.map((p, i) => ({ party: p, index: i })).filter(({ party }) => candidateNames[party.partyCode])
    : parties.map((p, i) => ({ party: p, index: i }));
  const eligibleIndicesSet = new Set(partyEntriesWithCandidates.map((e) => e.index));

  // Helper function to get candidate name for a party (uses real name if available, otherwise fallback when no district data)
  const getCandidateName = (partyIndex: number): string => {
    const party = parties[partyIndex];
    if (!party) return "Unknown";
    if (candidateNames[party.partyCode]) return candidateNames[party.partyCode];
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
        postalCode,
        postalCodeLength: postalCode?.length || 0
      });
      
      if (!postalCode) {
        console.log('   ⏸️  Skipping fetch - no postal code');
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
  }, [postalCode]);

  // Check if all sliders are 0
  const allZero = climate[0] === 0 && housing[0] === 0 && jobs[0] === 0 && healthcare[0] === 0;

  // Check if postal code is valid: require 6 characters (ignoring spaces)
  const normalizedPostal = postalCode.replace(/\s+/g, '').toUpperCase();
  const postalCodeValid = normalizedPostal.length === 6;
  // Always require valid postal code and district probabilities to show results
  const shouldShowResults = postalCodeValid && districtProbabilities !== null && !allZero;
  
  // Debug logging for UI state
  useEffect(() => {
    console.log('🎯 UI State Debug:', {
      postalCode,
      normalizedPostal,
      postalCodeValid,
      districtName,
      districtProbabilities: districtProbabilities !== null,
      candidateNames: Object.keys(candidateNames).length,
      shouldShowResults,
      loadingProbabilities,
      allZero
    });
  }, [postalCode, postalCodeValid, districtName, districtProbabilities, candidateNames, shouldShowResults, loadingProbabilities, allZero, normalizedPostal]);

  const scores = calculatePartyScores();
  
  // Normalize scores to percentages that add up to 100%
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const normalizedScores = totalScore > 0 ? scores.map(score => (score / totalScore) * 100) : [0, 0, 0, 0];
  
  // Prepare data for strategic voting logic (only include parties that have a candidate in this district when applicable)
  const alignedPartiesAll = scores.map((score, index) => ({
    partyIndex: index,
    partyName: parties[index].name,
    score: normalizedScores[index],
    rubricScore: score,
  })).sort((a, b) => b.rubricScore - a.rubricScore);
  const alignedParties = alignedPartiesAll.filter((p) => eligibleIndicesSet.has(p.partyIndex));

  const strategicPartiesAll = districtProbabilities ? [
    { partyIndex: 0, partyName: 'Ontario PC Party', probability: districtProbabilities.PCP ?? 0 },
    { partyIndex: 1, partyName: 'NDP', probability: districtProbabilities.NDP ?? 0 },
    { partyIndex: 2, partyName: 'Liberal', probability: districtProbabilities.LIB ?? 0 },
    { partyIndex: 3, partyName: 'Green', probability: districtProbabilities.GPO ?? 0 },
  ].sort((a, b) => b.probability - a.probability) : [];
  const strategicParties = strategicPartiesAll.filter((p) => eligibleIndicesSet.has(p.partyIndex));

  // Strategic voting logic - always use slider algorithm (only among parties with candidates when district data exists)
  let topPartyIndex: number;
  let topParty: { name: string; candidateName: string; color: string; partyCode: string };
  
  const sliderValue = strategicSlider[0]; // Get slider value (0-1)
  
  if (partyEntriesWithCandidates.length === 0) {
    topPartyIndex = -1;
    topParty = parties[0];
  } else if (strategicParties.length > 0 && alignedParties.length > 0 && sliderValue > 0) {
    // Slider Algorithm Implementation
    // Find the party with the highest alignment score (topParty)
    const topAlignedParty = alignedParties[0];
    const topAlignedPartyIndex = topAlignedParty.partyIndex;
    const topAlignedPartyScore = topAlignedParty.rubricScore;
    
    // Find the party with the lowest alignment score (worstParty)
    const worstParty = alignedParties[alignedParties.length - 1];
    const worstPartyIndex = worstParty.partyIndex;
    
    // Normalize alignment scores to 0-1 scale for fair comparison with probabilities
    const maxAlignmentScore = Math.max(...alignedParties.map(p => p.rubricScore));
    const minAlignmentScore = Math.min(...alignedParties.map(p => p.rubricScore));
    const alignmentRange = maxAlignmentScore - minAlignmentScore;
    
    // Rank parties by win probability
    const rankedByProb = [...strategicParties].sort((a, b) => b.probability - a.probability);
    
    // If the top-aligned party is ranked 1st or 2nd by probability, return it immediately
    if (rankedByProb[0].partyIndex === topAlignedPartyIndex || 
        (rankedByProb.length > 1 && rankedByProb[1].partyIndex === topAlignedPartyIndex)) {
      topPartyIndex = topAlignedPartyIndex;
      topParty = parties[topPartyIndex];
    } else {
      // Strategy applies
      // Exclude the least-aligned party
      // Slider controls how much value deviation is allowed
      // At slider = 0: require 100% of top score, at slider = 1: require 0% (allow all except worst)
      const minValuesAgreement = topAlignedPartyScore * (1 - sliderValue);
      
      // Create a map of party index to normalized alignment score and probability
      const partyData = new Map();
      alignedParties.forEach(p => {
        // Normalize alignment score to 0-1 scale
        const normalizedAlignment = alignmentRange > 0 
          ? (p.rubricScore - minAlignmentScore) / alignmentRange 
          : 0.5; // If all scores are the same, use 0.5
        
        const probability = strategicParties.find(sp => sp.partyIndex === p.partyIndex)?.probability ?? 0;
        
        partyData.set(p.partyIndex, {
          alignmentScore: p.rubricScore, // Keep original for threshold check
          normalizedAlignment, // Normalized for weighted calculation
          probability
        });
      });
      
      // Filter eligible parties: not worstParty and alignmentScore >= minValuesAgreement
      const eligibleParties = Array.from(partyData.entries())
        .filter(([index, data]) => 
          index !== worstPartyIndex && data.alignmentScore >= minValuesAgreement
        );
      
      if (eligibleParties.length > 0) {
        // From eligible parties, pick the one with highest weighted score
        // Use normalized values so alignment and probability are on the same scale
        // score = (1 - slider) * normalizedAlignment + slider * probability
        const bestParty = eligibleParties.reduce((best, current) => {
          const [bestIndex, bestData] = best;
          const [currentIndex, currentData] = current;
          
          const bestScore = (1 - sliderValue) * bestData.normalizedAlignment + sliderValue * bestData.probability;
          const currentScore = (1 - sliderValue) * currentData.normalizedAlignment + sliderValue * currentData.probability;
          
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
    // When slider is at 0 or no district data: use alignment scores only (among eligible parties)
    if (partyEntriesWithCandidates.length > 0) {
      const bestAmongEligible = partyEntriesWithCandidates.reduce((best, entry) =>
        normalizedScores[entry.index] >= normalizedScores[best.index] ? entry : best
      );
      topPartyIndex = bestAmongEligible.index;
    } else {
      topPartyIndex = totalScore > 0 ? normalizedScores.indexOf(Math.max(...normalizedScores)) : 0;
    }
    topParty = parties[topPartyIndex];
  }

  return (
    <>
      <header className="container py-4 md:py-6 flex items-center justify-between w-full">
        <a href="/" className="flex items-center">
          <img
            src={lang === "fr" ? "/images/newestfrenchlogo.png" : "/images/logo.png"}
            alt={lang === "fr" ? "Le Pacte d'Action Logo" : "The Action Pact Logo"}
            className="h-24 md:h-32 w-auto object-contain"
          />
        </a>
        <button
          type="button"
          onClick={() => setLang(lang === "en" ? "fr" : "en")}
          className="px-4 py-2 text-lg font-medium border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          style={{ fontFamily: 'var(--font-display)' }}
          aria-label={lang === "en" ? "Switch to French" : "Passer en anglais"}
        >
          {lang === "en" ? "FR" : "EN"}
        </button>
      </header>
      <main className="container py-10 md:py-14 overflow-y-auto max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-6xl md:text-7xl font-bold mb-10 md:mb-14 text-center text-primary tracking-tight">ActiVote</h1>

        {/* Two Column Layout - asymmetric emphasis on results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-stretch">
          {/* Left Column - Sliders in a raised panel */}
          <div className="lg:col-span-6 lg:self-start">
            <div className="relative rounded-3xl border-2 border-gray-300 bg-transparent pt-4 pb-4 pl-6 pr-6 md:pt-5 md:pb-5 md:pl-8 md:pr-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <h2 className={`font-bold mb-2 ${lang === "fr" ? "text-[1.06rem] sm:text-[1.2rem] md:text-[1.375rem]" : "text-xl sm:text-2xl md:text-[1.65rem]"}`}>{t.scoreHeading}</h2>
              <p className="text-lg text-black mb-8">{t.scaleLabel}</p>
              <div className="space-y-8">
              {/* Climate Slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xl font-medium">{t.climate}</label>
                  <span className="text-xl font-bold text-primary">{climate[0]}/5</span>
                </div>
                <Slider
                  value={climate}
                  onValueChange={setClimate}
                  min={0}
                  max={5}
                  step={1}
                  className="[&_.relative.h-2]:border-2 [&_.relative.h-2]:border-gray-300 [&_.relative.h-2]:rounded-full [&_.absolute.h-full]:!bg-primary [&_[role=slider]]:!bg-primary [&_[role=slider]]:!border-primary"
                />
              </div>

              {/* Housing Slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xl font-medium">{t.housing}</label>
                  <span className="text-xl font-bold text-primary">{housing[0]}/5</span>
                </div>
                <Slider
                  value={housing}
                  onValueChange={setHousing}
                  min={0}
                  max={5}
                  step={1}
                  className="[&_.relative.h-2]:border-2 [&_.relative.h-2]:border-gray-300 [&_.relative.h-2]:rounded-full [&_.absolute.h-full]:!bg-primary [&_[role=slider]]:!bg-primary [&_[role=slider]]:!border-primary"
                />
              </div>

              {/* Jobs Slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xl font-medium">{t.jobs}</label>
                  <span className="text-xl font-bold text-primary">{jobs[0]}/5</span>
                </div>
                <Slider
                  value={jobs}
                  onValueChange={setJobs}
                  min={0}
                  max={5}
                  step={1}
                  className="[&_.relative.h-2]:border-2 [&_.relative.h-2]:border-gray-300 [&_.relative.h-2]:rounded-full [&_.absolute.h-full]:!bg-primary [&_[role=slider]]:!bg-primary [&_[role=slider]]:!border-primary"
                />
              </div>

              {/* Healthcare Slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xl font-medium">{t.healthcare}</label>
                  <span className="text-xl font-bold text-primary">{healthcare[0]}/5</span>
                </div>
                <Slider
                  value={healthcare}
                  onValueChange={setHealthcare}
                  min={0}
                  max={5}
                  step={1}
                  className="[&_.relative.h-2]:border-2 [&_.relative.h-2]:border-gray-300 [&_.relative.h-2]:rounded-full [&_.absolute.h-full]:!bg-primary [&_[role=slider]]:!bg-primary [&_[role=slider]]:!border-primary"
                />
              </div>

              {/* Postal Code Input - Always Required */}
              <div className="flex items-center gap-3 mt-4 pt-2">
                <label className="text-xl font-medium">{t.postalCode}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder={t.required}
                    className={`px-3 text-base border-2 border-foreground rounded-md w-28 h-10 self-center focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-all ${
                      loadingProbabilities ? 'opacity-50' : ''
                    }`}
                    style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif' }}
                    disabled={loadingProbabilities}
                    required
                  />
                  {loadingProbabilities && (
                    <span className="text-base text-gray-500">{t.loading}</span>
                  )}
                  {!loadingProbabilities && postalCodeValid && districtProbabilities === null && postalCode.length > 0 && (
                    <span className="text-base text-red-600">{t.notFound}</span>
                  )}
                </div>
              </div>

              {/* Strategic Voting Slider - Always shown */}
              <div className="mt-6">
                <div className={`flex justify-between items-center mb-3 ${lang === "fr" ? "flex-nowrap gap-4" : ""}`}>
                  <span className={`text-lg font-medium text-primary ${lang === "fr" ? "whitespace-nowrap" : ""}`}>{t.matchBasedOnScores}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-lg font-medium text-primary">{t.strategic}</span>
                    <button
                      type="button"
                      onClick={() => setInfoPopoverOpen(true)}
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-background text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                      aria-label={t.ariaInfo}
                    >
                      <span className="text-base font-semibold">i</span>
                    </button>
                  </div>
                </div>
                <Slider
                  value={strategicSlider}
                  onValueChange={setStrategicSlider}
                  min={0}
                  max={1}
                  step={0.01}
                  className="[&_.relative.h-2]:border-2 [&_.relative.h-2]:border-gray-300 [&_.relative.h-2]:rounded-full [&_.absolute.h-full]:!bg-primary [&_[role=slider]]:!bg-primary [&_[role=slider]]:!border-primary"
                />
              </div>
              
              {/* Disclaimer */}
              <p className={`font-medium text-primary mb-0 pt-0 -mt-3 text-center ${lang === "fr" ? "text-[17px] whitespace-nowrap" : "text-lg sm:whitespace-nowrap"}`}>
                {t.disclaimer}
              </p>
              </div>

              {/* Info overlay - covers whole scoring box when i is clicked */}
              {infoPopoverOpen && (
                <div className="absolute inset-0 z-10 rounded-3xl bg-background border-2 border-gray-300 overflow-auto flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.06)] pl-6 pr-6 pt-6 pb-6 md:pl-8 md:pr-8 md:pt-6 md:pb-6">
                  <button
                    type="button"
                    onClick={() => setInfoPopoverOpen(false)}
                    className="self-end mb-4 p-1 text-primary hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-opacity"
                    aria-label={t.close}
                  >
                    <span className="text-4xl font-medium leading-none">×</span>
                  </button>
                  <div className="space-y-5 flex-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                    <p className="text-2xl font-semibold text-gray-900">
                      {t.howSliderWorks}
                    </p>
                    <ul className="list-disc list-outside space-y-3 text-lg text-gray-700 ml-5 pl-0">
                      <li className="pl-1">{t.sliderBullet1}</li>
                      <li className="pl-1">{t.sliderBullet2}</li>
                      <li className="pl-1">{t.sliderBullet3}</li>
                      <li className="pl-1">{t.sliderBullet4}</li>
                      <li className="pl-1">{t.sliderBullet5}</li>
                      <li className="pl-1">{t.sliderBullet6}</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-6 lg:sticky lg:top-8 h-full flex flex-col min-h-0">
            {districtName && (
              <p className="text-center text-lg md:text-xl text-black mb-0 -mt-2">
                {t.districtOf} <span className="font-semibold">{districtName}</span>
              </p>
            )}
            {/* Show results if postal code is valid and district probabilities are loaded and sliders are used */}
            {shouldShowResults ? (
              <div className="flex flex-col flex-1 min-h-0">
                {partyEntriesWithCandidates.length === 0 ? (
                  <div className="bg-transparent border-2 border-gray-300 rounded-2xl pl-8 pr-8 pt-8 pb-8 md:pl-10 md:pr-10 md:pt-10 md:pb-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                    <p className="text-xl text-gray-700">
                      {lang === "fr" ? "Aucun candidat dans notre base de données pour cette circonscription." : "No candidates in our dataset for this district."}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="relative bg-gradient-to-br from-red-50 to-red-100 border-4 border-red-600 rounded-3xl pl-8 pr-8 pt-8 pb-8 md:pl-10 md:pr-10 md:pt-10 md:pb-10 shadow-[0_8px_40px_rgba(0,0,0,0.08)] mb-8 shrink-0">
                      <div className={`absolute right-6 -rotate-6 border-2 border-red-600 bg-white/90 px-4 py-2 rounded shadow-sm ${lang === "fr" ? "top-8" : "top-8"}`} style={{ fontFamily: 'var(--font-display)' }}>
                        <span className={`font-bold text-red-600 ${lang === "fr" ? "text-xl" : "text-2xl"}`}>{t.yourTopMatch}</span>
                      </div>
                      <p className={`text-6xl font-bold ${topParty.color} mb-2`}>
                        {t.partyNames[topPartyIndex]}
                      </p>
                      <p className="text-4xl font-bold text-gray-900 mb-3">
                        {getCandidateName(topPartyIndex)}
                      </p>
                    </div>

                    {/* All Parties - only parties with a candidate in this district when district data exists */}
                    <div className="flex flex-col flex-1 min-h-0 space-y-3">
                      <h3 className="font-bold text-xl mb-4 shrink-0">{t.allParties}</h3>
                      {partyEntriesWithCandidates.map(({ party, index: idx }) => (
                        <div 
                          key={party.name}
                          className={`pl-5 pr-5 pt-4 pb-4 md:pl-6 md:pr-6 md:pt-5 md:pb-5 border-2 rounded-2xl transition-colors ${
                            idx === topPartyIndex 
                              ? 'border-red-600 bg-red-50 ring-2 ring-red-600/20' 
                              : 'border-gray-300 bg-transparent shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
                          }`}
                        >
                          <div className="flex flex-row justify-between items-center gap-4">
                            <p className={`text-xl font-bold ${party.color}`}>{t.partyNames[idx]}</p>
                            <p className="text-base font-medium text-gray-900">{getCandidateName(idx)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
            {loadingProbabilities ? (
              <div className="bg-transparent border-2 border-gray-300 rounded-2xl pl-8 pr-8 pt-8 pb-8 md:pl-10 md:pr-10 md:pt-10 md:pb-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <p className="text-xl text-gray-700">
                  {t.findingCandidate}
                </p>
              </div>
            ) : !postalCodeValid ? (
              <div className="bg-transparent border-2 border-gray-300 rounded-2xl pl-8 pr-8 pt-8 pb-8 md:pl-10 md:pr-10 md:pt-10 md:pb-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <p className="text-xl text-black">
                  {t.enterPostalCode}
                </p>
              </div>
            ) : allZero ? (
              <div className="bg-transparent border-2 border-gray-300 rounded-2xl pl-8 pr-8 pt-8 pb-8 md:pl-10 md:pr-10 md:pt-10 md:pb-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <p className="text-xl text-gray-700">
                  {t.useOneSlider}
                </p>
              </div>
            ) : (
              <div className="bg-transparent border-2 border-gray-300 rounded-2xl pl-8 pr-8 pt-8 pb-8 md:pl-10 md:pr-10 md:pt-10 md:pb-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <p className="text-xl text-black">
                  {t.enterPostalCode}
                </p>
              </div>
            )}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default ActiVote;

