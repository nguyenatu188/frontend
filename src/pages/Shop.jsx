import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import { useAuthContext } from '../context/AuthContext';

export function Shop() {
    const { authUser, setAuthUser } = useAuthContext();

    const [lives, setLives] = useState([
        { id: 1, name: "Extra Life", price: 100, icon: "❤️", count: 0 },
    ]);

    const [pets, setPets] = useState([
        { id: 2, name: "Lion", price: 200, icon: "🦁", bought: false, showDropdown: false },
        { id: 3, name: "Snake", price: 250, icon: "🐍", bought: false, showDropdown: false },
        { id: 4, name: "Ant", price: 250, icon: "🐜", bought: false, showDropdown: false },
        { id: 5, name: "Corgi", price: 300, icon: "🐶", bought: false, showDropdown: false },
        { id: 6, name: "CockRoach", price: 300, icon: "🪳", bought: false, showDropdown: false },
        { id: 7, name: "Squirrel", price: 300, icon: "🐿️", bought: false, showDropdown: false },
        { id: 8, name: "Panda", price: 300, icon: "🐼", bought: false, showDropdown: false },
    ]);

    const handleBuy = (id, price, name, type) => {
        if ((authUser?.coins ?? 0) < price) {
            alert("Not enough coins!");
            return;
        }

        const confirmed = window.confirm(`Are you sure you want to buy "${name}" for ${price} coins?`);
        if (!confirmed) return;

        // Trừ coin từ authUser (sẽ hiển thị tại RightSidebar)
        setAuthUser(prev => ({
            ...prev,
            coins: prev.coins - price
        }));

        if (type === "life") {
            setLives(prev =>
                prev.map(item =>
                    item.id === id ? { ...item, count: item.count + 1 } : item
                )
            );
        } else {
            setPets(prev =>
                prev.map(item =>
                    item.id === id ? { ...item, bought: true } : item
                )
            );
        }
    };

    const toggleDropdown = (id) => {
        setPets(prev =>
            prev.map(item =>
                item.id === id ? { ...item, showDropdown: !item.showDropdown } : item
            )
        );
    };

    const exampleImages = [
        "https://via.placeholder.com/60?text=1",
        "https://via.placeholder.com/60?text=2",
        "https://via.placeholder.com/60?text=3",
        "https://via.placeholder.com/60?text=4",
        "https://via.placeholder.com/60?text=5",
    ];

    return (
        <div className="flex">
            <Sidebar />
            <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-gray-800">
                <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 w-full max-w-md relative">
                    <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">Shopping</h2>
                    <h3 className="text-center text-gray-600 mb-4">Mọi điều bạn cần đều có ở đây 😊</h3>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2">❤️ Lives</h4>
                        <div className="space-y-2">
                            {lives.map(item => (
                                <div
                                    key={item.id}
                                    className="border border-gray-300 rounded-lg px-4 py-2 flex justify-between items-center"
                                >
                                    <div>{item.icon} {item.name}</div>
                                    <div className="flex items-center gap-3">
                                        {item.count > 0 && (
                                            <span className="text-blue-500 font-semibold">x{item.count}</span>
                                        )}
                                        <button
                                            className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                            onClick={() => handleBuy(item.id, item.price, item.name, "life")}
                                        >
                                            Buy ({item.price})
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="my-6" />

                    <div>
                        <h4 className="text-lg font-semibold mb-2">🐾 Pets</h4>
                        <div className="space-y-2">
                            {pets.map(item => (
                                <div
                                    key={item.id}
                                    className="border border-gray-300 rounded-lg px-4 py-2"
                                >
                                    <div
                                        onClick={() => toggleDropdown(item.id)}
                                        className="flex justify-between items-center cursor-pointer"
                                    >
                                        <div>{item.icon} {item.name}</div>
                                        {item.bought ? (
                                            <span className="text-green-600 font-bold">Bought</span>
                                        ) : (
                                            <button
                                                className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleBuy(item.id, item.price, item.name, "pet");
                                                }}
                                            >
                                                Buy ({item.price})
                                            </button>
                                        )}
                                    </div>

                                    {item.showDropdown && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: "auto" }}
                                            exit={{ height: 0 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            className="mt-3 flex flex-wrap gap-2"
                                        >
                                            {exampleImages.map((url, index) => (
                                                <img
                                                    key={index}
                                                    src={url}
                                                    alt={`Example ${index + 1}`}
                                                    className="w-14 h-14 rounded-lg"
                                                />
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <RightSidebar />
        </div>
    );
}

export default Shop;
