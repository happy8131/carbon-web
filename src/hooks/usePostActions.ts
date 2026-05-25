import { useState } from 'react';
import { useStore } from './useStore';
import { createOrUpdatePost } from '@/lib/api';
import type { Post } from '@/lib/types';

export type PostFormData = Omit<Post, 'id'>;

export function usePostActions() {
  const { posts, setPosts } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = async (data: PostFormData) => {
    setLoading(true);
    setError(null);

    try {
      const newPost = await createOrUpdatePost(data);
      setPosts([...posts, newPost]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '포스트 작성에 실패했습니다';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (id: string, data: PostFormData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedPost = await createOrUpdatePost({ ...data, id });
      setPosts(posts.map((post) => (post.id === id ? updatedPost : post)));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '포스트 수정에 실패했습니다';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id));
    setError(null);
  };

  return {
    createPost,
    updatePost,
    deletePost,
    loading,
    error,
  };
}
