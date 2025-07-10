import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { Video } from '@/types';
import { logger } from '@/utils/logger';

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/videos');
      setVideos(response.data || []);
    } catch (error) {
      logger.error('Error fetching videos:', error);
      setError('動画の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const createVideo = async (videoData: Partial<Video>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/videos', videoData);
      await fetchVideos();
      return response.data;
    } catch (error) {
      logger.error('Error creating video:', error);
      setError('動画の作成に失敗しました');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateVideo = async (id: number, videoData: Partial<Video>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/videos/${id}`, videoData);
      await fetchVideos();
      return response.data;
    } catch (error) {
      logger.error('Error updating video:', error);
      setError('動画の更新に失敗しました');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (id: number) => {
    if (!window.confirm('この作品を削除しますか？')) return false;
    
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/videos/${id}`);
      await fetchVideos();
      return true;
    } catch (error) {
      logger.error('Error deleting video:', error);
      setError('動画の削除に失敗しました');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return {
    videos,
    loading,
    error,
    fetchVideos,
    createVideo,
    updateVideo,
    deleteVideo
  };
}