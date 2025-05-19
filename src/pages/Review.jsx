import React from 'react'
import { useParams } from 'react-router-dom'
import useQuestion from '../hooks/useQuestion'
import Comments from '../components/Comments'

const Review = () => {
  const { lessonId } = useParams()
  const { data, loading, error } = useQuestion(lessonId)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="w-screen bg-white mx-auto p-4">
      <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">Review: {data.lesson?.title}</h1>
      
      <div className="space-y-8 mb-8">
        {data.questions.map((question, index) => (
          <div key={question.question_id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <h3 className="text-xl text-gray-700 font-semibold">Câu {index + 1}:</h3>
              <p className="text-lg text-gray-700 mt-2">{question.question_text}</p>
            </div>
            
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
          </div>
        ))}
      </div>

      <Comments />
    </div>
  )
}

export default Review
