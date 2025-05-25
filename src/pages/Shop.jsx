import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import useShopItems from '../hooks/useShopItems';

export function Shop() {
  const {
    gems,
    lives,
    mascots,
    mascotImages,
    loading,
    error,
    purchaseItem,
    toggleDropdown,
  } = useShopItems();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading store...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-gray-800 overflow-y-auto">
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 w-full max-w-md relative">
          <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">Shopping</h2>
          <h3 className="text-center text-gray-600 mb-4">Mọi điều bạn cần đều có ở đây 😊</h3>
          <p className="text-center font-semibold text-purple-500 mb-4">Your Gems: {gems}</p>

          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">❤️ Lives</h4>
            <div className="space-y-2">
              {lives.map(item => (
                <div key={item.id} className="border rounded-lg px-4 py-2 flex justify-between items-center">
                  <div>{item.icon} {item.name}</div>
                  {item.bought ? (
                    <span className="text-green-600 font-bold">Bought</span>
                  ) : (
                    <button
                      className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => purchaseItem(item.id, item.price, item.name, "life")}
                    >
                      Buy ({item.price})
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <hr className="my-6" />

          <div>
            <h4 className="text-lg font-semibold mb-2">🐾 Pets</h4>
            <div className="space-y-2">
              {mascots.map(item => (
                <div key={item.item_id} className="border rounded-lg px-4 py-2">
                  <div
                    onClick={() => item.item_id && toggleDropdown(item.item_id)}
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
                          purchaseItem(item.item_id, item.price, item.name, "pet");
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
                      {(mascotImages[item.item_id] || []).map(url => (
                        <img
                          key={url}
                          src={url}
                          alt={`Mascot ${item.name}`}
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
    </div>
  );
}

export default Shop;
