'use client';

import type { Company, Post } from '@/lib/types';
import PostCard from './PostCard';

interface PostListProps {
  posts: Post[];
  companies: Company[];
  onDeletePost?: (id: string) => void;
  deletingPostIds?: string[];
}

export default function PostList({
  posts,
  companies,
  onDeletePost,
  deletingPostIds = [],
}: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500">No posts found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {posts.map((post) => {
        const company = companies.find((c) => c.id === post.resourceUid);
        return company ? (
          <PostCard
            key={post.id}
            post={post}
            company={company}
            onDelete={onDeletePost}
            isDeleting={deletingPostIds.includes(post.id)}
          />
        ) : null;
      })}
    </div>
  );
}
