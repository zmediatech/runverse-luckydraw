import { useState, useEffect } from 'react';
import { LuckyDrawResponse, Participant, Prize } from '../types';
import { fetchLuckyDrawData, fetchParticipantDetails } from '../services/api';
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

  const getRarityForPosition = (position: string) => {
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

        // Fetch lucky draw data
        const drawData = await fetchLuckyDrawData(EVENT_ID);
        setLuckyDrawData(drawData);

        // Use participant data directly from API
        const participantDetails = drawData.participants.map(participant => ({
          id: participant.userId,
          name: participant.name,
          picture: participant.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.userId}&backgroundColor=b6e3f4,c0aede,d1d4f9`
        }));

        // Convert rewards to prizes format
        const convertedPrizes: Prize[] = drawData.rewards.map((reward, index) => ({
          id: index + 1,
          name: reward.title.toUpperCase(),
          value: `POSITION ${reward.position.toString()}`,
          icon: getIconForReward(reward.title),
          rarity: getRarityForPosition(reward.position.toString()),
          color: getColorForRarity(getRarityForPosition(reward.position.toString())),
          picture: reward.picture
        }));

        setPrizes(convertedPrizes);

        // Assign prizes to random participants for demonstration
        // In a real scenario, this would come from the API
        const shuffledParticipants = [...participantDetails].sort(() => Math.random() - 0.5);
        
        // Create winners array with assigned prizes
        const winnersWithPrizes = convertedPrizes.map((prize, index) => ({
          ...shuffledParticipants[index],
          position: parseInt(prize.value.split(' ')[1]) || index + 1, // Extract position number
          prize: prize
        })).sort((a, b) => (a.position || 0) - (b.position || 0));

        // Remaining participants without prizes
        const remainingParticipantsData = shuffledParticipants.slice(convertedPrizes.length).map((participant, index) => ({
          ...participant,
          position: convertedPrizes.length + index + 1
        }));

        setWinners(winnersWithPrizes);
        setRemainingParticipants(remainingParticipantsData);
        setParticipants([...winnersWithPrizes, ...remainingParticipantsData]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lucky draw data');
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
    participantCount: participants.length,
    totalEntries: luckyDrawData?.maxTotalEntries || participants.length,
    numWinners: luckyDrawData?.numWinners || 0
  };
};