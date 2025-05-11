import { useState, useEffect } from 'react';

const base_url = "http://localhost:8000/api";

const useFriends = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendRequestsSent, setFriendRequestsSent] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFriendRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${base_url}/v1/friends/requests/received`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFriendRequests(data?.data?.requests || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${base_url}/v1/friends/requests/sent`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFriendRequestsSent(data?.data?.requests || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${base_url}/v1/friends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFriends(data?.data?.friends || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchFriendRequests(),
      fetchSentRequests(),
      fetchFriends(),
    ]);
    setLoading(false);
  };

  const acceptFriendRequest = async (requestId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${base_url}/v1/friends/requests/${requestId}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error("Chấp nhận lời mời thất bại");
    await fetchAll();
  };

  const rejectFriendRequest = async (requestId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${base_url}/v1/friends/requests/${requestId}/reject`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error("Từ chối lời mời thất bại");
    await fetchFriendRequests();
  };

  const deleteFriend = async (userId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${base_url}/v1/friends/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Xóa bạn thất bại");
    await fetchFriends();
  };

  const sendFriendRequest = async (receiverId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${base_url}/v1/friends/requests`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiver_id: receiverId }),
    });
    if (!res.ok) throw new Error("Gửi lời mời thất bại");
    await fetchSentRequests();
  };

  const revokeSentRequest = async (requestId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${base_url}/v1/friends/requests/${requestId}/cancel`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Thu hồi lời mời thất bại");
    await fetchSentRequests();
  };

  const getAllUsers = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${base_url}/v1/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data?.data || [];
  };

  useEffect(() => { fetchAll(); }, []);

  return {
    friendRequests,
    friendRequestsSent,
    friends,
    loading,
    error,
    getAllUsers,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    deleteFriend,
    revokeSentRequest,
    refetchAll: fetchAll,
  };
};

export default useFriends;
