import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/layout/Navigation';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { PersonaBuilder } from '@/components/persona/PersonaBuilder';
import { ScenarioSimulator } from '@/components/scenario/ScenarioSimulator';
import { ThemeSelector } from '@/components/layout/ThemeSelector';
import { usePersonaStore } from '@/stores/persona-store';
import DotGrid from '@/components/DotGrid';

type View = 'dashboard' | 'builder' | 'scenarios' | 'themes';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const { loadData, isLoading, theme } = usePersonaStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Apply theme class
  useEffect(() => {
    document.documentElement.classList.remove('theme-dark', 'theme-neon', 'theme-light', 'theme-cyberpunk');
    if (theme !== 'dark') {
      document.documentElement.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  const handleCreatePersona = () => {
    setCurrentView('builder');
  };

  const handlePersonaCreated = () => {
    setCurrentView('dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Loading animation */}
          <div className="relative w-24 h-24">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border-2 border-primary/30"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">🧠</span>
            </div>
          </div>
          <motion.p
            className="mt-6 font-display text-lg neon-text"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Initializing Simulation...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background grid */}
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <DotGrid
          baseColor="#004d4d"
          activeColor="#00ffff"
          dotSize={2}
          gap={20}
          proximity={100}
          shockRadius={50}
          shockStrength={2}
        />
      </div>

      {/* Ambient glow effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-6 space-y-6">
        <Navigation currentView={currentView} onViewChange={setCurrentView} />

        <AnimatePresence mode="wait">
          <motion.main
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentView === 'dashboard' && (
              <Dashboard onCreatePersona={handleCreatePersona} />
            )}
            {currentView === 'builder' && (
              <PersonaBuilder onComplete={handlePersonaCreated} />
            )}
            {currentView === 'scenarios' && (
              <ScenarioSimulator />
            )}
            {currentView === 'themes' && (
              <ThemeSelector />
            )}
          </motion.main>
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          className="text-center py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >

        </motion.footer>
      </div>

      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none scanlines opacity-50" />
    </div>
  );
};

export default Index;
