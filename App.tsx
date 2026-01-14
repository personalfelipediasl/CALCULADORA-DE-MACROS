
import React, { useState, useMemo, useRef } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Calculator, ChevronRight, Plus, Minus, Utensils, 
  ShieldAlert, PieChart, Activity, CheckCircle, Target, X
} from 'lucide-react';
import { TRANSLATIONS, FOOD_DATABASE } from './constants';
import { UserMacroGoals, FoodItem } from './types';
import { Button, ScreenWrapper } from './components';

const getMealNames = (count: number): string[] => {
  switch (count) {
    case 3:
      return ['Café da manhã (ou Desjejum)', 'Almoço', 'Jantar'];
    case 4:
      return ['Café da manhã', 'Almoço', 'Café da tarde (ou Lanche da tarde)', 'Jantar'];
    case 5:
      return ['Café da manhã', 'Lanche da manhã', 'Almoço', 'Lanche da tarde', 'Jantar'];
    case 6:
      return ['Café da manhã', 'Lanche da manhã (Colação)', 'Almoço', 'Lanche da tarde', 'Jantar', 'Ceia'];
    default:
      return Array.from({ length: count }, (_, i) => `Refeição ${i + 1}`);
  }
};

// --- Home Screen ---
const HomeScreen = () => {
  const navigate = useNavigate();
  const t = (k: string) => TRANSLATIONS[k]?.pt || k;

  return (
    <ScreenWrapper>
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
        <div className="w-24 h-24 mb-6 bg-primary-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary-500/20">
          <Calculator size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-black uppercase leading-none tracking-tighter">
          {t('guideTitle')} <br/>
          <span className="text-primary-500">{t('guideSubtitle')}</span>
        </h1>
        <div className="w-12 h-1 bg-primary-500 my-6 rounded-full" />
      </div>
      <div className="p-6 pb-12">
        <Button fullWidth onClick={() => navigate('/legal')}>{t('startBtn')}</Button>
      </div>
    </ScreenWrapper>
  );
};

// --- Legal Screen ---
const LegalScreen = () => {
  const navigate = useNavigate();
  const t = (k: string) => TRANSLATIONS[k]?.pt || k;

  return (
    <ScreenWrapper>
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <ShieldAlert size={64} className="text-primary-500 animate-pulse" />
        <h2 className="text-2xl font-black uppercase tracking-widest">{t('legalTitle')}</h2>
        <div className="bg-surface p-6 rounded-2xl border border-neutral-800 text-neutral-400 text-sm leading-relaxed">
          {t('legalDesc')}
        </div>
        <Button fullWidth onClick={() => navigate('/calculator')}>{t('proceedBtn')}</Button>
      </div>
    </ScreenWrapper>
  );
};

