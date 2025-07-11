import { LuckyDrawResponse } from '../types';

const API_BASE_URL = '/api';

// Mock data for fallback when API is unavailable
const createMockLuckyDrawData = (eventId: string): LuckyDrawResponse => {
  const mockParticipants = Array.from({ length: 25 }, (_, i) => ({
    userId: `user-${i + 1}`,
    name: `Player ${i + 1}`,
    picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=user-${i + 1}&backgroundColor=b6e3f4,c0aede,d1d4f9`
  }));

  const mockRewards = [
    { position: 1, title: 'Golden Crown', picture: null },
    { position: 2, title: 'Silver Trophy', picture: null },
    { position: 3, title: 'Bronze Star', picture: null },
    { position: 4, title: 'Premium Watch', picture: null },
    { position: 5, title: 'Designer Shirt', picture: null }
  ];

  return {
    id: `mock-${eventId}`,
    eventId,
    drawDate: { _seconds: Date.now() / 1000, _nanoseconds: 0 },
    maxEntries: 5,
    maxTotalEntries: 100,
    entryPriceCurrency: 'USD',
    entryPriceTokens: 10,
    numWinners: 5,
    active: true,
    createdAt: { _seconds: Date.now() / 1000, _nanoseconds: 0 },
    updatedAt: { _seconds: Date.now() / 1000, _nanoseconds: 0 },
    rewards: mockRewards,
    participants: mockParticipants
  };
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchLuckyDrawData = async (eventId: string): Promise<LuckyDrawResponse> => {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}: Fetching lucky draw data for event: ${eventId}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_BASE_URL}/luckydraws/get/${eventId}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
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
      lastError = error instanceof Error ? error : new Error('Unknown error occurred');
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.warn(`Attempt ${attempt}: Request timeout`);
        } else {
          console.warn(`Attempt ${attempt}: ${error.message}`);
        }
      }
      
      // If this isn't the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const waitTime = attempt * 1000; // Progressive delay: 1s, 2s, 3s
        console.log(`Waiting ${waitTime}ms before retry...`);
        await delay(waitTime);
      }
    }
  }
  
  // All attempts failed, use mock data as fallback
  console.warn('All API attempts failed, using mock data as fallback');
  console.warn('Last error:', lastError?.message);
  
  return createMockLuckyDrawData(eventId);
};

export const submitWinners = async (eventId: string, winners: Array<{uid: string, reward: string, position: string}>): Promise<void> => {
  const maxRetries = 3;
  let lastError: Error | null = null;

  const payload = {
    eventId,
    winners
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}: Submitting winners data for event: ${eventId}`, payload);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(`${API_BASE_URL}/luckydraws/draw`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(payload)
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Winners data submitted successfully:', result);
      return;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error occurred');
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.warn(`Attempt ${attempt}: Request timeout while submitting winners`);
        } else {
          console.warn(`Attempt ${attempt}: ${error.message}`);
        }
      }
      
      // If this isn't the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const waitTime = attempt * 1000; // Progressive delay: 1s, 2s, 3s
        console.log(`Waiting ${waitTime}ms before retry...`);
        await delay(waitTime);
      }
    }
  }
  
  // All attempts failed
  console.error('Failed to submit winners data after all attempts:', lastError?.message);
  throw lastError || new Error('Failed to submit winners data');
};