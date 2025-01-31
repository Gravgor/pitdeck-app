import { Metadata } from 'next';
import { BlogHeader } from '@/components/blog/BlogHeader';
import { BlogList } from '@/components/blog/BlogList';

export const metadata: Metadata = {
  title: 'PitDeck Blog | F1 Cards & Motorsport Collection News',
  description: 'Latest updates and news about PitDeck, F1 cards, and motorsport digital collection game. Stay informed about new features, cards, and community events.',
  keywords: [
    'F1 cards news',
    'motorsport cards blog',
    'digital collection updates',
    'PitDeck news',
    'racing cards blog'
  ]
};

async function getBlogPosts() {
  const res = await fetch('https://api.pitdeck.app/api/blog');
  
  if (!res.ok) throw new Error('Failed to fetch blog posts');
  
  return res.json();
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-blue-600/30 to-transparent animate-gradient" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
      </div>

      <div className="relative">
        <BlogHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
          <BlogList posts={posts} />
        </main>
      </div>
    </div>
  );
} 