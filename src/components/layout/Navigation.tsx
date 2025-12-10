import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Users, Activity, Gamepad2, Palette, Home } from 'lucide-react';

type View = 'dashboard' | 'builder' | 'scenarios' | 'themes';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const navItems = [
  { id: 'dashboard' as View, label: 'Dashboard', icon: Activity },
  { id: 'builder' as View, label: 'Create Persona', icon: Users },
  { id: 'scenarios' as View, label: 'Scenarios', icon: Gamepad2 },
  { id: 'themes' as View, label: 'Themes', icon: Palette },
];

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  return (
    <nav className="glass-card">
      <div className="flex items-center justify-between p-4">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-xl">🧠</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-display text-lg">PERSONA</h1>
            <p className="text-xs text-muted-foreground -mt-1">SIMULATOR</p>
          </div>
        </motion.div>

        {/* Nav Items */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "relative px-3 sm:px-4 py-2 rounded-lg font-display text-sm transition-all flex items-center gap-2",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/30"
                    layoutId="nav-active"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className="w-4 h-4 relative z-10" />
                <span className="hidden sm:inline relative z-10">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
