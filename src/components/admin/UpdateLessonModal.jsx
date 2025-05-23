import React from 'react'

const UpdateLessonModal = ({
  showUpdateModal,
  setShowUpdateModal,
  editedTitle,
  setEditedTitle,
  editedTimeLimit,
  setEditedTimeLimit,
  handleUpdateLesson,
  isUpdating,
  setSelectedLessonToUpdate
}) => {
  return (
    <dialog className={`modal ${showUpdateModal ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Chỉnh sửa bài học</h3>
        <div className="form-control w-full mt-4">
          <label className="label">
            <span className="label-text">Tiêu đề bài học</span>
          </label>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Nhập tiêu đề..."
            className="input input-bordered w-full"
            disabled={isUpdating}
          />
          <label className="label mt-4">
            <span className="label-text">Thời gian làm bài</span>
            <span className="label-text-alt"> (giây)</span>
          </label>
          <input
            type="number"
            value={editedTimeLimit}
            onChange={(e) => setEditedTimeLimit(e.target.value)}
            placeholder="Nhập thời gian làm bài"
            className="input input-bordered w-full"
            disabled={isUpdating}
          />
        </div>
        
        <div className="modal-action">
          <button
            className="btn"
            onClick={() => {
              setShowUpdateModal(false)
              setEditedTitle('')
              setSelectedLessonToUpdate(null)
            }}
            disabled={isUpdating}
          >
            Hủy
          </button>
          <button
            className="btn btn-primary"
            onClick={handleUpdateLesson}
            disabled={isUpdating || !editedTitle.trim()}
          >
            {isUpdating ? (
              <>
                <span className="loading loading-spinner"></span>
                Đang cập nhật...
              </>
            ) : (
              'Xác nhận'
            )}
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default UpdateLessonModal
