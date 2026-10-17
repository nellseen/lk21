import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Film, 
  Search, 
  Compass, 
  ShieldCheck, 
  Sun, 
  Moon, 
  LogOut, 
  Menu, 
  X, 
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navLinks = [
    { name: 'Beranda', path: '/', icon: Film },
    { name: 'Jelajahi', path: '/browse', icon: Compass },
    { name: 'Pencarian', path: '/search', icon: Search }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'glass-nav py-3 shadow-xl'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2.5 group focus:outline-none"
          aria-label="AuraStream Cinema Beranda"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="font-cinzel text-xl font-black tracking-widest gold-gradient-text leading-tight">
              AURA<span className="font-light tracking-normal opacity-90 text-[var(--color-text-primary)]">STREAM</span>
            </span>
            <span className="text-[9px] tracking-[0.25em] text-[var(--color-gold-primary)] uppercase font-semibold">
              Cinema Exclusive
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'text-[var(--color-gold-primary)] bg-[var(--color-gold-glow)] shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Admin Link if verified admin */}
          {isAdmin && (
            <Link
              to="/admin"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all border ${
                isActive('/admin')
                  ? 'border-[var(--color-gold-primary)] bg-[var(--color-gold-primary)] text-black font-semibold'
                  : 'border-[var(--color-gold-primary)]/40 text-[var(--color-gold-primary)] hover:bg-[var(--color-gold-primary)]/10'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Panel Admin</span>
            </Link>
          )}
        </nav>

        {/* Right Action Tools: Theme Toggle & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5 transition-colors cursor-pointer border border-[var(--color-border-subtle)]"
            aria-label={theme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
            title={theme === 'dark' ? 'Tema Terang' : 'Tema Gelap'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* User Account / Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full glass-card hover:border-[var(--color-border-glass)] cursor-pointer"
                aria-label="Menu Pengguna"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Pengguna'}
                    className="w-7 h-7 rounded-full object-cover border border-[var(--color-gold-primary)]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[var(--color-gold-glow)] text-[var(--color-gold-primary)] flex items-center justify-center font-bold text-xs">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-medium text-[var(--color-text-primary)] hidden sm:inline max-w-[100px] truncate">
                  {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
                {isAdmin && (
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-gold-primary)] hidden sm:inline" />
                )}
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl shadow-2xl p-3 border border-[var(--color-border-glass)] animate-fadeIn">
                  <div className="px-3 py-2 border-b border-[var(--color-border-subtle)] mb-2">
                    <p className="text-sm font-bold text-[var(--color-text-primary)] truncate">
                      {user.displayName || 'Akun Google'}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] truncate">
                      {user.email}
                    </p>
                    {isAdmin ? (
                      <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Official Administrator
                      </span>
                    ) : (
                      <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] uppercase font-medium tracking-wider rounded-md bg-white/10 text-[var(--color-text-secondary)]">
                        Penonton Terverifikasi
                      </span>
                    )}
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[var(--color-gold-primary)] hover:bg-white/5 rounded-xl transition-colors mb-1"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Studio Panel Admin
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      window.dispatchEvent(new CustomEvent('open-firebase-config'));
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5 rounded-xl transition-colors cursor-pointer mb-1"
                  >
                    <Sparkles className="w-4 h-4 text-[var(--color-gold-primary)]" />
                    <span>Pengaturan Firebase</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar dari Sesi
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="gold-button px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </Link>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5 border border-[var(--color-border-subtle)]"
            aria-label="Buka menu navigasi"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav border-t border-[var(--color-border-subtle)] mt-2 px-4 py-4 space-y-2 animate-fadeIn">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  active
                    ? 'text-[var(--color-gold-primary)] bg-[var(--color-gold-glow)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                isActive('/admin')
                  ? 'bg-[var(--color-gold-primary)] text-black font-semibold'
                  : 'text-[var(--color-gold-primary)] bg-[var(--color-gold-primary)]/10'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Panel Admin Studio</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
