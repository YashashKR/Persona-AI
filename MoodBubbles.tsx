import { motion } from 'framer-motion';
import type { Persona } from '@/types/persona';
import { getMoodColor, getMoodEmoji } from '@/lib/persona-logic';
import { neonColors } from '@/data/avatars';

interface MoodBubblesProps {
  personas: Persona[];
}

export function MoodBubbles({ personas }: MoodBubblesProps) {
  return (
    <div className="glass-card p-4">
      <h3 className="font-display text-sm mb-4 text-muted-foreground uppercase tracking-wider">
        Mood States
      </h3>
      <div className="flex flex-wrap gap-3">
        {personas.map((persona, index) => {
          const color = neonColors.find(c => c.id === persona.color) || neonColors[0];
          const moodEmoji = getMoodEmoji(persona.currentMood);
          const moodColor = getMoodColor(persona.currentMood);

          return (
            <motion.div
              key={persona.id}
              className="relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
            >
              {/* Morphing bubble */}
              <motion.div
                className="w-16 h-16 rounded-full flex flex-col items-center justify-center"
                style={{
                  background: `radial-gradient(circle at 30% 30%, hsl(var(--${moodColor}) / 0.4), hsl(var(--${moodColor}) / 0.1))`,
                  border: `2px solid hsl(var(--${moodColor}) / 0.5)`,
                  boxShadow: `0 0 20px hsl(var(--${moodColor}) / 0.3)`,
                }}
                animate={{
                  scale: [1, 1.05, 0.98, 1.02, 1],
                  borderRadius: ['50%', '45% 55% 50% 50%', '52% 48% 48% 52%', '48% 52% 52% 48%', '50%'],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <span className="text-xl">{moodEmoji}</span>
                <span
                  className="text-[10px] font-display truncate max-w-[50px]"
                  style={{ color: `hsl(${color.hsl})` }}
                >
                  {persona.name.slice(0, 6)}
                </span>
              </motion.div>

              {/* Floating particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    background: `hsl(var(--${moodColor}))`,
                    top: '50%',
                    left: '50%',
                  }}
                  animate={{
                    x: Math.cos((i * 120) * Math.PI / 180) * 30,
                    y: Math.sin((i * 120) * Math.PI / 180) * 30,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          );
        })}

        {personas.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No personas created yet
          </p>
        )}
      </div>
    </div>
  );
}
