import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Loader2, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBalance, useTransfer } from '@/hooks/useBalance';
import { useUserSearch } from '@/hooks/useUsers';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import { transferSchema, type TransferFormData } from '@/lib/validations';
import { v4 as uuidv4 } from '@/lib/uuid';

export default function TransferPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: balanceData } = useBalance();
  const { mutate: transfer, isPending } = useTransfer();
  const { setSearchTerm, users, isFetching } = useUserSearch();
  const [formData, setFormData] = useState({ toUsername: '', amount: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof TransferFormData, string>>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Filter out current user from suggestions
  const filteredUsers = users.filter((u) => u.username !== user?.username);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, toUsername: value }));
    setSearchTerm(value);
    setShowSuggestions(true);
    setErrors((prev) => ({ ...prev, toUsername: undefined }));
  };

  const handleSelectUser = (username: string) => {
    setFormData((prev) => ({ ...prev, toUsername: username }));
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, amount: value }));
    setErrors((prev) => ({ ...prev, amount: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToValidate = {
      toUsername: formData.toUsername,
      amount: parseFloat(formData.amount) || 0,
    };
    const result = transferSchema.safeParse(dataToValidate);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof TransferFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof TransferFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    if (dataToValidate.amount > (balanceData?.balance || 0)) {
      setErrors({ amount: 'Insufficient balance' });
      return;
    }
    transfer(
      { toUsername: dataToValidate.toUsername, amount: dataToValidate.amount, requestId: uuidv4() },
      { onSuccess: () => navigate('/dashboard') }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary rounded-full p-2">
                  <ArrowUpRight className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Send Money</CardTitle>
                  <CardDescription>Transfer to another user</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(balanceData?.balance || 0)}</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2 relative" ref={suggestionRef}>
                  <Label htmlFor="toUsername">Recipient Username</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="toUsername"
                      name="toUsername"
                      placeholder="Search for a user..."
                      value={formData.toUsername}
                      onChange={handleUsernameChange}
                      onFocus={() => formData.toUsername && setShowSuggestions(true)}
                      disabled={isPending}
                      className="pl-9"
                      autoComplete="off"
                    />
                    {isFetching && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>

                  {/* User suggestions dropdown */}
                  {showSuggestions && filteredUsers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredUsers.map((userItem) => (
                        <button
                          key={userItem.id}
                          type="button"
                          className="w-full px-4 py-3 text-left hover:bg-muted flex items-center gap-3 border-b last:border-b-0"
                          onClick={() => handleSelectUser(userItem.username)}
                        >
                          <div className="bg-primary/10 rounded-full p-2">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{userItem.username}</p>
                            <p className="text-sm text-muted-foreground">
                              {userItem.firstName} {userItem.lastName}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* No results message */}
                  {showSuggestions && formData.toUsername.length > 0 && !isFetching && filteredUsers.length === 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg p-4 text-center text-muted-foreground">
                      No users found
                    </div>
                  )}

                  {errors.toUsername && <p className="text-sm text-destructive">{errors.toUsername}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="Enter amount"
                    min="1"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleAmountChange}
                    disabled={isPending}
                  />
                  {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)} disabled={isPending}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Money'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

