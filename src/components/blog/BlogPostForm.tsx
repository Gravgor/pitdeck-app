'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Editor } from '@/components/Editor';

interface FormData {
  title: string;
  content: string;
  tags: string;
  published: boolean;
}

export function BlogPostForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('https://api.pitdeck.app/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          tags: data.tags.split(',').map(tag => tag.trim()),
          slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const post = await response.json();
      router.push(`/blog/${post.slug}`);
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Title
        </label>
        <input
          type="text"
          {...register('title', { required: true })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          placeholder="Enter post title"
        />
        {errors.title && (
          <span className="text-sm text-red-500">Title is required</span>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Content
        </label>
        <Editor
          {...register('content', { required: true })}
          className="min-h-[400px] w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
        />
        {errors.content && (
          <span className="text-sm text-red-500">Content is required</span>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Tags (comma separated)
        </label>
        <input
          type="text"
          {...register('tags')}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          placeholder="f1, cards, update"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register('published')}
          className="rounded border-white/10 bg-white/5 text-blue-500"
        />
        <label className="text-sm font-medium text-gray-300">
          Publish immediately
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg text-white font-medium disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="inline-block animate-spin mr-2" />
            Creating Post...
          </>
        ) : (
          'Create Post'
        )}
      </button>
    </form>
  );
} 