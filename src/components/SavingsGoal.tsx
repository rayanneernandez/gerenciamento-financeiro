import { useState, useEffect } from 'react';
import { PiggyBank, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { useSavings } from '@/hooks/useSavings';

export function SavingsGoal() {
  const { savingsCurrent, savingsGoal, loading, updateSavingsGoal } = useSavings();
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempCurrent, setTempCurrent] = useState("");
  const [tempGoal, setTempGoal] = useState("");

  const formatCurrencyInput = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const floatValue = Number(numericValue) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(floatValue);
  };

  const parseCurrencyInput = (value: string) => {
    return Number(value.replace(/\D/g, '')) / 100;
  };

  useEffect(() => {
    if (!loading) {
      setTempCurrent(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(savingsCurrent));
      setTempGoal(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(savingsGoal));
    }
  }, [loading, savingsCurrent, savingsGoal]);

  const handleSaveGoal = async () => {
    const current = parseCurrencyInput(tempCurrent);
    const goal = parseCurrencyInput(tempGoal);
    
    if (isNaN(current) || isNaN(goal)) {
      toast.error('Valores inválidos');
      return;
    }

    try {
      await updateSavingsGoal(current, goal);
      setIsEditingGoal(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const savingsPercentage = Math.min((savingsCurrent / savingsGoal) * 100, 100);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-card/50 border border-white/5 rounded-2xl p-5 space-y-4 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <PiggyBank className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Meu Cofrinho</h3>
            <p className="text-xs text-white/70">Meta de Economia</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditingGoal(!isEditingGoal)}>
          {isEditingGoal ? 'Cancelar' : 'Editar Meta'}
        </Button>
      </div>

      {isEditingGoal ? (
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="space-y-1">
            <label className="text-xs text-white/70">Tenho Hoje</label>
            <Input 
              type="text" 
              value={tempCurrent} 
              onChange={(e) => setTempCurrent(formatCurrencyInput(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-white/70">Quero Atingir</label>
            <Input 
              type="text" 
              value={tempGoal} 
              onChange={(e) => setTempGoal(formatCurrencyInput(e.target.value))}
            />
          </div>
          <Button className="col-span-2 mt-2" onClick={handleSaveGoal}>Salvar Alterações</Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Progresso</span>
            <span className="font-medium text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(savingsCurrent)} / 
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(savingsGoal)}
            </span>
          </div>
          <Progress value={savingsPercentage} className="h-2" />
          <p className="text-xs text-right text-white/60">{savingsPercentage.toFixed(0)}% da meta atingida</p>
        </div>
      )}
    </div>
  );
}