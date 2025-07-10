import { LuckyDrawResponse } from '../types';

const API_BASE_URL = '/api';

export const fetchLuckyDrawData = async (eventId: string): Promise<LuckyDrawResponse> => {
  try {
    console.log(`Fetching lucky draw data for event: ${eventId}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(`${API_BASE_URL}/luckydraws/get/${eventId}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Lucky draw data received successfully:', data);
    
    // Validate the response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format received from API');
    }
    
    // Ensure required fields exist with defaults
    const validatedData: LuckyDrawResponse = {
      id: data.id || '',
      eventId: data.eventId || eventId,
      drawDate: data.drawDate || { _seconds: Date.now() / 1000, _nanoseconds: 0 },
      maxEntries: data.maxEntries || 0,
      maxTotalEntries: data.maxTotalEntries || 0,
      entryPriceCurrency: data.entryPriceCurrency || '',
      entryPriceTokens: data.entryPriceTokens || 0,
      numWinners: data.numWinners || 0,
      active: data.active !== undefined ? data.active : true,
      createdAt: data.createdAt || { _seconds: Date.now() / 1000, _nanoseconds: 0 },
      updatedAt: data.updatedAt || { _seconds: Date.now() / 1000, _nanoseconds: 0 },
      rewards: Array.isArray(data.rewards) ? data.rewards : [],
      participants: Array.isArray(data.participants) ? data.participants : []
    };
    
    return validatedData;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection and try again');
      }
      console.error('Error fetching lucky draw data:', error.message);
      throw new Error(`Failed to fetch lucky draw data: ${error.message}`);
    }
    
    console.error('Unknown error fetching lucky draw data:', error);
    throw new Error('An unexpected error occurred while fetching data');
  }
};