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

  if (loading) return <main className="p-8">로딩 중...</main>
  if (!post) return null

  if (editing) {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">✏️ 글 수정</h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">작성자</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="border px-4 py-2 rounded hover:bg-gray-100"
            >
              취소
            </button>
          </div>
        </form>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <Link href="/" className="text-blue-600 hover:underline">
        ← 목록으로
      </Link>

      <article className="mt-4">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-sm text-gray-500 mt-2">
          {post.author || '익명'} ·{' '}
          {new Date(post.created_at).toLocaleString('ko-KR')}
        </p>

        <div className="mt-6 whitespace-pre-wrap">{post.content}</div>

        <div className="mt-8 flex gap-2">
          <button
            onClick={() => setEditing(true)}
            className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            삭제
          </button>
        </div>
      </article>
    </main>
  )
}