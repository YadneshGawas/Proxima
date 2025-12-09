import { Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockUserCredits } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export function CreditsDisplay() {
  const navigate = useNavigate();
  const credits = mockUserCredits;

  return (
    <Button
      variant="outline"
      className="gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10"
      onClick={() => navigate('/credits')}
    >
      <Coins className="h-4 w-4 text-primary" />
      <span className="font-semibold text-primary">{credits.balance}</span>
      <span className="hidden text-muted-foreground sm:inline">credits</span>
    </Button>
  );
}