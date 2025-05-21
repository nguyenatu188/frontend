import { IoMale, IoFemale, IoMaleFemale } from "react-icons/io5"

const EditProfileModal = ({ 
  showModal, 
  setShowModal,
  formData,
  setFormData,
  handleSubmit,
  isUpdating,
  updateError 
}) => {
  return (
    <div className={`modal ${showModal ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-2xl text-blue-500 mb-6">Chỉnh sửa hồ sơ</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Họ và tên</span>
              </label>
              <input
                type="text"
                placeholder="Nhập họ tên"
                className="input input-bordered"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({...prev, full_name: e.target.value}))}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Tên đăng nhập</span>
              </label>
              <input
                type="text"
                placeholder="Nhập tên đăng nhập"
                className="input input-bordered"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({...prev, username: e.target.value}))}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Nhập email"
                className="input input-bordered"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Giới tính</span>
              </label>
              <div className="flex gap-6">
                {[
                  { value: 'male', label: 'Nam', color: 'text-blue-500', icon: <IoMale /> },
                  { value: 'female', label: 'Nữ', color: 'text-pink-500', icon: <IoFemale /> },
                  { value: 'other', label: 'Khác', color: 'text-purple-500', icon: <IoMaleFemale /> }
                ].map((option) => (
                  <label key={option.value} className="label cursor-pointer gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value={option.value}
                      checked={formData.gender === option.value}
                      onChange={() => setFormData(prev => ({...prev, gender: option.value}))}
                      className={`radio ${option.color}`}
                    />
                    <span className="label-text">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {updateError && (
              <div className="alert alert-error mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{updateError}</span>
              </div>
            )}
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowModal(false)}
              disabled={isUpdating}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Đang lưu...
                </>
              ) : 'Xác nhận'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfileModal
