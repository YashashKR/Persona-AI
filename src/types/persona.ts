export type Mood = 'happy' | 'excited' | 'calm' | 'curious' | 'frustrated' | 'sad' | 'angry' | 'neutral';

export type CommunicationStyle = 'formal' | 'casual' | 'analytical' | 'creative' | 'empathetic';

export interface PersonaTraits {
  creativity: number; // 0-100
  logic: number;
  empathy: number;
  curiosity: number;
  moodVolatility: number;
}

export interface Persona {
  id: string;
  name: string;
  avatar: string;
  traits: PersonaTraits;
  communicationStyle: CommunicationStyle;
  currentMood: Mood;
  moodHistory: { mood: Mood; timestamp: number }[];
  createdAt: number;
  color: string;
}

export interface Relationship {
  personaA: string;
  personaB: string;
  score: number; // -100 to 100
  interactions: number;
  lastInteraction: number;
}

export interface Message {
  id: string;
  personaId: string;
  content: string;
  mood: Mood;
  timestamp: number;
  sentiment: number; // -1 to 1
}

export interface Conversation {
  id: string;
  participants: string[];
  messages: Message[];
  scenario: string | null;
  startedAt: number;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  prompts: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'collaboration' | 'conflict' | 'creative' | 'adventure';
}

export type Theme = 'dark' | 'neon' | 'light' | 'cyberpunk';
