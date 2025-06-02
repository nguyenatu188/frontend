// src/components/BoughtMascotsModal.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BoughtMascotsModal = ({ 
  isOpen, 
  onClose, 
  boughtMascots, 
  mascotImages, 
  expandedMascot,
  toggleMascot,
  loading,
  error,
  onToggleActive
}) => {
  if (!isOpen) return null;

  const hasActiveMascot = boughtMascots.some(m => m.active);

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-2xl text-green-600 mb-4 text-center">Linh vật</h3>
        
        <button 
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-4 text-gray-500">Đang tải linh vật...</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto p-2">
            {boughtMascots.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                Bạn chưa mua linh vật nào
              </div>
            ) : (
              boughtMascots.map(mascot => (
                <div 
                  key={mascot.id} 
                  className="border rounded-lg p-4 bg-base-100 shadow-sm"
                >
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleMascot(mascot.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{mascot.icon}</span>
                      <span className="font-bold">{mascot.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Sử dụng checkbox của DaisyUI */}
                      <input 
                        type="checkbox"
                        className="checkbox checkbox-info"
                        checked={mascot.active}
                        onChange={(e) => {
                          e.stopPropagation();
                          onToggleActive(mascot.id);
                        }}
                        disabled={hasActiveMascot && !mascot.active}
                      />
                      
                      <span className="text-lg">
                        {expandedMascot === mascot.id ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {expandedMascot === mascot.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4"
                      >
                        <div className="flex flex-wrap gap-3">
                          {(mascotImages[mascot.id] || []).length > 0 ? (
                            mascotImages[mascot.id].map((url, idx) => (
                              <img
                                key={idx}
                                src={url}
                                alt={`${mascot.name} ${idx + 1}`}
                                className="w-20 h-20 rounded-lg object-cover border-2 border-green-300"
                              />
                            ))
                          ) : (
                            <div className="text-gray-500 text-center w-full py-2">
                              Không có ảnh
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>
        )}
        
        <div className="modal-action">
          <button className="btn btn-primary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoughtMascotsModal;
