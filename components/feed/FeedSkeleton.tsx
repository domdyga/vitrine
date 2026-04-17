export default function FeedSkeleton() {
  return (
    <div className="feed-container">
      {[0, 1, 2].map((i) => (
        <div key={i} className="feed-card bg-zinc-900 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 pb-16 space-y-3 z-10">
            <div className="h-12 w-64 bg-white/10 rounded-lg" />
            <div className="h-4 w-40 bg-white/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
