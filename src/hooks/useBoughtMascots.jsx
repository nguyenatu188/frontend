// src/hooks/useBoughtMascots.js
import { useState, useEffect, useCallback } from 'react';

const iconMap = {
  "Lion": "🦁",
  "Snake": "🐍",
  "Ant": "🐜",
  "Corgi": "🐶",
  "CockRoach": "🦗",
  "Squirrel": "🐿️",
  "Panda": "🐼",
  "Cat": "🐱",
};

const useBoughtMascots = () => {
  const [boughtMascots, setBoughtMascots] = useState([]);
  const [mascotImages, setMascotImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMascot, setExpandedMascot] = useState(null);
  const [activeMascotImages, setActiveMascotImages] = useState({ first: null, second: null });

  // Sử dụng useCallback để hàm có thể được truyền xuống mà không gây re-render không cần thiết
  const fetchBoughtMascots = useCallback(async (token) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/store-items/mascot/user', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch bought mascots');
      }

      const data = await res.json();
      return data.data.map(item => ({
        id: Number(item.item_id),
        name: item.item_name,
        icon: iconMap[item.item_name] || '🐾',
        active: Boolean(item.active),
      }));
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMascotImages = useCallback(async (mascotId, token) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/mascot-pics/${mascotId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error('Failed to load mascot images');
      
      const pics = await res.json();
      return pics.data.map(pic => 
        pic.pic_url.replace(/^public\//, 'http://localhost:8000/')
      );
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, []);

  // Hàm chọn hai ảnh ngẫu nhiên khác nhau
  const selectRandomImages = (images) => {
    if (!images || images.length === 0) return { first: null, second: null };
    if (images.length === 1) return { first: images[0], second: null };

    // Chọn ảnh đầu tiên
    const firstIndex = Math.floor(Math.random() * images.length);
    let secondIndex = Math.floor(Math.random() * images.length);
    
    // Đảm bảo ảnh thứ hai khác ảnh đầu tiên
    while (secondIndex === firstIndex && images.length > 1) {
      secondIndex = Math.floor(Math.random() * images.length);
    }
    
    return {
      first: images[firstIndex],
      second: images[secondIndex],
    };
  };

  const refetch = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Token not found');
      setLoading(false);
      return;
    }

    try {
      const mascots = await fetchBoughtMascots(token);
      setBoughtMascots(mascots);

      const activeMascot = mascots.find(m => m.active);

      if (!activeMascot) {
        setActiveMascotImages({ first: null, second: null });
        return;
      }

      const images = await fetchMascotImages(activeMascot.id, token);
      setMascotImages(prev => ({
        ...prev,
        [activeMascot.id]: images
      }));
      
      // Chọn hai ảnh ngẫu nhiên khác nhau
      const selectedImages = selectRandomImages(images);
      setActiveMascotImages(selectedImages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchBoughtMascots, fetchMascotImages]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const toggleMascot = useCallback(async (mascotId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token not found');
      return;
    }

    if (expandedMascot === mascotId) {
      setExpandedMascot(null);
      return;
    }

    setExpandedMascot(mascotId);

    if (!mascotImages[mascotId]) {
      const images = await fetchMascotImages(mascotId, token);
      setMascotImages(prev => ({
        ...prev,
        [mascotId]: images
      }));
    }
  }, [expandedMascot, mascotImages, fetchMascotImages]);

  return {
    boughtMascots,
    mascotImages,
    expandedMascot,
    loading,
    error,
    toggleMascot,
    refetch,
    activeMascotImages,
  };
};

export default useBoughtMascots;
