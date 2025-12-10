import { motion } from 'framer-motion';
import { usePersonaStore } from '@/stores/persona-store';
import type { Theme } from '@/types/persona';
import { cn } from '@/lib/utils';

const themes: { id: Theme; name: string; preview: string; description: string }[] = [
  {
    id: 'dark',
    name: 'Dark Mode',
    preview: 'linear-gradient(135deg, #0a0f1a 0%, #1a1f2e 100%)',
    description: 'Classic dark theme with cyan accents',
  },
  {
    id: 'neon',
    name: 'Neon',
    preview: 'linear-gradient(135deg, #050510 0%, #0a1f0a 100%)',
    description: 'Vibrant green neon aesthetic',
  },
  {
    id: 'light',
    name: 'Light Mode',
    preview: 'linear-gradient(135deg, #e8f4f8 0%, #f8f8ff 100%)',
    description: 'Clean light theme for daytime use',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    preview: 'linear-gradient(135deg, #1a0a1a 0%, #2a1a2a 100%)',
    description: 'Yellow & pink cyberpunk vibes',
  },
];

export function ThemeSelector() {
  const { theme, setTheme } = usePersonaStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl mb-2">Theme Engine</h2>
        <p className="text-muted-foreground">
          Choose your visual experience. Themes include unique colors, glows, and animations.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {themes.map((t, index) => (
          <motion.button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={cn(
              "glass-card p-6 text-left transition-all hud-corners",
              theme === t.id && "ring-2 ring-primary"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Preview */}
            <div
              className="w-full h-24 rounded-lg mb-4 relative overflow-hidden"
              style={{ background: t.preview }}
            >
              {/* Animated elements to show theme vibe */}
              <motion.div
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: t.id === 'light' ? '#00b4d8' :
                    t.id === 'neon' ? '#00ff88' :
                      t.id === 'cyberpunk' ? '#ffdd00' : '#00fff2',
                  top: '20%',
                  left: '20%',
                  boxShadow: `0 0 20px ${t.id === 'light' ? '#00b4d8' :
                      t.id === 'neon' ? '#00ff88' :
                        t.id === 'cyberpunk' ? '#ffdd00' : '#00fff2'
                    }`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <motion.div
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: t.id === 'light' ? '#7c3aed' :
                    t.id === 'neon' ? '#ffcc00' :
                      t.id === 'cyberpunk' ? '#ff00aa' : '#ff00ff',
                  top: '60%',
                  left: '70%',
                  boxShadow: `0 0 15px ${t.id === 'light' ? '#7c3aed' :
                      t.id === 'neon' ? '#ffcc00' :
                        t.id === 'cyberpunk' ? '#ff00aa' : '#ff00ff'
                    }`,
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.5,
                }}
              />

              {/* Grid pattern */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `linear-gradient(${t.id === 'light' ? '#00b4d8' : '#00fff2'}20 1px, transparent 1px), linear-gradient(90deg, ${t.id === 'light' ? '#00b4d8' : '#00fff2'}20 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                }}
              />
            </div>

            {/* Info */}
            <h3 className="font-display text-lg mb-1">{t.name}</h3>
            <p className="text-sm text-muted-foreground">{t.description}</p>

            {/* Active indicator */}
            {theme === t.id && (
              <motion.div
                className="mt-4 flex items-center gap-2 text-primary text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                Active
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Theme transition effect info */}

    </div>
  );
}
