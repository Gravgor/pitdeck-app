import Link from 'next/link';
import { Shield, Image as ImageIcon, Database, UserCircle } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Image Rights */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-xl font-semibold text-white">
              <ImageIcon className="h-6 w-6 text-red-500" />
              <h2>Image Rights and Copyright</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                All motorsport-related images, team logos, driver photos, and car designs displayed on PitDeck are property 
                of their respective owners. This includes but is not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Formula 1® and its associated teams and partners</li>
                <li>FIA World Endurance Championship (WEC)</li>
                <li>IndyCar Series</li>
                <li>NASCAR</li>
                <li>Formula 2 Championship</li>
                <li>Individual racing teams and manufacturers</li>
                <li>Professional motorsport photographers and media agencies</li>
              </ul>
              <p>
                These images are used for informational and entertainment purposes only. We do not claim ownership 
                of any copyrighted material. All rights remain with their respective owners.
              </p>
            </div>
          </section>

          {/* Data Collection */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-xl font-semibold text-white">
              <Database className="h-6 w-6 text-blue-500" />
              <h2>Data Collection and Usage</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                We collect and store the following information to provide our services:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Basic account information (username, email)</li>
                <li>Collection data and trading history</li>
                <li>Game progress and achievements</li>
                <li>User preferences and settings</li>
              </ul>
            </div>
          </section>

          {/* User Content */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-xl font-semibold text-white">
              <UserCircle className="h-6 w-6 text-green-500" />
              <h2>User Content</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                By using PitDeck, you agree that any user-generated content you submit (including profile pictures, 
                comments, and messages) complies with our terms of service and does not infringe on any third-party rights.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-xl font-semibold text-white">
              <Shield className="h-6 w-6 text-yellow-500" />
              <h2>Contact Us</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                For any privacy-related concerns or copyright issues, please contact us at:{' '}
                <Link href="mailto:privacy@pitdeck.app" className="text-blue-400 hover:text-blue-300">
                  privacy@pitdeck.app
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 