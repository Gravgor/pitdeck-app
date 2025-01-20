import { Scale, Shield, FileText, Users, Lock } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-blue-600/30 to-transparent animate-gradient" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full 
                         border border-white/10 bg-white/5 backdrop-blur-sm">
              <Scale className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-sm text-white/80">Legal</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">Service</span>
            </h1>
            <p className="text-lg text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={section.title} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-2xl opacity-10 blur-xl" />
              <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                <div className="flex items-center gap-3 text-xl font-semibold text-white mb-6">
                  <section.icon className={`h-6 w-6 ${section.iconColor}`} />
                  <h2>{section.title}</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  {section.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const sections = [
  {
    title: 'Acceptance of Terms',
    icon: FileText,
    iconColor: 'text-blue-500',
    content: (
      <p>
        By accessing or using PitDeck, you agree to be bound by these Terms of Service. If you disagree 
        with any part of the terms, you may not access the service.
      </p>
    )
  },
  {
    title: 'User Responsibilities',
    icon: Users,
    iconColor: 'text-green-500',
    content: (
      <>
        <p>As a PitDeck user, you are responsible for:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Maintaining the security of your account</li>
          <li>All activities that occur under your account</li>
          <li>Ensuring your content doesn't violate any laws or rights</li>
          <li>Following our community guidelines</li>
        </ul>
      </>
    )
  },
  {
    title: 'Intellectual Property',
    icon: Shield,
    iconColor: 'text-red-500',
    content: (
      <>
        <p>
          All content on PitDeck, including but not limited to card designs, logos, and trademarks, 
          is protected by intellectual property rights. Users may not:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Copy or reproduce any content without permission</li>
          <li>Use our trademarks or branding</li>
          <li>Modify or create derivative works</li>
          <li>Distribute or sell any PitDeck content</li>
        </ul>
      </>
    )
  },
  {
    title: 'Contact Information',
    icon: Lock,
    iconColor: 'text-yellow-500',
    content: (
      <p>
        For any questions about these Terms of Service, please contact us at:{' '}
        <Link href="mailto:legal@pitdeck.app" className="text-blue-400 hover:text-blue-300 transition-colors">
          legal@pitdeck.app
        </Link>
      </p>
    )
  }
]; 