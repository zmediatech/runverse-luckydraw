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