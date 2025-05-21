const ChangePasswordModal = ({
  showModal,
  setShowModal,
  currentPass,
  setCurrentPass,
  newPass,
  setNewPass,
  confirmPass,
  setConfirmPass,
  handleSubmit,
  isChanging,
  passwordError,
  isSuccess
}) => {
  return (
    <div className={`modal ${showModal ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-2xl text-blue-500 mb-6">Đổi mật khẩu</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Mật khẩu hiện tại</span>
              </label>
              <input
                type="password"
                placeholder="Nhập mật khẩu hiện tại"
                className="input input-bordered"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                disabled={isChanging}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Mật khẩu mới</span>
              </label>
              <input
                type="password"
                placeholder="Nhập mật khẩu mới (ít nhất 8 ký tự)"
                className="input input-bordered"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                disabled={isChanging}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Xác nhận mật khẩu mới</span>
              </label>
              <input
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                className="input input-bordered"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                disabled={isChanging}
              />
            </div>

            {passwordError && (
              <div className="alert alert-error mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{passwordError}</span>
              </div>
            )}

            {isSuccess && (
              <div className="alert alert-success mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Đổi mật khẩu thành công!</span>
              </div>
            )}
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setShowModal(false)
                setCurrentPass('')
                setNewPass('')
                setConfirmPass('')
              }}
              disabled={isChanging}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isChanging}
            >
              {isChanging ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Đang xử lý...
                </>
              ) : 'Xác nhận'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePasswordModal
