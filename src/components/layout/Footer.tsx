import Link from 'next/link';
import { Trophy, Twitter, Instagram, Youtube, Facebook, Download, Apple, Play } from 'lucide-react';

const APP_VERSION = 'Beta 1.1.0';

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-red-500" />
              <span className="text-xl font-bold text-white font-display tracking-wider">PitDeck</span>
            </div>
            <p className="text-sm text-gray-400">
              The ultimate digital collectible platform for motorsport enthusiasts.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={Twitter} />
              <SocialLink href="#" icon={Instagram} />
              <SocialLink href="#" icon={Youtube} />
              <SocialLink href="#" icon={Facebook} />
            </div>
            <div className="pt-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="group relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all transform group-hover:scale-105">
                    <Apple className="h-5 w-5 text-white" />
                    <div>
                      <div className="text-xs text-white/60">Download on the</div>
                      <div className="text-sm font-semibold text-white">App Store</div>
                    </div>
                  </div>
                </div>
                <div className="group relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all transform group-hover:scale-105">
                    <Play className="h-5 w-5 text-white" />
                    <div>
                      <div className="text-xs text-white/60">Get it on</div>
                      <div className="text-sm font-semibold text-white">Google Play</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Racing Series */}
          <div>
            <h3 className="text-white font-display uppercase tracking-wider text-sm mb-4">Racing Series</h3>
            <ul className="space-y-2">
              <FooterLink href="/series/f1" text="Formula 1" />
              <FooterLink href="/series/wec" text="WEC" />
              <FooterLink href="/series/indycar" text="IndyCar" />
              <FooterLink href="/series/nascar" text="NASCAR" />
              <FooterLink href="/series/formula-e" text="Formula E" />
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-display uppercase tracking-wider text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="/marketplace" text="Marketplace" />
              <FooterLink href="/packs" text="Card Packs" />
              <FooterLink href="/collections" text="Collections" />
              <FooterLink href="/trading" text="Trading" />
              <FooterLink href="/leaderboard" text="Leaderboard" />
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-display uppercase tracking-wider text-sm mb-4">Support</h3>
            <ul className="space-y-2">
              <FooterLink href="/help" text="Help Center" />
              <FooterLink href="/contact" text="Contact Us" />
              <FooterLink href="/faq" text="FAQ" />
              <FooterLink href="/terms" text="Terms of Service" />
              <FooterLink href="/privacy" text="Privacy Policy" />
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} PitDeck. All rights reserved.
              </p>
              <span className="hidden md:inline text-gray-600">•</span>
              <span className="text-xs text-gray-600">{APP_VERSION}</span>
            </div>
            <div className="flex space-x-6">
              <FooterLink href="/terms" text="Terms" />
              <FooterLink href="/privacy" text="Privacy" />
              <FooterLink href="/cookies" text="Cookies" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, text }: { href: string; text: string }) {
  return (
    <li>
      <Link 
        href={href}
        className="text-sm text-gray-400 hover:text-white transition-colors"
      >
        {text}
      </Link>
    </li>
  );
}

function SocialLink({ href, icon: Icon }: { href: string; icon: any }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity" />
      <Icon className="relative h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
    </a>
  );
}