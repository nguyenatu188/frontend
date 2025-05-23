import React from 'react'

const AddLessonModal = ({
  showAddModal,
  setShowAddModal,
  newLessonTitle,
  setNewLessonTitle,
  newLessonTimeLimit,
  setNewLessonTimeLimit,
  handleAddLesson,
  isSubmitting
}) => {
  return (
    <dialog className={`modal ${showAddModal ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Thêm bài học mới</h3>

        <div className="form-control w-full mt-4">
          <label className="label">
            <span className="label-text">Tiêu đề bài học</span>
          </label>
          <input
            type="text"
            value={newLessonTitle}
            onChange={(e) => setNewLessonTitle(e.target.value)}
            placeholder="Nhập tiêu đề..."
            className="input input-bordered w-full"
            disabled={isSubmitting}
          />
          <label className="label mt-4">
            <span className="label-text">Thời gian làm bài</span>
            <span className="label-text-alt"> (giây)</span>
          </label>
          <input
            type="number"
            value={newLessonTimeLimit}
            onChange={(e) => setNewLessonTimeLimit(e.target.value)}
            placeholder="Nhập thời gian làm bài..."
            className="input input-bordered w-full"
            disabled={isSubmitting}
          />
        </div>

        <div className="modal-action">
          <button
            className="btn"
            onClick={() => {
              setShowAddModal(false)
              setNewLessonTitle('')
              setNewLessonTimeLimit()
            }}
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            className="btn btn-primary"
            onClick={handleAddLesson}
            disabled={isSubmitting || !newLessonTitle.trim() || !newLessonTimeLimit}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner"></span>
                Đang tạo...
              </>
            ) : (
              'Thêm mới'
            )}
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default AddLessonModal
