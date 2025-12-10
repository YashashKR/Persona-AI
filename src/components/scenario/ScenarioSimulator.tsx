import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScenarioCard } from './ScenarioCard';
import { scenarios } from '@/data/scenarios';
import { usePersonaStore } from '@/stores/persona-store';
import { generatePersonaResponse, calculateMoodShift, calculateRelationshipChange } from '@/lib/persona-logic';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, Square } from 'lucide-react';
import type { Scenario, Persona } from '@/types/persona';

export function ScenarioSimulator() {
  const {
    personas,
    selectedPersonas,
    activeConversation,
    isSimulating,
    currentScenario,
    startConversation,
    addMessage,
    endConversation,
    setSimulating,
    setScenario,
    updatePersona,
    updateRelationship,
  } = usePersonaStore();

  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const selectedPersonaObjects = personas.filter(p => selectedPersonas.includes(p.id));

  const handleSelectScenario = (scenario: Scenario) => {
    setScenario(scenario);
  };

  const handleStartSimulation = () => {
    if (!currentScenario || selectedPersonas.length < 2) return;
    
    startConversation(selectedPersonas, currentScenario);
    setCurrentPromptIndex(0);
    setIsPaused(false);
  };

  const handleStopSimulation = async () => {
    await endConversation();
    setCurrentPromptIndex(0);
    setIsPaused(false);
  };

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  const generateResponse = useCallback(async () => {
    if (!currentScenario || !activeConversation || isPaused) return;

    // Pick a random persona from participants to respond
    const responderIndex = activeConversation.messages.length % selectedPersonaObjects.length;
    const responder = selectedPersonaObjects[responderIndex];
    
    if (!responder) return;

    const message = generatePersonaResponse(
      responder,
      currentScenario.prompts[currentPromptIndex % currentScenario.prompts.length],
      selectedPersonaObjects.filter(p => p.id !== responder.id)
    );

    addMessage(message);

    // Update persona mood
    const newMood = calculateMoodShift(responder, message.sentiment);
    if (newMood !== responder.currentMood) {
      await updatePersona({
        ...responder,
        currentMood: newMood,
        moodHistory: [
          ...responder.moodHistory,
          { mood: newMood, timestamp: Date.now() }
        ]
      });
    }

    // Update relationships
    for (const other of selectedPersonaObjects) {
      if (other.id === responder.id) continue;
      
      const change = calculateRelationshipChange(responder, other, message.sentiment);
      await updateRelationship({
        personaA: responder.id,
        personaB: other.id,
        score: Math.max(-100, Math.min(100, change)),
        interactions: 1,
        lastInteraction: Date.now()
      });
    }

    // Advance prompt after all personas have responded
    if ((activeConversation.messages.length + 1) % selectedPersonaObjects.length === 0) {
      setCurrentPromptIndex(prev => prev + 1);
    }
  }, [currentScenario, activeConversation, isPaused, selectedPersonaObjects, currentPromptIndex, addMessage, updatePersona, updateRelationship]);

  // Auto-generate responses
  useEffect(() => {
    if (!isSimulating || isPaused || !currentScenario) return;

    const timer = setInterval(() => {
      generateResponse();
    }, 2000 + Math.random() * 1000); // 2-3 seconds between messages

    return () => clearInterval(timer);
  }, [isSimulating, isPaused, currentScenario, generateResponse]);

  const canStart = currentScenario && selectedPersonas.length >= 2;

  return (
    <div className="space-y-6">
      {/* Current Scenario Info */}
      <AnimatePresence mode="wait">
        {currentScenario && isSimulating && (
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{currentScenario.icon}</span>
                <div>
                  <h2 className="font-display text-xl">{currentScenario.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Prompt {(currentPromptIndex % currentScenario.prompts.length) + 1} of {currentScenario.prompts.length}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleTogglePause}
                  className="border-primary/30"
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => generateResponse()}
                  disabled={!isPaused}
                  className="border-primary/30"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={handleStopSimulation}
                >
                  <Square className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Current Prompt */}
            <motion.div
              key={currentPromptIndex}
              className="p-4 rounded-lg bg-muted/30 border border-primary/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-sm text-muted-foreground mb-1">Current Challenge:</p>
              <p className="font-display">
                "{currentScenario.prompts[currentPromptIndex % currentScenario.prompts.length]}"
              </p>
            </motion.div>

            {/* Participants */}
            <div className="flex items-center gap-2 mt-4">
              <span className="text-xs text-muted-foreground">Participants:</span>
              {selectedPersonaObjects.map((persona) => (
                <motion.span
                  key={persona.id}
                  className="text-lg"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random(),
                  }}
                >
                  {persona.avatar}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scenario Selection */}
      {!isSimulating && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Select Scenario</h2>
            {canStart && (
              <Button
                onClick={handleStartSimulation}
                className="holo-button"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Simulation
              </Button>
            )}
          </div>

          {selectedPersonas.length < 2 && (
            <motion.p
              className="text-sm text-neon-orange p-3 rounded-lg bg-neon-orange/10 border border-neon-orange/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ⚠️ Select at least 2 personas from the dashboard to start a scenario
            </motion.p>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {scenarios.map((scenario, index) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ScenarioCard
                  scenario={scenario}
                  isSelected={currentScenario?.id === scenario.id}
                  onClick={() => handleSelectScenario(scenario)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
