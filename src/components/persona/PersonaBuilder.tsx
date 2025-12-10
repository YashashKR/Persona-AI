import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TraitSlider } from './TraitSlider';
import { PersonaPreview } from './PersonaPreview';
import { avatarOptions, neonColors } from '@/data/avatars';
import { usePersonaStore } from '@/stores/persona-store';
import type { Persona, PersonaTraits, CommunicationStyle } from '@/types/persona';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Sparkles, Zap, Brain, Heart, Search, MessageSquare } from 'lucide-react';

const communicationStyles: { value: CommunicationStyle; label: string; icon: string }[] = [
  { value: 'formal', label: 'Formal', icon: '🎩' },
  { value: 'casual', label: 'Casual', icon: '😎' },
  { value: 'analytical', label: 'Analytical', icon: '🔬' },
  { value: 'creative', label: 'Creative', icon: '🎨' },
  { value: 'empathetic', label: 'Empathetic', icon: '💝' },
];

interface PersonaBuilderProps {
  onComplete?: () => void;
}

export function PersonaBuilder({ onComplete }: PersonaBuilderProps) {
  const addPersona = usePersonaStore((state) => state.addPersona);
  const [showBirthAnimation, setShowBirthAnimation] = useState(false);

  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [selectedColor, setSelectedColor] = useState(neonColors[0]);
  const [communicationStyle, setCommunicationStyle] = useState<CommunicationStyle>('casual');

  const [traits, setTraits] = useState<PersonaTraits>({
    creativity: 50,
    logic: 50,
    empathy: 50,
    curiosity: 50,
    moodVolatility: 30,
  });

  const updateTrait = (key: keyof PersonaTraits, value: number) => {
    setTraits((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreate = async () => {
    if (!name.trim()) return;

    setShowBirthAnimation(true);

    const persona: Persona = {
      id: `persona-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      avatar: selectedAvatar.emoji,
      traits,
      communicationStyle,
      currentMood: 'neutral',
      moodHistory: [{ mood: 'neutral', timestamp: Date.now() }],
      createdAt: Date.now(),
      color: selectedColor.id,
    };

    await addPersona(persona);

    // Show birth animation then complete
    setTimeout(() => {
      setShowBirthAnimation(false);
      onComplete?.();
    }, 2000);
  };

  return (
    <div className="relative">
      {/* Birth Animation Overlay */}
      <AnimatePresence>
        {showBirthAnimation && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative">
              {/* Particle burst effect */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: `hsl(var(--neon-${selectedColor.id}))`,
                    boxShadow: `0 0 10px hsl(var(--neon-${selectedColor.id}))`,
                  }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos((i * 360) / 20 * Math.PI / 180) * 150,
                    y: Math.sin((i * 360) / 20 * Math.PI / 180) * 150,
                    scale: [0, 1.5, 0],
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: 'easeOut',
                    delay: i * 0.02,
                  }}
                />
              ))}

              {/* Central avatar reveal */}
              <motion.div
                className="relative z-10"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: [0, 1.2, 1], rotate: 0 }}
                transition={{ duration: 0.8, type: 'spring' }}
              >
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center text-6xl"
                  style={{
                    background: `hsl(var(--neon-${selectedColor.id}) / 0.3)`,
                    border: `2px solid hsl(var(--neon-${selectedColor.id}))`,
                  }}
                >
                  {selectedAvatar.emoji}
                </div>
              </motion.div>

              {/* Name reveal */}
              <motion.h2
                className="text-center mt-6 font-display text-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {name}
              </motion.h2>
              <motion.p
                className="text-center text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                has been born into the simulation
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Builder Controls */}
        <div className="space-y-6">
          {/* Name Input */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-display text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Identity
            </h3>
            <Input
              placeholder="Enter persona name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-input/50 border-primary/30 font-display text-lg placeholder:text-muted-foreground/50"
            />
          </motion.div>

          {/* Avatar Selection */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-display text-lg mb-4">Avatar</h3>
            <div className="grid grid-cols-6 gap-3">
              {avatarOptions.map((avatar) => (
                <motion.button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-all",
                    selectedAvatar.id === avatar.id
                      ? "bg-primary/30 ring-2 ring-primary"
                      : "bg-muted/30 hover:bg-muted/50"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {avatar.emoji}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Color Selection */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-display text-lg mb-4">Energy Color</h3>
            <div className="flex flex-wrap gap-3">
              {neonColors.map((color) => (
                <motion.button
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "w-10 h-10 rounded-full transition-all",
                    selectedColor.id === color.id && "border-2 border-black ring-2 ring-white ring-offset-2 ring-offset-background"
                  )}
                  style={{
                    background: `hsl(${color.hsl})`,
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Communication Style */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-display text-lg mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Communication Style
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {communicationStyles.map((style) => (
                <motion.button
                  key={style.value}
                  onClick={() => setCommunicationStyle(style.value)}
                  className={cn(
                    "p-3 rounded-lg text-center transition-all",
                    communicationStyle === style.value
                      ? "bg-primary/30 ring-1 ring-primary"
                      : "bg-muted/30 hover:bg-muted/50"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xl block mb-1">{style.icon}</span>
                  <span className="text-xs">{style.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Traits & Preview */}
        <div className="space-y-6">
          {/* Traits */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-display text-lg mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Personality Traits
            </h3>
            <div className="space-y-6">
              <TraitSlider
                label="Creativity"
                icon="🎨"
                value={traits.creativity}
                onChange={(v) => updateTrait('creativity', v)}
                description="Ability to generate novel ideas and solutions"
              />
              <TraitSlider
                label="Logic"
                icon="🧮"
                value={traits.logic}
                onChange={(v) => updateTrait('logic', v)}
                description="Analytical thinking and problem-solving"
              />
              <TraitSlider
                label="Empathy"
                icon="💗"
                value={traits.empathy}
                onChange={(v) => updateTrait('empathy', v)}
                description="Understanding and sharing feelings of others"
              />
              <TraitSlider
                label="Curiosity"
                icon="🔍"
                value={traits.curiosity}
                onChange={(v) => updateTrait('curiosity', v)}
                description="Desire to learn and explore new things"
              />
              <TraitSlider
                label="Mood Volatility"
                icon="🌊"
                value={traits.moodVolatility}
                onChange={(v) => updateTrait('moodVolatility', v)}
                description="How quickly moods change during interactions"
              />
            </div>
          </motion.div>

          {/* Live Preview */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-display text-lg mb-4">Live Preview</h3>
            <PersonaPreview
              name={name || 'Unnamed'}
              avatar={selectedAvatar.emoji}
              color={selectedColor}
              traits={traits}
              communicationStyle={communicationStyle}
            />
          </motion.div>

          {/* Create Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="w-full holo-button h-14 text-lg"
            >
              <Zap className="w-5 h-5 mr-2" />
              Initialize Persona
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
