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
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 
                       dark:text-gray-400 transition-colors">
          ₦
        </span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min="1"
          step="1"
          className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-all duration-200
                   hover:border-gray-400 dark:hover:border-gray-500"
        />
      </div>
    </div>
  );
}