// --- Macro Calculator ---
const CalculatorScreen = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ gender: 'm', age: 25, weight: 75, height: 175, activity: 1.2 });
  const [results, setResults] = useState<UserMacroGoals | null>(null);

  const calculate = () => {
    let bmr = (10 * data.weight) + (6.25 * data.height) - (5 * data.age);
    bmr = data.gender === 'm' ? bmr + 5 : bmr - 161;
    const tdee = Math.round(bmr * data.activity);
    const cutting = tdee - 500;
    
    setResults({
      tdee,
      cutting,
      protein: data.weight * 2,
      fat: Math.round(data.weight * 0.8),
      carbs: Math.round((cutting - (data.weight * 2 * 4) - (data.weight * 0.8 * 9)) / 4)
    });
  };

  return (
    <ScreenWrapper>
      <div className="flex-1 p-6 overflow-y-auto no-scrollbar pb-24">
        <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
          <Activity className="text-primary-500" /> Calculadora TDEE
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setData({...data, gender: 'm'})} className={`py-4 rounded-xl font-bold border-2 transition-all ${data.gender === 'm' ? 'bg-primary-500 border-primary-500' : 'bg-surface border-neutral-800 text-neutral-500'}`}>MASCULINO</button>
            <button onClick={() => setData({...data, gender: 'f'})} className={`py-4 rounded-xl font-bold border-2 transition-all ${data.gender === 'f' ? 'bg-primary-500 border-primary-500' : 'bg-surface border-neutral-800 text-neutral-500'}`}>FEMININO</button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {['age', 'weight', 'height'].map(key => (
              <div key={key}>
                <label className="text-[10px] font-black uppercase text-neutral-500 block mb-1">{key === 'age' ? 'Idade' : key === 'weight' ? 'Peso (kg)' : 'Altura (cm)'}</label>
                <input 
                  type="number" 
                  className="w-full bg-surface border border-neutral-800 rounded-xl p-4 font-bold text-center outline-none focus:border-primary-500"
                  value={(data as any)[key]}
                  onChange={e => setData({...data, [key]: Number(e.target.value)})}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-neutral-500 block mb-1">Nível de Atividade</label>
            <select 
              className="w-full bg-surface border border-neutral-800 rounded-xl p-4 font-bold outline-none focus:border-primary-500 appearance-none"
              onChange={e => setData({...data, activity: Number(e.target.value)})}
            >
              <option value="1.2">Sedentário</option>
              <option value="1.375">Leve (1-2x/semana)</option>
              <option value="1.55">Moderado (3-5x/semana)</option>
              <option value="1.725">Pesado (6-7x/semana)</option>
            </select>
          </div>

          <Button fullWidth onClick={calculate}>CALCULAR AGORA</Button>

          {results && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-4 pt-6">
              <div className="bg-primary-500/10 border border-primary-500/20 p-6 rounded-2xl text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary-500 mb-1">Calorias Recomendadas (Cutting)</p>
                <h3 className="text-5xl font-black">{results.cutting} <span className="text-lg">kcal</span></h3>
              </div>
              <Button fullWidth variant="primary" onClick={() => navigate('/setup-meals', { state: { results } })} className="mt-4">
                O QUE FAÇO AGORA? <ChevronRight className="ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </ScreenWrapper>
  );
};

// --- Setup Meals ---
const SetupMealsScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const results = location.state?.results;
  const [mealCount, setMealCount] = useState(4);

  return (
    <ScreenWrapper>
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-10">
        <Utensils size={64} className="text-primary-500" />
        <h2 className="text-2xl font-black uppercase">{TRANSLATIONS.mealsQuestion.pt}</h2>
        
        <div className="flex items-center gap-8">
          <button onClick={() => setMealCount(Math.max(1, mealCount - 1))} className="w-16 h-16 bg-surface border border-neutral-800 rounded-full flex items-center justify-center active:scale-90 transition-all"><Minus/></button>
          <span className="text-7xl font-black text-primary-500">{mealCount}</span>
          <button onClick={() => setMealCount(Math.min(8, mealCount + 1))} className="w-16 h-16 bg-surface border border-neutral-800 rounded-full flex items-center justify-center active:scale-90 transition-all"><Plus/></button>
        </div>

        <p className="text-neutral-500 font-bold uppercase text-xs tracking-widest leading-relaxed">
          {TRANSLATIONS.instructionText.pt}
        </p>
      </div>
      <div className="p-6 pb-12">
        <Button fullWidth onClick={() => navigate('/diary', { state: { mealCount, results } })}>CONTINUAR</Button>
      </div>
    </ScreenWrapper>
  );
};

// --- Food Diary (Automatic Input) ---
const DiaryScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mealCount, results } = location.state || { mealCount: 4, results: null };
  
  const mealNames = useMemo(() => getMealNames(mealCount), [mealCount]);
  const [mealTexts, setMealTexts] = useState<string[]>(Array(mealCount).fill(''));
  const [activeMealIndex, setActiveMealIndex] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const blurTimeoutRef = useRef<number | null>(null);
  const [showAlert, setShowAlert] = useState(true);

  const handleTextChange = (idx: number, val: string) => {
    const newTexts = [...mealTexts];
    newTexts[idx] = val;
    setMealTexts(newTexts);
    
    const lastWord = val.split(/, ?|\s/).pop()?.toLowerCase();
    
    if (lastWord && lastWord.length >= 2) {
      const normalizedLastWord = lastWord.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const filtered = FOOD_DATABASE.filter(food => 
        food.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedLastWord)
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (foodName: string) => {
    if (activeMealIndex === null) return;
    
    const currentText = mealTexts[activeMealIndex];
    const words = currentText.split(/([,\s])/);
    while (words.length > 0 && words[words.length - 1].trim() === '') {
      words.pop();
    }
    words.pop();
    
    const newText = words.join('') + foodName + ', ';
    
    const newTexts = [...mealTexts];
    newTexts[activeMealIndex] = newText;
    setMealTexts(newTexts);
    
    setSuggestions([]);
  };

  const getUnit = (measure: string) => {
    if (measure === '100g') return 'g';
    if (measure === '100ml') return 'ml';
    return measure;
  };

  const processAndCalculate = () => {
    if (!results) return;

    const LUNCH_KEYWORDS = ['arroz', 'feijao', 'carne', 'frango', 'tilapia', 'bovina', 'suino', 'patinho', 'mandioca', 'batata-doce', 'batata-inglesa'];
    let lunchMealIndex = -1;
    const normalizedMealTexts = mealTexts.map(text => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
    
    for (let i = 0; i < normalizedMealTexts.length; i++) {
        const text = normalizedMealTexts[i];
        if (LUNCH_KEYWORDS.some(keyword => text.includes(keyword))) {
            lunchMealIndex = i;
            break;
        }
    }
    
    if (lunchMealIndex === -1) {
        const almoçoNameIndex = mealNames.findIndex(name => name.toLowerCase().includes('almoço'));
        if (almoçoNameIndex !== -1) {
            lunchMealIndex = almoçoNameIndex;
        } else if (mealCount > 1) {
            lunchMealIndex = Math.floor(mealCount / 2);
        } else {
            lunchMealIndex = 0;
        }
    }

    const weights = Array(mealCount).fill(1.0);
    if(mealCount > 1) {
      weights[lunchMealIndex] = 1.5;
      if (0 !== lunchMealIndex) weights[0] = 0.75;
      if (mealCount > 2 && (mealCount - 1) !== lunchMealIndex) weights[mealCount - 1] = 0.75;
    }
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    const finalPlan = mealTexts.map((text, idx) => {
        const mealName = mealNames[idx];
        const foodQueries = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(',').map(q => q.trim()).filter(Boolean);

        if (foodQueries.length === 0) return { name: mealName, items: [] };

        const uniqueItems = new Map<string, FoodItem>();
        foodQueries.forEach(query => {
            const matches = FOOD_DATABASE.filter(food => food.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(query));
            if (matches.length > 0) {
                const bestMatch = matches.find(m => m.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === query) || matches[0];
                if (!uniqueItems.has(bestMatch.id)) uniqueItems.set(bestMatch.id, bestMatch);
            }
        });

        const mealItems = Array.from(uniqueItems.values());
        if (mealItems.length === 0) return { name: mealName, items: [] };

        const mealShare = weights[idx] / totalWeight;
        let mealTargetP = results.protein * mealShare;
        let mealTargetC = results.carbs * mealShare;
        let mealTargetF = results.fat * mealShare;

        const calculatedItems: { name: string; amount: number; unit: string; }[] = [];
        let itemsToProcess = [...mealItems];

        // Handle hardcoded fixed items first
        const liquidLimitItems = [{ name: 'Leite Integral', unit: 'ml' }, { name: 'Café (sem açúcar)', unit: 'ml' }];
        liquidLimitItems.forEach(liquid => {
            const liquidItemIndex = itemsToProcess.findIndex(item => item.name === liquid.name);
            if (liquidItemIndex > -1) {
                const liquidItemData = itemsToProcess.splice(liquidItemIndex, 1)[0];
                const amount = 200;
                calculatedItems.push({ name: liquidItemData.name, amount, unit: liquid.unit });
                const factor = amount / 100;
                mealTargetP -= (liquidItemData.protein * factor);
                mealTargetC -= (liquidItemData.carbs * factor);
                mealTargetF -= (liquidItemData.fat * factor);
            }
        });

        const groupVForBase = itemsToProcess.filter(i => i.category === 'Vegetais');
        groupVForBase.forEach(item => {
            const vIndex = itemsToProcess.findIndex(i => i.id === item.id);
            if (vIndex > -1) {
                const veggieItem = itemsToProcess.splice(vIndex, 1)[0];
                const amount = 100;
                calculatedItems.push({ name: veggieItem.name, amount, unit: getUnit(veggieItem.measure) });
                const factor = amount / (veggieItem.measure.includes('100') ? 100 : 1);
                mealTargetP -= (veggieItem.protein * factor);
                mealTargetC -= (veggieItem.carbs * factor);
                mealTargetF -= (veggieItem.fat * factor);
            }
        });
        
        // Iteratively solve for remaining items with portion caps
        for (let i = 0; i < mealItems.length + 1; i++) {
          if (itemsToProcess.length === 0) break;
  
          const groupP = itemsToProcess.filter(i => i.category === 'Proteínas');
          const groupC = itemsToProcess.filter(i => i.category === 'Carboidratos' || i.category === 'Frutas');
          const groupF = itemsToProcess.filter(i => i.category === 'Gorduras');
  
          let potentialItems: { food: FoodItem, amount: number }[] = [];
          let tempP = mealTargetP, tempC = mealTargetC, tempF = mealTargetF;
  
          const processGroupGreedy = (group: FoodItem[], targetMacro: 'protein' | 'fat' | 'carbs') => {
              let targetMacroTotal;
              if (targetMacro === 'protein') targetMacroTotal = tempP;
              else if (targetMacro === 'fat') targetMacroTotal = tempF;
              else targetMacroTotal = tempC;
              
              if (targetMacroTotal <= 0 || group.length === 0) return;
  
              const macroPerItem = targetMacroTotal / group.length;
              group.forEach(item => {
                  if (item[targetMacro] <= 0) return;
                  const baseUnit = item.measure.includes('100') ? 100 : 1;
                  const amount = (macroPerItem / item[targetMacro]) * baseUnit;
                  if (amount <= 0) return;
                  
                  potentialItems.push({ food: item, amount });
                  
                  const factor = amount / baseUnit;
                  tempP -= item.protein * factor;
                  tempC -= item.carbs * factor;
                  tempF -= item.fat * factor;
              });
          };
  
          processGroupGreedy(groupP, 'protein');
          processGroupGreedy(groupF, 'fat');
          processGroupGreedy(groupC, 'carbs');
  
          let actualP = 0, actualC = 0, actualF = 0;
          potentialItems.forEach(({ food, amount }) => {
              const baseUnit = food.measure.includes('100') ? 100 : 1;
              const factor = amount / baseUnit;
              actualP += food.protein * factor;
              actualC += food.carbs * factor;
              actualF += food.fat * factor;
          });
  
          const p_ratio = mealTargetP > 1 ? actualP / mealTargetP : 1;
          const c_ratio = mealTargetC > 1 ? actualC / mealTargetC : 1;
          const f_ratio = mealTargetF > 1 ? actualF / mealTargetF : 1;
  
          const max_ratio = Math.max(p_ratio, c_ratio, f_ratio);
  
          let adjustment_factor = 1;
          if (max_ratio > 1.0) {
              adjustment_factor = 1 / max_ratio;
          }
  
          let itemToCap: { food: FoodItem, amount: number } | null = null;
          let maxExceededRatio = 1.0;
  
          potentialItems.forEach(({ food, amount }) => {
              const potentialAmount = amount * adjustment_factor;
              if (food.maxPortion && potentialAmount > food.maxPortion) {
                  const ratio = potentialAmount / food.maxPortion;
                  if (ratio > maxExceededRatio) {
                      maxExceededRatio = ratio;
                      itemToCap = { food, amount: food.maxPortion };
                  }
              }
          });
  
          if (itemToCap) {
              calculatedItems.push({
                  name: itemToCap.food.name,
                  amount: itemToCap.amount,
                  unit: getUnit(itemToCap.food.measure),
              });
              const baseUnit = itemToCap.food.measure.includes('100') ? 100 : 1;
              const factor = itemToCap.amount / baseUnit;
              mealTargetP -= itemToCap.food.protein * factor;
              mealTargetC -= itemToCap.food.carbs * factor;
              mealTargetF -= itemToCap.food.fat * factor;
              itemsToProcess = itemsToProcess.filter(f => f.id !== itemToCap!.food.id);
          } else {
              potentialItems.forEach(({ food, amount }) => {
                  const finalAmount = amount * adjustment_factor;
                  if (finalAmount > 0) {
                      let displayAmount = Math.round(finalAmount);
                      if (displayAmount < 1) {
                        displayAmount = 1;
                      }
                      calculatedItems.push({
                          name: food.name,
                          amount: displayAmount,
                          unit: getUnit(food.measure),
                      });
                  }
              });
              break;
          }
        }

        calculatedItems.forEach(item => {
          const foodData = FOOD_DATABASE.find(f => f.name === item.name);
          if (foodData?.minPortion && item.amount > 0 && item.amount < foodData.minPortion) {
            item.amount = foodData.minPortion;
          }
        });

        return {
            name: mealName,
            items: calculatedItems.sort((a,b) => a.name.localeCompare(b.name))
        };
    });

    navigate('/final', { state: { plan: finalPlan, results } });
};


  return (
    <ScreenWrapper>
      <div className="p-6 overflow-y-auto no-scrollbar pb-32">
        <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
          <Utensils className="text-primary-500" /> Diário de Macros
        </h2>

        {showAlert && (
          <div className="bg-primary-500/5 border border-primary-500/20 rounded-2xl p-4 mb-6 flex items-start gap-3 relative animate-in fade-in">
            <ShieldAlert size={24} className="text-primary-500/70 mt-1 flex-shrink-0" />
            <p className="text-xs text-neutral-400 leading-relaxed pr-6">
              <strong>Atenção:</strong> Caso não encontre um alimento desejado aqui, faça uma adaptação. Frituras ou doces ou algo que atrapalhe seu processo não estão nesta ferramenta!
            </p>
            <button onClick={() => setShowAlert(false)} className="absolute top-3 right-3 p-1 text-neutral-500 hover:text-white">
              <X size={16} />
            </button>
          </div>
        )}

        {mealTexts.map((text, idx) => (
          <div key={idx} className="bg-surface border border-neutral-800 rounded-2xl p-5 mb-4 shadow-xl relative">
            <h4 className="font-black uppercase text-primary-500 tracking-widest mb-3">{mealNames[idx]}</h4>
            <textarea 
              className="w-full bg-black border border-neutral-800 rounded-xl p-4 text-sm font-medium focus:border-primary-500 outline-none h-24 no-scrollbar resize-none"
              placeholder="Digite os alimentos (Ex: ovo, pão, queijo...)"
              value={text}
              onChange={e => handleTextChange(idx, e.target.value)}
              onFocus={() => {
                if (blurTimeoutRef.current) {
                  clearTimeout(blurTimeoutRef.current);
                  blurTimeoutRef.current = null;
                }
                setActiveMealIndex(idx);
                handleTextChange(idx, text); 
              }}
              onBlur={() => {
                blurTimeoutRef.current = window.setTimeout(() => {
                  setActiveMealIndex(null);
                }, 200);
              }}
            />
             {activeMealIndex === idx && suggestions.length > 0 && (
                <div className="absolute z-10 w-[calc(100%-40px)] bg-neutral-900 border border-neutral-700 rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto no-scrollbar">
                    {suggestions.map(food => (
                        <button 
                            key={food.id}
                            className="w-full text-left p-3 hover:bg-primary-500/20 text-sm transition-colors"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleSuggestionClick(food.name);
                            }}
                        >
                            {food.name}
                        </button>
                    ))}
                </div>
            )}
          </div>
        ))}

        <Button fullWidth className="mt-4" onClick={processAndCalculate}>
          {TRANSLATIONS.calculateFinal.pt}
        </Button>
      </div>
    </ScreenWrapper>
  );
};

