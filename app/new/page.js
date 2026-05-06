'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function NewPost() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('posts')
      .insert([{ title, content, author }])

    setLoading(false)

    if (error) {
      alert('저장 실패: ' + error.message)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <header className="flex items-baseline justify-between mb-12">
        <Link href="/" className="text-sm text-gray-500">
          ← Board
        </Link>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="제목"
          className="w-full text-2xl font-medium tracking-tight outline-none placeholder:text-gray-300"
        />

        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="작성자"
          className="w-full text-sm text-gray-600 outline-none placeholder:text-gray-300"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          placeholder="내용을 입력하세요..."
          className="w-full text-[15px] leading-relaxed outline-none resize-none placeholder:text-gray-300"
        />

        <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading || !title}
            className="text-sm text-gray-900 disabled:text-gray-300"
          >
            {loading ? '저장 중...' : '저장'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-sm text-gray-500"
          >
            취소
          </button>
        </div>
      </form>
    </main>
  )
}
