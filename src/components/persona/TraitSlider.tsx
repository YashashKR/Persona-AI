import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TraitSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: string;
  description?: string;
  color?: string;
}

export function TraitSlider({
  label,
  value,
  onChange,
  icon,
  description,
  color = 'primary'
}: TraitSliderProps) {
  const getIntensityLabel = (val: number) => {
    if (val < 20) return 'Very Low';
    if (val < 40) return 'Low';
    if (val < 60) return 'Moderate';
    if (val < 80) return 'High';
    return 'Very High';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.span
            className="text-xl"
            animate={{ scale: 0.8 + (value / 200) }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {icon}
          </motion.span>
          <span className="font-display text-sm uppercase tracking-wider text-foreground">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {getIntensityLabel(value)}
          </span>
          <motion.span
            className="font-mono text-primary neon-text text-sm min-w-[40px] text-right"
            key={value}
            initial={{ scale: 1.2, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            {value}
          </motion.span>
        </div>
      </div>

      <div className="relative">
        <Slider
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          max={100}
          min={0}
          step={1}
          className="w-full"
        />


      </div>

      {description && (
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
