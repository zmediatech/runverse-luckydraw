import { LuckyDrawResponse } from '../types';

const API_BASE_URL = 'https://runverse-backend.vercel.app/api';

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
    throw error;
  }
};

// Mock function to get participant details - replace with actual API when available
export const fetchParticipantDetails = async (participantIds: string[]) => {
  // This is a mock implementation - replace with actual API call
  return participantIds.map((id, index) => ({
    id,
    name: `Player_${id.slice(-4)}`,
    picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}&backgroundColor=b6e3f4,c0aede,d1d4f9`
  }));
};