import type { Scenario } from '@/types/persona';

export const scenarios: Scenario[] = [
  {
    id: 'space-expedition',
    name: 'Space Expedition',
    description: 'Lead a crew through an interstellar journey to discover new worlds. Navigate challenges, make critical decisions, and explore the unknown.',
    icon: '🚀',
    prompts: [
      "The ship's sensors detect an anomaly ahead. What should we do?",
      "We've discovered a habitable planet. How do we approach first contact?",
      "Critical systems are failing. Who takes charge?",
      "An alien artifact has been found. Should we study it or leave it?",
      "The crew is divided on the next destination. How do we decide?"
    ],
    difficulty: 'hard',
    category: 'adventure'
  },
  {
    id: 'conflict-resolution',
    name: 'Conflict Resolution',
    description: 'Mediate disputes and find common ground. Practice diplomacy and negotiation skills in challenging scenarios.',
    icon: '⚖️',
    prompts: [
      "Two team members have opposing views on a critical decision.",
      "Resources are limited. How should they be distributed fairly?",
      "A past disagreement is affecting current collaboration.",
      "Different priorities are causing tension in the group.",
      "Trust has been broken. How do we rebuild it?"
    ],
    difficulty: 'medium',
    category: 'conflict'
  },
  {
    id: 'creative-brainstorm',
    name: 'Creative Brainstorming',
    description: 'Generate innovative ideas and push the boundaries of imagination. No idea is too wild in this creative space.',
    icon: '💡',
    prompts: [
      "Design a solution that doesn't exist yet.",
      "What if we combined two completely unrelated concepts?",
      "Reimagine an everyday object with future technology.",
      "Create a story from a random word combination.",
      "What would an alien think of this human invention?"
    ],
    difficulty: 'easy',
    category: 'creative'
  },
  {
    id: 'mystery-investigation',
    name: 'Mystery Investigation',
    description: 'Uncover clues, analyze evidence, and solve a complex mystery together. Every detail matters.',
    icon: '🔍',
    prompts: [
      "A strange message has been received. What does it mean?",
      "The evidence doesn't match the initial theory. What now?",
      "A new witness has come forward with contradicting information.",
      "Time is running out. Which lead do we follow?",
      "The culprit might be among us. How do we proceed?"
    ],
    difficulty: 'hard',
    category: 'adventure'
  },
  {
    id: 'team-building',
    name: 'Team Building',
    description: 'Strengthen bonds and develop trust through collaborative challenges. Learn to work together effectively.',
    icon: '🤝',
    prompts: [
      "What unique skill does each member bring to the team?",
      "Share a challenge you've overcome and what you learned.",
      "If we were stranded on an island, what roles would we take?",
      "What's one thing we can improve about our collaboration?",
      "Let's plan an imaginary celebration. Who does what?"
    ],
    difficulty: 'easy',
    category: 'collaboration'
  },
  {
    id: 'ethical-dilemma',
    name: 'Ethical Dilemma',
    description: 'Navigate complex moral questions and explore different perspectives on challenging ethical scenarios.',
    icon: '🧠',
    prompts: [
      "Would you sacrifice one to save many?",
      "Is it ever acceptable to break a promise?",
      "How do we balance individual rights with collective good?",
      "Should advanced AI have rights?",
      "When does ambition cross into harmful territory?"
    ],
    difficulty: 'medium',
    category: 'conflict'
  }
];
