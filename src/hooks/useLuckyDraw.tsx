import { useState, useEffect } from 'react';
import { LuckyDrawResponse, Participant, Prize } from '../types';
import { fetchLuckyDrawData } from '../services/api';
import { Trophy, Crown, Star, Gift, Gem, Award, Watch, Shirt } from 'lucide-react';

const EVENT_ID = 'KIiz5bZEVIEDROIskpKv';

export const useLuckyDraw = () => {
  const [luckyDrawData, setLuckyDrawData] = useState<LuckyDrawResponse | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [remainingParticipants, setRemainingParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  const getIconForReward = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('watch')) return <Watch className="w-16 h-16" />;
    if (lowerTitle.includes('cloth') || lowerTitle.includes('shirt')) return <Shirt className="w-16 h-16" />;
    if (lowerTitle.includes('crown')) return <Crown className="w-16 h-16" />;
    if (lowerTitle.includes('trophy')) return <Trophy className="w-16 h-16" />;
    if (lowerTitle.includes('star')) return <Star className="w-16 h-16" />;
    if (lowerTitle.includes('gem') || lowerTitle.includes('diamond')) return <Gem className="w-16 h-16" />;
    return <Gift className="w-16 h-16" />;
  };

  const getRarityForPosition = (position: string | number) => {
    const pos = position.toString();
    switch (pos) {
      case '1': return 'legendary' as const;
      case '2': return 'epic' as const;
      case '3': return 'rare' as const;
      default: return 'common' as const;
    }
  };

  const getColorForRarity = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400';
      case 'epic': return 'text-purple-400';
      case 'rare': return 'text-cyan-400';
      default: return 'text-gray-300';
    }
  };

  useEffect(() => {
    const loadLuckyDrawData = async () => {
      try {
        setLoading(true);
        setError(null);
        setUsingFallbackData(false);

        console.log('Fetching lucky draw data...');
        
        // Fetch lucky draw data (will use fallback if API fails)
        const drawData = await fetchLuckyDrawData(EVENT_ID);
        console.log('Draw data received:', drawData);
        
        if (!drawData) {
          throw new Error('No data received');
        }

        // Check if we're using mock data (indicated by mock- prefix in id)
        if (drawData.id.startsWith('mock-')) {
          setUsingFallbackData(true);
          console.log('Using fallback mock data due to API unavailability');
        }

        setLuckyDrawData(drawData);

        // Ensure we have participants array
        if (!drawData.participants || !Array.isArray(drawData.participants)) {
          console.warn('Invalid participants data, using empty array');
          setParticipants([]);
          setPrizes([]);
          setWinners([]);
          setRemainingParticipants([]);
          return;
        }

        // Use participant data directly from API
        const participantDetails = drawData.participants.map((participant, index) => ({
          id: participant.userId || `participant-${index}`,
          name: participant.name || `Player ${index + 1}`,
          picture: participant.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.userId || index}&backgroundColor=b6e3f4,c0aede,d1d4f9`
        }));

        console.log('Processed participants:', participantDetails);

        // Ensure we have rewards array
        if (!drawData.rewards || !Array.isArray(drawData.rewards)) {
          console.warn('No rewards data, using default prizes');
          setPrizes([]);
          setParticipants(participantDetails);
          setWinners([]);
          setRemainingParticipants(participantDetails);
        } else {
          // Convert rewards to prizes format
          const convertedPrizes: Prize[] = drawData.rewards.map((reward, index) => ({
            id: index + 1,
            name: reward.title?.toUpperCase() || `PRIZE ${index + 1}`,
            value: `POSITION ${reward.position?.toString() || (index + 1)}`,
            icon: getIconForReward(reward.title || 'gift'),
            rarity: getRarityForPosition(reward.position?.toString() || (index + 1)),
            color: getColorForRarity(getRarityForPosition(reward.position?.toString() || (index + 1))),
            picture: reward.picture
          }));

          setPrizes(convertedPrizes);
          console.log('Converted prizes:', convertedPrizes);

          // Assign prizes to random participants for demonstration
          const shuffledParticipants = [...participantDetails].sort(() => Math.random() - 0.5);
          
          // Create winners array with assigned prizes
          const winnersWithPrizes = convertedPrizes.map((prize, index) => {
            const participant = shuffledParticipants[index];
            if (!participant) return null;
            
            return {
              ...participant,
              position: parseInt(prize.value.split(' ')[1]) || (index + 1),
              prize: prize
            };
          }).filter(Boolean).sort((a, b) => (a?.position || 0) - (b?.position || 0));

          // Remaining participants without prizes
          const remainingParticipantsData = shuffledParticipants.slice(convertedPrizes.length).map((participant, index) => ({
            ...participant,
            position: convertedPrizes.length + index + 1
          }));

          setWinners(winnersWithPrizes as Participant[]);
          setRemainingParticipants(remainingParticipantsData);
          setParticipants([...winnersWithPrizes as Participant[], ...remainingParticipantsData]);
        }

        console.log('Lucky draw data loaded successfully');
      } catch (err) {
        console.error('Error loading lucky draw data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load lucky draw data';
        
        // Only set error if we don't have fallback data
        if (!usingFallbackData) {
          setError(`Unable to connect to server. ${errorMessage}`);
        }
        
        // Set fallback data to prevent app crashes
        setParticipants([]);
        setPrizes([]);
        setWinners([]);
        setRemainingParticipants([]);
      } finally {
        setLoading(false);
      }
    };

    loadLuckyDrawData();
  }, []);

  return {
    luckyDrawData,
    participants,
    winners,
    remainingParticipants,
    prizes,
    loading,
    error,
    usingFallbackData,
    participantCount: participants.length,
    totalEntries: luckyDrawData?.maxTotalEntries || participants.length,
    numWinners: luckyDrawData?.numWinners || prizes.length
  };
};