import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { BlogPost as BlogPostType } from '@/types/blog';

interface BlogPostProps {
  post: BlogPostType;
}

function Highlights({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 my-4">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2 text-gray-300">
          <span className="text-green-500">{item.split(' ')[0]}</span>
          <span>{item.split(' ').slice(1).join(' ')}</span>
        </li>
      ))}
    </ul>
  );
}

function ImageGallery({ images }: { images: string[] }) {
  if (images.length === 1) {
    return (
      <div className="relative aspect-video rounded-xl overflow-hidden my-6">
        <Image
          src={images[0]}
          alt="Feature preview"
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 my-6">
      {images.map((image, index) => (
        <div key={index} className="relative aspect-video rounded-xl overflow-hidden">
          <Image
            src={image}
            alt={`Feature preview ${index + 1}`}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export function BlogPost({ post }: BlogPostProps) {
  return (
    <article className="space-y-12">
      <Link 
        href="/blog"
        className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Blog
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            {formatDate(post.createdAt)}
          </span>
          {post.updatedAt !== post.createdAt && (
            <span className="text-sm text-gray-500">
              (Updated {formatDate(post.updatedAt)})
            </span>
          )}
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            {post.title}
          </span>
        </h1>

        <div className="flex items-center gap-3">
          <Image
            src={post.author.image}
            alt={post.author.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <div className="text-white font-medium">
              {post.author.name}
            </div>
            <div className="text-sm text-gray-400">
              PitDeck Team
            </div>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="text-xl text-gray-300 leading-relaxed">
        {post.introduction}
      </div>

      {/* Sections */}
      <div className="space-y-16">
        {post.sections.map((section, index) => (
          <section key={index} className="space-y-6">
            <h2 className="text-3xl font-bold text-white">
              {section.title}
            </h2>
            
            <p className="text-lg text-gray-300">
              {section.content}
            </p>

            {section.highlights && (
              <Highlights items={section.highlights} />
            )}

            {section.images && (
              <ImageGallery images={section.images} />
            )}

            {section.subsections && (
              <div className="space-y-8 mt-8">
                {section.subsections.map((subsection, subIndex) => (
                  <div key={subIndex} className="space-y-4">
                    <h3 className="text-2xl font-semibold text-white">
                      {subsection.title}
                    </h3>
                    
                    <p className="text-lg text-gray-300">
                      {subsection.content}
                    </p>

                    {subsection.highlights && (
                      <Highlights items={subsection.highlights} />
                    )}

                    {subsection.image && (
                      <ImageGallery images={[subsection.image]} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Conclusion */}
      <div className="text-xl text-gray-300 leading-relaxed">
        {post.conclusion}
      </div>

      {/* CTA */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="relative p-8">
          <p className="text-lg text-gray-200 whitespace-pre-wrap">
            {post.cta}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 pt-8">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-sm rounded-full bg-white/5 border border-white/10 text-white/80"
          >
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
} 