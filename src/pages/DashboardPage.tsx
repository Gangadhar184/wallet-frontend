import { Link } from 'react-router-dom';
import { Wallet, ArrowUpRight, ArrowDownLeft, History, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useBalance, useTransactions } from '@/hooks/useBalance';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: balanceData, isLoading: balanceLoading, refetch: refetchBalance } = useBalance();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions();

  const recentTransactions = transactions?.slice(0, 5) || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-muted-foreground mt-1">Here's your account overview</p>
        </div>

        {/* Balance Card */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="col-span-full md:col-span-1 bg-linear-to-br from-primary to-primary/80 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium opacity-90">Available Balance</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => refetchBalance()} className="text-primary-foreground hover:bg-white/10">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {balanceLoading ? (
                <Skeleton className="h-10 w-32 bg-white/20" />
              ) : (
                <div className="text-3xl font-bold">{formatCurrency(balanceData?.balance || 0)}</div>
              )}
              <div className="flex items-center gap-1 mt-2 opacity-80">
                <Wallet className="h-4 w-4" />
                <span className="text-sm">Paytm Wallet</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Link to="/transfer" className="flex-1">
                <Button className="w-full h-20 flex flex-col gap-2" variant="outline">
                  <ArrowUpRight className="h-6 w-6" />
                  <span>Send Money</span>
                </Button>
              </Link>
              <Link to="/transactions" className="flex-1">
                <Button className="w-full h-20 flex flex-col gap-2" variant="outline">
                  <History className="h-6 w-6" />
                  <span>History</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest transactions</CardDescription>
            </div>
            <Link to="/transactions">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No transactions yet</p>
                <Link to="/transfer">
                  <Button variant="link" className="mt-2">Make your first transfer</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((tx, index) => {
                  const isSent = tx.fromUser === user?.username;
                  return (
                    <div key={`${tx.fromUser}-${tx.toUser}-${tx.date}-${index}`} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${isSent ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {isSent ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium">{isSent ? tx.toUser : tx.fromUser}</p>
                          <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`font-semibold ${isSent ? 'text-red-600' : 'text-green-600'}`}>
                        {isSent ? '-' : '+'}{formatCurrency(tx.amount)}
                      </span>
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

