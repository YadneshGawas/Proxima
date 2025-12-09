import { useState } from 'react';
import { CreditCard, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

interface AddCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const creditPacks = [
  { id: '50', amount: 50, price: 5 },
  { id: '100', amount: 100, price: 9, popular: true },
  { id: '250', amount: 250, price: 20 },
  { id: '500', amount: 500, price: 35 },
];

export function AddCreditsModal({ open, onOpenChange }: AddCreditsModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPack, setSelectedPack] = useState('100');
  const [customAmount, setCustomAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const pack = creditPacks.find(p => p.id === selectedPack);
    const amount = pack ? pack.amount : parseInt(customAmount) || 0;

    toast({
      title: 'Credits Added!',
      description: `${amount} credits have been added to your account.`,
    });

    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Add Credits
          </DialogTitle>
          <DialogDescription>
            Choose a credit pack or enter a custom amount.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup value={selectedPack} onValueChange={setSelectedPack} className="grid grid-cols-2 gap-4">
            {creditPacks.map((pack) => (
              <div key={pack.id}>
                <RadioGroupItem
                  value={pack.id}
                  id={pack.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={pack.id}
                  className="flex flex-col items-center justify-between rounded-lg border-2 border-border bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                >
                  {pack.popular && (
                    <span className="mb-1 text-xs font-medium text-primary">Popular</span>
                  )}
                  <span className="text-2xl font-bold">{pack.amount}</span>
                  <span className="text-sm text-muted-foreground">credits</span>
                  <span className="mt-2 text-lg font-semibold text-primary">${pack.price}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or custom amount</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customAmount">Custom Credits</Label>
            <Input
              id="customAmount"
              type="number"
              min="1"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                if (e.target.value) setSelectedPack('');
              }}
              placeholder="Enter amount..."
              onFocus={() => setSelectedPack('')}
            />
            {customAmount && (
              <p className="text-sm text-muted-foreground">
                Estimated cost: ${(parseInt(customAmount) * 0.1).toFixed(2)}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || (!selectedPack && !customAmount)}>
              {isSubmitting ? (
                'Processing...'
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Add Credits
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}