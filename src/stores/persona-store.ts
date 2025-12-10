import { create } from 'zustand';
import type { Persona, Relationship, Conversation, Message, Theme, Scenario } from '@/types/persona';
import * as db from '@/lib/indexeddb';

interface PersonaState {
  personas: Persona[];
  relationships: Relationship[];
  conversations: Conversation[];
  activeConversation: Conversation | null;
  selectedPersonas: string[];
  currentScenario: Scenario | null;
  theme: Theme;
  isSimulating: boolean;
  isLoading: boolean;
  
  // Actions
  loadData: () => Promise<void>;
  addPersona: (persona: Persona) => Promise<void>;
  updatePersona: (persona: Persona) => Promise<void>;
  removePersona: (id: string) => Promise<void>;
  selectPersona: (id: string) => void;
  deselectPersona: (id: string) => void;
  clearSelection: () => void;
  
  updateRelationship: (relationship: Relationship) => Promise<void>;
  
  startConversation: (participants: string[], scenario?: Scenario) => void;
  addMessage: (message: Message) => void;
  endConversation: () => Promise<void>;
  
  setScenario: (scenario: Scenario | null) => void;
  setTheme: (theme: Theme) => void;
  setSimulating: (simulating: boolean) => void;
}

export const usePersonaStore = create<PersonaState>((set, get) => ({
  personas: [],
  relationships: [],
  conversations: [],
  activeConversation: null,
  selectedPersonas: [],
  currentScenario: null,
  theme: 'dark',
  isSimulating: false,
  isLoading: true,
  
  loadData: async () => {
    set({ isLoading: true });
    try {
      const [personas, relationships, conversations] = await Promise.all([
        db.getAllPersonas(),
        db.getAllRelationships(),
        db.getAllConversations()
      ]);
      
      const settings = await db.getSetting('preferences');
      
      set({
        personas: personas || [],
        relationships: relationships || [],
        conversations: conversations || [],
        theme: settings?.theme || 'dark',
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      set({ isLoading: false });
    }
  },
  
  addPersona: async (persona) => {
    await db.savePersona(persona);
    set(state => ({
      personas: [...state.personas, persona]
    }));
  },
  
  updatePersona: async (persona) => {
    await db.savePersona(persona);
    set(state => ({
      personas: state.personas.map(p => p.id === persona.id ? persona : p)
    }));
  },
  
  removePersona: async (id) => {
    await db.deletePersona(id);
    set(state => ({
      personas: state.personas.filter(p => p.id !== id),
      selectedPersonas: state.selectedPersonas.filter(pid => pid !== id)
    }));
  },
  
  selectPersona: (id) => {
    set(state => {
      if (state.selectedPersonas.includes(id)) return state;
      return { selectedPersonas: [...state.selectedPersonas, id] };
    });
  },
  
  deselectPersona: (id) => {
    set(state => ({
      selectedPersonas: state.selectedPersonas.filter(pid => pid !== id)
    }));
  },
  
  clearSelection: () => {
    set({ selectedPersonas: [] });
  },
  
  updateRelationship: async (relationship) => {
    await db.saveRelationship(relationship);
    set(state => {
      const exists = state.relationships.find(
        r => r.personaA === relationship.personaA && r.personaB === relationship.personaB
      );
      if (exists) {
        return {
          relationships: state.relationships.map(r =>
            r.personaA === relationship.personaA && r.personaB === relationship.personaB
              ? relationship
              : r
          )
        };
      }
      return { relationships: [...state.relationships, relationship] };
    });
  },
  
  startConversation: (participants, scenario) => {
    const conversation: Conversation = {
      id: `conv-${Date.now()}`,
      participants,
      messages: [],
      scenario: scenario?.id || null,
      startedAt: Date.now()
    };
    set({
      activeConversation: conversation,
      currentScenario: scenario || null,
      isSimulating: true
    });
  },
  
  addMessage: (message) => {
    set(state => {
      if (!state.activeConversation) return state;
      return {
        activeConversation: {
          ...state.activeConversation,
          messages: [...state.activeConversation.messages, message]
        }
      };
    });
  },
  
  endConversation: async () => {
    const { activeConversation } = get();
    if (activeConversation && activeConversation.messages.length > 0) {
      await db.saveConversation(activeConversation);
      set(state => ({
        conversations: [...state.conversations, activeConversation],
        activeConversation: null,
        isSimulating: false,
        currentScenario: null
      }));
    } else {
      set({
        activeConversation: null,
        isSimulating: false,
        currentScenario: null
      });
    }
  },
  
  setScenario: (scenario) => {
    set({ currentScenario: scenario });
  },
  
  setTheme: async (theme) => {
    await db.saveSetting('preferences', { theme });
    set({ theme });
    
    // Apply theme class to document
    document.documentElement.classList.remove('theme-dark', 'theme-neon', 'theme-light', 'theme-cyberpunk');
    if (theme !== 'dark') {
      document.documentElement.classList.add(`theme-${theme}`);
    }
  },
  
  setSimulating: (simulating) => {
    set({ isSimulating: simulating });
  }
}));
