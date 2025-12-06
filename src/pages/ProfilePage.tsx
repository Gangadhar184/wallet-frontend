import { useState } from 'react';
import { User, Lock, Loader2, Mail, Phone, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/Navbar';
import { useCurrentUser, useUpdateProfile, useUpdatePassword } from '@/hooks/useUsers';
import type { UpdatePasswordRequest } from '@/types';

export default function ProfilePage() {
  const { data: currentUser, isLoading } = useCurrentUser();
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();
  const { mutate: updatePassword, isPending: isUpdatingPassword } = useUpdatePassword();

  const [passwordData, setPasswordData] = useState<UpdatePasswordRequest>({
    oldPassword: '',
    newPassword: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateProfile({
      email: formData.get('email') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
      setPasswordError('');
    } else {
      setPasswordData((prev) => ({ ...prev, [name]: value }));
      setPasswordError('');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    updatePassword(passwordData, {
      onSuccess: () => {
        setPasswordData({ oldPassword: '', newPassword: '' });
        setConfirmPassword('');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[250px] w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
              <UserCircle className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">{currentUser?.username}</h1>
            <p className="text-muted-foreground">Manage your account settings</p>
          </div>

          {/* Profile Information Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary rounded-full p-2">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4" key={currentUser?.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" defaultValue={currentUser?.firstName || ''} disabled={isUpdatingProfile} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" defaultValue={currentUser?.lastName || ''} disabled={isUpdatingProfile} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email"><Mail className="inline h-4 w-4 mr-1" />Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={currentUser?.email || ''} disabled={isUpdatingProfile} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone"><Phone className="inline h-4 w-4 mr-1" />Phone</Label>
                  <Input id="phone" name="phone" defaultValue={currentUser?.phone || ''} disabled={isUpdatingProfile} placeholder="10-digit phone number" />
                </div>
                <Button type="submit" disabled={isUpdatingProfile} className="w-full md:w-auto">
                  {isUpdatingProfile ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 rounded-full p-2">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password for security</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="oldPassword">Current Password</Label>
                  <Input
                    id="oldPassword"
                    name="oldPassword"
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    disabled={isUpdatingPassword}
                    placeholder="Enter your current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    disabled={isUpdatingPassword}
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={handlePasswordChange}
                    disabled={isUpdatingPassword}
                    placeholder="Confirm new password"
                  />
                </div>
                {passwordError && (
                  <p className="text-sm text-destructive">{passwordError}</p>
                )}
                <Button type="submit" disabled={isUpdatingPassword} variant="outline" className="w-full md:w-auto">
                  {isUpdatingPassword ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</> : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Username</p>
                  <p className="font-medium">{currentUser?.username}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${currentUser?.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {currentUser?.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Member Since</p>
                  <p className="font-medium">{currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{currentUser?.updatedAt ? new Date(currentUser.updatedAt).toLocaleDateString() : '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

