
import React, { useState, useMemo } from 'react';
import { 
  X, Plus, Minus, Search, Trash2, 
  ChevronRight, Calculator, PieChart, Utensils 
} from 'lucide-react';
import { FoodItem, Meal, LoggedFood } from './types';
import { FOOD_DATABASE } from './constants';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary', fullWidth?: boolean }> = ({ 
  children, variant = 'primary', fullWidth = false, className = '', ...props 
}) => {
  const base = "inline-flex items-center justify-center px-6 py-4 rounded-xl font-bold transition-all active:scale-95";
  const variants = {
    primary: "bg-primary-500 text-white shadow-lg shadow-primary-500/30 hover:bg-primary-600",
    secondary: "bg-surface text-white border border-neutral-800 hover:bg-neutral-800",
  };
  return (
    <button className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const ScreenWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen max-w-md mx-auto bg-black text-white flex flex-col relative overflow-x-hidden">
    {children}
  </div>
);

export const FoodSelector: React.FC<{ 
  onAdd: (food: FoodItem, amount: number) => void; 
  onClose: () => void 
}> = ({ onAdd, onClose }) => {
  const [query, setQuery] = useState('');
  const [amount, setAmount] = useState<number>(100);

  const filtered = useMemo(() => 
    FOOD_DATABASE.filter(f => f.name.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <div className="fixed inset-0 z-[110] bg-black/95 p-6 flex flex-col animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black uppercase">Adicionar Alimento</h3>
        <button onClick={onClose} className="p-2 bg-neutral-900 rounded-full"><X /></button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input 
          autoFocus
          className="w-full bg-surface border border-neutral-800 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary-500"
          placeholder="Ex: Frango, Arroz..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
        {filtered.map(food => (
          <div key={food.id} className="bg-surface p-4 rounded-xl border border-neutral-800 flex justify-between items-center">
            <div>
              <p className="font-bold">{food.name}</p>
              <p className="text-[10px] text-neutral-500 uppercase">{food.measure} • {food.category}</p>
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                className="w-16 bg-black border border-neutral-700 rounded-lg p-2 text-center text-sm font-bold"
                defaultValue={100}
                onChange={e => setAmount(Number(e.target.value))}
              />
              <button 
                onClick={() => onAdd(food, amount)}
                className="p-2 bg-primary-500 rounded-lg"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MealCard: React.FC<{ 
  meal: Meal; 
  onAddItem: () => void; 
  onRemoveItem: (index: number) => void 
}> = ({ meal, onAddItem, onRemoveItem }) => {
  const totals = useMemo(() => {
    return meal.items.reduce((acc, log) => {
      const food = FOOD_DATABASE.find(f => f.id === log.foodId)!;
      const factor = log.amount / (food.measure === '100g' ? 100 : 1);
      return {
        cal: acc.cal + food.calories * factor,
        pro: acc.pro + food.protein * factor,
        carb: acc.carb + food.carbs * factor,
        fat: acc.fat + food.fat * factor
      };
    }, { cal: 0, pro: 0, carb: 0, fat: 0 });
  }, [meal.items]);

  return (
    <div className="bg-surface border border-neutral-800 rounded-2xl p-5 mb-4 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-black uppercase text-primary-500 tracking-widest">{meal.name}</h4>
        <span className="text-xs font-bold text-neutral-500">{Math.round(totals.cal)} kcal</span>
      </div>

      <div className="space-y-3 mb-4">
        {meal.items.map((item, idx) => {
          const food = FOOD_DATABASE.find(f => f.id === item.foodId)!;
          return (
            <div key={idx} className="flex justify-between items-center text-sm">
              <p className="text-neutral-300"><span className="font-bold text-white">{item.amount}{food.measure === '100g' ? 'g' : ''}</span> {food.name}</p>
              <button onClick={() => onRemoveItem(idx)} className="text-neutral-600 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
          );
        })}
      </div>

      <Button variant="secondary" fullWidth onClick={onAddItem} className="py-2 text-xs border-dashed border-neutral-700">
        <Plus size={14} className="mr-2" /> Adicionar Alimento
      </Button>
    </div>
  );
};
