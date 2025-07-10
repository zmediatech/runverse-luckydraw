import { LuckyDrawResponse } from '../types';

const API_BASE_URL = '/api';

// Mock data for fallback
const mockLuckyDrawData: LuckyDrawResponse = {
  id: 'mock-event-123',
  title: 'Demo Lucky Draw Event',
  description: 'This is a demo event with mock data',
  prizes: [
    {
      id: 'prize-1',
      name: 'Grand Prize - Gaming Setup',
      description: 'Complete gaming setup with monitor, keyboard, and mouse',
      value: '$2,500',
      quantity: 1,
      image: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'prize-2',
      name: 'Second Prize - Wireless Headphones',
      description: 'Premium noise-cancelling wireless headphones',
      value: '$300',
      quantity: 2,
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'prize-3',
      name: 'Third Prize - Gift Card',
      description: 'Amazon gift card',
      value: '$100',
      quantity: 5,
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ],
  participants: [
    'user-001', 'user-002', 'user-003', 'user-004', 'user-005',
    'user-006', 'user-007', 'user-008', 'user-009', 'user-010',
    'user-011', 'user-012', 'user-013', 'user-014', 'user-015'
  ],
  status: 'active',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const mockParticipants = [
  { id: 'user-001', name: 'Alex Johnson', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-001&backgroundColor=b6e3f4' },
  { id: 'user-002', name: 'Sarah Chen', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-002&backgroundColor=c0aede' },
  { id: 'user-003', name: 'Mike Rodriguez', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-003&backgroundColor=d1d4f9' },
  { id: 'user-004', name: 'Emma Wilson', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-004&backgroundColor=b6e3f4' },
  { id: 'user-005', name: 'David Kim', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-005&backgroundColor=c0aede' },
  { id: 'user-006', name: 'Lisa Thompson', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-006&backgroundColor=d1d4f9' },
  { id: 'user-007', name: 'James Brown', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-007&backgroundColor=b6e3f4' },
  { id: 'user-008', name: 'Maria Garcia', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-008&backgroundColor=c0aede' },
  { id: 'user-009', name: 'Ryan Lee', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-009&backgroundColor=d1d4f9' },
  { id: 'user-010', name: 'Anna Davis', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-010&backgroundColor=b6e3f4' },
  { id: 'user-011', name: 'Chris Miller', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-011&backgroundColor=c0aede' },
  { id: 'user-012', name: 'Jessica Taylor', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-012&backgroundColor=d1d4f9' },
  { id: 'user-013', name: 'Kevin Wang', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-013&backgroundColor=b6e3f4' },
  { id: 'user-014', name: 'Sophie Anderson', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-014&backgroundColor=c0aede' },
  { id: 'user-015', name: 'Daniel Martinez', picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-015&backgroundColor=d1d4f9' }
];

export const fetchLuckyDrawData = async (eventId: string): Promise<LuckyDrawResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/luckydraws/get/${eventId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock data:', error);
    // Return mock data when API fails
    return {
      ...mockLuckyDrawData,
      id: eventId // Use the requested eventId
    };
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
      } catch (error) {
        console.warn(`Failed to fetch details for participant ${id}:`, error);
        // Fallback for individual participant
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
    console.warn('API unavailable for participants, using mock data:', error);
    // Return mock participants that match the requested IDs
    return participantIds.map((id) => {
      const mockParticipant = mockParticipants.find(p => p.id === id);
      if (mockParticipant) {
        return mockParticipant;
      }
      return {
        id,
        name: `Player_${id.slice(-4)}`,
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}&backgroundColor=b6e3f4,c0aede,d1d4f9`
      };
    });
  }
};