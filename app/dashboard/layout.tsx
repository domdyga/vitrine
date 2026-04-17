import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold tracking-widest text-sm uppercase">
          Vitrine
        </Link>
        <Link href="/" className="text-sm text-white/30 hover:text-white/60 transition-colors">
          ← Feed
        </Link>
      </nav>
      <main className="max-w-2xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  )
}
