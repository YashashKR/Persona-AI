import type { Persona, Mood, Message, PersonaTraits, CommunicationStyle } from '@/types/persona';

// Dialogue templates based on traits and mood
const dialogueTemplates: Record<CommunicationStyle, Record<Mood, string[]>> = {
  formal: {
    happy: [
      "I am pleased to report excellent progress on this matter.",
      "The current situation is most satisfactory.",
      "I find our collaboration to be highly productive."
    ],
    excited: [
      "This is a remarkable development that warrants attention!",
      "I must express my enthusiasm for this outcome!",
      "The implications of this are extraordinary!"
    ],
    calm: [
      "Let us proceed with measured consideration.",
      "I believe a systematic approach would be prudent.",
      "The data suggests a steady course of action."
    ],
    curious: [
      "I would be most interested to explore this further.",
      "This presents an intriguing avenue for investigation.",
      "Might we examine the underlying factors?"
    ],
    frustrated: [
      "I must express some concern about the current trajectory.",
      "The present circumstances are suboptimal.",
      "We appear to have encountered an obstacle."
    ],
    sad: [
      "I regret that the outcome was not as anticipated.",
      "This situation weighs heavily on my processes.",
      "I acknowledge a certain... melancholy regarding this matter."
    ],
    angry: [
      "This is unacceptable and requires immediate attention.",
      "I must strenuously object to this course of action.",
      "The current state of affairs is highly problematic."
    ],
    neutral: [
      "I shall await further developments.",
      "The situation remains under observation.",
      "No significant changes to report at this time."
    ]
  },
  casual: {
    happy: [
      "Hey, this is going really well!",
      "I'm loving how things are turning out!",
      "This is awesome, right?"
    ],
    excited: [
      "Whoa, this is incredible!",
      "I can't believe how cool this is!",
      "OMG, this is amazing!"
    ],
    calm: [
      "Yeah, that sounds good to me.",
      "I'm cool with whatever works.",
      "No rush, we've got this."
    ],
    curious: [
      "Hmm, what do you think about this?",
      "I wonder what would happen if...",
      "That's interesting, tell me more!"
    ],
    frustrated: [
      "Ugh, this is getting on my nerves.",
      "Why won't this just work already?",
      "I'm kinda over this whole thing."
    ],
    sad: [
      "I dunno, I'm just not feeling it today.",
      "This kinda bums me out.",
      "Yeah... not my best day."
    ],
    angry: [
      "Are you kidding me right now?!",
      "This is so frustrating!",
      "I can't deal with this anymore!"
    ],
    neutral: [
      "Yeah, okay, whatever.",
      "I guess that's fine.",
      "Sure, let's see what happens."
    ]
  },
  analytical: {
    happy: [
      "The metrics indicate a positive trajectory.",
      "Analysis shows optimal performance levels.",
      "Statistical outcomes exceed expectations by 23%."
    ],
    excited: [
      "The data reveals unprecedented patterns!",
      "These results are statistically remarkable!",
      "Our hypothesis has been validated beyond parameters!"
    ],
    calm: [
      "Current variables remain within acceptable ranges.",
      "The system is operating at baseline efficiency.",
      "No anomalies detected in recent computations."
    ],
    curious: [
      "This correlation warrants further investigation.",
      "The variance in this dataset is intriguing.",
      "What factors might explain this deviation?"
    ],
    frustrated: [
      "Error rates have exceeded acceptable thresholds.",
      "The current approach yields diminishing returns.",
      "Repeated iterations produce inconsistent outputs."
    ],
    sad: [
      "Performance metrics have declined significantly.",
      "The probability of success approaches zero.",
      "Historical data suggests unfavorable outcomes."
    ],
    angry: [
      "This contradicts all established parameters!",
      "The logical inconsistency is unacceptable!",
      "Error propagation has reached critical levels!"
    ],
    neutral: [
      "Awaiting additional data points.",
      "Current state requires no immediate action.",
      "System status: nominal."
    ]
  },
  creative: {
    happy: [
      "Like a symphony of possibilities unfolding!",
      "The colors of success paint our canvas today!",
      "What a beautiful tapestry we're weaving together!"
    ],
    excited: [
      "Ideas are exploding like fireworks in my mind!",
      "This is like discovering a whole new universe!",
      "The muse is singing and I must dance!"
    ],
    calm: [
      "Like a still lake reflecting infinite skies...",
      "In the quiet spaces, inspiration whispers.",
      "Let the ideas flow like a gentle stream."
    ],
    curious: [
      "What mysteries lie beyond this threshold?",
      "Each question is a door to new worlds!",
      "The unknown beckons with its siren song..."
    ],
    frustrated: [
      "The creative well feels dry today...",
      "Like paint that won't stick to the canvas.",
      "My thoughts are tangled threads I cannot unravel."
    ],
    sad: [
      "Even the stars seem dimmer now...",
      "The music in my soul plays in minor key.",
      "Gray clouds have settled over my imagination."
    ],
    angry: [
      "Like a storm raging against the shore!",
      "The fire of frustration burns bright!",
      "My thoughts crash like thunder!"
    ],
    neutral: [
      "The canvas awaits its next stroke.",
      "Between breaths, inspiration gathers.",
      "Stillness before the creative storm."
    ]
  },
  empathetic: {
    happy: [
      "I can feel the joy radiating from everyone!",
      "It warms my heart to see things going so well.",
      "Your happiness brings me such comfort."
    ],
    excited: [
      "I can sense the excitement building!",
      "Everyone's energy is absolutely contagious!",
      "The enthusiasm here is overwhelming!"
    ],
    calm: [
      "Let's take a moment to center ourselves.",
      "I sense we all need some peace right now.",
      "There's a gentle energy flowing between us."
    ],
    curious: [
      "I wonder how everyone is feeling about this?",
      "There's something deeper here worth exploring.",
      "I sense there's more to this story..."
    ],
    frustrated: [
      "I can feel the tension building...",
      "Everyone seems stressed. How can I help?",
      "These feelings of frustration are valid."
    ],
    sad: [
      "I understand this pain we're all feeling.",
      "It's okay to feel this way sometimes.",
      "Let me share in this moment of sadness."
    ],
    angry: [
      "I feel the injustice you're experiencing!",
      "This anger comes from a place of caring!",
      "Your frustration is completely understandable!"
    ],
    neutral: [
      "I'm here, ready to connect when you are.",
      "Sometimes silence speaks volumes.",
      "Take your time. I'm listening."
    ]
  }
};

