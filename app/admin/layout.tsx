import Link from 'next/link'
import AdminSignOut from './SignOut'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/admin" className="font-bold tracking-widest text-sm uppercase">
          Vitrine Admin
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/admin/models" className="text-sm text-white/50 hover:text-white transition-colors">
            Models
          </Link>
          <Link href="/" className="text-sm text-white/30 hover:text-white/60 transition-colors">
            ← Feed
          </Link>
          <AdminSignOut />
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  )
}
