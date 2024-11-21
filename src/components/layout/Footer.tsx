import Link from 'next/link';
import { Trophy, Twitter, Instagram, Youtube, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
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
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
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
            <h3 className="text-white font-semibold mb-4">Support</h3>
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
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} PitDeck. All rights reserved.
            </p>
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

// Helper Components
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
      className="p-2 text-gray-400 hover:text-white transition-colors"
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}