import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import useShopItems from '../hooks/useShopItems';
import useBoughtMascots from '../hooks/useBoughtMascots';

export function Shop() {
  const {
    lives,
    mascots,
    mascotImages,
    loading,
    error,
    toggleDropdown,
    purchaseItem,
  } = useShopItems();

  const {
    loading: mascotsLoading,
    activeMascotImage
  } = useBoughtMascots()

  const handlePurchase = async (id, price, name, type) => {
    await purchaseItem(id, price, name, type);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-gray-800 overflow-y-auto">
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 w-full max-w-md relative">
          <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">Shopping</h2>
          <h3 className="text-center text-gray-600 mb-4">Mọi điều bạn cần đều có ở đây 😊</h3>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center text-sm text-gray-500 my-4">Loading items...</div>
          ) : (
            <>
              {/* Lives Section */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">❤️ Lives</h4>
                <div className="space-y-2">
                  {lives.map(item => (
                    <div key={item.id} className="border rounded-lg px-4 py-2 flex justify-between items-center">
                      <div>{item.icon} {item.name}</div>
                      <button
                        className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        onClick={() => handlePurchase(item.id, item.price, item.name, "life")}
                      >
                        Buy ({item.price})
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="my-6" />

              {/* Mascots Section */}
              <div>
                <h4 className="text-lg font-semibold mb-2">🐾 Pets</h4>
                <div className="space-y-2">
                  {mascots.map(item => (
                    <div key={item.id} className="border rounded-lg px-4 py-2">
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
                              e.stopPropagation(); // Không cho sự kiện click lan ra toggle dropdown
                              handlePurchase(item.id, item.price, item.name, "mascot");
                            }}
                          >
                            Buy ({item.price})
                          </button>
                        )}
                      </div>

                      <AnimatePresence>
                        {item.showDropdown && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="mt-3 flex flex-wrap gap-2 overflow-hidden"
                          >
                            {(mascotImages[item.id] || []).map((url, idx) => (
                              <img
                                key={`${item.id}-${idx}`}
                                src={url}
                                alt={`Mascot ${item.name} ${idx}`}
                                className="w-14 h-14 rounded-lg object-cover"
                              />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {activeMascotImage && (
        <div className="absolute bottom-5 right-25 flex items-center justify-center w-42 h-42">
        {mascotsLoading ? 
            <span className="loading loading-spinner loading-lg text-info"></span> :
            <img
            src={activeMascotImage} 
            alt="Active mascot" 
            className="w-full h-full object-contain"
            />
        }
        </div>
      )}
      <RightSidebar />
    </div>
  );
}

export default Shop;
