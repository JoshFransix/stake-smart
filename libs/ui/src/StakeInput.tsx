import { Input } from "./Input";

interface StakeInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function StakeInput({ value, onChange }: StakeInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Stake Amount
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 
                       dark:text-gray-300 transition-colors z-10 font-medium">
          ₦
        </span>
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={1}
          step={1}
          className="pl-8"
        />
      </div>
    </div>
  );
}
