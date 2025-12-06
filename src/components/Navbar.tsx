import { Link, useLocation } from 'react-router-dom';
import { Wallet, LogOut, LayoutDashboard, ArrowUpRight, History, Menu, X, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transfer', label: 'Transfer', icon: ArrowUpRight },
  { to: '/transactions', label: 'Transactions', icon: History },
  { to: '/profile', label: 'Profile', icon: UserCircle },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-1.5">
              <Wallet className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">Paytm</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link key={link.to} to={link.to}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={`gap-2 ${isActive ? 'bg-primary/10 text-primary' : ''}`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* User & Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Hello, </span>
              <span className="font-medium">{user?.username}</span>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t pt-4 mt-4">
              <div className="px-4 pb-3 text-sm">
                <span className="text-muted-foreground">Logged in as </span>
                <span className="font-medium">{user?.username}</span>
              </div>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

