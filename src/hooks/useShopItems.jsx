import { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';

const useShopItems = () => {
  const [lives, setLives] = useState([]);
  const [mascots, setMascots] = useState([]);
  const [mascotImages, setMascotImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { authUser, setAuthUser } = useAuthContext();

  const iconMap = {
    "Extra Life": "❤️",
    "Lion": "🦁",
    "Snake": "🐍",
    "Ant": "🐜",
    "Corgi": "🐶",
    "CockRoach": "🪳",
    "Squirrel": "🐿️",
    "Panda": "🐼",
    "Cat": "🐱",
    "1 Lives": "❤️",
  };

  const fetchShopData = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const [livesRes, mascotsRes, boughtMascotsRes] = await Promise.all([
        fetch('http://localhost:8000/api/v1/store-items', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:8000/api/v1/store-items/mascot', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:8000/api/v1/store-items/mascot/user', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!livesRes.ok || !mascotsRes.ok || !boughtMascotsRes.ok) {
        throw new Error('Lấy dữ liệu cửa hàng thất bại');
      }

      const livesData = await livesRes.json();
      const mascotsData = await mascotsRes.json();
      const boughtMascotsData = await boughtMascotsRes.json();

      const boughtMascotIds = new Set(
        boughtMascotsData.data.map(item => item.item_id)
      );

      setLives(
        livesData.data.map(item => ({
          ...item,
          id: item.item_id,
          bought: item.bought || false,
          icon: iconMap[item.item_name] || '❤️',
          name: item.item_name,
          price: item.item_price,
          type: 'life',
        }))
      );

      setMascots(
        mascotsData.data.map(item => ({
          ...item,
          id: item.item_id,
          bought: boughtMascotIds.has(item.item_id),
          icon: iconMap[item.item_name] || '🐾',
          name: item.item_name,
          price: item.item_price,
          showDropdown: false,
          type: 'mascot',
        }))
      );
    } catch (err) {
      setError(err.message || 'Lỗi khi tải cửa hàng');
      setLives([]);
      setMascots([]);
    } finally {
      setLoading(false);
    }
  };

  const purchaseItem = async (itemId, price, name, type) => {
    const confirmed = window.confirm(`Are you sure you want to buy "${name}" for ${price} coins?`);
    if (!confirmed) return false;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token không tồn tại');
      return false;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/v1/purchase-item/${itemId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Mua hàng thất bại');
      }

      const responseData = await res.json();

      // Cập nhật coin trong context authUser
      if (responseData.remainingCoins !== undefined) {
        setAuthUser(prev => ({
          ...prev,
          coins: responseData.remainingCoins,
        }));
      } else {
        setAuthUser(prev => ({
          ...prev,
          coins: (prev?.coins ?? 0) - price,
        }));
      }

      // Đánh dấu là đã mua
      if (type === 'life') {
        setLives(prev => prev.map(item => (item.id === itemId ? { ...item, bought: true } : item)));
      } else {
        setMascots(prev => prev.map(item => (item.id === itemId ? { ...item, bought: true } : item)));
      }

      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      alert(err.message);
      return false;
    }
  };

  const toggleDropdown = async (mascotId) => {
    setMascots(prev =>
      prev.map(item =>
        item.item_id === mascotId ? { ...item, showDropdown: !item.showDropdown } : item
      )
    );

    if (!mascotImages[mascotId]) {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token không tồn tại');
        return;
      }
      try {
        const res = await fetch(`http://localhost:8000/api/v1/mascot-pics/${mascotId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Không tải được ảnh mascot');

        const pics = await res.json();
        setMascotImages(prev => ({
          ...prev,
          [mascotId]: pics.data.map(pic => pic.pic_url.replace(/^public\//, 'http://localhost:8000/')),
        }));
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token không tồn tại');
      setLoading(false);
      return;
    }

    fetchShopData(token);
  }, []);

  return {
    lives,
    mascots,
    mascotImages,
    loading,
    error,
    purchaseItem,
    toggleDropdown,
  };
};

export default useShopItems;
