import { ArrowUpRight, ArrowDownLeft, History, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useBalance';
import Navbar from '@/components/Navbar';

export default function TransactionsPage() {
  const { user } = useAuth();
  const { data: transactions, isLoading, refetch } = useTransactions();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Transaction History
              </CardTitle>
              <CardDescription>All your past transactions</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>
            ) : !transactions || transactions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No transactions yet</p>
                <p className="text-sm mt-1">Your transaction history will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx, index) => {
                  const isSent = tx.fromUser === user?.username;
                  return (
                    <div
                      key={`${tx.fromUser}-${tx.toUser}-${tx.date}-${index}`}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-full ${
                            isSent ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                          }`}
                        >
                          {isSent ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-medium">
                            {isSent ? `Sent to ${tx.toUser}` : `Received from ${tx.fromUser}`}
                          </p>
                          <p className="text-sm text-muted-foreground">{formatDate(tx.date)}</p>
                          <p className="text-xs text-muted-foreground capitalize">{tx.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${isSent ? 'text-red-600' : 'text-green-600'}`}>
                          {isSent ? '-' : '+'}
                          {formatCurrency(tx.amount)}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            tx.status === 'SUCCESS'
                              ? 'bg-green-100 text-green-700'
                              : tx.status === 'FAILED'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

