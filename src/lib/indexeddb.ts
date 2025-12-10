import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Persona, Relationship, Conversation, Message } from '@/types/persona';

interface PersonaSimDB extends DBSchema {
  personas: {
    key: string;
    value: Persona;
    indexes: { 'by-created': number };
  };
  relationships: {
    key: string;
    value: Relationship;
    indexes: { 'by-personas': string };
  };
  conversations: {
    key: string;
    value: Conversation;
    indexes: { 'by-started': number };
  };
  settings: {
    key: string;
    value: { theme: string; soundEnabled: boolean };
  };
}

let db: IDBPDatabase<PersonaSimDB> | null = null;

export async function initDB(): Promise<IDBPDatabase<PersonaSimDB>> {
  if (db) return db;
  
  db = await openDB<PersonaSimDB>('persona-sim-db', 1, {
    upgrade(db) {
      // Personas store
      const personaStore = db.createObjectStore('personas', { keyPath: 'id' });
      personaStore.createIndex('by-created', 'createdAt');
      
      // Relationships store
      const relationshipStore = db.createObjectStore('relationships', { keyPath: ['personaA', 'personaB'] });
      relationshipStore.createIndex('by-personas', 'personaA');
      
      // Conversations store
      const conversationStore = db.createObjectStore('conversations', { keyPath: 'id' });
      conversationStore.createIndex('by-started', 'startedAt');
      
      // Settings store
      db.createObjectStore('settings', { keyPath: 'key' });
    },
  });
  
  return db;
}

// Persona operations
export async function savePersona(persona: Persona): Promise<void> {
  const database = await initDB();
  await database.put('personas', persona);
}

export async function getPersona(id: string): Promise<Persona | undefined> {
  const database = await initDB();
  return database.get('personas', id);
}

export async function getAllPersonas(): Promise<Persona[]> {
  const database = await initDB();
  return database.getAllFromIndex('personas', 'by-created');
}

export async function deletePersona(id: string): Promise<void> {
  const database = await initDB();
  await database.delete('personas', id);
}

// Relationship operations
export async function saveRelationship(relationship: Relationship): Promise<void> {
  const database = await initDB();
  await database.put('relationships', relationship);
}

export async function getRelationship(personaA: string, personaB: string): Promise<Relationship | undefined> {
  const database = await initDB();
  const all = await database.getAll('relationships');
  return all.find(r => 
    (r.personaA === personaA && r.personaB === personaB) ||
    (r.personaA === personaB && r.personaB === personaA)
  );
}

export async function getAllRelationships(): Promise<Relationship[]> {
  const database = await initDB();
  return database.getAll('relationships');
}

// Conversation operations
export async function saveConversation(conversation: Conversation): Promise<void> {
  const database = await initDB();
  await database.put('conversations', conversation);
}

export async function getConversation(id: string): Promise<Conversation | undefined> {
  const database = await initDB();
  return database.get('conversations', id);
}

export async function getAllConversations(): Promise<Conversation[]> {
  const database = await initDB();
  return database.getAllFromIndex('conversations', 'by-started');
}

// Settings
export async function saveSetting(key: string, value: any): Promise<void> {
  const database = await initDB();
  await database.put('settings', { key, ...value });
}

export async function getSetting(key: string): Promise<any> {
  const database = await initDB();
  return database.get('settings', key);
}
