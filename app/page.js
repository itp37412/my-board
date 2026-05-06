import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <header className="flex items-baseline justify-between mb-12">
        <h1 className="text-2xl font-medium tracking-tight">Board</h1>
        <Link
          href="/new"
          className="text-sm text-gray-500"
        >
          새 글
        </Link>
      </header>

      {error && (
        <p className="text-sm text-gray-500">
          불러올 수 없습니다.
        </p>
      )}

      {posts && posts.length === 0 && (
        <p className="text-sm text-gray-400">
          아직 작성된 글이 없습니다.
        </p>
      )}

  <ul className="space-y-1">
  {posts?.map((post) => (
    <li key={post.id}>
      <Link
        href={`/posts/${post.id}`}
        className="flex items-baseline gap-4 py-3 border-b border-gray-100"
      >
        <span className="text-[15px] text-gray-900 truncate flex-1">
          {post.title}
        </span>
        <span className="text-xs text-gray-400 shrink-0">
          {post.author || '익명'}
        </span>
        <span className="text-xs text-gray-400 tabular shrink-0 w-12 text-right">
          {formatDate(post.created_at)}
        </span>
      </Link>
    </li>
  ))}
</ul>
    </main>
  )
}

function formatDate(iso) {
  const d = new Date(iso)
  const now = new Date()
  const sameYear = d.getFullYear() === now.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return sameYear ? `${month}.${day}` : `${d.getFullYear()}.${month}.${day}`
}
