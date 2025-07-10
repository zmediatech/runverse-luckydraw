import { LuckyDrawResponse } from '../types';

const API_BASE_URL = 'https://runverse-backend.vercel.app/api';

// Mock data fallback
const mockLuckyDrawData: LuckyDrawResponse = {
  participants: [
    'user123', 'user456', 'user789', 'user101', 'user202',
    'user303', 'user404', 'user505', 'user606', 'user707'
  ],
  rewards: [
    {
      title: 'Golden Crown',
      position: '1',
      picture: 'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'Silver Trophy',
      position: '2', 
      picture: 'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'Bronze Medal',
      position: '3',
      picture: 'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ],
  maxTotalEntries: 100,
  numWinners: 3
};

export const fetchLuckyDrawData = async (eventId: string): Promise<LuckyDrawResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/luckydraws/get/${eventId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching lucky draw data:', error);
    console.warn('Falling back to mock data due to API connectivity issues');
    // Return mock data as fallback
    return mockLuckyDrawData;
  }
};

export const fetchParticipantDetails = async (participantIds: string[]) => {
  // Mock implementation - replace with actual API call when backend is available
  return participantIds.map((id, index) => ({
    id,
    name: `Player_${id.slice(-4)}`,
    picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}&backgroundColor=b6e3f4,c0aede,d1d4f9`
  }));
};