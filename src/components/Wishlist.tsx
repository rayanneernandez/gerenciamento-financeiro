import { useState } from 'react';
import { Plus, Trash2, ShoppingBag, Pencil, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWishlist } from '@/hooks/useWishlist';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export function Wishlist() {
  const { items, addItem, deleteItem, updateItem } = useWishlist();
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [priority, setPriority] = useState<'Alta' | 'Média' | 'Baixa'>('Média');
  const [open, setOpen] = useState(false);

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editPriority, setEditPriority] = useState<'Alta' | 'Média' | 'Baixa'>('Média');
  const [editOpen, setEditOpen] = useState(false);

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const floatValue = Number(numericValue) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(floatValue);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const formatted = formatCurrency(e.target.value);
    if (isEdit) {
      setEditPrice(formatted);
    } else {
      setPrice(formatted);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !price) return;

    const numericPrice = Number(price.replace(/\D/g, '')) / 100;

    addItem({
      description,
      price: numericPrice,
      priority
    });
    setDescription('');
    setPrice('');
    setPriority('Média');
    setOpen(false);
  };

  const handleEditClick = (item: any) => {
    setEditingId(item.id);
    setEditDescription(item.description);
    setEditPrice(formatCurrency((item.price * 100).toString()));
    setEditPriority(item.priority);
    setEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editDescription || !editPrice) return;

    const numericPrice = Number(editPrice.replace(/\D/g, '')) / 100;

    updateItem(editingId, {
      description: editDescription,
      price: numericPrice,
      priority: editPriority
    });

    setEditingId(null);
    setEditOpen(false);
  };

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <ShoppingBag className="h-5 w-5 text-purple-500" />
          </div>
          <CardTitle>Lista de Desejos</CardTitle>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar à Lista de Desejos</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="desc">O que quer comprar?</Label>
                <Input
                  id="desc"
                  placeholder="Ex: Novo Celular"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Valor Estimado</Label>
                <Input
                  id="price"
                  type="text"
                  placeholder="R$ 0,00"
                  value={price}
                  onChange={(e) => handlePriceChange(e)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Adicionar</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Editar Desejo
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-desc">O que quer comprar?</Label>
                <Input
                  id="edit-desc"
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Valor Estimado</Label>
                <Input
                  id="edit-price"
                  type="text"
                  value={editPrice}
                  onChange={(e) => handlePriceChange(e, true)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Prioridade</Label>
                <Select value={editPriority} onValueChange={(v: any) => setEditPriority(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Salvar Alterações</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-white/5 group">
              <div>
                <p className="font-medium">{item.description}</p>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    item.priority === 'Alta' ? 'bg-red-500/20 text-red-500' :
                    item.priority === 'Média' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-green-500/20 text-green-500'
                  }`}>{item.priority}</span>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={() => handleEditClick(item)} className="text-muted-foreground hover:text-primary">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-4">Sua lista está vazia</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}