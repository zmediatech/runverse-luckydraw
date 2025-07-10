import { LuckyDrawResponse } from '../types';

const API_BASE_URL = '/api';

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

export const fetchParticipantDetails = async (participantIds: string[]) => {
  try {
    // Fetch details for each participant
    const participantPromises = participantIds.map(async (id) => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`);
        if (response.ok) {
          const userData = await response.json();
          return {
            id,
            name: userData.displayName || userData.name || `Player_${String(id).slice(-4)}`,
            picture: userData.photoURL || userData.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}&backgroundColor=b6e3f4,c0aede,d1d4f9`
          };
        } else {
          // Fallback if user API fails
          return {
            id,
            name: `Player_${String(id).slice(-4)}`,
            picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}&backgroundColor=b6e3f4,c0aede,d1d4f9`
          };
        }
      } catch (error) {
        console.warn(`Failed to fetch details for participant ${id}:`, error);
        // Fallback for individual participant
        return {
          id,
          name: `Player_${String(id).slice(-4)}`,
          picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}&backgroundColor=b6e3f4,c0aede,d1d4f9`
        };
      }
    });

    const participants = await Promise.all(participantPromises);
    return participants;
  } catch (error) {
    console.error('Error fetching participant details:', error);
    // Complete fallback
    return participantIds.map((id) => ({
      id,
      name: `Player_${String(id).slice(-4)}`,
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}&backgroundColor=b6e3f4,c0aede,d1d4f9`
    }));
  }
};