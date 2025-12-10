import { motion } from 'framer-motion';
import type { Scenario } from '@/types/persona';
import { cn } from '@/lib/utils';

interface ScenarioCardProps {
  scenario: Scenario;
  isSelected?: boolean;
  onClick?: () => void;
}

const difficultyColors = {
  easy: 'neon-green',
  medium: 'neon-yellow',
  hard: 'neon-red',
};

const categoryColors = {
  collaboration: 'neon-cyan',
  conflict: 'neon-orange',
  creative: 'neon-purple',
  adventure: 'neon-magenta',
};

export function ScenarioCard({ scenario, isSelected, onClick }: ScenarioCardProps) {
  const diffColor = difficultyColors[scenario.difficulty];
  const catColor = categoryColors[scenario.category];

  return (
    <motion.div
      className={cn(
        "glass-card p-5 cursor-pointer transition-all hud-corners",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Icon & Title */}
      <div className="flex items-start gap-4">
        <motion.div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
          style={{
            background: `linear-gradient(135deg, hsl(var(--${catColor}) / 0.2), hsl(var(--card)))`,
            border: `1px solid hsl(var(--${catColor}) / 0.3)`,
          }}
          animate={{
            boxShadow: isSelected
              ? [
                  `0 0 20px hsl(var(--${catColor}) / 0.3)`,
                  `0 0 40px hsl(var(--${catColor}) / 0.5)`,
                  `0 0 20px hsl(var(--${catColor}) / 0.3)`,
                ]
              : `0 0 10px hsl(var(--${catColor}) / 0.2)`,
          }}
          transition={{
            duration: 2,
            repeat: isSelected ? Infinity : 0,
          }}
        >
          {scenario.icon}
        </motion.div>

        <div className="flex-1">
          <h3 className="font-display text-lg mb-1">{scenario.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {scenario.description}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 mt-4">
        <span
          className="px-2 py-1 rounded text-xs font-mono uppercase"
          style={{
            background: `hsl(var(--${diffColor}) / 0.2)`,
            color: `hsl(var(--${diffColor}))`,
            border: `1px solid hsl(var(--${diffColor}) / 0.3)`,
          }}
        >
          {scenario.difficulty}
        </span>
        <span
          className="px-2 py-1 rounded text-xs font-mono uppercase"
          style={{
            background: `hsl(var(--${catColor}) / 0.2)`,
            color: `hsl(var(--${catColor}))`,
            border: `1px solid hsl(var(--${catColor}) / 0.3)`,
          }}
        >
          {scenario.category}
        </span>
        <span className="text-xs text-muted-foreground ml-auto">
          {scenario.prompts.length} prompts
        </span>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          className="absolute -inset-px rounded-xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, hsl(var(--${catColor}) / 0.1), transparent)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.div>
  );
}