// --- Final Analysis (Result Page) ---
const FinalScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { results } = location.state || { plan: [], results: null };
  const [plan, setPlan] = useState(location.state?.plan || []);

  const handleQuantityChange = (mealIndex: number, itemIndex: number, delta: number) => {
    setPlan((currentPlan: any[]) => {
      const newPlan = JSON.parse(JSON.stringify(currentPlan));
      const item = newPlan[mealIndex].items[itemIndex];
      const foodData = FOOD_DATABASE.find(f => f.name === item.name);

      let newAmount = item.amount + delta;

      if (foodData?.minPortion) {
        if (newAmount > 0 && newAmount < foodData.minPortion) {
          newAmount = delta < 0 ? 0 : foodData.minPortion;
        }
      }

      item.amount = Math.max(0, newAmount);
      return newPlan;
    });
  };

  const dailyTotals = useMemo(() => {
    if (!plan || plan.length === 0) return { calories: 0, protein: 0, carbs: 0, fat: 0 };

    let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    plan.forEach((meal: any) => {
      meal.items.forEach((item: any) => {
        const foodData = FOOD_DATABASE.find(f => f.name === item.name);
        if (!foodData) return;

        const baseAmount = foodData.measure.includes('100') ? 100 : 1;
        const factor = parseFloat(item.amount) / baseAmount;

        totals.calories += foodData.calories * factor;
        totals.protein += foodData.protein * factor;
        totals.carbs += foodData.carbs * factor;
        totals.fat += foodData.fat * factor;
      });
    });
    return {
      calories: Math.round(totals.calories),
      protein: Math.round(totals.protein),
      carbs: Math.round(totals.carbs),
      fat: Math.round(totals.fat),
    };
  }, [plan]);


  return (
    <ScreenWrapper>
      <div className="p-6 overflow-y-auto no-scrollbar pb-32">
        <div className="flex flex-col items-center text-center mb-8">
           <div className="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center border border-primary-500/30 mb-4">
              <CheckCircle size={40} className="text-primary-500" />
           </div>
           <h2 className="text-3xl font-black uppercase tracking-tighter">Plano Pronto</h2>
           <p className="text-neutral-500 text-sm mt-1">Consuma as quantidades abaixo para secar e definir:</p>
        </div>

        {results && (
          <div className="bg-surface border border-neutral-800 rounded-2xl p-6 mb-8 shadow-2xl">
            <h3 className="font-black text-primary-500 uppercase mb-4 border-b border-neutral-800 pb-2 flex items-center gap-2">
              <Target size={16}/> Resumo do Dia
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-black/40 p-3 rounded-lg">
                <p className="text-xs text-neutral-500 font-bold">Calorias</p>
                <p className="font-bold"><span className="text-primary-500">{dailyTotals.calories}</span> / {results.cutting} kcal</p>
              </div>
              <div className="bg-black/40 p-3 rounded-lg">
                <p className="text-xs text-neutral-500 font-bold">Proteínas</p>
                <p className="font-bold"><span className="text-primary-500">{dailyTotals.protein}g</span> / {results.protein}g</p>
              </div>
              <div className="bg-black/40 p-3 rounded-lg">
                <p className="text-xs text-neutral-500 font-bold">Carbos</p>
                <p className="font-bold"><span className="text-primary-500">{dailyTotals.carbs}g</span> / {results.carbs}g</p>
              </div>
              <div className="bg-black/40 p-3 rounded-lg">
                <p className="text-xs text-neutral-500 font-bold">Gorduras</p>
                <p className="font-bold"><span className="text-primary-500">{dailyTotals.fat}g</span> / {results.fat}g</p>
              </div>
            </div>
          </div>
        )}

        {plan.map((meal: any, idx: number) => {
          const mealTotals = useMemo(() => {
            let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
            if (!meal.items) return totals;
            meal.items.forEach((item: any) => {
              const foodData = FOOD_DATABASE.find(f => f.name === item.name);
              if (!foodData) return;
              const baseAmount = foodData.measure.includes('100') ? 100 : 1;
              const factor = parseFloat(item.amount) / baseAmount;
              totals.calories += foodData.calories * factor;
              totals.protein += foodData.protein * factor;
              totals.carbs += foodData.carbs * factor;
              totals.fat += foodData.fat * factor;
            });
            return {
              calories: Math.round(totals.calories),
              protein: Math.round(totals.protein),
              carbs: Math.round(totals.carbs),
              fat: Math.round(totals.fat),
            };
          }, [meal]);

          return (
            <div key={idx} className="bg-surface border border-neutral-800 rounded-2xl p-6 mb-4 shadow-2xl animate-in slide-in-from-bottom" style={{ animationDelay: `${idx * 100}ms` }}>
              <h3 className="font-black text-primary-500 uppercase mb-4 border-b border-neutral-800 pb-2 flex justify-between">
                <span>{meal.name}</span>
                <span className="text-[10px] text-neutral-600">Sugerido</span>
              </h3>
              {meal.items.length === 0 ? (
                <p className="text-neutral-600 italic text-sm py-4 text-center">Nenhum alimento identificado nesta refeição.</p>
              ) : (
                <div className="space-y-3">
                  {meal.items.map((item: any, i: number) => (
                    <div key={`${idx}-${i}`} className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-neutral-800/30 group">
                       <span className="text-neutral-200 font-bold group-hover:text-white transition-colors flex-1 pr-2">{item.name}</span>
                       <div className="flex items-center gap-2">
                          <button onClick={() => handleQuantityChange(idx, i, -1)} className="w-8 h-8 flex items-center justify-center bg-neutral-900/70 rounded-full active:scale-90 transition-transform border border-neutral-700">
                            <Minus size={16} className="text-neutral-400" />
                          </button>
                          <div className="flex items-baseline gap-1 text-center w-16 justify-center">
                             <span className="font-black text-primary-500 text-2xl">{item.amount}</span>
                             <span className="text-[10px] text-neutral-500 font-black uppercase">{item.unit}</span>
                          </div>
                           <button onClick={() => handleQuantityChange(idx, i, 1)} className="w-8 h-8 flex items-center justify-center bg-neutral-900/70 rounded-full active:scale-90 transition-transform border border-neutral-700">
                            <Plus size={16} className="text-neutral-400" />
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              )}
              {meal.items.length > 0 && (
                <div className="mt-4 pt-4 border-t border-neutral-800 grid grid-cols-4 gap-2 text-center">
                    <div className="bg-black/40 p-2 rounded-lg">
                        <p className="text-[10px] text-neutral-500 font-bold uppercase">PTN</p>
                        <p className="font-bold text-sm text-primary-500">{mealTotals.protein}g</p>
                    </div>
                    <div className="bg-black/40 p-2 rounded-lg">
                        <p className="text-[10px] text-neutral-500 font-bold uppercase">Gord</p>
                        <p className="font-bold text-sm text-primary-500">{mealTotals.fat}g</p>
                    </div>
                    <div className="bg-black/40 p-2 rounded-lg">
                        <p className="text-[10px] text-neutral-500 font-bold uppercase">Carbo</p>
                        <p className="font-bold text-sm text-primary-500">{mealTotals.carbs}g</p>
                    </div>
                    <div className="bg-black/40 p-2 rounded-lg">
                        <p className="text-[10px] text-neutral-500 font-bold uppercase">Kcal</p>
                        <p className="font-bold text-sm text-primary-500">{mealTotals.calories}</p>
                    </div>
                </div>
              )}
            </div>
          )
        })}
        
        {plan && plan.length > 0 && (
          <div className="bg-surface border-2 border-primary-500/30 rounded-2xl p-6 my-8 shadow-2xl shadow-primary-500/10">
            <h3 className="font-black text-primary-500 uppercase mb-4 border-b border-neutral-800 pb-2 flex justify-center text-center">
                <span>TOTAIS DO DIA</span>
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-black/40 p-2 rounded-lg">
                    <p className="text-[10px] text-neutral-500 font-bold uppercase">PTN</p>
                    <p className="font-bold text-sm text-primary-500">{dailyTotals.protein}g</p>
                </div>
                <div className="bg-black/40 p-2 rounded-lg">
                    <p className="text-[10px] text-neutral-500 font-bold uppercase">Gord</p>
                    <p className="font-bold text-sm text-primary-500">{dailyTotals.fat}g</p>
                </div>
                <div className="bg-black/40 p-2 rounded-lg">
                    <p className="text-[10px] text-neutral-500 font-bold uppercase">Carbo</p>
                    <p className="font-bold text-sm text-primary-500">{dailyTotals.carbs}g</p>
                </div>
                <div className="bg-black/40 p-2 rounded-lg">
                    <p className="text-[10px] text-neutral-500 font-bold uppercase">Kcal</p>
                    <p className="font-bold text-sm text-primary-500">{dailyTotals.calories}</p>
                </div>
            </div>
          </div>
        )}

        <div className="p-6 bg-primary-500/5 border border-primary-500/10 rounded-2xl mb-8 mt-4">
           <p className="text-xs text-center text-neutral-400 font-medium">
             Dica: Capture a tela para salvar e não esquecer a sugestão do seu plano! Beba bastante água!
           </p>
        </div>

        <Button fullWidth onClick={() => navigate('/')} className="mb-4">NOVO CÁLCULO</Button>
      </div>
    </ScreenWrapper>
  );
};

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/legal" element={<LegalScreen />} />
        <Route path="/calculator" element={<CalculatorScreen />} />
        <Route path="/setup-meals" element={<SetupMealsScreen />} />
        <Route path="/diary" element={<DiaryScreen />} />
        <Route path="/final" element={<FinalScreen />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
