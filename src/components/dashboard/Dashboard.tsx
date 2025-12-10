import { useState } from 'react';
import { motion } from 'framer-motion';
import { NodeGraph } from './NodeGraph';
import { ConversationPanel } from './ConversationPanel';
import { MoodBubbles } from './MoodBubbles';
import { PersonaCard } from '../persona/PersonaCard';
import { usePersonaStore } from '@/stores/persona-store';
import { Button } from '@/components/ui/button';
import { Plus, Users, Zap } from 'lucide-react';

interface DashboardProps {
  onCreatePersona: () => void;
}

export function Dashboard({ onCreatePersona }: DashboardProps) {
  const {
    personas,
    relationships,
    selectedPersonas,
    activeConversation,
    isSimulating,
    selectPersona,
    deselectPersona,
    removePersona,
  } = usePersonaStore();

  const handleNodeClick = (personaId: string) => {
    if (selectedPersonas.includes(personaId)) {
      deselectPersona(personaId);
    } else {
      selectPersona(personaId);
    }
  };

  const handleDeletePersona = async (id: string) => {
    await removePersona(id);
  };

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="glass-card p-4 hud-corners">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <p className="text-2xl font-display neon-text">{personas.length}</p>
              <p className="text-xs text-muted-foreground">Personas</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 hud-corners">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-secondary" />
            <div>
              <p className="text-2xl font-display neon-text-secondary">{selectedPersonas.length}</p>
              <p className="text-xs text-muted-foreground">Selected</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 hud-corners">
          <div className="flex items-center gap-3">
            <span className="text-xl">💬</span>
            <div>
              <p className="text-2xl font-display">{activeConversation?.messages.length || 0}</p>
              <p className="text-xs text-muted-foreground">Messages</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 hud-corners">
          <div className="flex items-center gap-3">
            <span className="text-xl">{isSimulating ? '🔴' : '⚪'}</span>
            <div>
              <p className="text-sm font-display">{isSimulating ? 'ACTIVE' : 'IDLE'}</p>
              <p className="text-xs text-muted-foreground">Simulation</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Node Graph - Takes 2 columns on large screens */}
        <motion.div
          className="lg:col-span-2 glass-card overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {personas.length > 0 ? (
            <NodeGraph
              personas={personas}
              relationships={relationships}
              activePersonas={selectedPersonas}
              onNodeClick={handleNodeClick}
            />
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center">
              <span className="text-6xl mb-4">🌌</span>
              <h3 className="font-display text-xl mb-2">No Personas Yet</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Create your first AI persona to begin the simulation
              </p>
              <Button onClick={onCreatePersona} className="holo-button">
                <Plus className="w-4 h-4 mr-2" />
                Create Persona
              </Button>
            </div>
          )}
        </motion.div>

        {/* Conversation Panel */}
        <motion.div
          className="lg:row-span-2 min-h-[500px]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ConversationPanel
            messages={activeConversation?.messages || []}
            personas={personas}
            isActive={isSimulating}
          />
        </motion.div>

        {/* Mood Bubbles */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MoodBubbles personas={personas} />
        </motion.div>
      </div>

      {/* Persona List */}
      {personas.length > 0 && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">All Personas</h2>
            <Button
              onClick={onCreatePersona}
              variant="outline"
              size="sm"
              className="border-primary/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {personas.map((persona, index) => (
              <motion.div
                key={persona.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PersonaCard
                  persona={persona}
                  isSelected={selectedPersonas.includes(persona.id)}
                  onClick={() => handleNodeClick(persona.id)}
                  onDelete={() => handleDeletePersona(persona.id)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
