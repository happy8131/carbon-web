import { useState, useCallback } from 'react';
import { useDashboardStore } from '@/store/store';
import { createOrUpdatePost } from '@/lib/api';
import type { Post } from '@/lib/types';

export type PostFormData = Omit<Post, 'id'>;

export function usePostActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = useCallback(async (data: PostFormData) => {
    setLoading(true);
    setError(null);

    try {
      const newPost = await createOrUpdatePost(data);
      // store에서 현재 posts를 가져와서 추가
      const currentPosts = useDashboardStore.getState().posts;
      useDashboardStore.getState().setPosts([...currentPosts, newPost]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '포스트 작성에 실패했습니다';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (id: string, data: PostFormData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedPost = await createOrUpdatePost({ ...data, id });
      const currentPosts = useDashboardStore.getState().posts;
      useDashboardStore.getState().setPosts(currentPosts.map((post) => (post.id === id ? updatedPost : post)));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '포스트 수정에 실패했습니다';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback((id: string) => {
    const currentPosts = useDashboardStore.getState().posts;
    useDashboardStore.getState().setPosts(currentPosts.filter((post) => post.id !== id));
    setError(null);
  }, []);

  return {
    createPost,
    updatePost,
    deletePost,
    loading,
    error,
  };
}
