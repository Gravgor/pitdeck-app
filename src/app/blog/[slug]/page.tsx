import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogHeader } from '@/components/blog/BlogHeader';
import { BlogPost } from '@/components/blog/BlogPost';

interface Props {
  params: { slug: string }
}

async function getBlogPost(slug: string) {
  const res = await fetch(`https://api.pitdeck.app/api/blog/${slug}`, {
    next: { revalidate: 3600 }
  });
  
  if (!res.ok) return null;
  
  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  if (!post) return notFound();

  return {
    title: `${post.title} | PitDeck Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage]
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPost(params.slug);
  
  if (!post) return notFound();

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-blue-600/30 to-transparent animate-gradient" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
      </div>

      <div className="relative">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
          <BlogPost post={post} />
        </main>
      </div>
    </div>
  );
} 