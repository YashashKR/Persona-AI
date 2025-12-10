import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Persona, Relationship } from '@/types/persona';
import { neonColors } from '@/data/avatars';
import { getMoodColor } from '@/lib/persona-logic';

interface NodeGraphProps {
  personas: Persona[];
  relationships: Relationship[];
  activePersonas?: string[];
  onNodeClick?: (personaId: string) => void;
}

interface Node {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  persona: Persona;
}

export function NodeGraph({ personas, relationships, activePersonas = [], onNodeClick }: NodeGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize nodes
    const width = container.clientWidth;
    const height = container.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    nodesRef.current = personas.map((persona, i) => {
      const angle = (i / personas.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.3;
      return {
        id: persona.id,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        persona,
      };
    });

    let time = 0;

    const animate = () => {
      time += 0.016;
      const width = container.clientWidth;
      const height = container.clientHeight;

      ctx.clearRect(0, 0, width, height);

      // Draw grid background
      ctx.strokeStyle = 'hsla(180, 100%, 50%, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update node positions with soft physics
      nodesRef.current.forEach((node) => {
        // Gentle floating motion
        node.x += Math.sin(time + node.x * 0.01) * 0.3;
        node.y += Math.cos(time + node.y * 0.01) * 0.3;

        // Apply velocity with damping
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.99;
        node.vy *= 0.99;

        // Boundary repulsion
        const margin = 60;
        if (node.x < margin) node.vx += 0.1;
        if (node.x > width - margin) node.vx -= 0.1;
        if (node.y < margin) node.vy += 0.1;
        if (node.y > height - margin) node.vy -= 0.1;
      });

      // Draw connections between nodes
      relationships.forEach((rel) => {
        const nodeA = nodesRef.current.find(n => n.id === rel.personaA);
        const nodeB = nodesRef.current.find(n => n.id === rel.personaB);
        if (!nodeA || !nodeB) return;

        const isActive = activePersonas.includes(nodeA.id) && activePersonas.includes(nodeB.id);
        const colorA = neonColors.find(c => c.id === nodeA.persona.color) || neonColors[0];

        ctx.beginPath();
        ctx.moveTo(nodeA.x, nodeA.y);
        ctx.lineTo(nodeB.x, nodeB.y);

        if (isActive) {
          // Pulsing energy beam
          const gradient = ctx.createLinearGradient(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
          const pulse = (Math.sin(time * 4) + 1) / 2;
          gradient.addColorStop(0, `hsla(${colorA.hsl.split(' ')[0]}, 100%, 50%, ${0.3 + pulse * 0.5})`);
          gradient.addColorStop(0.5, `hsla(180, 100%, 60%, ${0.5 + pulse * 0.5})`);
          gradient.addColorStop(1, `hsla(${colorA.hsl.split(' ')[0]}, 100%, 50%, ${0.3 + pulse * 0.5})`);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 3;

          // Glow effect
          ctx.shadowColor = `hsla(180, 100%, 50%, 0.8)`;
          ctx.shadowBlur = 15;
        } else {
          ctx.strokeStyle = `hsla(180, 100%, 50%, 0.1)`;
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw energy particles along active connections
      if (activePersonas.length >= 2) {
        relationships.forEach((rel) => {
          const nodeA = nodesRef.current.find(n => n.id === rel.personaA);
          const nodeB = nodesRef.current.find(n => n.id === rel.personaB);
          if (!nodeA || !nodeB) return;
          if (!activePersonas.includes(nodeA.id) || !activePersonas.includes(nodeB.id)) return;

          // Animated particles along the beam
          const particleCount = 3;
          for (let i = 0; i < particleCount; i++) {
            const t = ((time * 0.5 + i / particleCount) % 1);
            const px = nodeA.x + (nodeB.x - nodeA.x) * t;
            const py = nodeA.y + (nodeB.y - nodeA.y) * t;

            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(180, 100%, 70%, ${1 - t})`;
            ctx.shadowColor = 'hsla(180, 100%, 50%, 1)';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      }

      // Draw nodes
      nodesRef.current.forEach((node) => {
        const color = neonColors.find(c => c.id === node.persona.color) || neonColors[0];
        const isActive = activePersonas.includes(node.id);
        const isHovered = hoveredNode === node.id;
        const baseSize = 35;
        const size = baseSize + (isActive ? 10 : 0) + (isHovered ? 5 : 0);

        // Outer glow
        if (isActive) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, size + 20, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(node.x, node.y, size, node.x, node.y, size + 20);
          gradient.addColorStop(0, `hsla(${color.hsl.split(' ')[0]}, 100%, 50%, 0.4)`);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        const nodeGradient = ctx.createRadialGradient(node.x - size/3, node.y - size/3, 0, node.x, node.y, size);
        nodeGradient.addColorStop(0, `hsla(${color.hsl.split(' ')[0]}, 100%, 40%, 0.9)`);
        nodeGradient.addColorStop(1, `hsla(${color.hsl.split(' ')[0]}, 100%, 20%, 0.8)`);
        ctx.fillStyle = nodeGradient;
        ctx.fill();

        // Border
        ctx.strokeStyle = `hsla(${color.hsl.split(' ')[0]}, 100%, 60%, ${isActive ? 1 : 0.5})`;
        ctx.lineWidth = isActive ? 3 : 2;
        ctx.stroke();

        // Avatar emoji
        ctx.font = `${size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.fillText(node.persona.avatar, node.x, node.y);

        // Name label
        ctx.font = '12px Orbitron, sans-serif';
        ctx.fillStyle = `hsla(${color.hsl.split(' ')[0]}, 100%, 80%, 0.9)`;
        ctx.fillText(node.persona.name, node.x, node.y + size + 15);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let found = false;
      nodesRef.current.forEach((node) => {
        const dist = Math.hypot(node.x - x, node.y - y);
        if (dist < 45) {
          setHoveredNode(node.id);
          found = true;
        }
      });
      if (!found) setHoveredNode(null);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      nodesRef.current.forEach((node) => {
        const dist = Math.hypot(node.x - x, node.y - y);
        if (dist < 45) {
          onNodeClick?.(node.id);
        }
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [personas, relationships, activePersonas, hoveredNode, onNodeClick]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ cursor: hoveredNode ? 'pointer' : 'default' }}
      />
      
      {/* HUD overlay */}
      <div className="absolute top-4 left-4 glass-card px-4 py-2 hud-corners">
        <span className="text-xs font-mono text-primary">
          NODES: {personas.length} • ACTIVE: {activePersonas.length}
        </span>
      </div>
    </div>
  );
}
