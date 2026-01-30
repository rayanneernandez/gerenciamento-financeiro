import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export function useSavings() {
  const { user } = useAuth();
  const [savingsCurrent, setSavingsCurrent] = useState(0);
  const [savingsGoal, setSavingsGoal] = useState(1000);
  const [loading, setLoading] = useState(true);

  const loadSavingsGoal = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading savings goal:', error);
        return;
      }

      if (data) {
        setSavingsCurrent(Number(data.current_amount));
        setSavingsGoal(Number(data.target_amount));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavingsGoal();
  }, [user]);

  const updateSavingsGoal = async (current: number, goal: number) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      const { error } = await supabase
        .from('savings_goals')
        .upsert({ 
          user_id: user.id,
          current_amount: current,
          target_amount: goal,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      setSavingsCurrent(current);
      setSavingsGoal(goal);
      toast.success('Metas do cofrinho atualizadas!');
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Erro ao salvar metas');
      throw error;
    }
  };

  return {
    savingsCurrent,
    savingsGoal,
    loading,
    updateSavingsGoal
  };
}