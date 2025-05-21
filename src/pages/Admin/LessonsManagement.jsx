import AdminSidebar from '../../components/admin/AdminSidebar'
import { useEffect, useRef, useState } from 'react'
import useLesson from '../../hooks/useLesson'
import { useNavigate } from 'react-router-dom'
import useAddLesson from '../../hooks/admin/lessons/useAddLesson'
import useDeleteLesson from '../../hooks/admin/lessons/useDeleteLesson'
import useUpdateLesson from '../../hooks/admin/lessons/useUpdateLesson'
import AddLessonModal from '../../components/admin/AddLessonModal'
import DeleteLessonModal from '../../components/admin/DeleteLessonModal'
import UpdateLessonModal from '../../components/admin/UpdateLessonModal'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const LessonsManagement = () => {
  const navigate = useNavigate()
  const [category, setCategory] = useState("Reading")
  const [lessons, setLessons] = useState([])
  const [showFloatbox, setShowFloatbox] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const lessonRefs = useRef([])

  const { data, loading, error, refetch } = useLesson(category)
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [newLessonTitle, setNewLessonTitle] = useState('')
  const { createLesson, isSubmitting } = useAddLesson()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedLessonToDelete, setSelectedLessonToDelete] = useState(null)
  const { deleteLesson, isDeleting } = useDeleteLesson()

  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [selectedLessonToUpdate, setSelectedLessonToUpdate] = useState(null)
  const { updateLesson, isSubmitting: isUpdating } = useUpdateLesson()
  
  useEffect(() => {
    console.log("API response:", data)
    if (data?.data) {
      console.log("Lessons from API:", data.data)
      const sortedLessons = [...data.data].sort((a, b) => {
        return a.lesson_id - b.lesson_id
      })
      setLessons(sortedLessons)
    }
  }, [data])
  
  const handleLessonClick = (lesson) => {
    console.log("Clicked lesson:", lesson)
    setSelectedLesson(lesson)
    setShowFloatbox(true)
  }

  const handleReviewSubmission = () => {
    if (selectedLesson) {
      navigate(`/lesson-details/${selectedLesson.lesson_id}`) // Thêm lesson_id vào URL
      setShowFloatbox(false)
    }
  }

  const handleAddLesson = async () => {
    try {
      await createLesson({
        title: newLessonTitle,
        category: category
      })
      
      toast.success('Tạo bài học thành công!')
      setNewLessonTitle('')
      setShowAddModal(false)
      refetch()
    } catch (err) {
      toast.error(err.message || 'Có lỗi xảy ra khi tạo bài học')
    }
  }

  const handleDeleteLesson = async () => {
    if (!selectedLessonToDelete) return
    
    try {
      await deleteLesson(selectedLessonToDelete.lesson_id)
      toast.success('Xóa bài học thành công!')
      refetch()
      setShowFloatbox(false)
      setSelectedLesson(null)
      setShowDeleteModal(false)
      setSelectedLessonToDelete(null)
    } catch (err) {
      toast.error(err.message || 'Xóa bài học thất bại')
    }
  }

  const handleDeleteClick = (lesson) => {
    setSelectedLessonToDelete(lesson)
    setShowDeleteModal(true)
  }

  const handleUpdateLesson = async () => {
    if (!selectedLessonToUpdate || !editedTitle.trim()) return
    
    try {
      await updateLesson(selectedLessonToUpdate.lesson_id, {
        title: editedTitle
      })
      
      toast.success('Cập nhật bài học thành công!')
      refetch()
      setShowUpdateModal(false)
      setSelectedLessonToUpdate(null)
      setEditedTitle('')
    } catch (err) {
      toast.error(err.message || 'Cập nhật bài học thất bại')
    }
  }

  const closeFloatbox = () => {
    setShowFloatbox(false)
    setSelectedLesson(null)
  }

  const lessonGroups = []
  for (let i = 0; i < lessons.length; i += 5) {
    lessonGroups.push(lessons.slice(i, i + 5))
  }

  return (
    <div className='flex min-h-screen'>
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
      <AdminSidebar />
      {/* Main Content */}
      <div className="flex-1 ml-64 bg-blue-50">
        {/* Category Header */}
        <div className="sticky top-0 bg-white shadow z-20">
          <div className="flex justify-center gap-4 p-4">
            <button
              className={`px-4 py-2 rounded ${category === "Reading" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => {
                console.log("Switching to Reading")
                setCategory("Reading")
              }}
            >
              Reading
            </button>
            <button
              className={`px-4 py-2 rounded ${category === "Listening" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => {
                console.log("Switching to Listening")
                setCategory("Listening")
              }}
            >
              Listening
            </button>
          </div>
        </div>

        {/* Lesson List */}
        <div className="flex flex-col items-center gap-12 mt-10 px-4 py-8 overflow-y-auto min-h-screen">
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">Error: {error}</div>}
          {!loading && !error && lessons.length === 0 && (
            <div>No lessons found for this category.</div>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:bg-gray-100 transition-colors text-blue-500 text-4xl font-bold"
          >
            +
          </button>

          {/* Iterate through lessonGroups and lessons */}
          {lessonGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="relative flex flex-col items-center gap-10">
              {group.map((lesson, idx) => {
                const totalIdx = groupIdx * 5 + idx
                const isLastInGroup = idx === group.length - 1

                return (
                  <div key={lesson.lesson_id} className="relative flex flex-col items-center">
                    {/* Lesson button */}
                    <button
                      ref={(el) => (lessonRefs.current[totalIdx] = el)}
                      className="press-button w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:bg-blue-600 transition-colors z-10 text-white text-sm font-semibold text-center p-2"
                      onClick={() => handleLessonClick(lesson)}
                    >
                      {lesson.title}
                    </button>

                    {/* Connecting dashed line */}
                    {!isLastInGroup && (
                      <div className="h-10 mt-10 border-l-4 border-dashed border-blue-400 mx-auto"></div>
                    )}

                    {/* Floatbox for lesson info */}
                    {showFloatbox && selectedLesson?.lesson_id === lesson.lesson_id && (
                      <div className="animate-slide-in-right absolute left-28 top-0 bg-blue-500 text-white rounded-lg p-4 w-64 shadow-lg z-30">
                        <div className="absolute -left-6 top-6 transform rotate-90">
                          <div className="w-12 h-12 bg-blue-500 rounded-full border-4 border-blue-600 flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="mt-2 text-center">
                          <h3 className="text-lg font-bold">{selectedLesson.title}</h3>
                          <button
                            className="mt-4 bg-white text-blue-500 font-bold py-2 px-4 rounded-full w-full hover:bg-gray-100 transition-colors"
                            onClick={handleReviewSubmission}
                          >
                            Chi tiết
                          </button>
                          <button
                            className="mt-4 bg-white text-red-400 font-bold py-2 px-4 rounded-full w-full hover:bg-gray-100 transition-colors"
                            onClick={() => handleDeleteClick(lesson)}
                          >
                            Xóa bài học
                          </button>
                          <button
                            className="mt-4 bg-white text-blue-500 font-bold py-2 px-4 rounded-full w-full hover:bg-gray-100 transition-colors"
                            onClick={() => {
                              setSelectedLessonToUpdate(lesson)
                              setEditedTitle(lesson.title)
                              setShowUpdateModal(true)
                            }}
                          >
                            Thông tin chung
                          </button>
                        </div>
                        <button
                          className="absolute top-2 right-2 text-white hover:text-gray-200"
                          onClick={closeFloatbox}
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Mascot */}
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-bounce mt-8">
                <svg
                  className="w-12 h-12 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 14c2.76 0 5-2.24 5-5h-2c0 1.66-1.34 3-3 3s-3-1.34-3-3H7c0 2.76 2.24 5 5 5z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <AddLessonModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        newLessonTitle={newLessonTitle}
        setNewLessonTitle={setNewLessonTitle}
        handleAddLesson={handleAddLesson}
        isSubmitting={isSubmitting}
      />

      <DeleteLessonModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        selectedLessonToDelete={selectedLessonToDelete}
        setSelectedLessonToDelete={setSelectedLessonToDelete}
        handleDeleteLesson={handleDeleteLesson}
        isDeleting={isDeleting}
      />

      <UpdateLessonModal
        showUpdateModal={showUpdateModal}
        setShowUpdateModal={setShowUpdateModal}
        selectedLessonToUpdate={selectedLessonToUpdate}
        setSelectedLessonToUpdate={setSelectedLessonToUpdate}
        editedTitle={editedTitle}
        setEditedTitle={setEditedTitle}
        handleUpdateLesson={handleUpdateLesson}
        isUpdating={isUpdating}
      />
    </div>
  )
}

export default LessonsManagement
