import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface WishlistItem {
  id: string;
  description: string;
  price: number;
  priority: 'Alta' | 'Média' | 'Baixa';
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { user } = useAuth();

  const fetchItems = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setItems(data);
    } catch (error) {
      console.error('Erro ao buscar lista de desejos', error);
    }
  };

  useEffect(() => {
    if (user) fetchItems();
  }, [user]);

  const addItem = async (item: Omit<WishlistItem, 'id'>) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .insert([{ ...item, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setItems(prev => [data, ...prev]);
        toast.success('Item adicionado à lista!');
      }
    } catch (error) {
      toast.error('Erro ao adicionar item');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success('Item removido!');
    } catch (error) {
      toast.error('Erro ao remover item');
    }
  };

  const updateItem = async (id: string, updates: Partial<Omit<WishlistItem, 'id'>>) => {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setItems(prev => prev.map(item => item.id === id ? data : item));
        toast.success('Item atualizado!');
      }
    } catch (error) {
      toast.error('Erro ao atualizar item');
    }
  };

  return { items, addItem, deleteItem, updateItem };
}