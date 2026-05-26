'use client';

import { useState } from 'react';
import type { Company, Post } from '@/lib/types';

export type PostFormData = Omit<Post, 'id'>;

interface PostFormProps {
  companies: Company[];
  onSubmit: (data: PostFormData) => void;
  onCancel?: () => void;
  initialData?: Post;
  isLoading?: boolean;
}

export default function PostForm({
  companies,
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [resourceUid, setResourceUid] = useState(initialData?.resourceUid || '');
  const [dateTime, setDateTime] = useState(initialData?.dateTime || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    }
    if (!resourceUid) {
      newErrors.resourceUid = '회사를 선택해주세요';
    }
    if (!dateTime) {
      newErrors.dateTime = '날짜를 선택해주세요';
    }
    if (!content.trim()) {
      newErrors.content = '내용을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      resourceUid,
      dateTime,
      content: content.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 제목 */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="포스트 제목을 입력하세요"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={isLoading}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      {/* 회사 선택 */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
          회사 <span className="text-red-500">*</span>
        </label>
        <select
          id="company"
          value={resourceUid}
          onChange={(e) => setResourceUid(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={isLoading}
        >
          <option value="">회사를 선택하세요</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
        {errors.resourceUid && <p className="text-red-500 text-xs mt-1">{errors.resourceUid}</p>}
      </div>

      {/* 날짜 */}
      <div>
        <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700 mb-1">
          날짜 <span className="text-red-500">*</span>
        </label>
        <input
          id="dateTime"
          type="month"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={isLoading}
        />
        {errors.dateTime && <p className="text-red-500 text-xs mt-1">{errors.dateTime}</p>}
      </div>

      {/* 내용 */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          내용 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="포스트 내용을 입력하세요"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          disabled={isLoading}
        />
        {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
      </div>

      {/* 버튼 */}
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '작성 중...' : '작성'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
}
