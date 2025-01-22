'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, Trophy, Car, Flag,
  Bell, LogOut, User, Settings, Crown, MapPin, 
  Scroll, Download, Play, Apple
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { NavbarLoading } from './NavbarLoading';
import Image from 'next/image';
import { NotificationBell } from '../notifications/NotificationBell';
import { PitDeckLogo } from '../ui/logo';
import { UserBalance } from '../user/UserBalance';

const mainLinks = [
  { 
    name: 'Collection', 
    href: '/collection',
    requiresAuth: true 
  },
  { 
    name: 'Trading', 
    href: '/trading',
    requiresAuth: true 
  },
  { 
    name: 'Marketplace', 
    href: '/marketplace',
    requiresAuth: true 
  },
  { 
    name: 'Packs', 
    href: '/packs',
    requiresAuth: true 
  },
  { 
    name: 'Roadmap', 
    href: '/roadmap',
    requiresAuth: false 
  },
  { 
    name: 'Waitlist', 
    href: '/waitlist',
    requiresAuth: false 
  },
  { 
    name: 'Features', 
    href: '/features',
    requiresAuth: false 
  },
];

const seriesLinks = [
  { name: 'Formula 1', href: '/series/f1', icon: Car },
  { name: 'WEC', href: '/series/wec', icon: Flag },
  { name: 'IndyCar', href: '/series/indycar', icon: Trophy },
];


export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSeriesMenuOpen, setIsSeriesMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const userMenuItems = [
    { label: 'Profile', href: `/profile/${session?.user?.name}`, icon: User },
    { label: 'Map', href: '/map', icon: MapPin },
    { label: 'Quests', href: '/quests', icon: Scroll },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const visibleLinks = mainLinks.filter(link => 
    !link.requiresAuth || (link.requiresAuth && status === 'authenticated')
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl border-b border-white/10" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <PitDeckLogo className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {visibleLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm ${
                  pathname === link.href 
                    ? 'text-white' 
                    : 'text-gray-300 hover:text-white'
                } transition-colors`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Series Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSeriesMenuOpen(!isSeriesMenuOpen)}
                className="flex items-center space-x-1 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <span>Series</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              <AnimatePresence>
                {isSeriesMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-2 w-48 py-2 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10"
                  >
                    {seriesLinks.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <NavbarLoading />
            ) : status === 'authenticated' ? (
              <>
                <UserBalance initialBalance={session?.user?.coins || 0} />
                <NotificationBell />
                <UserMenu 
                  session={session} 
                  isOpen={isUserMenuOpen}
                  setIsOpen={setIsUserMenuOpen}
                />
              </>
            ) : (
              <>
                <Link
                  href="/waitlist"
                  className="group relative overflow-hidden rounded-full bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 inline-flex items-center hover:bg-white/10 transition-colors"
                >
                  <span className="relative text-white text-sm flex items-center">
                    <Download className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-1" />
                    Join Waitlist
                  </span>
                </Link>
                <Link
                  href="/auth/signin"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative p-2 text-gray-300 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu 
            session={session} 
            status={status}
            seriesLinks={seriesLinks}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}

// Separate components for cleaner organization
function UserMenu({ session, isOpen, setIsOpen }: { session: any, isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {
  const userMenuItems = [
    { label: 'Profile', href: `/profile/${session?.user?.name}`, icon: User },
    { label: 'Map', href: '/map', icon: MapPin },
    { label: 'Quests', href: '/quests', icon: Scroll },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 rounded-full hover:bg-white/10 transition-colors"
      >
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || ''}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="h-8 w-8 bg-gradient-to-br from-red-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {session.user.name?.charAt(0)}
            </span>
          </div>
        )}
        <ChevronDown className="h-4 w-4 text-white/60" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 py-2 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10"
          >
            {userMenuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
            <hr className="my-2 border-white/10" />
            <button
              onClick={() => signOut()}
              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMenu({ session, status, seriesLinks, onClose }: { session: any, status: any, seriesLinks: any, onClose: any }) {
  const userMenuItems = [
    { label: 'Profile', href: `/profile/${session?.user?.name}`, icon: User },
    { label: 'Map', href: '/map', icon: MapPin },
    { label: 'Quests', href: '/quests', icon: Scroll },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];
  const visibleLinks = mainLinks.filter(link => 
    !link.requiresAuth || (link.requiresAuth && status === 'authenticated')
  );

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="relative md:hidden border-t border-white/10"
    >
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
      <div className="relative px-4 py-6 space-y-6">
        <div className="space-y-3">
          {visibleLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={onClose}
              className="block px-2 py-2 text-base text-gray-300 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
          
          {/* Mobile Series Links */}
          <div className="pt-2 pb-1 px-2 text-sm text-gray-500">Series</div>
          {seriesLinks.map((item: any) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className="flex items-center space-x-2 px-2 py-2 text-base text-gray-300 hover:text-white transition-colors"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="pt-4">
          {status === 'authenticated' ? (
            <div className="space-y-3">
              {userMenuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <button
                onClick={() => {
                  signOut();
                  onClose();
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                href="/waitlist"
                onClick={onClose}
                className="block w-full px-4 py-2 text-center text-white bg-gradient-to-r from-red-600 to-blue-600 rounded-full hover:opacity-90 transition-opacity"
              >
                Join Waitlist
              </Link>
              <Link
                href="/auth/signin"
                onClick={onClose}
                className="block w-full px-4 py-2 text-center text-white border border-white/10 rounded-full hover:bg-white/10 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}