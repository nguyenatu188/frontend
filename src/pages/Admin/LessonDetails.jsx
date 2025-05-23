import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useQuestion from '../../hooks/useQuestion'
import Comments from '../../components/Comments'
import AdminSidebar from '../../components/admin/AdminSidebar'
import useAddQuestion from '../../hooks/admin/questions/useAddQuestion'
import useDeleteQuestion from '../../hooks/admin/questions/useDeleteQuestion'
import useUpdateQuestion from '../../hooks/admin/questions/useUpdateQuestion'
import useAddOptions from '../../hooks/admin/options/useAddOptions'
import useUpdateOption from '../../hooks/admin/options/useUpdateOption'
import useDeleteOption from '../../hooks/admin/options/useDeleteOption'
import useAudioUpload from '../../hooks/admin/questions/useAudioUpload'
import { FaTrashAlt } from "react-icons/fa"
import { FaEdit } from "react-icons/fa"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const LessonDetails = () => {
  const { lessonId } = useParams()
  const { data, refetch } = useQuestion(lessonId)

  const { createQuestion, isSubmitting } = useAddQuestion()
  const { updateQuestion, isSubmitting: isUpdatingQuestion } = useUpdateQuestion()
  const { updateOption, isSubmitting: isUpdatingOption } = useUpdateOption()

  // States cho modal thêm câu hỏi
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [questionText, setQuestionText] = useState('')
  const [explanation, setExplanation] = useState('')
  const [options, setOptions] = useState([{ optionText: '', isCorrect: false }])
  const { addOptions, isSubmitting: isAddingOptions } = useAddOptions()

  // States cho modal sửa câu hỏi
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [editQuestionText, setEditQuestionText] = useState('')
  const [editExplanation, setEditExplanation] = useState('')
  const [editingOptions, setEditingOptions] = useState([])
  const [editingOptionId, setEditingOptionId] = useState(null)

  const { deleteQuestion, isDeleting: isDeletingQuestion } = useDeleteQuestion()
  const [deletingQuestionId, setDeletingQuestionId] = useState(null)

  const { deleteOption, isDeleting: isDeletingOption } = useDeleteOption()
  const [deletingOptionId, setDeletingOptionId] = useState(null)

  const { uploadAudio, isUploading: isUploadingAudio, error: audioError } = useAudioUpload()
  const [audioFile, setAudioFile] = useState(null)
  const [tempAudioUrl, setTempAudioUrl] = useState(null)

  const handleAddQuestion = async () => {
    try {
      if (!questionText.trim()) throw new Error('Nội dung câu hỏi không được trống')
      if (options.some(opt => !opt.optionText.trim())) throw new Error('Các lựa chọn không được trống')
      if (!options.some(opt => opt.isCorrect)) throw new Error('Phải có ít nhất một lựa chọn đúng')

      const newQuestion = await createQuestion({
        lesson_id: parseInt(lessonId),
        question_text: questionText,
        explanation: explanation || null,
      })

      const optionsData = options.map(opt => ({
        option_text: opt.optionText.trim(),
        is_correct: opt.isCorrect,
      }))

      if (audioFile && data.lesson?.category === 'Listening') {
        await handleAudioUpload(newQuestion.data.question_id);
      }

      try {
        await addOptions(newQuestion.data.question_id, optionsData)
      } catch (err) {
        await deleteQuestion(newQuestion.question_id)
        toast.error(`Thêm lựa chọn thất bại: ${err.message}`)
      }

      setQuestionText('')
      setExplanation('')
      setOptions([{ optionText: '', isCorrect: false }])
      setIsModalOpen(false)
      refetch()
      toast.success('Thêm câu hỏi thành công!')
    } catch (err) {
      toast.error(`Thêm câu hỏi thất bại: ${err.message}`)
      console.error(err.message)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setQuestionText('')
    setExplanation('')
    setAudioFile(null)
    setTempAudioUrl(null)
    setOptions([{ optionText: '', isCorrect: false }])
  }

  // Functions cho modal sửa
  const openEditModal = (question) => {
    setEditingQuestion(question)
    setEditQuestionText(question.question_text)
    setEditExplanation(question.explanation || '')
    setEditingOptions([...question.options])
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingQuestion(null)
    setEditQuestionText('')
    setEditExplanation('')
    setEditingOptions([])
    setEditingOptionId(null)
    setOptions([{ optionText: '', isCorrect: false }])
  }

  const handleUpdateQuestion = async () => {
    try {
      if (!editQuestionText.trim()) {
        throw new Error('Nội dung câu hỏi không được trống')
      }

      const updatedQuestion = await updateQuestion(editingQuestion.question_id, {
        question_text: editQuestionText,
        explanation: editExplanation || null
      })

      const optionsData = options.map(opt => ({
        option_text: opt.optionText.trim(),
        is_correct: opt.isCorrect,
      }))

      try {
        await addOptions(updatedQuestion.data.question_id, optionsData)
      } catch (err) {
        toast.error(`Thêm lựa chọn thất bại: ${err.message}`)
      }

      closeEditModal()
      refetch()
      toast.success('Cập nhật câu hỏi thành công!')
    } catch (err) {
      toast.error(`Cập nhật câu hỏi thất bại: ${err.message}`)
    }
  }

  const handleUpdateOption = async (optionId, newText, newIsCorrect) => {
    try {
      if (!newText.trim()) {
        throw new Error('Nội dung lựa chọn không được trống')
      }

      await updateOption(optionId, {
        question_id: editingQuestion.question_id,
        option_text: newText,
        is_correct: newIsCorrect
      })

      refetch()
      setEditingOptions(prev => 
        prev.map(opt => 
          opt.option_id === optionId 
            ? { ...opt, option_text: newText, is_correct: newIsCorrect }
            : opt
        )
      )

      setEditingOptionId(null)
      toast.success('Cập nhật lựa chọn thành công!')
    } catch (err) {
      toast.error(`Cập nhật lựa chọn thất bại: ${err.message}`)
    }
  }

  const handleAudioUpload = async (questionId) => {
    if (!audioFile) return;
    
    try {
      await uploadAudio(audioFile, questionId)
      toast.success('Upload audio thành công!')
      setAudioFile(null)
      setTempAudioUrl(null)
    } catch (err) {
      toast.error(`Upload audio thất bại: ${err.message}`)
    }
  }

  useEffect(() => {
  return () => {
    if (tempAudioUrl) URL.revokeObjectURL(tempAudioUrl);
  };
}, [tempAudioUrl]);

  return (
    <div className='flex min-h-screen'>
      <AdminSidebar />
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="w-full bg-white mx-auto pl-68 p-4">
        <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">Review: {data.lesson?.title}</h1>
        <button 
          className="btn btn-info btn-lg btn-dash"
          onClick={() => setIsModalOpen(true)}
        >
          Thêm câu hỏi
        </button>
        <div className="space-y-8 mb-8 mt-8">
          {data.questions.map((question, index) => (
            <div key={question.question_id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <h3 className="text-xl text-gray-700 font-semibold">Câu {index + 1}:</h3>
                <p className="text-lg text-gray-700 mt-2">{question.question_text}</p>
              </div>

              {data.lesson?.category === 'Listening' && question.audio_file && (
                <div className="my-4">
                  <audio controls className="w-full">
                    <source
                      src={question.audio_url}
                      type="audio/mpeg"
                    />
                    Trình duyệt không hỗ trợ phát audio
                  </audio>
                  <div className="mt-2 flex gap-2">
                    <span className="text-sm text-gray-500">
                      File audio: {question.audio_file}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                {question.options.map((option) => (
                  <div
                    key={option.option_id}
                    className={`p-3 rounded-lg ${
                      option.is_correct 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <span className={option.is_correct ? 'text-blue-600 font-medium' : 'text-gray-700'}>
                      {option.option_text}
                    </span>
                  </div>
                ))}
              </div>
              
              {question.explanation && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-700">{question.explanation}</p>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button 
                  className="btn btn-dash btn-primary mr-2 btn-wide"
                  onClick={() => openEditModal(question)}
                >
                  Sửa
                </button>
                <button 
                  className="btn btn-dash btn-error btn-wide"
                  onClick={() => setDeletingQuestionId(question.question_id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        <Comments lessonId={lessonId} />

        {/* Modal thêm câu hỏi */}
        {isModalOpen && (
          <dialog open className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Thêm câu hỏi mới</h3>
              
              <div className="form-control flex flex-col mb-4">
                <label className="label">Nội dung câu hỏi</label>
                <input 
                  type="text" 
                  className="input input-bordered"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />
              </div>

              {data.lesson?.category === 'Listening' && (
                <div className="form-control flex flex-col mb-4">
                  <label className="label">Upload Audio</label>
                  <input
                    type="file"
                    accept=".mp3,.wav,.ogg"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setAudioFile(file)
                        setTempAudioUrl(URL.createObjectURL(file))
                        refetch()
                      }
                    }}
                    className="file-input file-input-bordered"
                  />
                  {tempAudioUrl && (
                    <div className="mt-2">
                      <audio controls className="mt-2">
                        <source src={tempAudioUrl} type={audioFile.type} />
                        Trình duyệt không hỗ trợ phát audio
                      </audio>
                      <button
                        className="btn btn-error btn-xs mt-2"
                        onClick={() => {
                          setAudioFile(null);
                          setTempAudioUrl(null);
                        }}
                      >
                        Xóa audio
                      </button>
                    </div>
                  )}
                  {isUploadingAudio && <p className="text-sm text-gray-500">Đang upload audio...</p>}
                  {audioError && <p className="text-sm text-red-500">{audioError}</p>}
                </div>
              )}

              <div className="mb-4">
                <label className="label">Lựa chọn</label>
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2 mb-2 items-center">
                    <input
                      type="text"
                      placeholder={`Lựa chọn ${index + 1}`}
                      className="input input-bordered flex-grow"
                      value={option.optionText}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index].optionText = e.target.value;
                        setOptions(newOptions);
                      }}
                    />
                    <label className="label cursor-pointer gap-1">
                      <span className="label-text">Đúng</span>
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[index].isCorrect = e.target.checked;
                          setOptions(newOptions);
                        }}
                        className="checkbox checkbox-primary checkbox-sm"
                      />
                    </label>
                    <button
                      className="btn btn-error btn-soft btn-sm"
                      onClick={() => setOptions(options.filter((_, i) => i !== index))}
                      disabled={options.length === 1}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}
                <button
                  className="btn btn-sm btn-soft btn-info mt-2"
                  onClick={() => setOptions([...options, { optionText: '', isCorrect: false }])}
                >
                  Thêm lựa chọn
                </button>
              </div>

              <div className="form-control flex flex-col mb-2">
                <label className="label">Giải thích (nếu có)</label>
                <textarea 
                  className="textarea textarea-bordered"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                />
              </div>

              <div className="modal-action">
                <button 
                  className="btn btn-ghost"
                  onClick={closeModal}
                >
                  Huỷ
                </button>
                <button 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  onClick={handleAddQuestion}
                >
                  {(isSubmitting || isAddingOptions) ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
              </div>
            </div>
          </dialog>
        )}

        {/* Modal sửa câu hỏi */}
        {isEditModalOpen && (
          <dialog open className="modal modal-open">
            <div className="modal-box max-w-4xl">
              <h3 className="font-bold text-lg mb-4">Sửa câu hỏi</h3>
              
              <div className="form-control flex flex-col mb-4">
                <label className="label">Nội dung câu hỏi</label>
                <input
                  type="text" 
                  className="input input-bordered"
                  value={editQuestionText}
                  onChange={(e) => setEditQuestionText(e.target.value)}
                />
              </div>

              {data.lesson?.category === 'Listening' && (
                <div className="form-control flex flex-col mb-4">
                  <div>
                    <label className="label">Cập nhật Audio</label>
                    <span className="text-sm text-gray-500"> (Cập nhật audio không hoàn tác được dù có hủy cập nhật câu hỏi)</span>
                  </div>
                  <input
                    type="file"
                    accept=".mp3,.wav,.ogg"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        try {
                          const responseData = await uploadAudio(file, editingQuestion.question_id);
                          toast.success('Cập nhật audio thành công!')
                          
                          setEditingQuestion(prev => ({
                            ...prev,
                            audio_file: responseData.audio_file,
                            audio_url: responseData.urls.api
                          }))
                          
                          refetch()
                        } catch (err) {
                          toast.error(`Cập nhật audio thất bại: ${err.message}`)
                        }
                      }
                    }}
                    className="file-input file-input-bordered"
                  />
                  {editingQuestion?.audio_file && (
                    <div className="mt-4">
                      <audio controls className="w-full">
                        <source 
                          src={editingQuestion.audio_url} 
                          type="audio/mpeg"
                        />
                      </audio>
                    </div>
                  )}
                  {isUploadingAudio && <p className="text-sm text-gray-500">Đang upload audio...</p>}
                </div>
              )}

              <div className="mb-4">
                <label className="label">Lựa chọn</label>
                {editingOptions.map((option) => (
                  <div key={option.option_id} className="mb-4 p-4 border rounded-lg">
                    {editingOptionId === option.option_id ? (
                      <EditOptionForm
                        option={option}
                        onSave={(newText, newIsCorrect) => handleUpdateOption(option.option_id, newText, newIsCorrect)}
                        onCancel={() => setEditingOptionId(null)}
                        isSubmitting={isUpdatingOption}
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-grow">
                          <div className={`p-2 rounded ${option.is_correct ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            <span className={option.is_correct ? 'text-blue-600 font-medium' : 'text-gray-700'}>
                              {option.option_text}
                            </span>
                            {option.is_correct && (
                              <span className="ml-2 text-sm text-blue-500">(Đáp án đúng)</span>
                            )}
                          </div>
                        </div>
                        <button
                          className="btn btn-sm btn-soft btn-primary ml-4"
                          onClick={() => setEditingOptionId(option.option_id)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-soft btn-error ml-4"
                          onClick={() => setDeletingOptionId(option.option_id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <div className="mb-4">
                  {options.map((option, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-center">
                      <input
                        type="text"
                        placeholder={`lựa chọn mới`}
                        className="input input-bordered flex-grow"
                        value={option.optionText}
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[index].optionText = e.target.value;
                          setOptions(newOptions);
                        }}
                      />
                      <label className="label cursor-pointer gap-1">
                        <span className="label-text">Đúng</span>
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={(e) => {
                            const newOptions = [...options];
                            newOptions[index].isCorrect = e.target.checked;
                            setOptions(newOptions);
                          }}
                          className="checkbox checkbox-primary checkbox-sm"
                        />
                      </label>
                      <button
                        className="btn btn-error btn-soft btn-sm"
                        onClick={() => setOptions(options.filter((_, i) => i !== index))}
                        disabled={options.length === 1}
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  ))}
                  <button
                    className="btn btn-sm btn-soft btn-info mt-2"
                    onClick={() => setOptions([...options, { optionText: '', isCorrect: false }])}
                  >
                    Thêm lựa chọn
                  </button>
                </div>
              </div>

              <div className="form-control flex flex-col mb-2">
                <label className="label">Giải thích (nếu có)</label>
                <textarea 
                  className="textarea textarea-bordered"
                  value={editExplanation}
                  onChange={(e) => setEditExplanation(e.target.value)}
                />
              </div>

              <div className="modal-action">
                <button 
                  className="btn btn-ghost"
                  onClick={closeEditModal}
                >
                  Huỷ
                </button>
                <button 
                  className="btn btn-primary"
                  disabled={isUpdatingQuestion}
                  onClick={handleUpdateQuestion}
                >
                  {isUpdatingQuestion ? 'Đang cập nhật...' : 'Cập nhật câu hỏi'}
                </button>
              </div>
            </div>
          </dialog>
        )}

        {/* Modal xác nhận xóa */}
        {deletingQuestionId && (
          <dialog open className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Xác nhận xóa</h3>
              <p className="py-4">Bạn có chắc chắn muốn xóa câu hỏi này không?</p>
              <p className="text-red-400">Hành động này không thể hoàn tác!</p>

              <div className="modal-action">
                <button 
                  className="btn btn-ghost"
                  onClick={() => setDeletingQuestionId(null)}
                  disabled={isDeletingQuestion}
                >
                  Huỷ
                </button>
                <button 
                  className="btn btn-error"
                  onClick={async () => {
                    try {
                      await deleteQuestion(deletingQuestionId)
                      setDeletingQuestionId(null)
                      refetch()
                      toast.success('Xóa câu hỏi thành công!')
                    } catch (err) {
                      toast.error(`Xóa câu hỏi thất bại: ${err.message}`)
                    }
                  }}
                  disabled={isDeletingQuestion}
                >
                  {isDeletingQuestion ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          </dialog>
        )}

        {deletingOptionId && (
          <dialog open className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Xác nhận xóa</h3>
              <p className="py-4">Bạn có chắc chắn muốn xóa lựa chọn này không?</p>
              <p className="text-red-400">Hành động này không thể hoàn tác!</p>

              <div className="modal-action">
                <button 
                  className="btn btn-ghost"
                  onClick={() => setDeletingOptionId(null)}
                  disabled={isDeletingOption}
                >
                  Huỷ
                </button>
                <button 
                  className="btn btn-error"
                  onClick={async () => {
                    try {
                      await deleteOption(deletingOptionId)
                      setDeletingOptionId(null)
                      setEditingOptions(prev => prev.filter(opt => opt.option_id !== deletingOptionId))
                      refetch()
                      toast.success('Xóa lựa chọn thành công!')
                    } catch (err) {
                      toast.error(`Xóa lựa chọn thất bại: ${err.message}`)
                    }
                  }}
                  disabled={isDeletingOption}
                >
                  {isDeletingOption ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  )
}

const EditOptionForm = ({ option, onSave, onCancel, isSubmitting }) => {
  const [optionText, setOptionText] = useState(option.option_text)
  const [isCorrect, setIsCorrect] = useState(option.is_correct)

  const handleSave = () => {
    onSave(optionText, isCorrect)
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          className="input input-bordered flex-grow"
          value={optionText}
          onChange={(e) => setOptionText(e.target.value)}
        />
        <label className="label cursor-pointer gap-1">
          <span className="label-text">Đúng</span>
          <input
            type="checkbox"
            checked={isCorrect}
            onChange={(e) => setIsCorrect(e.target.checked)}
            className="checkbox checkbox-primary checkbox-sm"
          />
        </label>
      </div>
      <div className="flex gap-2">
        <button
          className="btn btn-sm btn-success"
          onClick={handleSave}
          disabled={isSubmitting || !optionText.trim()}
        >
          {isSubmitting ? 'Đang lưu...' : 'Lưu'}
        </button>
        <button
          className="btn btn-sm btn-ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Hủy
        </button>
        <span className='text-sm mt-2 text-gray-500'>(ấn lưu là sẽ không hoàn tác được)</span>
      </div>
    </div>
  )
}

export default LessonDetails
