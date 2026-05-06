'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function PostDetail() {
  const router = useRouter()
  const params = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')

  useEffect(() => {
    fetchPost()
  }, [])

  async function fetchPost() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      alert('글을 불러올 수 없습니다: ' + error.message)
      router.push('/')
      return
    }

    setPost(data)
    setTitle(data.title)
    setContent(data.content || '')
    setAuthor(data.author || '')
    setLoading(false)
  }

  async function handleUpdate(e) {
    e.preventDefault()

    const { error } = await supabase
      .from('posts')
      .update({ title, content, author })
      .eq('id', params.id)

    if (error) {
      alert('수정 실패: ' + error.message)
    } else {
      setEditing(false)
      fetchPost()
    }
  }

  async function handleDelete() {
    if (!confirm('정말 삭제하시겠습니까?')) return

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', params.id)

    if (error) {
      alert('삭제 실패: ' + error.message)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  if (loading) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-sm text-gray-400">불러오는 중...</p>
      </main>
    )
  }
  if (!post) return null

  if (editing) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <header className="flex items-baseline justify-between mb-12">
          <Link href="/" className="text-sm text-gray-500">
            ← Board
          </Link>
        </header>

        <form onSubmit={handleUpdate} className="space-y-8">
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
              className="text-sm text-gray-900"
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-sm text-gray-500"
            >
              취소
            </button>
          </div>
        </form>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <header className="flex items-baseline justify-between mb-12">
        <Link href="/" className="text-sm text-gray-500">
          ← Board
        </Link>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-gray-500"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="text-sm text-gray-500"
          >
            삭제
          </button>
        </div>
      </header>

      <article>
        <h1 className="text-2xl font-medium tracking-tight">
          {post.title}
        </h1>

        <p className="text-xs text-gray-400 mt-3 tabular">
          {post.author || '익명'} · {formatFullDate(post.created_at)}
        </p>

        <div className="mt-12 text-[15px] leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </article>
    </main>
  )
}

function formatFullDate(iso) {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}.${m}.${day} ${h}:${min}`
}
