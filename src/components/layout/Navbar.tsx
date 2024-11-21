'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, Trophy, Wallet, 
  Users, Star, CircuitBoard, Car, Flag,
  Bell,
  CreditCard,
  LogOut,
  User,
  Settings,
  Package,
  Crown,
  MapPin,
  Scroll
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { NavbarLoading } from './NavbarLoading';
import Image from 'next/image';
import { NotificationBell } from '../notifications/NotificationBell';
import { PitDeckLogo } from '../ui/logo';
const seriesLinks = [
  { name: 'Formula 1', href: '/series/f1', icon: Car },
  { name: 'WEC', href: '/series/wec', icon: Flag },
  { name: 'IndyCar', href: '/series/indycar', icon: CircuitBoard },
  { name: 'NASCAR', href: '/series/nascar', icon: Trophy },
  { name: 'Formula E', href: '/series/formula-e', icon: Car },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSeriesMenuOpen, setIsSeriesMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const mainLinks = status === 'authenticated' 
    ? [
        { name: 'Marketplace', href: '/marketplace' },
        { name: 'Packs', href: '/packs' },
        { name: 'Collections', href: '/collections' },
        { name: 'Trading', href: '/trading' },
      ]
    : [
        { name: 'Collections', href: '/collections' },
      ];

  const userMenuItems = [
    { label: 'Profile', href: `/profile/${session?.user?.name}`, icon: User },
    { label: 'My Collection', href: '/collection', icon: Package },
    { label: 'Trading', href: '/trading', icon: Users },
    { label: 'Map', href: '/map', icon: MapPin },
    { label: 'Quests', href: '/quests', icon: Scroll },
    { label: 'Achievements', href: '/achievements', icon: Crown },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <PitDeckLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Series Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSeriesMenuOpen(!isSeriesMenuOpen)}
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
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
                    className="absolute top-full left-0 w-48 py-2 mt-2 bg-black/90 backdrop-blur-lg rounded-lg border border-white/10"
                  >
                    {seriesLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <link.icon className="h-4 w-4 mr-2" />
                        {link.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Main Navigation Links */}
            {mainLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm ${
                  pathname === link.href ? 'text-white' : 'text-gray-300 hover:text-white'
                } transition-colors`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <NavbarLoading />
            ) : status === 'authenticated' ? (
              <>
                {/* Balance */}
                <div className="px-4 py-2 bg-white/5 rounded-full flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-white font-display">
                    {session.user.coins || 0} RC
                  </span>
                </div>

               <NotificationBell />

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
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
                      <div className="h-8 w-8 bg-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-display">
                          {session.user.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-lg rounded-lg border border-white/10 shadow-xl"
                      >
                        {/*@ts-ignore */}
                        {status === 'loading' ? (
                          <div className="p-2 space-y-2">
                            {[...Array(4)].map((_, index) => (
                              <div 
                                key={index}
                                className="flex items-center space-x-2 px-4 py-2"
                              >
                                <div className="h-4 w-4 bg-white/10 rounded animate-pulse" />
                                <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-2">
                            {userMenuItems.map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                              >
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                              </Link>
                            ))}
                            <hr className="my-2 border-white/10" />
                            <button
                              onClick={() => signOut()}
                              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <LogOut className="h-4 w-4" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm text-white hover:text-white/80 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
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
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Series Links */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-400">Series</h3>
                {seriesLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center px-2 py-2 text-base text-gray-300 hover:text-white transition-colors"
                  >
                    <link.icon className="h-5 w-5 mr-3" />
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Main Links */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-400">Navigation</h3>
                {mainLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block px-2 py-2 text-base text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Links */}
              <div className="pt-4 space-y-3">
                <Link
                  href="/auth/signin"
                  className="block w-full px-4 py-2 text-center text-white border border-white/10 rounded-full hover:bg-white/10 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block w-full px-4 py-2 text-center bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}