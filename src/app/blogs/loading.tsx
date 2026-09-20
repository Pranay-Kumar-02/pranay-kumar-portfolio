export default function BlogLoading() {
  return (
    <div className="container mx-auto px-4 py-24 min-h-screen font-sans">
      <div className="flex flex-col items-center mb-12">
        <div className="h-12 w-64 bg-zinc-800 rounded-lg animate-pulse mb-4" />
        <div className="h-5 w-96 bg-zinc-800/60 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-64 bg-black/40 border border-zinc-800 rounded-lg p-6 flex flex-col gap-4 animate-pulse"
          >
            <div className="flex justify-between">
              <div className="h-5 w-16 bg-zinc-800 rounded-full" />
              <div className="h-4 w-24 bg-zinc-800/60 rounded" />
            </div>
            <div className="h-6 w-3/4 bg-zinc-800 rounded" />
            <div className="h-4 w-full bg-zinc-800/60 rounded" />
            <div className="h-4 w-2/3 bg-zinc-800/60 rounded" />
            <div className="mt-auto h-4 w-28 bg-zinc-800/40 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
