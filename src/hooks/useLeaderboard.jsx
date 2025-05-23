import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../context/AuthContext'; 

const API_BASE_URL = 'http://localhost:8000/api/v1';

// ĐỊNH NGHĨA availableRanks BÊN NGOÀI HOOK
const AVAILABLE_RANKS = [
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond'
];

const useLeaderboard = () => {
    const { fetchWithAuth } = useAuthContext();

    const [leaderboard, setLeaderboard] = useState({});
    const [userRank, setUserRank] = useState(null);
    const [friendsLeaderboard, setFriendsLeaderboard] = useState([]);
    const [compareFriends, setCompareFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Không còn định nghĩa availableRanks ở đây nữa!

    const fetchData = useCallback(async (endpoint, params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const url = new URL(`${API_BASE_URL}${endpoint}`);
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

            const response = await fetchWithAuth(url.toString(), {
                method: 'GET',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch data');
            }

            const result = await response.json();
            setLoading(false);
            return result.data;
        } catch (err) {
            setError(err);
            setLoading(false);
            console.error(`Error fetching from ${endpoint}:`, err);
            return null;
        }
    }, [fetchWithAuth]);

    const fetchLeaderboard = useCallback(async (limit = 100) => {
        const data = await fetchData('/leaderboard', { limit });
        if (data) {
            const groupedData = {};
          
            // Sử dụng hằng số AVAILABLE_RANKS
            AVAILABLE_RANKS.forEach(rankName => {
                groupedData[rankName] = [];
            });

        
            data.forEach(user => {
                const rankName = user.rank;
                if (AVAILABLE_RANKS.includes(rankName)) { // Sử dụng hằng số AVAILABLE_RANKS
                    groupedData[rankName].push(user);
                }
            });
            setLeaderboard(groupedData);
        }
    }, [fetchData]); // availableRanks KHÔNG CÒN LÀ DEPENDENCY nữa!

    const fetchUserRank = useCallback(async () => {
        const data = await fetchData('/leaderboard/user');
        if (data) {
            setUserRank(data);
        }
    }, [fetchData]);

    const fetchFriendsLeaderboard = useCallback(async () => {
        const data = await fetchData('/leaderboard/friends');
        if (data) {
            setFriendsLeaderboard(data);
        }
    }, [fetchData]);

    const fetchCompareFriendsRank = useCallback(async () => {
        const data = await fetchData('/leaderboard/friends/compare');
        if (data) {
            setCompareFriends(data);
        }
    }, [fetchData]);

    useEffect(() => {
        fetchLeaderboard();
        fetchUserRank();
    }, [fetchLeaderboard, fetchUserRank]);

    return {
        leaderboard,
        userRank,
        friendsLeaderboard,
        compareFriends,
        loading,
        error,
        fetchLeaderboard,
        fetchUserRank,
        fetchFriendsLeaderboard,
        fetchCompareFriendsRank,
    };
};

export default useLeaderboard;