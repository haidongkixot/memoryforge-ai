'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Chapter {
  id: string; slug: string; title: string; body: string; category: string
  keyTakeaways: string[]; minPlanSlug: string; hasAccess: boolean
  quizData: Array<{ question: string; options: string[]; correctIndex: number }> | null
  progress: { completed: boolean; quizScore: number | null; quizAnswers: any } | null
}

export default function AcademyChapterPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)

  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [quizResult, setQuizResult] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/academy/${slug}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(setChapter)
      .catch(() => setChapter(null))
      .finally(() => setLoading(false))
  }, [slug])

  async function markComplete() {
    if (!chapter) return
    setMarking(true)
    await fetch('/api/academy/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterId: chapter.id }),
    })
    setChapter({ ...chapter, progress: { completed: true, quizScore: chapter.progress?.quizScore ?? null, quizAnswers: null } })
    setMarking(false)
  }

  async function submitQuiz() {
    if (!chapter?.quizData) return
    setSubmitting(true)
    try {
      const answerArray = chapter.quizData.map((_, i) => answers[i] ?? -1)
      const res = await fetch('/api/academy/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId: chapter.id, answers: answerArray }),
      })
      const data = await res.json()
      setQuizResult(data)
    } catch {}
    setSubmitting(false)
  }

  if (loading) return <div className="text-center py-20 text-[#9CA3AF]">Loading...</div>
  if (!chapter) return <div className="text-center py-20 text-[#9CA3AF]">Chapter not found. <Link href="/academy" className="text-[#593CC8] underline">Back to Academy</Link></div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/academy" className="text-sm text-[#593CC8] hover:underline">&larr; Back to Academy</Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            chapter.minPlanSlug === 'free' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'
          }`}>{chapter.minPlanSlug === 'free' ? 'Free' : chapter.minPlanSlug.toUpperCase()}</span>
          <span className="text-xs text-[#9CA3AF]">{chapter.category.replace(/-/g, ' ')}</span>
        </div>
        <h1 className="text-3xl font-bold text-[#1f2937]">{chapter.title}</h1>
      </div>

      {/* Locked banner */}
      {!chapter.hasAccess && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 text-center">
          <p className="text-purple-700 font-medium">This chapter requires a {chapter.minPlanSlug.toUpperCase()} plan.</p>
          <p className="text-purple-500 text-sm mt-1">Upgrade to unlock all academy content.</p>
        </div>
      )}

      {/* Body */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="prose prose-sm max-w-none text-[#374151] whitespace-pre-wrap leading-relaxed">
          {chapter.body}
        </div>
      </div>

      {/* Key Takeaways */}
      {chapter.hasAccess && chapter.keyTakeaways.length > 0 && (
        <div className="bg-[#F0EDFF] border border-[#593CC8]/20 rounded-2xl p-5">
          <h3 className="font-semibold text-[#593CC8] mb-3">Key Takeaways</h3>
          <ul className="space-y-2">
            {chapter.keyTakeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#374151]">
                <span className="text-[#593CC8] font-bold mt-0.5">&#10003;</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mark complete */}
      {chapter.hasAccess && !chapter.progress?.completed && (
        <button onClick={markComplete} disabled={marking}
          className="w-full py-3 bg-[#593CC8] hover:bg-[#4B2EA8] text-white rounded-xl font-medium transition-colors disabled:opacity-50">
          {marking ? 'Saving...' : 'Mark as Complete'}
        </button>
      )}
      {chapter.progress?.completed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center text-green-700 text-sm font-medium">
          Completed {chapter.progress.quizScore !== null ? `| Quiz: ${chapter.progress.quizScore}%` : ''}
        </div>
      )}

      {/* Quiz */}
      {chapter.hasAccess && chapter.quizData && chapter.quizData.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
          <button onClick={() => setShowQuiz(!showQuiz)}
            className="text-[#593CC8] font-semibold hover:underline">
            {showQuiz ? 'Hide Quiz' : 'Take Quiz'}
          </button>
          {showQuiz && (
            <div className="space-y-6">
              {chapter.quizData.map((q, qi) => (
                <div key={qi} className="space-y-2">
                  <p className="font-medium text-[#1f2937]">{qi + 1}. {q.question}</p>
                  <div className="space-y-1">
                    {q.options.map((opt, oi) => {
                      const chosen = answers[qi] === oi
                      let optClass = 'border-gray-200 hover:border-[#593CC8]/40'
                      if (quizResult) {
                        const r = quizResult.results[qi]
                        if (oi === r.correctIndex) optClass = 'border-green-400 bg-green-50'
                        else if (chosen && !r.isCorrect) optClass = 'border-red-400 bg-red-50'
                      } else if (chosen) {
                        optClass = 'border-[#593CC8] bg-[#F0EDFF]'
                      }
                      return (
                        <button key={oi} onClick={() => !quizResult && setAnswers({ ...answers, [qi]: oi })}
                          className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-colors ${optClass}`}>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
              {!quizResult ? (
                <button onClick={submitQuiz} disabled={submitting || Object.keys(answers).length < (chapter.quizData?.length ?? 0)}
                  className="w-full py-3 bg-[#593CC8] hover:bg-[#4B2EA8] text-white rounded-xl font-medium transition-colors disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Answers'}
                </button>
              ) : (
                <div className={`text-center p-4 rounded-xl font-medium ${quizResult.score >= 75 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                  Score: {quizResult.score}% ({quizResult.correct}/{quizResult.total} correct)
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
