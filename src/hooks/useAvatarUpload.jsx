import { useAuthContext } from '../context/AuthContext'
import { useState } from 'react'

const useAvatarUpload = () => {
  const { setAuthUser, fetchWithAuth } = useAuthContext()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)

  const uploadAvatar = async (file) => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetchWithAuth('http://127.0.0.1:8000/api/v1/user/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload avatar thất bại');
      }

      const { data } = await response.json(); // Thêm destructuring ở đây
      
      setAuthUser(prev => ({
        ...prev,
        avatar: data.avatar_path.split('/').pop()
      }));

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }

  return { uploadAvatar, isUploading, error }
}

export default useAvatarUpload
