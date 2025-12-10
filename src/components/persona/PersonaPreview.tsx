import { motion } from 'framer-motion';
import type { PersonaTraits, CommunicationStyle } from '@/types/persona';

interface PersonaPreviewProps {
  name: string;
  avatar: string;
  color: { id: string; hsl: string };
  traits: PersonaTraits;
  communicationStyle: CommunicationStyle;
}

export function PersonaPreview({
  name,
  avatar,
  color,
  traits,
  communicationStyle,
}: PersonaPreviewProps) {
  // Calculate dominant trait
  const dominantTrait = Object.entries(traits).reduce((a, b) =>
    a[1] > b[1] ? a : b
  );

  const traitDescriptions: Record<string, string> = {
    creativity: 'Creative Visionary',
    logic: 'Logical Analyst',
    empathy: 'Empathetic Connector',
    curiosity: 'Curious Explorer',
    moodVolatility: 'Dynamic Spirit',
  };

  return (
    <div className="relative">
      {/* Avatar with glow */}
      <div className="flex flex-col items-center">
        <motion.div
          className="relative"
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-50"
            style={{
              background: `radial-gradient(circle, hsl(${color.hsl} / 0.4) 0%, transparent 70%)`,
              filter: 'blur(20px)',
              transform: 'scale(1.5)',
            }}
            animate={{
              scale: [1.3, 1.6, 1.3],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Avatar container */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-5xl relative z-10"
            style={{
              background: `hsl(${color.hsl} / 0.2)`,
              border: `2px solid hsl(${color.hsl} / 0.5)`,
            }}
          >
            {avatar}
          </div>
        </motion.div>

        {/* Name */}
        <motion.h4
          className="mt-4 font-display text-xl"
        >
          {name}
        </motion.h4>

        {/* Dominant trait badge */}
        <motion.div
          className="mt-2 px-3 py-1 rounded-full text-xs font-mono"
          style={{
            background: `hsl(${color.hsl} / 0.2)`,
            border: `1px solid hsl(${color.hsl} / 0.3)`,
          }}
        >
          {traitDescriptions[dominantTrait[0]]}
        </motion.div>

        {/* Trait bars */}
        <div className="w-full mt-6 space-y-2">
          {Object.entries(traits).map(([trait, value]) => (
            <div key={trait} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-8 text-right font-mono">
                {value}
              </span>
              <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, hsl(${color.hsl}), hsl(${color.hsl} / 0.5))`,
                    boxShadow: `0 0 10px hsl(${color.hsl} / 0.5)`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Communication style indicator */}
        <div className="mt-4 text-center">
          <span className="text-xs text-muted-foreground">Communication: </span>
          <span className="text-xs font-display uppercase tracking-wider text-primary">
            {communicationStyle}
          </span>
        </div>
      </div>
    </div>
  );
}
