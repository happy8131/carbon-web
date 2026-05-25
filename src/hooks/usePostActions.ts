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
      const { posts } = useDashboardStore.getState();

      // 이미 생성된 포스트가 없으면 추가 (API에서 이미 추가됨)
      if (!posts.find(p => p.id === newPost.id)) {
        useDashboardStore.getState().setPosts([...posts, newPost]);
      }
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
