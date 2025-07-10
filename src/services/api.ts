import { LuckyDrawResponse, LuckyDrawParticipant } from '../types';

const API_BASE_URL = '/api';

export const fetchLuckyDrawData = async (eventId: string): Promise<LuckyDrawResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/luckydraws/get/${eventId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Lucky draw data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching lucky draw data:', error);
    throw error;
  }
};

export const fetchParticipantDetails = async (participants: LuckyDrawParticipant[]) => {
  try {
    // Transform API participant data to our format
    return participants.map(participant => ({
      id: participant.userId,
      name: participant.name,
      picture: participant.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.userId}&backgroundColor=b6e3f4,c0aede,d1d4f9`
    }));
  } catch (error) {
    console.error('Error processing participant details:', error);
    throw error;
  }
};

// Legacy function for backward compatibility (if needed)
export const fetchParticipantDetailsByIds = async (participantIds: string[]) => {
  try {
    // Fetch details for each participant by ID
    const participantPromises = participantIds.map(async (id) => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
      if (response.ok) {
        const userData = await response.json();
        return {
          id,
          name: userData.displayName || userData.name || `Player_${id.slice(-4)}`,
          picture: userData.photoURL || userData.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}&backgroundColor=b6e3f4,c0aede,d1d4f9`
        };
      } else {
        // Fallback if user API fails
        return {
          id,
          name: `Player_${id.slice(-4)}`,
          picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}&backgroundColor=b6e3f4,c0aede,d1d4f9`
        };
      }
    });

    const participants = await Promise.all(participantPromises);
    return participants;
  } catch (error) {
    console.error('Error fetching participant details by IDs:', error);
    // Fallback for individual participants
    return participantIds.map((id) => {
      return {
        id,
        name: `Player_${id.slice(-4)}`,
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}&backgroundColor=b6e3f4,c0aede,d1d4f9`
      };
    });
  }
}