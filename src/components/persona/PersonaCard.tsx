import { motion } from 'framer-motion';
import type { Persona } from '@/types/persona';
import { getMoodColor, getMoodEmoji } from '@/lib/persona-logic';
import { neonColors } from '@/data/avatars';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

interface PersonaCardProps {
  persona: Persona;
  isSelected?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

export function PersonaCard({ persona, isSelected, onClick, onDelete }: PersonaCardProps) {
  const color = neonColors.find(c => c.id === persona.color) || neonColors[0];
  const moodColor = getMoodColor(persona.currentMood);
  const moodEmoji = getMoodEmoji(persona.currentMood);

  return (
    <motion.div
      className={cn(
        "relative glass-card p-4 cursor-pointer transition-all group",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Delete button */}
      {onDelete && (
        <motion.button
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-destructive/20 text-destructive opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          className="absolute -inset-px rounded-xl"
          style={{
            background: `linear-gradient(135deg, hsl(${color.hsl} / 0.3), transparent)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          layoutId={`selected-${persona.id}`}
        />
      )}

      <div className="relative flex items-center gap-4">
        {/* Avatar */}
        <motion.div
          className="relative"
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-3xl"
            style={{
              background: `linear-gradient(135deg, hsl(${color.hsl} / 0.2), hsl(var(--card)))`,
              border: `2px solid hsl(${color.hsl} / 0.5)`,
              boxShadow: `0 0 20px hsl(${color.hsl} / 0.3)`,
            }}
          >
            {persona.avatar}
          </div>
          
          {/* Mood indicator */}
          <motion.div
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-sm"
            style={{
              background: `hsl(var(--${moodColor}) / 0.3)`,
              border: `1px solid hsl(var(--${moodColor}))`,
            }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            {moodEmoji}
          </motion.div>
        </motion.div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4
            className="font-display text-base truncate"
            style={{
              textShadow: `0 0 10px hsl(${color.hsl} / 0.5)`,
            }}
          >
            {persona.name}
          </h4>
          <p className="text-xs text-muted-foreground capitalize">
            {persona.communicationStyle} • {persona.currentMood}
          </p>
          
          {/* Mini trait bars */}
          <div className="flex gap-1 mt-2">
            {Object.entries(persona.traits).slice(0, 4).map(([trait, value]) => (
              <div
                key={trait}
                className="h-1 flex-1 bg-muted/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${value}%`,
                    background: `hsl(${color.hsl})`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
