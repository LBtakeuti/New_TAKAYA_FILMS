import { useState } from 'react';
import { logger } from '@/utils/logger';

interface UploadedVideoData {
  filename: string;
  originalName: string;
  size: number;
  type: string;
  path: string;
  thumbnailPath: string | null;
  uploadedAt: string;
}

export function useVideoUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideoData, setUploadedVideoData] = useState<UploadedVideoData | null>(null);

  const uploadVideo = async (file: File): Promise<UploadedVideoData | null> => {
    setUploading(true);
    setUploadProgress(0);
    
    try {
      logger.log('Starting file upload:', {
        name: file.name,
        type: file.type,
        size: file.size,
        sizeInMB: (file.size / (1024 * 1024)).toFixed(2) + 'MB'
      });
      
      const formData = new FormData();
      formData.append('video', file);
      
      const response = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
      });
      
      const responseData = await response.json();
      logger.log('Upload response:', responseData);
      
      if (!response.ok) {
        const errorMessage = responseData.error || 'アップロードに失敗しました';
        const errorDetails = responseData.details ? `\n詳細: ${responseData.details}` : '';
        
        // Supabase未設定の場合の特別な処理
        if (response.status === 503 && responseData.missingVariables) {
          const setupMessage = `
${errorMessage}

必要な環境変数:
${responseData.missingVariables.join('\n')}

設定手順:
${responseData.instructions ? responseData.instructions.join('\n') : ''}

${responseData.alternativeOption || ''}
          `.trim();
          
          throw new Error(setupMessage);
        }
        
        throw new Error(errorMessage + errorDetails);
      }
      
      setUploadedVideoData(responseData.data);
      setUploadProgress(100);
      
      return responseData.data;
    } catch (error) {
      logger.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'ファイルのアップロードに失敗しました';
      alert(errorMessage);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setUploadedVideoData(null);
    setUploadProgress(0);
  };

  return {
    uploading,
    uploadProgress,
    uploadedVideoData,
    uploadVideo,
    resetUpload
  };
}