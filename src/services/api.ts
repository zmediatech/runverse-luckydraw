import { LuckyDrawResponse } from '../types';

const API_BASE_URL = '/api';

// Mock data for fallback when API is unavailable
const mockLuckyDrawData: LuckyDrawResponse = {
  id: 'KIiz5bZEVIEDROIskpKv',
  name: 'Demo Lucky Draw Event',
  description: 'A demonstration lucky draw with sample participants and prizes',
  maxTotalEntries: 100,
  numWinners: 5,
  participants: [
    {
      userId: 'user_001',
      name: 'Alex Johnson',
      picture: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      userId: 'user_002',
      name: 'Sarah Chen',
      picture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      userId: 'user_003',
      name: 'Michael Rodriguez',
      picture: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      userId: 'user_004',
      name: 'Emily Davis',
      picture: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      userId: 'user_005',
      name: 'David Kim',
      picture: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      userId: 'user_006',
      name: 'Jessica Wilson',
      picture: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      userId: 'user_007',
      name: 'Ryan Thompson',
      picture: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      userId: 'user_008',
      name: 'Amanda Garcia',
      picture: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      userId: 'user_009',
      name: 'James Brown',
      picture: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      userId: 'user_010',
      name: 'Lisa Martinez',
      picture: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      userId: 'user_011',
      name: 'Kevin Lee',
      picture: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      userId: 'user_012',
      name: 'Rachel Taylor',
      picture: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      userId: 'user_013',
      name: 'Daniel Anderson',
      picture: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      userId: 'user_014',
      name: 'Sophia White',
      picture: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      userId: 'user_015',
      name: 'Christopher Moore',
      picture: 'https://images.pexels.com/photos/1212985/pexels-photo-1212985.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    }
  ],
  rewards: [
    {
      title: 'Golden Crown Trophy',
      position: '1',
      picture: 'https://images.pexels.com/photos/1405963/pexels-photo-1405963.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1'
    },
    {
      title: 'Silver Star Medal',
      position: '2',
      picture: 'https://images.pexels.com/photos/1405964/pexels-photo-1405964.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1'
    },
    {
      title: 'Bronze Achievement Badge',
      position: '3',
      picture: 'https://images.pexels.com/photos/1405965/pexels-photo-1405965.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1'
    },
    {
      title: 'Premium Gift Box',
      position: '4',
      picture: 'https://images.pexels.com/photos/264985/pexels-photo-264985.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1'
    },
    {
      title: 'Special Recognition Award',
      position: '5',
      picture: 'https://images.pexels.com/photos/1405966/pexels-photo-1405966.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1'
    }
  ]
};

export const fetchLuckyDrawData = async (eventId: string): Promise<LuckyDrawResponse> => {
  try {
    // First, try to fetch from the actual API
    const response = await fetch(`${API_BASE_URL}/luckydraws/get/${eventId}`, {
      timeout: 5000 // 5 second timeout
    } as RequestInit);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock data:', error);
    
    // Return mock data as fallback
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        resolve(mockLuckyDrawData);
      }, 1000);
    });
  }
};