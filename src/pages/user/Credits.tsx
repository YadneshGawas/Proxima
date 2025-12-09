import { useState } from 'react';
import { CreditCard, Plus, ArrowUpRight, ArrowDownLeft, RotateCcw, Wallet } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockUserCredits } from '@/data/mockData';
import { AddCreditsModal } from '@/components/AddCreditsModal';
import { format } from 'date-fns';

export default function Credits() {
  const [addCreditsOpen, setAddCreditsOpen] = useState(false);
  const credits = mockUserCredits;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-primary" />;
      case 'deduction':
        return <ArrowUpRight className="h-4 w-4 text-destructive" />;
      case 'refund':
        return <RotateCcw className="h-4 w-4 text-chart-2" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'deposit':
        return <Badge className="bg-primary/10 text-primary">Deposit</Badge>;
      case 'deduction':
        return <Badge className="bg-destructive/10 text-destructive">Deduction</Badge>;
      case 'refund':
        return <Badge className="bg-chart-2/10 text-chart-2">Refund</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getAmountDisplay = (type: string, amount: number) => {
    const prefix = type === 'deduction' ? '-' : '+';
    const colorClass = type === 'deduction' ? 'text-destructive' : 'text-primary';
    return <span className={`font-semibold ${colorClass}`}>{prefix}{amount} credits</span>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Credits</h1>
            <p className="text-muted-foreground">Manage your credits for hackathon registrations</p>
          </div>
          <Button onClick={() => setAddCreditsOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Credits
          </Button>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border-primary/20">
          <CardContent className="py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-4xl font-bold text-foreground">{credits.balance}</p>
                  <p className="text-sm text-muted-foreground">credits available</p>
                </div>
              </div>
              <div className="hidden sm:block">
                <Button size="lg" onClick={() => setAddCreditsOpen(true)}>
                  <Plus className="mr-2 h-5 w-5" />
                  Add Credits
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Packs */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">Quick Add</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { amount: 50, price: 5, popular: false },
              { amount: 100, price: 9, popular: true },
              { amount: 250, price: 20, popular: false },
              { amount: 500, price: 35, popular: false },
            ].map((pack) => (
              <Card 
                key={pack.amount} 
                className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 ${pack.popular ? 'border-primary ring-1 ring-primary' : ''}`}
                onClick={() => setAddCreditsOpen(true)}
              >
                <CardContent className="py-6 text-center">
                  {pack.popular && (
                    <Badge className="mb-2">Most Popular</Badge>
                  )}
                  <p className="text-3xl font-bold text-foreground">{pack.amount}</p>
                  <p className="text-sm text-muted-foreground">credits</p>
                  <p className="mt-2 text-lg font-semibold text-primary">${pack.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your recent credit transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {credits.transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <CreditCard className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No transactions yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credits.transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(transaction.type)}
                          {getTransactionBadge(transaction.type)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{transaction.description}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(transaction.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        {getAmountDisplay(transaction.type, transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <AddCreditsModal open={addCreditsOpen} onOpenChange={setAddCreditsOpen} />
    </DashboardLayout>
  );
}