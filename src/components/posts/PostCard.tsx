'use client';

import type { Company, Post } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  company: Company;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

export default function PostCard({ post, company, onDelete, isDeleting = false }: PostCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 flex-1 pr-2">{post.title}</h3>
        {onDelete && (
          <button
            onClick={() => onDelete(post.id)}
            disabled={isDeleting}
            className="text-gray-400 hover:text-red-500 disabled:text-gray-300 transition-colors flex-shrink-0"
            aria-label="Delete post"
          >
            🗑️
          </button>
        )}
      </div>
      <div className="flex gap-2 items-center mb-2">
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{company.name}</span>
        <span className="text-xs text-gray-500">{formatDate(post.dateTime)}</span>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
    </div>
  );
}
