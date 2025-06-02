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
  const [activeMascotImage, setActiveMascotImage] = useState(null);

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

  // Hàm refetch mới để tải lại dữ liệu
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
        setActiveMascotImage(null);
        return;
      }

      const images = await fetchMascotImages(activeMascot.id, token);
      setMascotImages(prev => ({
        ...prev,
        [activeMascot.id]: images
      }));
      
      if (images.length > 0) {
        const randomIndex = Math.floor(Math.random() * images.length);
        setActiveMascotImage(images[randomIndex]);
      } else {
        setActiveMascotImage(null);
      }
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
    activeMascotImage
  };
};

export default useBoughtMascots;
