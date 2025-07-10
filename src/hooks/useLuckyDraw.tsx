import { useState, useEffect } from 'react';
import { LuckyDrawResponse, Participant, Prize } from '../types';
import { fetchLuckyDrawData, fetchParticipantDetails } from '../services/api';
import { Trophy, Crown, Star, Gift, Gem, Award, Watch, Shirt } from 'lucide-react';

const EVENT_ID = 'KIiz5bZEVIEDROIskpKv';

export const useLuckyDraw = () => {
  const [luckyDrawData, setLuckyDrawData] = useState<LuckyDrawResponse | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
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
    switch (position) {
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

        // Fetch participant details
        const participantDetails = await fetchParticipantDetails(drawData.participants);
        setParticipants(participantDetails);

        // Convert rewards to prizes format
        const convertedPrizes: Prize[] = drawData.rewards.map((reward, index) => ({
          id: index + 1,
          name: reward.title.toUpperCase(),
          value: `POSITION ${reward.position}`,
          icon: getIconForReward(reward.title),
          rarity: getRarityForPosition(reward.position),
          color: getColorForRarity(getRarityForPosition(reward.position)),
          picture: reward.picture
        }));

        setPrizes(convertedPrizes);
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
    prizes,
    loading,
    error,
    participantCount: participants.length,
    totalEntries: luckyDrawData?.maxTotalEntries || 0,
    numWinners: luckyDrawData?.numWinners || 0
  };
};