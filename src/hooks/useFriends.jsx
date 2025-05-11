import { useState, useEffect } from 'react';

const base_url = "http://localhost:8000/api";

const useFriendRequests = () => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [friendRequestsSent, setFriendRequestsSent] = useState([]);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // lấy danh sách lời mời kết bạn
    const fetchFriendRequests = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${base_url}/v1/friends/requests/received`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            const requests = Array.isArray(data?.data?.requests)
                ? data.data.requests
                : [];

            setFriendRequests(requests);
        } catch (err) {
            setError(err.message);
        }
    };

    // lấy danh sách lời mời đã gửi
    const fetchSentRequests = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${base_url}/v1/friends/requests/sent`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            const requests = Array.isArray(data?.data?.requests)
                ? data.data.requests
                : [];

            setFriendRequestsSent(requests);
        } catch (err) {
            setError(err.message);
        }
    };

    // lấy danh sách bạn bè
    const fetchFriends = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${base_url}/v1/friends`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            const friendList = Array.isArray(data?.data?.friends)
                ? data.data.friends
                : [];

            setFriends(friendList);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchAll = async () => {
        setLoading(true);
        await Promise.all([
            fetchFriendRequests(),
            fetchSentRequests(),
            fetchFriends()
        ]);
        setLoading(false);
    };

    // chấp nhận lời mời kết bạn
    const acceptFriendRequest = async (requestId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${base_url}/v1/friends/requests/${requestId}/accept`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Chấp nhận lời mời thất bại");

            await fetchFriendRequests();
            await fetchFriends(); // cập nhật danh sách bạn bè
        } catch (err) {
            throw err;
        }
    };

    // từ chối lời mời kết bạn
    const rejectFriendRequest = async (requestId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${base_url}/v1/friends/requests/${requestId}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Từ chối lời mời thất bại");

            await fetchFriendRequests();
        } catch (err) {
            throw err;
        }
    };

    // xóa bạn bè
    const deleteFriend = async (userId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${base_url}/v1/friends/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Xóa bạn thất bại");
            await fetchFriends();
        } catch (err) {
            throw err;
        }
    };
    // thu hồi lời mời đã gửi
    const revokeSentRequest = async (requestId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${base_url}/v1/friends/requests/${requestId}/cancel`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Thu hồi lời mời thất bại");

            await fetchSentRequests(); // cập nhật lại danh sách
        } catch (err) {
            throw err;
        }
    };



    useEffect(() => {
        fetchAll();
    }, []);

    return {
        friendRequests,
        friendRequestsSent,
        friends,
        loading,
        error,
        acceptFriendRequest,
        rejectFriendRequest,
        deleteFriend,
        revokeSentRequest,
        refetchAll: fetchAll,
    };
};

export default useFriendRequests;