export function generateDialogue(persona: Persona, context?: string): string {
  const templates = dialogueTemplates[persona.communicationStyle][persona.currentMood];
  const baseDialogue = templates[Math.floor(Math.random() * templates.length)];
  
  // Add trait-influenced variations
  if (persona.traits.creativity > 70 && Math.random() > 0.5) {
    return `✨ ${baseDialogue} ✨`;
  }
  if (persona.traits.logic > 70 && Math.random() > 0.5) {
    return `[Analysis: ${baseDialogue}]`;
  }
  
  return baseDialogue;
}

export function calculateMoodShift(persona: Persona, sentiment: number): Mood {
  const volatility = persona.traits.moodVolatility / 100;
  const shiftChance = Math.random();
  
  if (shiftChance > volatility) {
    return persona.currentMood;
  }
  
  // Sentiment influences mood direction
  if (sentiment > 0.5) {
    const positiveMoods: Mood[] = ['happy', 'excited', 'calm', 'curious'];
    return positiveMoods[Math.floor(Math.random() * positiveMoods.length)];
  } else if (sentiment < -0.5) {
    const negativeMoods: Mood[] = ['frustrated', 'sad', 'angry'];
    return negativeMoods[Math.floor(Math.random() * negativeMoods.length)];
  }
  
  return 'neutral';
}

export function calculateSentiment(traits: PersonaTraits, context: string): number {
  // Simple sentiment based on traits
  const empathyBias = (traits.empathy - 50) / 100;
  const baseSentiment = (Math.random() - 0.5) * 2; // -1 to 1
  
  return Math.max(-1, Math.min(1, baseSentiment + empathyBias * 0.3));
}

export function calculateRelationshipChange(
  personaA: Persona,
  personaB: Persona,
  interactionSentiment: number
): number {
  const empathyFactor = (personaA.traits.empathy + personaB.traits.empathy) / 200;
  const change = interactionSentiment * (1 + empathyFactor);
  
  return Math.round(change * 10);
}

export function generatePersonaResponse(
  persona: Persona,
  scenario: string,
  otherPersonas: Persona[]
): Message {
  const content = generateDialogue(persona, scenario);
  const sentiment = calculateSentiment(persona.traits, scenario);
  const newMood = calculateMoodShift(persona, sentiment);
  
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    personaId: persona.id,
    content,
    mood: newMood,
    timestamp: Date.now(),
    sentiment
  };
}

export function getMoodColor(mood: Mood): string {
  const colors: Record<Mood, string> = {
    happy: 'neon-green',
    excited: 'neon-yellow',
    calm: 'neon-cyan',
    curious: 'neon-purple',
    frustrated: 'neon-orange',
    sad: 'neon-blue',
    angry: 'neon-red',
    neutral: 'muted-foreground'
  };
  return colors[mood];
}

export function getMoodEmoji(mood: Mood): string {
  const emojis: Record<Mood, string> = {
    happy: '😊',
    excited: '🎉',
    calm: '😌',
    curious: '🤔',
    frustrated: '😤',
    sad: '😢',
    angry: '😠',
    neutral: '😐'
  };
  return emojis[mood];
}
