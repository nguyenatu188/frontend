import { useState } from 'react';
import { useAuthContext } from '../../../context/AuthContext';

const useAudioUpload = () => {
  const { fetchWithAuth } = useAuthContext();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadAudio = async (file, questionId) => {
    if (!file || !questionId) return;

    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('audio_file', file);

      const response = await fetchWithAuth(
        `http://127.0.0.1:8000/api/v1/questions/${questionId}/audio`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload audio thất bại');
      }

      const responseData = await response.json();
      return responseData.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadAudio, isUploading, error };
};

export default useAudioUpload;
