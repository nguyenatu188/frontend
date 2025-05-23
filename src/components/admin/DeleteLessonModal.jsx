import React from 'react'

const DeleteLessonModal = ({
  showDeleteModal,
  setShowDeleteModal,
  selectedLessonToDelete,
  setSelectedLessonToDelete,
  handleDeleteLesson,
  isDeleting
}) => {
  return (
    <dialog className={`modal ${showDeleteModal ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Xác nhận xóa</h3>
        <p className="py-2">
          Bạn có chắc chắn muốn xóa bài học "{selectedLessonToDelete?.title}"?
          <br />
          <span className="text-red-400">Hành động này không thể hoàn tác!</span>
        </p>
        
        <div className="modal-action">
          <button
            className="btn"
            onClick={() => {
              setShowDeleteModal(false)
              setSelectedLessonToDelete(null)
            }}
            disabled={isDeleting}
          >
            Hủy
          </button>
          <button
            className="btn btn-error"
            onClick={handleDeleteLesson}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="loading loading-spinner"></span>
                Đang xóa...
              </>
            ) : (
              'Xác nhận xóa'
            )}
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default DeleteLessonModal
