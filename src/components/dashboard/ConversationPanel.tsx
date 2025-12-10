import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Message, Persona } from '@/types/persona';
import { getMoodColor, getMoodEmoji } from '@/lib/persona-logic';
import { neonColors } from '@/data/avatars';

interface ConversationPanelProps {
  messages: Message[];
  personas: Persona[];
  isActive: boolean;
}

export function ConversationPanel({ messages, personas, isActive }: ConversationPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getPersona = (id: string) => personas.find(p => p.id === id);

  return (
    <div className="glass-card h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-primary/20">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg">Conversation Stream</h3>
          <div className="flex items-center gap-2">
            {isActive && (
              <motion.div
                className="w-2 h-2 rounded-full bg-neon-green"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              />
            )}
            <span className="text-xs text-muted-foreground font-mono">
              {isActive ? 'LIVE' : 'IDLE'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center h-full text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-4xl mb-2">💬</span>
              <p className="text-sm">No messages yet</p>
              <p className="text-xs">Start a simulation to see conversations</p>
            </motion.div>
          ) : (
            messages.map((message, index) => {
              const persona = getPersona(message.personaId);
              if (!persona) return null;

              const color = neonColors.find(c => c.id === persona.color) || neonColors[0];
              const moodColor = getMoodColor(message.mood);
              const moodEmoji = getMoodEmoji(message.mood);

              return (
                <motion.div
                  key={message.id}
                  className="relative"
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Ripple effect on new message */}
                  <motion.div
                    className="absolute -inset-2 rounded-xl"
                    style={{
                      background: `radial-gradient(circle, hsl(${color.hsl} / 0.2), transparent)`,
                    }}
                    initial={{ scale: 0.8, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />

                  <div
                    className="relative rounded-xl p-4"
                    style={{
                      background: `linear-gradient(135deg, hsl(${color.hsl} / 0.1), hsl(var(--card)))`,
                      border: `1px solid hsl(${color.hsl} / 0.3)`,
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                        style={{
                          background: `hsl(${color.hsl} / 0.2)`,
                          border: `1px solid hsl(${color.hsl} / 0.5)`,
                        }}
                      >
                        {persona.avatar}
                      </div>
                      <div className="flex-1">
                        <span
                          className="font-display text-sm"
                          style={{ color: `hsl(${color.hsl})` }}
                        >
                          {persona.name}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <motion.div
                        className="text-lg"
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        {moodEmoji}
                      </motion.div>
                    </div>

                    {/* Content */}
                    <p className="text-sm leading-relaxed">
                      {message.content}
                    </p>

                    {/* Sentiment bar */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Sentiment:</span>
                      <div className="flex-1 h-1 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            width: `${(message.sentiment + 1) * 50}%`,
                            background: message.sentiment > 0 
                              ? `hsl(var(--neon-green))` 
                              : message.sentiment < 0 
                                ? `hsl(var(--neon-red))` 
                                : `hsl(var(--muted-foreground))`,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(message.sentiment + 1) * 50}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
