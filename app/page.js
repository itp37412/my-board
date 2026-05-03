import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-3xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📋 게시판</h1>
        <Link
          href="/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          글쓰기
        </Link>
      </div>

      {error && <p className="text-red-500">에러: {error.message}</p>}

      {posts && posts.length === 0 && (
        <p className="text-gray-500">아직 게시글이 없습니다.</p>
      )}

      <ul className="divide-y">
        {posts?.map((post) => (
          <li key={post.id} className="py-4">
            <Link
              href={`/posts/${post.id}`}
              className="block hover:bg-gray-50 p-2 rounded"
            >
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {post.author || '익명'} ·{' '}
                {new Date(post.created_at).toLocaleString('ko-KR')}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}