import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { BlogPost } from '@/types/blog';

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
    console.log(posts);
  if (!posts || !Array.isArray(posts)) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-white">No posts found</h2>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link 
          key={post.id} 
          href={`/blog/${post.slug}`}
          className="group relative"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-25 transition-opacity blur" />
          <article className="relative h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {formatDate(post.createdAt)}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-blue-500 transition-all">
                {post.title}
              </h2>
              
              <p className="text-gray-400 line-clamp-2">
                {post.introduction.substring(0, 150)}...
              </p>
              
              <div className="flex items-center gap-3 pt-4">
                <Image
                  src={post.author.image}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-sm text-gray-400">
                  {post.author.name}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-white/80"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}

 